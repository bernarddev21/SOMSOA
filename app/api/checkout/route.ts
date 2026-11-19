import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "../../../lib/supabase-admin";

import { SIZE_OPTIONS } from "../../../components/products";
import { getStoreProductById } from "../../../lib/products-server";

import type { SizeSystem } from "../../../components/products";

import {
  calculateShippingPlan,
  getPairWeights,
  INTERNATIONAL_RATES,
  getShippingCountry,
  type OrderLineForShipping,
  type ShippingDestination,
  type UkService,
} from "../../../components/shipping";

type ShippingRegion = "GB" | "EU" | "US" | "CA" | "ROW";

const VALID_SIZE_SYSTEMS: SizeSystem[] = ["UK", "EU", "US"];

// Keep these in one place until Jasmine confirms the final carton weights/costs.
const PACKING_CONFIG = {
  mediumCapacity: 4,
  largeCapacity: 8,
  bagWeight: 10,
  mediumWeight: 0,
  largeWeight: 0,
  mediumCost: 0,
  largeCost: 0,
};

// Customer shipping is currently set to the calculated delivery cost with no markup.
// Change this single number later if SOMSOA decides to add a shipping contribution.
const CUSTOMER_SHIPPING_MARKUP_PENCE = 0;

const DELIVERY_ESTIMATES: Record<
  Exclude<ShippingRegion, "GB">,
  { minDays: number; maxDays: number }
> = {
  EU: { minDays: 3, maxDays: 5 },
  US: { minDays: 6, maxDays: 7 },
  CA: { minDays: 6, maxDays: 7 },
  ROW: { minDays: 6, maxDays: 10 },
};

function isValidSizeSystem(value: unknown): value is SizeSystem {
  return (
    typeof value === "string" &&
    VALID_SIZE_SYSTEMS.includes(value as SizeSystem)
  );
}

function getSizeLabel(
  size: (typeof SIZE_OPTIONS)[number],
  sizeSystem: SizeSystem
): string {
  if (sizeSystem === "EU") return size.eu;
  if (sizeSystem === "US") return size.us;
  return size.uk;
}

function isValidSize(
  sizeSystem: SizeSystem,
  selectedSize: string
): boolean {
  return SIZE_OPTIONS.some(
    (size) => getSizeLabel(size, sizeSystem) === selectedSize
  );
}

function isShippingRegion(value: unknown): value is ShippingRegion {
  return (
    value === "GB" ||
    value === "EU" ||
    value === "US" ||
    value === "CA" ||
    value === "ROW"
  );
}

function getShippingConfiguration(region: ShippingRegion, country: string) {
  const countryInfo = getShippingCountry(country);

  if (!countryInfo || countryInfo.region !== region) {
    return null;
  }

  return {
    allowedCountries: [countryInfo.code],
  };
}

function calculateShippingCost(
  lines: OrderLineForShipping[],
  destination: ShippingDestination,
  service: UkService,
  country: string
) {
  const weights = getPairWeights(lines);

  if (!weights.length || weights.some((weight) => weight <= 0)) {
    return null;
  }

  const parcels = calculateShippingPlan(weights, {
    ...PACKING_CONFIG,
    destination,
    service,
    country,
  });

  if (!parcels.length) {
    return null;
  }

  const postage = parcels.reduce(
    (sum, parcel) => sum + parcel.postage,
    0
  );

  const packaging = parcels.reduce(
    (sum, parcel) => sum + parcel.packagingCost,
    0
  );

  return {
    parcels,
    productWeight: weights.reduce((sum, weight) => sum + weight, 0),
    postage,
    packaging,
    totalCost: postage + packaging,
  };
}

function getParcelSummary(
  parcels: ReturnType<typeof calculateShippingPlan>
) {
  return parcels
    .map((parcel) => `${parcel.kind}:${parcel.pairs}`)
    .join(",");
}

function getInternationalShippingOptions(
  shippingRegion: Exclude<ShippingRegion, "GB">,
  shippingCostPence: number
) {
  const estimate = DELIVERY_ESTIMATES[shippingRegion];

  return [
    {
      shipping_rate_data: {
        type: "fixed_amount" as const,
        display_name: "Royal Mail International tracked delivery",
        fixed_amount: {
          amount: shippingCostPence + CUSTOMER_SHIPPING_MARKUP_PENCE,
          currency: "gbp" as const,
        },
        delivery_estimate: {
          minimum: {
            unit: "business_day" as const,
            value: estimate.minDays,
          },
          maximum: {
            unit: "business_day" as const,
            value: estimate.maxDays,
          },
        },
      },
    },
  ];
}

export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        {
          error:
            "Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local.",
        },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey);
    const body = await request.json();

    if (!Array.isArray(body.items)) {
      return NextResponse.json(
        { error: "Invalid cart." },
        { status: 400 }
      );
    }

    if (body.items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    if (body.items.length > 20) {
      return NextResponse.json(
        { error: "Too many different items in the cart." },
        { status: 400 }
      );
    }

    if (!isShippingRegion(body.shippingRegion)) {
      return NextResponse.json(
        { error: "Please select a delivery destination." },
        { status: 400 }
      );
    }

    const shippingRegion = body.shippingRegion;
    const shippingCountry =
      typeof body.shippingCountry === "string"
        ? body.shippingCountry.toUpperCase()
        : "";

    const effectiveCountry =
      shippingRegion === "GB" ? "GB" : shippingCountry;

    if (!effectiveCountry) {
      return NextResponse.json(
        {
          error:
            "Please select a specific delivery country so we can calculate the correct Royal Mail rate.",
        },
        { status: 400 }
      );
    }

    const countryInfo = getShippingCountry(effectiveCountry);

    if (!countryInfo || countryInfo.region !== shippingRegion) {
      return NextResponse.json(
        { error: "Invalid shipping destination." },
        { status: 400 }
      );
    }

    if (
      shippingRegion !== "GB" &&
      !INTERNATIONAL_RATES[countryInfo.rateKey]
    ) {
      return NextResponse.json(
        {
          error:
            "The Royal Mail tariff for this destination has not been configured yet.",
        },
        { status: 400 }
      );
    }

    const shipping = getShippingConfiguration(
      shippingRegion,
      effectiveCountry
    );

    if (!shipping) {
      return NextResponse.json(
        { error: "Invalid shipping destination." },
        { status: 400 }
      );
    }

    const origin = new URL(request.url).origin;

    const shippingLines: OrderLineForShipping[] = [];
    let subtotalPence = 0;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      await Promise.all(body.items.map(async (item: unknown) => {
        if (typeof item !== "object" || item === null) {
          throw new Error("Invalid cart item.");
        }

        const cartItem = item as {
          productId?: unknown;
          sizeSystem?: unknown;
          size?: unknown;
          quantity?: unknown;
        };

        if (
          typeof cartItem.productId !== "string" ||
          typeof cartItem.sizeSystem !== "string" ||
          typeof cartItem.size !== "string" ||
          typeof cartItem.quantity !== "number"
        ) {
          throw new Error("Invalid cart item.");
        }

        if (!isValidSizeSystem(cartItem.sizeSystem)) {
          throw new Error("Invalid sizing system.");
        }

        if (
          !Number.isInteger(cartItem.quantity) ||
          cartItem.quantity < 1 ||
          cartItem.quantity > 99
        ) {
          throw new Error("Invalid quantity.");
        }

        if (!isValidSize(cartItem.sizeSystem, cartItem.size)) {
          throw new Error("Invalid size.");
        }

        const product = await getStoreProductById(cartItem.productId);

        if (!product) {
          throw new Error("Invalid product.");
        }

        subtotalPence += product.price * cartItem.quantity;

        shippingLines.push({
          sizeSystem: cartItem.sizeSystem,
          size: cartItem.size,
          quantity: cartItem.quantity,
        });

        return {
          price_data: {
            currency: "gbp",
            unit_amount: product.price,
            product_data: {
              name: `${product.name} Heated Slippers`,
              description: `${product.colour} · Size ${cartItem.size} (${cartItem.sizeSystem})${product.originalPrice ? ` · Sale price (was £${(product.originalPrice / 100).toFixed(2)})` : ""}`,
            },
          },
          quantity: cartItem.quantity,
        };
      }));

    const destination: ShippingDestination =
      shippingRegion === "GB" ? "GB" : "INT";

    const tracked48 = calculateShippingCost(
      shippingLines,
      destination,
      "tracked48",
      effectiveCountry
    );

    if (!tracked48) {
      return NextResponse.json(
        {
          error:
            "We could not calculate a valid Royal Mail shipping plan for this order.",
        },
        { status: 400 }
      );
    }

    let shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[];

    if (shippingRegion === "GB") {
      const tracked24 = calculateShippingCost(
        shippingLines,
        "GB",
        "tracked24",
        "GB"
      );

      if (!tracked24) {
        return NextResponse.json(
          {
            error:
              "We could not calculate a valid Tracked 24 shipping plan for this order.",
          },
          { status: 400 }
        );
      }

      shippingOptions = [
        {
          shipping_rate_data: {
            type: "fixed_amount" as const,
            fixed_amount: {
              amount:
                tracked48.totalCost + CUSTOMER_SHIPPING_MARKUP_PENCE,
              currency: "gbp" as const,
            },
            display_name: "Royal Mail Tracked 48",
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount" as const,
            fixed_amount: {
              amount:
                tracked24.totalCost + CUSTOMER_SHIPPING_MARKUP_PENCE,
              currency: "gbp" as const,
            },
            display_name: "Royal Mail Tracked 24",
          },
        },
      ];
    } else {
      shippingOptions = getInternationalShippingOptions(
        shippingRegion,
        tracked48.totalCost
      );
    }

    const metadata: Record<string, string> = {
      shipping_region: shippingRegion,
      shipping_country: effectiveCountry,
    };
    // Browser-generated identifiers are only attached when analytics consent exists.
    if (typeof body.analyticsVisitorId === "string" && body.analyticsVisitorId.length <= 80) {
      metadata.analytics_visitor_id = body.analyticsVisitorId;
    }
    if (typeof body.analyticsSessionId === "string" && body.analyticsSessionId.length <= 80) {
      metadata.analytics_session_id = body.analyticsSessionId;
    }

    if (shippingRegion === "GB") {
      const tracked24 = calculateShippingCost(
        shippingLines,
        "GB",
        "tracked24",
        "GB"
      );

      metadata.tracked48_product_weight_grams = String(tracked48.productWeight);
      metadata.tracked48_postage_pence = String(tracked48.postage);
      metadata.tracked48_shipping_cost_pence = String(tracked48.totalCost);
      metadata.tracked48_parcel_count = String(tracked48.parcels.length);
      metadata.tracked48_parcels = getParcelSummary(tracked48.parcels);

      if (tracked24) {
        metadata.tracked24_product_weight_grams = String(tracked24.productWeight);
        metadata.tracked24_postage_pence = String(tracked24.postage);
        metadata.tracked24_shipping_cost_pence = String(tracked24.totalCost);
        metadata.tracked24_parcel_count = String(tracked24.parcels.length);
        metadata.tracked24_parcels = getParcelSummary(tracked24.parcels);
      }
    } else {
      metadata.international_product_weight_grams = String(tracked48.productWeight);
      metadata.international_postage_pence = String(tracked48.postage);
      metadata.international_shipping_cost_pence = String(tracked48.totalCost);
      metadata.international_parcel_count = String(tracked48.parcels.length);
      metadata.international_parcels = getParcelSummary(tracked48.parcels);
    }

    let stripeDiscounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
    let discountCode: string | null = null;
    if (typeof body.discountCode === "string" && body.discountCode.trim()) {
      const code = body.discountCode.trim().toUpperCase();
      const admin = getSupabaseAdmin();
      const { data: discount, error: discountError } = await admin
        .from("discount_codes")
        .select("code,discount_type,discount_value,minimum_order_pence,starts_at,ends_at,active,max_uses,used_count")
        .eq("code", code)
        .maybeSingle();
      if (discountError) throw new Error("We could not validate that discount code.");
      const now = Date.now();
      const valid = discount && discount.active && subtotalPence >= discount.minimum_order_pence
        && (!discount.starts_at || new Date(discount.starts_at).getTime() <= now)
        && (!discount.ends_at || new Date(discount.ends_at).getTime() > now)
        && (discount.max_uses == null || discount.used_count < discount.max_uses);
      if (!valid) throw new Error("That discount code is invalid, expired, or does not meet its minimum spend.");
      const coupon = await stripe.coupons.create(discount.discount_type === "percentage"
        ? { percent_off: discount.discount_value, duration: "once", name: `SOMSOA ${code}` }
        : { amount_off: Math.min(subtotalPence, discount.discount_value), currency: "gbp", duration: "once", name: `SOMSOA ${code}` });
      stripeDiscounts = [{ coupon: coupon.id }];
      discountCode = code;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "en-GB",
      line_items: lineItems,
      ...(stripeDiscounts ? { discounts: stripeDiscounts } : {}),
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries:
          shipping.allowedCountries as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      shipping_options: shippingOptions,
      success_url:
        `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#collection`,
      metadata: { ...metadata, ...(discountCode ? { discount_code: discountCode } : {}) },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to create checkout session.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

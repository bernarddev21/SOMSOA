import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string
);

export async function POST(request: Request) {
  const body = await request.text();

  const headersList = await headers();
  const signature =
    headersList.get("stripe-signature");

  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error(
      "STRIPE_WEBHOOK_SECRET is missing."
    );

    return NextResponse.json(
      {
        error:
          "Webhook secret is not configured.",
      },
      { status: 500 }
    );
  }

  if (!signature) {
    return NextResponse.json(
      {
        error:
          "Missing Stripe signature.",
      },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Invalid webhook signature.",
      },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        /*
         * A Checkout Session can be completed before
         * a delayed payment method has actually settled.
         * Only treat the order as paid when Stripe says
         * the payment status is paid.
         */

        if (session.payment_status !== "paid") {
          console.log(
            `Checkout completed but payment is not yet paid: ${session.id}`
          );

          break;
        }

        const lineItems =
          await stripe.checkout.sessions.listLineItems(
            session.id,
            {
              limit: 100,
            }
          );

        console.log(
          "========================================"
        );

        console.log(
          "SOMSOA ORDER PAID"
        );

        console.log(
          "========================================"
        );

        console.log(
          "Checkout Session:",
          session.id
        );

        console.log(
          "Customer:",
          session.customer_details?.name ||
            "Not provided"
        );

        console.log(
          "Email:",
          session.customer_details?.email ||
            "Not provided"
        );

        console.log(
          "Phone:",
          session.customer_details?.phone ||
            "Not provided"
        );

        console.log(
          "Amount:",
          session.amount_total
            ? `£${(
                session.amount_total / 100
              ).toFixed(2)}`
            : "Unknown"
        );

        console.log(
          "Shipping address:",
          session.customer_details
            ?.address || "Not provided"
        );

        console.log(
          "Items:",
          lineItems.data.map((item) => ({
            name: item.description,
            quantity: item.quantity,
            amount:
              item.amount_total != null
                ? `£${(
                    item.amount_total / 100
                  ).toFixed(2)}`
                : undefined,
          }))
        );

        console.log(
          "========================================"
        );

        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        console.log(
          "Delayed payment succeeded:",
          session.id
        );

        break;
      }

      case "checkout.session.async_payment_failed": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        console.log(
          "Delayed payment failed:",
          session.id
        );

        break;
      }

      default:
        console.log(
          `Unhandled Stripe event: ${event.type}`
        );
    }

    return NextResponse.json(
      {
        received: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Stripe webhook handler error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Webhook handler failed.",
      },
      { status: 500 }
    );
  }
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';

type Product = {
  id: string;
  name: string;
  colour: string;
  price_pence: number;
  sale_price_pence: number | null;
  active: boolean;
};

type PriceDraft = {
  price: string;
  salePrice: string;
};

export default function ProductsAdmin() {
  const router = useRouter();

  const [items, setItems] = useState<Product[]>([]);
  const [drafts, setDrafts] = useState<Record<string, PriceDraft>>({});
  const [busy, setBusy] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      const sb = getSupabase();

      const {
        data: { user },
      } = await sb.auth.getUser();

      if (!user || user.app_metadata?.role !== 'admin') {
        router.replace('/admin/login');
        return;
      }

      const { data, error } = await sb
        .from('products')
        .select(
          'id,name,colour,price_pence,sale_price_pence,active'
        )
        .order('sort_order');

      if (cancelled) return;

      if (error) {
        setError(error.message);
      } else {
        const products = (data ?? []) as Product[];

        setItems(products);

        const initialDrafts: Record<string, PriceDraft> = {};

        products.forEach((product) => {
          initialDrafts[product.id] = {
            price: (product.price_pence / 100).toFixed(2),
            salePrice:
              product.sale_price_pence === null
                ? ''
                : (product.sale_price_pence / 100).toFixed(2),
          };
        });

        setDrafts(initialDrafts);
      }

      setBusy(false);
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [router]);

  function updateDraft(
    id: string,
    field: keyof PriceDraft,
    value: string
  ) {
    setDrafts((current) => ({
      ...current,
      [id]: {
        ...current[id],
        [field]: value,
      },
    }));
  }

  function formatDraft(
    id: string,
    field: keyof PriceDraft
  ) {
    const value = drafts[id]?.[field] ?? '';

    if (value.trim() === '') return;

    const number = Number(value);

    if (Number.isFinite(number) && number >= 0) {
      updateDraft(id, field, number.toFixed(2));
    }
  }

  function patch(id: string, values: Partial<Product>) {
    setItems((old) =>
      old.map((product) =>
        product.id === id
          ? { ...product, ...values }
          : product
      )
    );
  }

  async function save(product: Product) {
    setMessage('');
    setError('');

    const draft = drafts[product.id];

    if (!draft) return;

    const price = Number(draft.price);
    const salePrice =
      draft.salePrice.trim() === ''
        ? null
        : Number(draft.salePrice);

    if (
      draft.price.trim() === '' ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      setError(`Enter a valid price for ${product.name}.`);
      return;
    }

    if (
      salePrice !== null &&
      (!Number.isFinite(salePrice) || salePrice < 0)
    ) {
      setError(`Enter a valid sale price for ${product.name}.`);
      return;
    }

    if (
      salePrice !== null &&
      salePrice >= price
    ) {
      setError('Sale price must be lower than the standard price.');
      return;
    }

    setSavingId(product.id);

    const pricePence = Math.round(price * 100);
    const salePricePence =
      salePrice === null
        ? null
        : Math.round(salePrice * 100);

    const { error } = await getSupabase()
      .from('products')
      .update({
        price_pence: pricePence,
        sale_price_pence: salePricePence,
        active: product.active,
      })
      .eq('id', product.id);

    setSavingId(null);

    if (error) {
      setError(error.message);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.id === product.id
          ? {
              ...item,
              price_pence: pricePence,
              sale_price_pence: salePricePence,
            }
          : item
      )
    );

    setDrafts((current) => ({
      ...current,
      [product.id]: {
        price: (pricePence / 100).toFixed(2),
        salePrice:
          salePricePence === null
            ? ''
            : (salePricePence / 100).toFixed(2),
      },
    }));

    setMessage(`${product.name} updated successfully.`);
  }

  return (
    <>
      <p className="admin-kicker">Catalogue management</p>

      <h1 className="admin-title">Products & pricing</h1>

      <p className="admin-muted">
        Prices are stored in pence. Changes save to your Supabase catalogue.
      </p>

      {busy ? (
        <p>Loading products…</p>
      ) : (
        <div className="admin-panel admin-products-panel">
          <table className="admin-table admin-products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price (£)</th>
                <th>Sale price (£)</th>
                <th>Active</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {items.map((product) => (
                <tr key={product.id}>
                  <td data-label="Product">
                    <strong>{product.name}</strong>
                    <br />
                    <small>{product.colour}</small>
                  </td>

                  <td data-label="Price (£)">
                    <input
                      className="admin-input"
                      type="text"
                      inputMode="decimal"
                      value={drafts[product.id]?.price ?? ''}
                      onChange={(event) =>
                        updateDraft(
                          product.id,
                          'price',
                          event.target.value
                        )
                      }
                      onBlur={() =>
                        formatDraft(product.id, 'price')
                      }
                    />
                  </td>

                  <td data-label="Sale price (£)">
                    <input
                      className="admin-input"
                      type="text"
                      inputMode="decimal"
                      placeholder="No sale"
                      value={drafts[product.id]?.salePrice ?? ''}
                      onChange={(event) =>
                        updateDraft(
                          product.id,
                          'salePrice',
                          event.target.value
                        )
                      }
                      onBlur={() =>
                        formatDraft(product.id, 'salePrice')
                      }
                    />
                  </td>

                  <td data-label="Active">
                    <input
                      type="checkbox"
                      checked={product.active}
                      onChange={(event) =>
                        patch(product.id, {
                          active: event.target.checked,
                        })
                      }
                    />
                  </td>

                  <td data-label="Action">
                    <button
                      className="admin-button"
                      onClick={() => save(product)}
                      disabled={savingId === product.id}
                    >
                      {savingId === product.id ? 'Saving…' : 'Save'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {message && <p className="admin-success">{message}</p>}
      {error && <p className="admin-error">{error}</p>}
    </>
  );
}

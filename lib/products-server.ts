import { createClient } from '@supabase/supabase-js';
import { PRODUCTS as FALLBACK_PRODUCTS, type Product } from '@/components/products';

type DbProduct = {
  id: string;
  name: string;
  colour: string;
  price_pence: number;
  sale_price_pence: number | null;
  image: string;
  active: boolean;
  sort_order?: number;
};

function getPublicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function getStoreProducts(): Promise<Product[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return FALLBACK_PRODUCTS;
  const { data, error } = await supabase
    .from('products')
    .select('id,name,colour,price_pence,sale_price_pence,image,active,sort_order')
    .eq('active', true)
    .order('sort_order', { ascending: true });
  if (error || !data) {
    console.error('Unable to load SOMSOA products from Supabase:', error?.message);
    throw new Error('The SOMSOA product catalogue is temporarily unavailable. Please try again shortly.');
  }
  return (data as DbProduct[]).map((p) => ({
    id: p.id,
    name: p.name,
    colour: p.colour,
    price: p.sale_price_pence != null && p.sale_price_pence < p.price_pence ? p.sale_price_pence : p.price_pence,
    originalPrice: p.sale_price_pence != null && p.sale_price_pence < p.price_pence ? p.price_pence : undefined,
    image: p.image,
  }));
}

export async function getStoreProductById(id: string) {
  const supabase = getPublicSupabase();
  if (!supabase) throw new Error('Product catalogue is not configured.');
  const { data, error } = await supabase
    .from('products')
    .select('id,name,colour,price_pence,sale_price_pence,image,active')
    .eq('id', id)
    .eq('active', true)
    .maybeSingle();
  if (error) {
    console.error('Unable to validate checkout product:', error.message);
    throw new Error('We could not verify the current product price. Please try again.');
  }
  if (!data) return null;
  const p = data as DbProduct;
  const onSale = p.sale_price_pence != null && p.sale_price_pence < p.price_pence;
  return { id: p.id, name: p.name, colour: p.colour, price: onSale ? p.sale_price_pence! : p.price_pence, originalPrice: onSale ? p.price_pence : undefined, image: p.image } satisfies Product;
}

import { NextResponse } from 'next/server';
import { getStoreProducts } from '@/lib/products-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const products = await getStoreProducts();
  return NextResponse.json({ products }, { headers: { 'Cache-Control': 'no-store' } });
}

import { NextResponse } from 'next/server';
import { supabase } from './supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const label = searchParams.get('label');
  const product = searchParams.get('product');
  const price = searchParams.get('price');

  let query = supabase.from('grainger_products').select('*');

  // Filter by label (category)
  if (label) {
    query = query.ilike('label', `%${label}%`);
  }

  // Filter by product name
  if (product) {
    query = query.ilike('product', `%${product}%`);
  }

  // price is stored as text in Supabase — cast to numeric for comparison
  if (price) {
    query = query.lte('price', price);
  }

  // Order by id and limit results
  const { data, error } = await query.order('id', { ascending: true }).limit(60);

  if (error) {
    console.error('Supabase query error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
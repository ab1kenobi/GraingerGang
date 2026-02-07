import { NextResponse } from 'next/server';
import { supabase } from './supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const label = searchParams.get('label');
    const product = searchParams.get('product');
    const price = searchParams.get('price');

    let query = supabase
      .from('grainger_products')
      .select('*');

    // filter by category
    if (label) {
      query = query.ilike('label', `%${label}%`);
    }

    // filter by product name
    if (product) {
      query = query.ilike('product', `%${product}%`);
    }

    // price filter
    if (price) {
      query = query.lte('price', Number(price));
    }

    const { data, error } = await query
      .order('id', { ascending: true })
      .limit(60);

    if (error) {
      console.error('Supabase query error:', error);

      return NextResponse.json(
        { error: 'Database query failed' },
        { status: 500 }
      );
    }

    console.log("supabase returned:", data?.length, "rows");

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("Route crash:", err);

    return NextResponse.json(
      { error: 'Server crash' },
      { status: 500 }
    );
  }
}

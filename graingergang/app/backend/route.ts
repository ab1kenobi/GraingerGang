import { NextResponse } from 'next/server';
import { supabase } from './supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const label = searchParams.get('label');
  const name = searchParams.get('product');
  const price = searchParams.get('price');
  const imageurl = searchParams.get('image_url');
  const graingerurl = searchParams.get('grainger_url');

  let query = supabase.from('grainger_products').select('*');
  
  if (label) {
    query = query.ilike('label', `%${label}%`);
  }

  if (name) {
    query = query.ilike('product', `%${name}%`);
  }

  if (price) {
    query = query.lte('price', parseFloat(price));
  }

  if (imageurl) {
    query = query.ilike('image_url', `%${imageurl}%`);
  }

  if (graingerurl) {
    query = query.ilike('grainger_url', `%${graingerurl}%`);
  }

  // Limit to 50 items so we don't crash the browser
  const { data, error } = await query.limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
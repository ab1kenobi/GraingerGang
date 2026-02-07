import { NextResponse } from 'next/server';
import { supabase } from './supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const label = searchParams.get('Label');
  const name = searchParams.get('Product');
  const price = searchParams.get('Prices');
  const imageurl = searchParams.get('Image URL');
  const graingerurl = searchParams.get('Grainger URL');

  let query = supabase.from('products').select('*');
  
  if (label) {
    query = query.ilike('name', `%${label}%`); // Case-insensitive search
  }

  if (name) {
    query = query.ilike('Name', `%${name}%`);
  }

  if (price) {
    query = query.ilike('price', `%${price}%`);
  }

  if (imageurl) {
    query = query.ilike('Photo', `%${imageurl}%`);
  }

  if (graingerurl) {
    query = query.ilike('url', `%${graingerurl}%`);
  }

  // Limit to 50 items so we don't crash the browser
  const { data, error } = await query.limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
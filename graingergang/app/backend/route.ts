import { NextResponse } from 'next/server';
import { supabase } from './supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('title');
  const search = searchParams.get('search');

  let query = supabase.from('products').select('*');

  if (category) {
    query = query.ilike('title', `%${category}%`);
  }
  
  if (search) {
    query = query.ilike('name', `%${search}%`); // Case-insensitive search
  }

  // Limit to 50 items so we don't crash the browser
  const { data, error } = await query.limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
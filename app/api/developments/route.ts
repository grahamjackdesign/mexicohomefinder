import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// GET /api/developments - List all developments
export async function GET() {
  const { data, error } = await supabaseServer
    .from('developments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/developments - Create new development
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabaseServer
      .from('developments')
      .insert([body])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

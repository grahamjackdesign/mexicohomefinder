import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role for user creation
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, password } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email verification - let them use immediately
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
      },
    });

    if (authError) {
      console.error('Auth error:', authError);
      
      // Handle duplicate email
      if (authError.message.includes('already been registered')) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Create public_users record for MHF users
    const { error: profileError } = await supabaseAdmin
      .from('public_users')
      .insert({
        id: authData.user.id,
        email: email,
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        created_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Don't fail the registration if profile creation fails
      // The user can still log in and we can create the profile later
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully.',
      userId: authData.user.id,
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

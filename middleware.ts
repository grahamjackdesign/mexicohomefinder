import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple pass-through middleware for MexicoHomeFinder
// This overrides the parent BrokerLink middleware
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};

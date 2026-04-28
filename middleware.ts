import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Get session from cookies (more reliable than localStorage)
  const sessionCookie = request.cookies.get('habit-tracker-session');
  const hasSession = !!sessionCookie?.value;

  // Splash screen route check
  if (pathname === '/') {
    // Root path handling - check if user is authenticated
    if (hasSession) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Allow splash screen to render briefly
    return NextResponse.next();
  }

  // Protected routes (dashboard and related)
  if (pathname.startsWith('/dashboard')) {
    if (!hasSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Auth routes (login, signup)
  if (pathname === '/login' || pathname === '/signup') {
    if (hasSession) {
      // If already authenticated, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure which routes use middleware
export const config = {
  matcher: ['/', '/login', '/signup', '/dashboard/:path*'],
};

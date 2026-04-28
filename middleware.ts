import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Only protect dashboard routes
  // Let root, login, signup render normally - they handle redirects client-side
  if (pathname.startsWith('/dashboard')) {
    const sessionCookie = request.cookies.get('habit-tracker-session');
    const hasSession = !!sessionCookie?.value;
    
    if (!hasSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Only protect dashboard - let other routes handle themselves
export const config = {
  matcher: ['/dashboard/:path*'],
};

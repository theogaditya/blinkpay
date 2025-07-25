// middleware.ts
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

   const publicRoutes = ['/'];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const session = await auth();
  if (!session || !session.user?.email) {
    // Redirect back to "/" so they see the login form
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 3) Authenticated users go on
  return NextResponse.next();
}

export const config = {
  // match every path except Next.js internals, static, favicon, and /api
  matcher: ['/((?!_next|static|favicon.ico|api).*)'],
};

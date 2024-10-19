import { NextResponse } from 'next/server';
import jwtVerify from './lib/jwtVerify';

export async function middleware(request) {
  const publicPaths = ['/', '/about'];
  const adminPaths = ['/admin'];
  const superadminPaths = ['/superadmin'];

  const nextPath = request.nextUrl.pathname;

  if (publicPaths.includes(nextPath)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  if (nextPath === '/login' || nextPath === '/signup') {
    if (token) return NextResponse.redirect(new URL('/dashboard', request.url));
    else return NextResponse.next();
  }

  if (!token) {
    console.log('Token not found');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify the token
    const payload = await jwtVerify(token);

    if (payload.role === 'superadmin') {
      if (nextPath === '/dashboard') return NextResponse.redirect(new URL('/superadmin/dashboard', request.url));
      return NextResponse.next();
    }

    if (payload.role === 'admin' && !superadminPaths.some((path) => nextPath.startsWith(path))) {
      if (nextPath === '/dashboard') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      return NextResponse.next();
    }

    if (
      payload.role === 'user' &&
      !superadminPaths.some((path) => nextPath.startsWith(path)) &&
      !adminPaths.some((path) => nextPath.startsWith(path))
    ) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/unauthorized', request.url));
  } catch (error) {
    console.error('Token verification failed');
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

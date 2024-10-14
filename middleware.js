import { NextResponse } from 'next/server';
import jwtVerify from './lib/jwtVerify';

export async function middleware(request) {
  const publicPaths = ['/', '/login', '/signup', '/unauthorized', '/not-found'];
  const adminPaths = ['/admin'];
  const superadminPaths = [...adminPaths, '/superadmin'];

  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify the token
    const payload = await jwtVerify(token);

    if (payload.role === 'admin' && adminPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
      return NextResponse.next();
    }

    if (payload.role === 'superadmin' && superadminPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
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

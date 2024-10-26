import { NextResponse } from 'next/server';
import jwtVerify from './lib/jwtVerify';

export async function middleware(req) {
  const publicPaths = ['/about'];
  const adminPaths = ['/admin'];
  const superadminPaths = ['/superadmin'];

  const nextPath = req.nextUrl.pathname;

  if (publicPaths.includes(nextPath)) {
    return NextResponse.next();
  }

  if (nextPath.startsWith('/emailverification')) {
    const id = nextPath.slice('/emailverification'.length + 1);
    try {
      const res = await fetch(`${req.nextUrl.origin}/api/auth/checkTempAuth?id=${id}`);
      if (!res.ok) return NextResponse.redirect(new URL('/not_found', req.url));
      return NextResponse.next();
    } catch (error) {
      return NextResponse.next();
    }
    // return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;

  if (nextPath === '/login' || nextPath === '/signup') {
    if (token) return NextResponse.redirect(new URL('/dashboard', req.url));
    else return NextResponse.next();
  }

  if (nextPath === '/changepassword') {
    try {
      const passChangeToken = req.cookies.get('passChangeToken')?.value;
      await jwtVerify(passChangeToken, process.env.JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (!token) {
    console.error('Token not found');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    // Verify the token
    const payload = await jwtVerify(token, process.env.JWT_SECRET);

    if (payload) {
      if (nextPath === '/') return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    if (payload.role === 'user' && nextPath === '/dashboard')
      return NextResponse.redirect(new URL('/searchQuestion', req.url));

    if (payload.role === 'superadmin') {
      if (nextPath === '/dashboard') return NextResponse.redirect(new URL('/superadmin/dashboard', req.url));
      return NextResponse.next();
    }

    if (payload.role === 'admin' && !superadminPaths.some((path) => nextPath.startsWith(path))) {
      if (nextPath === '/dashboard') return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      return NextResponse.next();
    }

    if (
      payload.role === 'user' &&
      !superadminPaths.some((path) => nextPath.startsWith(path)) &&
      !adminPaths.some((path) => nextPath.startsWith(path))
    ) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/unauthorized', req.url));
  } catch (error) {
    console.error('Token verification failed');
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

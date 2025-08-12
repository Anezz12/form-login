import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/user/:path*'],
};

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  console.log('Middleware token:', token);

  if (!token) return redirectToLogin(req);

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${apiBase}/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('API validation status:', res.status); // Debug log

    if (res.ok) {
      console.log('Token valid, allowing access');
      return NextResponse.next();
    }

    console.log('Token invalid, redirecting to login');
  } catch (error) {
    console.error('Token validation error:', error);
  }

  // invalid/expired → hapus cookie & redirect
  const resp = redirectToLogin(req);
  resp.cookies.set('token', '', { maxAge: 0, path: '/' });
  return resp;
}

function redirectToLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = '/signup';
  return NextResponse.redirect(url);
}

import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/user/:path*'],
};

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;

  // kalau tidak ada token → redirect login
  if (!token) return redirectToLogin(req);

  // verifikasi ke Laravel (super cepat, 204 kalau valid)
  const apiBase = process.env.NEXT_PUBLIC_API_BASE!;
  const res = await fetch(`${apiBase}/api/auth/verify`, {
    headers: { Authorization: `Bearer ${token}` },
    // NOTE: jangan kirim credentials lain; cukup header Authorization
    cache: 'no-store',
  });

  if (res.ok) return NextResponse.next();

  // invalid/expired → hapus cookie & redirect
  const resp = redirectToLogin(req);
  resp.cookies.set('access_token', '', { maxAge: 0, path: '/' });
  return resp;
}

function redirectToLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = '/';
  url.searchParams.set('next', req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

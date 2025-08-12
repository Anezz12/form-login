import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const body = await request.json();
  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${apiBase}/auth/google/exchange`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${body.token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json();
    return NextResponse.json({ error: err.message }, { status: 401 });
  }

  const data = await response.json();
  const token = data?.authorization?.token as string | undefined;
  const ttl = data?.authorization?.expires_in as number | undefined; // detik

  if (!token)
    return NextResponse.json({ message: 'No token' }, { status: 500 });

  // set cookie HTTP-only
  const maxAge = ttl ?? 60 * 15;
  (await cookies()).set('access_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge,
  });

  return NextResponse.json({ ok: true });
}

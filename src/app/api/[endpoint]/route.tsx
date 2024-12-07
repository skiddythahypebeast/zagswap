import { notFound } from 'next/navigation';
import { NextResponse, type NextRequest } from 'next/server';
import { env } from '~/env';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest, { params }: { params: Promise<{ endpoint: string }> }) {
  const token = await getToken({ req: request });
  const url = new URL(`${env.SERVER_URL}/${(await params).endpoint}`);

  if (token?.swap_api_key) {
    url.searchParams.append('api_key', token.swap_api_key);
  } else {
    url.searchParams.append('api_key', env.API_KEY_WITH_FEE);
  }
  
  const localSearchParams = request.nextUrl.searchParams;
  localSearchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: { "Content-Type": "application/json"},
  });

  if (!response.ok) {
    const error = await response.text();
    if (response.status === 404) { notFound(); }
    console.error(`Error response from origin server: ${error}`);
    return NextResponse.json({ error: 'Something went wrong on the server.' }, { status: response.status });
  }

  const data = await response.json() as object;
  return NextResponse.json(data);
}
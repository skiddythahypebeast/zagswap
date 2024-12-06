import { notFound } from 'next/navigation';
import { NextResponse, type NextRequest } from 'next/server';
import { env } from '~/env';

export async function GET(request: NextRequest, { params }: { params: Promise<{ endpoint: string }> }) {
  const url = new URL(`${env.SERVER_URL}/${(await params).endpoint}`);
  url.searchParams.append('api_key', env.API_KEY);
  
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

export async function POST(request: NextRequest, { params }: { params: Promise<{ endpoint: string }> }) {
  const url = new URL(`${env.SERVER_URL}/${(await params).endpoint}`);
  url.searchParams.append('api_key', env.API_KEY);
  
  const localSearchParams = request.nextUrl.searchParams;
  localSearchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  const contentType = request.headers.get("Content-Type");
  if (contentType !== "application/json") {
    return NextResponse.json({ error: "Something went wrong on the server." }, { status: 500 });
  }

  const response = await fetch(url.toString(), {
    method: 'POST',
    body: request.body,
    headers: { "Content-Type": "application/json" },
    duplex: 'half',
  } as object);

  if (!response.ok) {
    const error = await response.text();
    if (response.status === 404) { notFound(); }
    console.error(`Error response from origin server: ${error}`);
    return NextResponse.json({ error: 'Something went wrong on the server.' }, { status: 500 });
  }

  const data = await response.json() as object;
  return NextResponse.json(data);
}
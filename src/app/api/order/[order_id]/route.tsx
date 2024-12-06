import { notFound } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";
import { RequestType } from "~/app/swap/models";
import { env } from "~/env";

export async function GET(_: NextRequest, props: { params: Promise<{ order_id: string }> }) {
  const params = await props.params;
  const order_id_buf = Buffer.from(params.order_id, 'hex');
  const order_id = order_id_buf.toString('utf8');

  if (!order_id) {
    console.error(`Invalid order id: ${params.order_id}`);
    notFound();
  }

  const response = await fetch(`${env.SERVER_URL}/${RequestType.GET_ORDER}?api_key=${env.API_KEY}&id=${order_id}`, {
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
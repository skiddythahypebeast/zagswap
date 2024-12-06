import { type GetOrderResponse } from "../models";
import { OrderDetails } from "../components/order_details";
import { notFound } from "next/navigation";
import { env } from "~/env";
import { RequestType } from "~/app/swap/models";

export default async function Order(props: { params: Promise<{ order_id: string }> }) {
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

  if (response.status == 404) {
    notFound();
  } else if (!response.ok) {
    console.error(await response.json());
    throw new Error("Internal server error");
  }

  const order_details = await response.json() as GetOrderResponse;
  order_details.id = params.order_id;

  const currency_from = order_details.currencies[order_details.currency_from];
  const currency_to = order_details.currencies[order_details.currency_to];

  if(!currency_from || !currency_to) {
    console.error(`Failed to index currencies: ${JSON.stringify(order_details, null, 2)}`);
    throw new Error("Internal server error");
  }

  if (order_details.status == "refunded") {
    console.warn(`Order refunded: ${params.order_id}`);
    console.info("Response switched to error status");
    order_details.status = "failed";
  }

  return (
    <OrderDetails 
      order_id={params.order_id}
      order_details={order_details} 
      currency_from={currency_from} 
      currency_to={currency_to} />
  );
}
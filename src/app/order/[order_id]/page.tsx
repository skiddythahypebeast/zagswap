import { RequestType } from "~/app/swap/models";
import { type GetOrderResponse } from "../models";
import { env } from "~/env";
import { OrderDetails } from "../components/order_details";
import { notFound } from "next/navigation";

export default async function Order(props: { params: Promise<{ order_id: string }> }) {
  const params = await props.params;
  const data = await fetch(`${env.SERVER_URL}/${RequestType.GET_ORDER}?api_key=${env.API_KEY}&id=${params.order_id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });

  if (data.status == 404) {
    notFound();
  } else if (!data.ok) {
    console.error(await data.json());
    throw new Error("Internal server error");
  }

  const order_details = await data.json() as GetOrderResponse;
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
import Order from "~/app/order/[order_id]/page";

export default function OrderModal({ params }: { params: Promise<{ order_id: string }> }) {
    return (<Order params={params} />)
}
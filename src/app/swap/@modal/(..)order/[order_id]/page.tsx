import Order from "~/app/order/[order_id]/page";
import { Modal } from "../../modal";

export default function OrderModal({ params }: { params: Promise<{ order_id: string }> }) {
    return (
        <Modal>
            <Order params={params} />
        </Modal>
    )
}
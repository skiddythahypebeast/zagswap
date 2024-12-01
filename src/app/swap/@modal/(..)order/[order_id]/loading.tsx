import { OrderLoader } from "~/app/order/components/loader";
import { Modal } from "../../modal";

export default function Loading() {
    return (
        <div className="absolute inset-0 z-50 fade-in">
            <Modal>
                <OrderLoader/>
            </Modal>
        </div>
    )
}
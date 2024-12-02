import { type ReactNode } from "react";
import { Modal } from "../../modal";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <Modal>
            {children}
        </Modal>
    )
}
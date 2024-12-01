'use client'

import { ErrorHandler } from "~/app/order/components/error_handler"
import { Modal } from "../../modal"
import { useRouter } from "next/navigation"

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
    const router = useRouter();
    return (
        <Modal>
            <ErrorHandler error={error} reset={reset} back={() => router.back()} />
        </Modal>
    )    
}
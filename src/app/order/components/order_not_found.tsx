"use client"

import { useRouter } from "next/navigation";

export const OrderNotFound = () => {
    const router = useRouter();
    return (
        <div className="w-[600px] max-w-[95%] h-[600px] px-20 flex flex-col gap-5 items-center justify-center">
            <h2 className='text-3xl font-bold text-center'>Sorry we could not find your order</h2>
            <p className="font-sm text-medium opacity-80">Please check your order ID and try again.</p>
            <div className="py-5">
                <p className="text-9xl font-bold opacity-20">404</p>
            </div>
            <button onClick={() => router.push("/swap")} className="bg-primary dark:bg-primary-dark rounded-md py-2 px-20">
                <p className="font-medium text-bg1">Back</p>
            </button>
        </div>
    )
}
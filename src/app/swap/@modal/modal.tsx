"use client"

import Image from "next/image"
import { useRouter } from "next/navigation";
import { type ReactNode } from "react"

export const Modal = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const closeModal = () => router.back();
    return (
        <div className="z-50 inset-0 fixed">
            <div className="z-30 w-full h-full backdrop-blur-sm flex flex-row justify-end">
                <div className="py-10 shadow-2xl shadow-[#00000050] flex flex-col items-center justify-center relative xl:w-[600px] lg:w-[600px] md:w-[600px] w-full bg-white">
                    <nav className="w-full flex flex-row items-center bg-white justify-between absolute top-0">
                        <div />
                        <button onClick={closeModal} className="p-3 opacity-50 hover:opacity-100">
                            <Image src="/icons/x-mark.svg" alt="" height={15} width={15} />
                        </button>
                    </nav>
                    {children}
                </div>
            </div>
        </div>
    )
}
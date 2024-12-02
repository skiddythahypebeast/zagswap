"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { type ReactNode } from "react"

export const Modal = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const closeModal = () => router.back();
    return (
        <>
            <nav className="w-full fixed top-0 right-0 flex flex-row items-center justify-between z-50">
                <div />
                <button onClick={closeModal} className="p-3 opacity-50 hover:opacity-100">
                    <Image src="/icons/x-mark.svg" alt="" height={15} width={15} />
                </button>
            </nav>
            <div className="z-30 absolute w-full bottom-0 xl:h-full lg:h-full top-0 backdrop-blur-sm flex flex-row justify-end">
                <div className="bg-white py-10 shadow-2xl shadow-[#00000050] flex items-center justify-center xl:w-[600px] lg:w-[600px] md:w-[600px] w-full">
                    {children}
                </div>
            </div>
        </>
    )
}
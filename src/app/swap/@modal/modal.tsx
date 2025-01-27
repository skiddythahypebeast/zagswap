"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react"

export const Modal = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const closeModal = () => router.back();
    return (
        <div className="z-50 inset-0 fixed">
            <div className="z-30 w-full h-full backdrop-blur-sm flex flex-row justify-end">
                <div className="py-10 dark:border-l-[1px] dark:border-l-border-dark flex flex-col items-center justify-center relative xl:w-[600px] lg:w-[600px] md:w-[600px] w-full bg-one dark:bg-one-dark">
                    <nav className="w-full flex flex-row items-center bg-one dark:bg-one-dark justify-between absolute top-0">
                        <div />
                        <button onClick={closeModal} className="p-3 opacity-50 hover:opacity-100">
                            <Image src="/icons/x-mark.svg" className="dark:filter dark:invert -rotate-90" height={15} width={15} alt="Icon"/>
                        </button>
                    </nav>
                    {children}
                </div>
            </div>
        </div>
    )
}
import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";

export default function OrderLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <header className="fixed w-full xl:px-5 lg:px-5 px-2 h-14 p-2 flex flex-row justify-between items-center bg-white">
                <Link href="/">
                    <Image src="/icons/qr.svg" alt="" height={25} width={25} />
                </Link>
                <nav className="flex flex-row gap-5 h-full items-center">
                    <Link href="/order/6c793436363674723034776a6e776c31">Orders</Link>
                    <Link href="/swap">
                        <p>Swap</p>
                    </Link>
                </nav>
            </header>
            <main className="flex min-h-screen w-full flex-col items-center justify-center bg-white text-stone-800">
                {children}
            </main>
        </>
    )
}
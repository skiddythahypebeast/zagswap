import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "../connect-button";

export default function Layout({ children, modal }: { modal: React.ReactNode, children: React.ReactNode }) {
    return (
        <>
            <header className="fixed w-full xl:px-5 lg:px-5 px-2 h-14 p-2 flex flex-row justify-between items-center bg-white">
                <Link href="/">
                    <Image src="/icons/qr.svg" alt="" height={25} width={25} />
                </Link>
                <nav className="flex flex-row gap-5 h-full items-center">
                    <ConnectButton />
                </nav>
            </header>
            <main className="flex w-[500px] max-w-[95%] m-auto min-h-screen flex-col items-center justify-center bg-gradient-to-b text-stone-800">
                {modal}
                {children}
            </main>
        </>
    )
}
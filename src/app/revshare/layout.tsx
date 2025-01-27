"use client";

import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { type ReactNode } from "react";

export default function RevShareLayout({ children, revshare }: { revshare: ReactNode, children: ReactNode }) {
    const segment = useSelectedLayoutSegment('revshare');

    return (
        <div className="flex w-[500px] min-h-screen max-w-[95%] m-auto flex-col rounded-lg gap-2 items-center justify-center">
            <nav className="h-10 w-full flex flex-row items-center justify-between">
                <div className="h-full gap-2 items-center flex flex-row">
                    <Link href="/revshare/mint" className={`${segment == 'mint' ? 'secondary-button' : ''} rounded-lg px-3 py-1`}>
                        <p className="text-md font-medium">Mint</p>
                    </Link>
                    <Link href="/revshare/claim" className={`${segment == 'claim' ? 'secondary-button' : ''} rounded-lg px-3 py-1`}>
                        <p className="text-md font-medium">Claim</p>
                    </Link>
                </div>
                <div className={`${segment == 'claim' ? 'block' : 'hidden'} px-3`}>
                    <Image src="/icons/claim.svg" className="dark:filter dark:invert" height={20} width={20} alt="Icon"/>
                </div>
                <div className={`${segment == 'mint' ? 'block' : 'hidden'} px-3`}>
                    <Image src="/icons/nft.svg" className="dark:filter dark:invert" height={20} width={20} alt="Icon"/>
                </div>
            </nav>
            <main className="w-full bg-three dark:bg-three-dark rounded-xl shadow-inner shadow-shade dark:shadow-shade-dark">
                {children}
                {revshare}
            </main> 
        </div>
    )
}
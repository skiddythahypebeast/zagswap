"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react";

export const Nav = () => {
    const [showMenu, setShowMenu] = useState(false);

    const openMenu = () => setShowMenu(true);
    const closeMenu = () => setShowMenu(false);

    const items = (
        <>
            <Link href="/swap"><p className='font-medium text-md'>Swap</p></Link>
            <Link href="/revshare/mint"><p className='font-medium text-md'>Revshare</p></Link>
        </>
    );

    return (
        <>
            <nav className="flex flex-row gap-5 h-full items-center">
                <Link href="/"><Image src="/icons/qr.svg" alt="" height={20} width={20} /></Link>
                <div className="xl:flex lg:flex md:flex hidden flex-row gap-5 h-full items-center">
                    {items}
                </div>
                <button onClick={openMenu} className="xl:hidden lg:hidden md:hidden flex">
                    <Image src="/icons/bars.svg" alt="" height={15} width={15} />
                </button>
            </nav>
            <div className={`${showMenu ? "" : "translate-y-[100vh]" } transition-transform duration-200 fixed bottom-0 left-0 right-0 p-2 min-h-[80vh] z-50 bg-white border-t-slate-300 border-t-2`}>
                <div className="w-full h-full flex flex-row items-center justify-end">
                    <button onClick={closeMenu}>
                        <Image src="/icons/x-mark.svg" className="opacity-80" alt="" height={20} width={20}/>
                    </button>
                </div>
                <div className="flex flex-col gap-5">
                    {items}
                </div>
            </div>
        </>
    )
}
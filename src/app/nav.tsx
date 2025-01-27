"use client"

import Image from "next/image";
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
                <Link href="/" className="">
                    <Image src="/logo/logo.svg" height={30} width={30} alt="Icon"/>
                </Link>
                <div className="xl:flex lg:flex md:flex hidden flex-row gap-5 h-full items-center">
                    {items}
                </div>
                <button onClick={openMenu} className="xl:hidden lg:hidden md:hidden flex">
                    <Image src="/icons/bars.svg" className="dark:filter dark:invert opacity-50" height={15} width={15} alt="Icon"/>
                </button>
            </nav>
            <div className={`${showMenu ? "" : "translate-y-[100vh]" } transition-transform duration-200 fixed bottom-0 left-0 right-0 p-2 min-h-[80vh] z-50 bg-one dark:bg-one-dark dark:border-t-five-dark border-t-five border-t-2`}>
                <div className="w-full h-full flex flex-row items-center justify-end">
                    <button onClick={closeMenu}>
                        <Image src="/icons/x-mark.svg" className="dark:filter dark:invert" alt="Icon" height={15} width={15}/>
                    </button>
                </div>
                <div className="flex flex-col gap-5">
                    {items}
                </div>
            </div>
        </>
    )
}
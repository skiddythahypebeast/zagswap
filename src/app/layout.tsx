import '@rainbow-me/rainbowkit/styles.css';
import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Web3Provider } from "./wagmi";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/auth-options";
import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton } from './connect-button';

export const metadata: Metadata = {
  title: "private swap",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="min-h-screen w-full text-stone-800">
        <Web3Provider session={session}>
          <header className="fixed w-full xl:px-5 lg:px-5 px-2 h-14 p-2 flex flex-row justify-between items-center bg-white">
            <nav className="flex flex-row gap-5 h-full items-center">
                <Link href="/">
                    <Image src="/icons/qr.svg" alt="" height={20} width={20} />
                </Link>
                <Link href="/swap"><p className='font-medium'>Swap</p></Link>
                <Link href="/order/6c793436363674723034776a6e776c31"><p className='font-medium'>Orders</p></Link>
                <Link href="/rev"><p className='font-medium'>Rev</p></Link>
            </nav>
            <ConnectButton />
          </header>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
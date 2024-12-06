import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "private swap",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <header className="fixed w-full px-10 h-12 p-2 flex flex-row justify-between items-center bg-white">
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
        <main className="min-h-screen w-full text-stone-800">
          {children}
        </main>
      </body>
    </html>
  );
}
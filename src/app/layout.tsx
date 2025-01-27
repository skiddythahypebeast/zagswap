/* eslint-disable @next/next/no-page-custom-font */
import "~/styles/globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { type Metadata } from "next";
import { Web3Provider } from "./wagmi";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/auth-options";
import { ConnectButton } from './connect-button';
import { TrackOrder } from './track-order';
import { Nav } from './nav';

export const metadata: Metadata = {
  title: "Zagswap",
  description: "",
  icons: [{ rel: "icon", url: "/logo/logo.svg" }],
};

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" className={`font-sofia-sans bg-one dark:bg-one-dark`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech&family=Share+Tech+Mono&family=Sofia+Sans:ital,wght@0,1..1000;1,1..1000&display=swap" rel="stylesheet"/>
      </head>
      <body className="h-screen w-full text-text dark:text-text-dark overflow-clip">
        <Web3Provider session={session}>
          <header className="fixed w-full gap-2 px-2 h-12 p-2 flex flex-row justify-between items-center bg-one dark:bg-one-dark z-50">
            <div className='flex-1 h-full'>
              <Nav />
            </div>
            <div className='flex-1 flex flex-row items-center justify-center h-full'>
              <TrackOrder />
            </div>
            <div className='flex flex-1 flex-row items-stretch justify-end h-full'>
              <ConnectButton />
            </div>
          </header>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
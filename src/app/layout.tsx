import '@rainbow-me/rainbowkit/styles.css';
import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Web3Provider } from "./wagmi";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/auth-options";
import { ConnectButton } from './connect-button';
import { TrackOrder } from './track-order';
import { Nav } from './nav';

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
          <header className="fixed w-full gap-2 xl:px-5 lg:px-5 px-2 h-14 p-2 flex flex-row justify-between items-center bg-white z-50">
            <div className='flex-1'>
              <Nav />
            </div>
            <div className='flex-1 flex flex-row items-center justify-center'>
              <TrackOrder />
            </div>
            <div className='flex flex-1 flex-row items-center justify-end'>
              <ConnectButton />
            </div>
          </header>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
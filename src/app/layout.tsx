import '@rainbow-me/rainbowkit/styles.css';
import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Web3Provider } from "./wagmi";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/auth-options";

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
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
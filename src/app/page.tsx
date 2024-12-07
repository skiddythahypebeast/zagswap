import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
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
    <div className="min-h-screen w-full h-full flex flex-col gap-5 items-center justify-center">
      <h1 className="xl:text-5xl lg:text-5xl md:text-4xl text-3xl font-bold text-center">Private Swap Dex</h1>
      <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 xl:w-1/3 lg:w-1/2 md:w-1/2 w-[95vw]">
        <Card href="/swap" title="SWAP" info="Swap 1000's of tokens across 300 different chains"/>
        <Card href="/order/6c793436363674723034776a6e776c31" title="ORDERS" info="Track and fulfil pending orders"/>
      </div>
    </div>
    </>
  );
}

const Card = ({ title, href, info }: { title: string, href: string, info: string }) => {
  return (
    <Link href={href} className="bg-blue-400 shadow-sm shadow-[#00000050] grid-item rounded-lg p-5 text-white">
      <h2 className="font-bold">{title}</h2>
      <p className="text-sm opacity-80">{info}</p>
    </Link>
  )
}
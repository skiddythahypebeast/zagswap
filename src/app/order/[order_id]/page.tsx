import Image from "next/image";
import { chainColors, RequestType } from "~/app/swap/models";
import { type GetOrderResponse } from "../models";
import { CopyButton } from "../components/copy_button";
import { env } from "~/env";

export default async function Order({ params: paramsPromise }: { params: Promise<{ order_id: string }> }) {
  const params = await paramsPromise;
  const data = await fetch(`${env.SERVER_URL}/${RequestType.GET_ORDER}?api_key=${env.API_KEY}&id=${params.order_id}`);
  if (!data.ok) { throw await data.json() };
  const order_details = await data.json() as GetOrderResponse;
  const currencyFrom = order_details.currencies[order_details.currency_from];
  const currencyTo = order_details.currencies[order_details.currency_to];
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b text-stone-800">
      <div className="w-[600px] max-w-[95%] h-[600px] flex flex-col gap-2">
        <div className="border-slate-200 border-2 px-2 py-1 rounded-md justify-between flex flex-row gap-2">
          <p className="text-sm font-bold">Order ID:</p>
          <CopyButton value={params.order_id} className="flex flex-row gap-2 items-center opacity-70 hover:opacity-100">
            <p className="fade-in text-sm font-semibold font-mono">{params.order_id}</p>
            <Image src="/icons/copy.svg" className="fade-in" alt="" height={10} width={10} />
          </CopyButton>
        </div>
        <div className="xl:p-5 lg:p-5 md:p-5 p-2 gap-2 flex flex-col mt-5 bg-blue-100 rounded-lg">
          <div className="bg-blue-300 px-2 py-1 rounded-md justify-between flex flex-row gap-2">
            <p className="text-sm font-bold">Deposit</p>
            <button className="opacity-60 hover:opacity-80">
              <Image src="/icons/info.svg" alt="" height={17} width={17} />
            </button>
          </div>
          <CopyButton value={order_details.address_from} className="hover:opacity-90 opacity-70 flex flex-row justify-between h-16 gap-5 items-center xl:px-5 lg:px-5 md:px-5 px-3 bg-blue-200 rounded-lg ">
            <p className="fade-in xl:text-lg lg:text-lg md:text-lg text-md font-semibold text-center truncate">{order_details.address_from}</p>
            <Image src="/icons/copy.svg" className="fade-in" alt="" height={12} width={12} />
          </CopyButton>
          <div className="flex flex-row h-10 py-1 xl:px-5 lg:px-5 md:px-5 px-3 items-center rounded-md justify-between bg-blue-200">
            <div className="flex flex-row h-8 gap-2 items-center w-1/2 rounded-md py-1">
              <p className="opacity-60 text-sm font-bold">send</p>
              <p className="fade-in text-md font-mono truncate">{order_details.amount_from}</p>
            </div>
            {currencyFrom && <div className="flex flex-row gap-2">
              <Image className="fade-in" src={currencyFrom?.image ?? "/icons/coin.svg"} alt="" height={25} width={25} />
              <p className="fade-in text-md font-medium">{order_details.currency_from.toUpperCase()}</p>
              <div className="fade-in px-2 rounded-full flex items-center justify-center" style={{ backgroundColor: chainColors[currencyFrom.network] }}>
                <p className="text-sm font-bold text-white">{currencyFrom.network.toUpperCase()}</p>
              </div>
            </div>} 
          </div>
        </div>
        <div className="bg-slate-200 border-2 px-2 mt-5 py-1 rounded-md justify-between flex flex-row gap-2">
          <p className="text-sm font-bold">Receive</p>
        </div>
        <CopyButton value={order_details.address_to} className="hover:opacity-90 opacity-70 flex flex-row justify-between h-12 gap-5 items-center xl:px-5 lg:px-5 md:px-5 px-3 bg-zinc-200 rounded-lg ">
          <p className="fade-in xl:text-md lg:text-md md:text-md text-sm font-semibold text-center truncate">{order_details.address_to}</p>
          <Image className="fade-in" src="/icons/copy.svg" alt="" height={12} width={12} />
        </CopyButton>
        <div className="flex flex-row h-10 py-1 xl:px-5 lg:px-5 md:px-5 px-3 items-center rounded-md justify-between bg-zinc-200">
          <div className="flex flex-row h-8 gap-2 items-center w-1/2 rounded-md py-1">
            <p className="opacity-60 text-sm font-bold">receive</p>
            <p className="fade-in text-md font-mono truncate">{order_details.amount_to}</p>
          </div>
          {currencyTo && <div className="flex flex-row gap-2">
            <Image className="fade-in" src={currencyTo?.image ?? "/icons/coin.svg"} alt="" height={25} width={25} />
            <p className="fade-in text-md font-medium">{order_details.currency_to.toUpperCase()}</p>
            <div className="fade-in px-2 rounded-full flex items-center justify-center" style={{ backgroundColor: chainColors[currencyTo.network] }}>
              <p className="text-sm font-bold text-white">{currencyTo.network.toUpperCase()}</p>
            </div>
          </div>} 
        </div>
        <div className="bg-slate-200 mt-5 border-2 px-2 py-1 rounded-md justify-between flex flex-row gap-2">
          <p className="text-sm font-bold">Progress</p>
        </div>
        <div className="flex flex-row w-full gap-2">
          <div className="flex-1">
            <div className="h-3 bg-blue-400 rounded-full"/>
            <p className="text-xs text-center">pending deposit</p>
          </div>
          <div className="flex-1">
            <div className="h-3 bg-blue-400 animate-pulse rounded-full"/>
            <p className="text-xs text-center">funds received</p>
          </div>
          <div className="flex-1">
            <div className="h-3 bg-slate-300 rounded-full"/>
            <p className="text-xs text-center">exchanging</p>
          </div>
          <div className="flex-1">
            <div className="h-3 bg-slate-300 rounded-full"/>
            <p className="text-xs text-center">processing</p>
          </div>
        </div>
      </div>
    </main>
  );
}
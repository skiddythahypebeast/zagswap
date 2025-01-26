import { env } from "~/env";
import { SwapForm } from "./components/form";
import { CHAIN_PLACEHOLDERS, Currencies, type GetCurrencyResponse, type GetRangeResponse, RequestType } from "./models";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Swap(props: { searchParams: Promise<{ inputCurrency?: string, outputCurrency?: string }> }) {
    const { inputCurrency = Currencies.ETH, outputCurrency = Currencies.USDC_ETH } = await props.searchParams;

    const allCurrenciesResponse = await fetch(`${env.SERVER_URL}/${RequestType.GET_ALL_CURRENCIES}?api_key=${env.API_KEY_FREE}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },    
    });
    
    const [pairsResponse, rangeResponse] = await Promise.all([
      await fetch(`${env.SERVER_URL}/${RequestType.GET_PAIRS}?api_key=${env.API_KEY_FREE}&fixed=false&symbol=${inputCurrency}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
      await fetch(`${env.SERVER_URL}/${RequestType.GET_RANGE}?api_key=${env.API_KEY_FREE}&fixed=false&currency_from=${inputCurrency}&currency_to=${outputCurrency}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
    ]);

    if (!allCurrenciesResponse.ok) throw new Error(`Currencies fetch failed: ${allCurrenciesResponse.statusText}`);
    const allCurrencies = (await allCurrenciesResponse.json() as GetCurrencyResponse[]).filter(x => !x.isFiat);
    
    let pairs: string[] = [];
    if (!pairsResponse.ok) {
      if (pairsResponse.status !== 404) {
        throw new Error(`Pairs fetch failed: ${pairsResponse.statusText}`);
      }
      pairs = [];
    } else {
      pairs = (await pairsResponse.json()) as string[];
    }
    const isActivePair = pairs.includes(outputCurrency);
    let range: GetRangeResponse;

    if(isActivePair){
      if (!rangeResponse.ok) throw new Error(`Range fetch failed: ${rangeResponse.statusText}`);
      range = (await rangeResponse.json() as GetRangeResponse);
    } else {
      range = { max: null, min: null }
    }

    const inputCurrencyData = allCurrencies.find((c) => c.symbol === inputCurrency);
    const outputCurrencyData = allCurrencies.find((c) => c.symbol === outputCurrency);

    if (!inputCurrencyData || !outputCurrencyData) {
      console.error(`Currency not found: ${inputCurrency} or ${outputCurrency}`);
      notFound();
    }
  
    return (
      <div className="flex flex-col gap-2 w-full">
        <Link href="" target="_blank" className="rounded-xl w-full aspect-[3/1] overflow-clip">
          <Image src="/ad-banner-one.png" alt="" height={500} width={1500} />
        </Link>
        <SwapForm 
          range={range}
          isActivePair={isActivePair}
          allCurrencies={allCurrencies}
          inputCurrency={inputCurrencyData} 
          outputCurrency={{ 
            ...outputCurrencyData, 
            placeholder: CHAIN_PLACEHOLDERS[outputCurrencyData.network] 
          }} />
      </div>
    );
}
import { env } from "~/env";
import { SwapForm } from "./components/form";
import { Currencies, type GetCurrencyResponse, type GetRangeResponse, RequestType } from "./models";

export const dynamic = 'force-dynamic';

export default async function Swap(props: { searchParams: Promise<{ inputCurrency?: string, outputCurrency?: string }> }) {
  try {
    const { inputCurrency = Currencies.ETH, outputCurrency = Currencies.USDC_ETH } = await props.searchParams;

    console.time('all_currencies');
    const allCurrenciesResponse = await fetch(`${env.SERVER_URL}/${RequestType.GET_ALL_CURRENCIES}?api_key=${env.API_KEY}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },    
    });
    console.timeEnd('all_currencies');
    
    console.time('pairs_range');
    const [pairsResponse, rangeResponse] = await Promise.all([
      await fetch(`${env.SERVER_URL}/${RequestType.GET_PAIRS}?api_key=${env.API_KEY}&fixed=false&symbol=${inputCurrency}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
      await fetch(`${env.SERVER_URL}/${RequestType.GET_RANGE}?api_key=${env.API_KEY}&fixed=false&currency_from=${inputCurrency}&currency_to=${outputCurrency}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
    ]);
    console.timeEnd('pairs_range');

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
      throw new Error(`Currency not found: ${inputCurrency} or ${outputCurrency}`);
    }
  
    return (
      <SwapForm 
        range={range}
        isActivePair={isActivePair}
        allCurrencies={allCurrencies}
        inputCurrency={inputCurrencyData} 
        outputCurrency={outputCurrencyData} />
    );
  } catch (err) { 
    console.error(err);
    throw new Error("Internal server error");
  }
}
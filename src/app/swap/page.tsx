import { env } from "~/env";
import { SwapForm } from "./components/form";
import { Currencies, type GetCurrencyResponse, type GetRangeResponse, RequestType } from "./models";

export default async function Swap(props: { searchParams: Promise<{ inputCurrency?: string, outputCurrency?: string }>}) {
  try {
    const { inputCurrency = Currencies.ETH, outputCurrency = Currencies.USDC_ETH } = await props.searchParams;

    const [allCurrenciesResponse, pairsResponse, rangeResponse] = await Promise.all([
      fetch(`${env.SERVER_URL}/${RequestType.GET_ALL_CURRENCIES}?api_key=${env.API_KEY}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 600 },
      }),
      fetch(`${env.SERVER_URL}/${RequestType.GET_PAIRS}?api_key=${env.API_KEY}&fixed=false&symbol=${inputCurrency}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 600 },
      }),
      fetch(`${env.SERVER_URL}/${RequestType.GET_RANGE}?api_key=${env.API_KEY}&fixed=false&currency_from=${inputCurrency}&currency_to=${outputCurrency}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 600 },
      })
    ]);

    if (!allCurrenciesResponse.ok) throw new Error(`Currencies fetch failed: ${allCurrenciesResponse.statusText}`);
    if (!pairsResponse.ok) throw new Error(`Pairs fetch failed: ${pairsResponse.statusText}`);

    const allCurrencies = (await allCurrenciesResponse.json()) as GetCurrencyResponse[];
    const pairs = (await pairsResponse.json()) as string[];
    const isActivePair = pairs.includes(outputCurrency);
    let range: GetRangeResponse;

    if(isActivePair){
      if (!rangeResponse.ok) throw new Error(`Range fetch failed: ${pairsResponse.statusText}`);
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
        allCurrencies={allCurrencies}
        inputCurrency={inputCurrencyData} 
        outputCurrency={outputCurrencyData}
        isActivePair={isActivePair} />
    );
  } catch (err) { 
    console.error(err);
    throw new Error("Internal server error");
  }
}

export const dynamic = "force-dynamic";
import { SwapForm } from "./components/form";
import { Currencies } from "./models";

export default async function Swap(props: { searchParams: Promise<{ inputCurrency?: string, outputCurrency?: string }>}) {
  //TODO - fetch currency on server
  //     - map 404 error to notFound 
  const { inputCurrency, outputCurrency } = await props.searchParams;

  return (
    <SwapForm 
      inputCurrency={inputCurrency ?? Currencies.ETH} 
      outputCurrency={outputCurrency ?? Currencies.USDC_ETH} />
  );
}
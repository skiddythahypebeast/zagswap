import { SwapForm } from "./components/form";
import { Currencies } from "./models";

export default async function Swap(props: { searchParams: Promise<{ inputCurrency?: string, outputCurrency?: string }>}) {
  const { inputCurrency, outputCurrency } = await props.searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b text-stone-800">
      <div className="w-[600px] max-w-[95vw]">
        <SwapForm inputCurrency={inputCurrency ?? Currencies.ETH} outputCurrency={outputCurrency ?? Currencies.USDC_ETH} />
      </div>
    </main>
  );
}
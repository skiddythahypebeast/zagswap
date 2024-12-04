import { useRouter } from "next/navigation";
import { type GetCurrencyResponse } from "../models";

export const useCurrentPair = (inputCurrency: GetCurrencyResponse, outputCurrency: GetCurrencyResponse) => {
    const router = useRouter();

    const switchDirection = () => {
        router.replace(`/swap?inputCurrency=${outputCurrency.symbol}&outputCurrency=${inputCurrency.symbol}`);
    }

    const updateInputCurrency = (symbol: string) => {
        if (symbol === outputCurrency.symbol) {
            switchDirection()
        } else {
            router.replace(`/swap?inputCurrency=${symbol}&outputCurrency=${outputCurrency.symbol}`);
        }
    }

    const updateOutputCurrency = (symbol: string) => {
        if (symbol === inputCurrency.symbol) {
            switchDirection()
        } else {
            router.replace(`/swap?inputCurrency=${inputCurrency.symbol}&outputCurrency=${symbol}`);
        }
    }

    return { updateInputCurrency, updateOutputCurrency, switchDirection };
}
import { useEffect, useState } from "react";
import { type GetCurrencyResponse, type RequestError, RequestType } from "../models";
import { type CurrentPairState, type GetPairsResponse, type PairState } from "../models/pairs";
import { useRouter } from "next/navigation";

export const useAllPairs = (fixed: boolean) => {
    const [state, setState] = useState<PairState>({
        error: undefined,
        loading: true,
        response: undefined
    });

    useEffect(() => {
        setState({ error: undefined, response: undefined, loading: true });
        void (async () => {
            await fetch(`/api/${RequestType.GET_PAIRS_ALL_PAIRS}?fixed=${fixed}`, { 
                method: "GET", 
                headers: { "Content-Type": "application/json" }
            })
            .then((result: Response) => result.json() as Promise<GetPairsResponse>)
            .catch((result: Response) => result.json() as Promise<RequestError>)
            .then(async response => {
                if ("error" in response) {
                    console.error(response);
                    setState(prev => ({ ...prev, error: response as RequestError, loading: false }));
                } else {
                    console.info(response);
                    setState(prev => ({ ...prev, response, loading: false }));
                }
            })
        })();
    }, [fixed]);

    return { state };
}

export const useCurrentPair = (pairs: PairState, outputCurrency: string, inputCurrency: string) => {
    const router = useRouter();

    const [state, setState] = useState<CurrentPairState>({
        isActive: undefined,
        loading: true,
        inputCurrency,
        outputCurrency
    });

    useEffect(() => {
        setState({ isActive: undefined, loading: true, inputCurrency, outputCurrency });
        if (!pairs.loading && pairs.response) {
            const target = pairs.response[inputCurrency];
            if (target) {
                const isActive = target.some(x => x == outputCurrency);
                setState(prev => ({
                    ...prev,
                    isActive,
                    inputCurrency,
                    outputCurrency,
                    loading: false
                }));
            }
        }
    }, [pairs, inputCurrency, outputCurrency]);

    const switchDirection = () => {
        router.push(`/swap?inputCurrency=${outputCurrency}&outputCurrency=${inputCurrency}`);
    }

    const updateInputCurrency = (symbol: string) => {
        setState(prev => ({
            ...prev,
            loading: true,
            isActive: undefined
        }));

        if (symbol === outputCurrency) {
            switchDirection()
        } else {
            router.push(`/swap?inputCurrency=${symbol}&outputCurrency=${outputCurrency}`);
        }
    }

    const updateOutputCurrency = (symbol: string) => {
        setState(prev => ({
            ...prev,
            loading: true,
            isActive: undefined
        }));

        if (symbol === inputCurrency) {
            switchDirection()
        } else {
            router.push(`/swap?inputCurrency=${inputCurrency}&outputCurrency=${symbol}`);
        }
    }

    return { state, updateInputCurrency, updateOutputCurrency, switchDirection };
}

interface UsePairsState {
    response: string[] | undefined,
    currencies: GetCurrencyResponse[] | undefined,
    loading: boolean,
    error: RequestError | undefined
}
export const usePairs = (tokenA: string, allPairs: GetPairsResponse | undefined, allCurrencies: GetCurrencyResponse[] | undefined, fixed: boolean) => {
    const [state, setState] = useState<UsePairsState>({
        currencies: undefined,
        loading: true,
        response: undefined,
        error: undefined
    });

    useEffect(() => {
        setState({ error: undefined, response: undefined, currencies: undefined, loading: true});
        void (async () => {
            await fetch(`/api/${RequestType.GET_PAIRS}?fixed=${fixed}&symbol=${tokenA}`, { 
                method: "GET", 
                headers: { "Content-Type": "application/json" }
            })
            .then((result: Response) => result.json() as Promise<string[]>)
            .catch((result: Response) => result.json() as Promise<RequestError>)
            .then(async response => {
                if ("error" in response) {
                    console.error(response);
                    setState(prev => ({ ...prev, error: response, loading: false }));
                } else {
                    console.info(response);
                    setState(prev => ({ ...prev, response, loading: false }));
                }
            })
        })();
    }, [tokenA, allPairs, fixed]);

    useEffect(() => {
        if(allCurrencies && state.response){
            const pairs: GetCurrencyResponse[] = [];
            for (const key of state.response) {
                const target = allCurrencies.find(val => {
                    return val.symbol === key
                });
                if (target) {
                    pairs.push(target);
                }
            }
            setState(prev => ({ ...prev, currencies: pairs }));
        }
    }, [allCurrencies, state.response]);

    return { state };
}
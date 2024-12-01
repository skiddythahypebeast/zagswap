"use client";

import { type ChangeEvent, useCallback, useEffect, useState } from "react";
import { chain_suffixes } from "../models";
import type { RequestError, GetCurrencyResponse, UseCurrencyState, UseRangeState, CurrentPairState, GetRangeResponse } from "../models";
import { RequestType } from "../models/request";

export const useTrimSuffix = () => {
    return (symbol: string | undefined) => {
        let updated_name = symbol;
        for (const suffix of chain_suffixes) {
            if (updated_name !== suffix && updated_name?.endsWith(suffix)) {
                updated_name = updated_name.replace(suffix, "");
            }
        }
        return updated_name
    };
}

export const useRange = (currentPair: CurrentPairState, fixed: boolean) => {
    const [state, setState] = useState<UseRangeState>({
        error: undefined,
        loading: true,
        response: undefined
    });

    useEffect(() => {
        setState({ loading: true, error: undefined, response: undefined });
        console.log("LOADING RANGE");
        console.log(currentPair.loading, currentPair.isActive);

        if (!currentPair.loading && currentPair.isActive) {
            void (async () => {
                await fetch(`/api/${RequestType.GET_RANGE}?fixed=${fixed}&currency_from=${currentPair.inputCurrency}&currency_to=${currentPair.outputCurrency}`, { 
                    method: "GET", 
                    headers: { "Content-Type": "application/json" }
                })
                .then((result: Response) => result.json() as Promise<GetRangeResponse>)
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
            })()
        }
    }, [currentPair, fixed]);

    return { state }
}

export const useCurrency = (currency: string, currencies: GetCurrencyResponse[] | undefined) => {
    const [state, setState] = useState<UseCurrencyState>({ 
        response: undefined, 
        loading: true, 
        error: undefined,
    });

    const load = useCallback(async (currency: string) => {
        if(currencies) {
            const cached = [...currencies]?.find(x => x.symbol === currency);
            if(cached){
                setTimeout(() => {
                    setState(prev => ({ ...prev, response: cached, loading: false }));
                }, 200);

                return;
            }
        }

        await fetch(`/api/${RequestType.GET_CURRENCY}?symbol=${currency}`, { 
            method: "GET", 
            headers: { "Content-Type": "application/json" }
        })
        .then((result: Response) => result.json() as Promise<GetCurrencyResponse>)
        .catch((result: Response) => result.json() as Promise<RequestError>)
        .then(async response => {
            if ("error" in response) {
                console.error(response);
                setState(prev => ({ ...prev, error: response, loading: false }));
            } else {
                setState(prev => ({ ...prev, response, loading: false }));
            }
        })
    }, [currencies]);

    useEffect(() => {
        void load(currency);
    }, [currency, load]);

    return { state }
}

interface UseAllCurrenciesState {
    loading: boolean,
    error: RequestError | undefined,
    response: GetCurrencyResponse[] | undefined
}
export const useAllCurrencies = () => {
    const [state, setState] = useState<UseAllCurrenciesState>({ 
        response: undefined, 
        loading: true, 
        error: undefined
    });
    
    useEffect(() => {
        void (async () => {
            await fetch(`/api/${RequestType.GET_ALL_CURRENCIES}?`, { 
                method: "GET", 
                headers: { "Content-Type": "application/json" }
            })
            .then((result: Response) => result.json() as Promise<GetCurrencyResponse[]>)
            .catch((result: Response) => result.json() as Promise<RequestError>)
            .then(async response => {
                if ("error" in response) {
                    console.error(response);
                    setState(prev => ({ ...prev, error: response, loading: false }));
                } else {
                    const filtered = response.filter(x => !x.isFiat);
                    setState(prev => ({ 
                        ...prev, 
                        response: filtered, 
                        currencies: filtered, 
                        loading: false 
                    }));
                }
            })
        })()
    }, []);

    useEffect(() => {
        if(state.response){
            const chains: string[] = [];
            for (const result of state.response) {
                if (!chains.some(x => x == result.network)) {
                    chains.push(result.network);
                }
            }
            console.log(chains);
        }
    }, [state.response]);

    return { loading: state.loading, currencies: state.response }
}

export const useTokenLookup = (items: GetCurrencyResponse[] | undefined) => {
    const [all, setAll] = useState<GetCurrencyResponse[] | undefined>();
    const [state, setState] = useState<GetCurrencyResponse[] | undefined>();
    const [query, setQuery] = useState<string | undefined>();
    const [position, setPosition] = useState(1);
    const trim = useTrimSuffix();

    useEffect(() => {
        setPosition(1);
        setAll(() => {
            if(items && query){
                const sorted = [...items].sort((a, b) => {
                    const queryLower = query.toLowerCase();
                
                    const priorityA = computePriority(a, queryLower);
                    const priorityB = computePriority(b, queryLower);
                
                    return priorityB - priorityA;
                });
                
                function computePriority(item: GetCurrencyResponse, query: string) {
                    let priority = 0;
                
                    if (item.name.toLowerCase() === query) {
                        priority += 4;
                    }
                
                    if (item.symbol?.toLowerCase() === query || trim(item.symbol)?.toLowerCase() === query) {
                        priority += 3;
                    }
                
                    if (item.name.toLowerCase().startsWith(query)) {
                        priority += 2;
                    }
                
                    if (item.name.toLowerCase().includes(query)) {
                        priority += 1;
                    }
                
                    return priority;
                }

                return sorted;
            } else {
                return items
            }
        });
    }, [query, items, trim]);

    useEffect(() => {
        if(all){
            setState(all.slice(0, position * 50))
        }
    }, [position, all]);

    const next = useCallback(() => {
        setPosition(position + 1);
    }, [position]);

    const search = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setQuery(!event.target.value ? undefined : event.target.value);
    }, []);

    return { currencies: state, search, next }
}
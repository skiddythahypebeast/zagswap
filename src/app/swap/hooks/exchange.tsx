import { useCallback, useEffect, useRef, useState } from "react";
import { type GetCurrencyResponse, type GetRangeResponse, type RequestError, RequestType } from "../models";

interface UseExchangeState {
    response: string | undefined,
    error: RequestError | undefined,
    amountOut: number,
    loading: boolean
}
export const useExchange = (amountIn: number | undefined, range: GetRangeResponse, inputCurrency: GetCurrencyResponse, outputCurrency: GetCurrencyResponse, fixed: boolean, isActivePair: boolean) => {
    const [state, setState] = useState<UseExchangeState>({
        response: undefined,
        error: undefined,
        amountOut: 0,
        loading: true
    });
    
    const timerRef = useRef<number | null>(null);

    const handleRequest = useCallback(async () => {
        await fetch(`/api/${RequestType.GET_ESTIMATED}?amount=${amountIn}&currency_from=${inputCurrency.symbol}&currency_to=${outputCurrency.symbol}&fixed=${fixed}`, { 
            method: "GET", 
            headers: { "Content-Type": "application/json" }
        })
        .then((result: Response) => result.json() as Promise<Exclude<string, "error">>)
        .catch((result: Response) => result.json() as Promise<RequestError>)
        .then(async response => {
            if (typeof response == "object" && "error" in response) {
                console.error(response);
                setState(prev => ({ ...prev, error: response, loading: false }));
            } else {
                setState(prev => ({ 
                    ...prev, 
                    response, 
                    loading: false,
                    amountOut: parseFloat(response) 
                }));
            }
        })
    }, [amountIn, inputCurrency.symbol, outputCurrency.symbol, fixed]);

    useEffect(() => {
        setState({ loading: true, error: undefined, response: undefined, amountOut: 0 });
        if (isActivePair) {
            if (amountIn !== undefined) {
                if (range.min === null || amountIn >= range.min) {
                    if (range.max === null || amountIn <= range.max) {
                        if (timerRef.current) { clearTimeout(timerRef.current); }

                        timerRef.current = window.setTimeout(() => {
                            void handleRequest();
                        }, 500);
                    }
                }
            }
        }
    }, [range, isActivePair, amountIn, handleRequest]);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return { exchange: state }
}
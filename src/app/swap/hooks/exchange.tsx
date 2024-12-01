import { useCallback, useEffect, useRef, useState } from "react";
import { type CurrentPairState, type RequestError, RequestType, type UseRangeState } from "../models";

interface UseExchangeState {
    response: string | undefined,
    error: RequestError | undefined,
    amountOut: number,
    loading: boolean
}
export const useExchange = (amountIn: number | undefined, range: UseRangeState, pair: CurrentPairState, fixed: boolean) => {
    const [state, setState] = useState<UseExchangeState>({
        response: undefined,
        error: undefined,
        amountOut: 0,
        loading: true
    });
    
    const timerRef = useRef<number | null>(null);

    const handleRequest = useCallback(async () => {
        await fetch(`/api/${RequestType.GET_ESTIMATED}?amount=${amountIn}&currency_from=${pair.inputCurrency}&currency_to=${pair.outputCurrency}&fixed=${fixed}`, { 
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
                console.info(response)
                setState(prev => ({ 
                    ...prev, 
                    response, 
                    loading: false,
                    amountOut: parseFloat(response) 
                }));
            }
        })
    }, [amountIn, pair.inputCurrency, pair.outputCurrency, fixed]);

    useEffect(() => {
        setState({ loading: true, error: undefined, response: undefined, amountOut: 0 });
        if (!range.loading && range.response) {
            if (!pair.loading && pair.isActive) {
                if (amountIn !== undefined) {
                    if (range.response.min === null || amountIn >= range.response.min) {
                        if (range.response.max === null || amountIn <= range.response.max) {
                            if (timerRef.current) { clearTimeout(timerRef.current); }
    
                            timerRef.current = window.setTimeout(() => {
                                void handleRequest();
                            }, 500);
                        }
                    }
                }
            }
        }
    }, [range, pair, amountIn, handleRequest]);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return { exchange: state }
}
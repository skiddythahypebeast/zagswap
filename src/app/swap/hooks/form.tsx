import { type ChangeEvent, type FormEvent, useCallback, useEffect, useState } from "react";
import { RequestType } from "../models";
import type { CreateExchangePayload, CreateExchangeResponse, CurrentPairState, RequestError, SimpleSwapFormState, UseRangeState } from "../models";
import { useExchange } from "./exchange";
import { useRouter } from "next/navigation";

export const useSimpleSwapForm = (currentPair: CurrentPairState, range: UseRangeState, fixed: boolean, addressValidator: string | undefined) => {
    const router = useRouter();
    const [state, setState] = useState<SimpleSwapFormState>({
        amountIn: undefined,
        receiver: undefined,
        submitting: false,
        valid: true
    });

    const { exchange } = useExchange(state.amountIn, range, currentPair, fixed);

    useEffect(() => {
        if (state.amountIn === undefined || state.receiver === undefined || state.receiver === '' || !addressValidator) {
            setState(prev => ({ ...prev, valid: false }));
        } else if (range.loading || !range.response) {
            setState(prev => ({ ...prev, valid: false }));
        } else if (currentPair.loading || state.submitting || exchange.loading || !exchange.response) {
            setState(prev => ({ ...prev, valid: false }));
        } else if ((range.response.min === null || state.amountIn > range.response.min) && (range.response.max === null || state.amountIn < range.response.max)) {
            if (new RegExp(addressValidator).test(state.receiver)) {
                setState(prev => ({ ...prev, valid: true }));
            } else {
                setState(prev => ({ ...prev, valid: false }));
            }
        } else {
            setState(prev => ({ ...prev, valid: false }));
        }
    }, [state.amountIn, state.receiver, state.submitting, range, currentPair, addressValidator, exchange]);

    const handleAmountInChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (!/^\d*\.?\d*$/.test(value)) { return; }
        const parsedValue = parseFloat(value);
        if (!isNaN(parsedValue)) {
            setState((prevState) => ({
                ...prevState,
                amountIn: parsedValue,
            }));
        } else {
            setState((prevState) => ({
                ...prevState,
                amountIn: undefined,
            }));
        }
    }, []);

    const handleReceiverChange = useCallback((address: string) => {
        // Address is validated at the component level
        setState((prevState) => ({
            ...prevState,
            receiver: address,
        }));
    }, []);

    const updateAmount = useCallback((amount: number) => {
        setState((prevState) => ({
            ...prevState,
            amountIn: amount,
        }));
    }, [])

    const toggleFixed = useCallback((fixed: boolean) => {
        setState(prev => ({
            ...prev,
            fixed,
        }));
    }, []);

    const handleResponse = (response: CreateExchangeResponse) => {
        router.push(`/order/${response.id}`);
    }

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (state.receiver && state.amountIn && state.valid) {
            setState(prev => ({ ...prev, submitting: true }));
            const request: CreateExchangePayload = {
                fixed,
                address_to: state.receiver,
                amount: state.amountIn,
                currency_from: currentPair.inputCurrency,
                currency_to: currentPair.outputCurrency,
                extra_id_to: "",
                user_refund_address: "",
                user_refund_extra_id: ""
            }
            void fetch(`/api/${RequestType.CREATE_EXCHANGE}`, { 
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(request)
            })
            .then((result: Response) => result.json() as Promise<CreateExchangeResponse>)
            .catch((result: Response) => result.json() as Promise<RequestError>)
            .then(async response => {
                if ("error" in response) {
                    setState(prev => ({ ...prev, submitting: false }));
                    console.error(response);
                } else {
                    setState(prev => ({ ...prev, submitting: false }));
                    handleResponse(response);
                }
            })
        }
    };

    return { form: state, exchange, handleAmountInChange, handleReceiverChange, updateAmount, toggleFixed, submit }
}
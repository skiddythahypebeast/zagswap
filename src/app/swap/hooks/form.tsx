import { type ChangeEvent, type FormEvent, useCallback, useEffect, useState } from "react";
import { RequestType } from "../models";
import type { CreateExchangePayload, CreateExchangeResponse, CurrentPairState, RequestError, SimpleSwapFormState, UseRangeState } from "../models";
import { useExchange } from "./exchange";
import { useRouter } from "next/navigation";
import { type ValidatedString } from "./input";

export const useSimpleSwapForm = (currentPair: CurrentPairState, range: UseRangeState, fixed: boolean, hasExtraId: boolean | undefined) => {
    const [state, setState] = useState<SimpleSwapFormState>({
        amountIn: undefined,
        receiver: { valid: true, value: '' },
        extraId: undefined,
        submitting: false,
        valid: true
    });

    const router = useRouter();
    const { exchange } = useExchange(state.amountIn, range, currentPair, fixed);

    useEffect(() => {
        if (state.amountIn === undefined) {
            setState(prev => ({ ...prev, valid: false }));
            return;
        }
        if (!state.receiver.valid || state.receiver.value == '') {
            setState(prev => ({ ...prev, valid: false }));
            return;
        }
        if (hasExtraId && !state.extraId?.valid) {
            setState(prev => ({ ...prev, valid: false }));
            return;
        }
        if (!hasExtraId && state.extraId) {
            setState(prev => ({ ...prev, valid: false }));
            return;
        }
        if (range.loading || !range.response) {
            setState(prev => ({ ...prev, valid: false }));
            return;
        }
        if (currentPair.loading || !currentPair.isActive) {
            setState(prev => ({ ...prev, valid: false }));
            return;
        }
        if (exchange.loading || !exchange.response) {
            setState(prev => ({ ...prev, valid: false }));
            return;
        }
        if (range.response.min != null && state.amountIn < range.response.min) {
            setState(prev => ({ ...prev, valid: false }));
            return;
        }
        if (range.response.max != null && state.amountIn > range.response.max) {
            setState(prev => ({ ...prev, valid: false }));
            return;
        }
        setState(prev => ({ ...prev, valid: true }));
    }, [state.amountIn, state.receiver, state.submitting, hasExtraId, range, currentPair, state.extraId, exchange]);

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

    const handleReceiverChange = useCallback((value: ValidatedString) => {
        setState((prev): SimpleSwapFormState => ({ ...prev, receiver: value }))
    }, []);

    const handleExtraIdChange = useCallback((value: ValidatedString | undefined) => {
        setState((prev): SimpleSwapFormState => ({...prev, extraId: value }))
    }, []);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (state.receiver && state.amountIn && state.valid) {
            setState(prev => ({ ...prev, submitting: true }));
            const request: CreateExchangePayload = {
                fixed,
                address_to: state.receiver.value,
                amount: state.amountIn,
                currency_from: currentPair.inputCurrency,
                currency_to: currentPair.outputCurrency,
                extra_id_to: state.extraId?.value ?? "",
                // TODO - use system refund addresses
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
                    router.push(`/order/${response.id}`);
                }
            })
        }
    };

    return { form: state, exchange, handleAmountInChange, handleExtraIdChange, handleReceiverChange, submit }
}
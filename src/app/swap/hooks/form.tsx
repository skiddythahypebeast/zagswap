import { type ChangeEvent, type FormEvent, useCallback, useEffect, useState } from "react";
import type { CreateExchangePayload, CreateExchangeResponse, GetCurrencyResponse, GetRangeResponse, RequestError, SimpleSwapFormState } from "../models";
import { useRouter } from "next/navigation";
import { type ValidatedString } from "./input";

export const useSimpleSwapForm = (inputCurrency: GetCurrencyResponse, outputCurrency: GetCurrencyResponse, range: GetRangeResponse, fixed: boolean, isActivePair: boolean) => {
    const [state, setState] = useState<SimpleSwapFormState>({
        amountIn: undefined,
        receiver: { valid: true, value: '' },
        extraId: undefined,
        submitting: false,
        valid: true
    });

    const router = useRouter();

    useEffect(() => {
        if (state.amountIn === undefined) {
            setState(prev => ({ ...prev, valid: false }));
            return;
        }
        if (!state.receiver.valid || state.receiver.value == '') {
            setState(prev => ({ ...prev, valid: false }));
            return;
        }
        if (outputCurrency.has_extra_id && !state.extraId?.valid) {
            setState(prev => ({ ...prev, valid: false }));
            return;
        }
        if (!outputCurrency.has_extra_id && state.extraId) {
            setState(prev => ({ ...prev, valid: false }));
            return;
        }
        if (!isActivePair) {
            setState(prev => ({ ...prev, valid: false }));
            return;
        }
        if (range.min != null && state.amountIn < range.min) {
            setState(prev => ({ ...prev, valid: false }));
            return;
        }
        if (range.max != null && state.amountIn > range.max) {
            setState(prev => ({ ...prev, valid: false }));
            return;
        }
        setState(prev => ({ ...prev, valid: true }));
    }, [state.amountIn, state.receiver, state.submitting, range, state.extraId, isActivePair, outputCurrency.has_extra_id]);

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
                currency_from: inputCurrency.symbol,
                currency_to: outputCurrency.symbol,
                extra_id_to: state.extraId?.value ?? "",
                // TODO - use system refund addresses
                user_refund_address: "",
                user_refund_extra_id: ""
            }
            void fetch(`/api/create_order`, { 
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
                    const idBuffer = Buffer.from(response.id);
                    router.push(`/order/${idBuffer.toString('hex')}`);
                    setState(prev => ({ ...prev, submitting: false }));
                }
            })
        }
    };

    return { form: state, handleAmountInChange, handleExtraIdChange, handleReceiverChange, submit }
}
import { type ValidatedString } from "../hooks/input";

export interface SimpleSwapFormState {
    amountIn: number | undefined,
    receiver: ValidatedString,
    extraId: ValidatedString | undefined,
    submitting: boolean,
    valid: boolean
}
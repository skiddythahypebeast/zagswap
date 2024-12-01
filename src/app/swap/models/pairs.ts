import { type RequestError } from "./request";

export type GetPairsResponse = Record<Exclude<string, "error">, string[]>;

export interface PairState {
    response: GetPairsResponse | undefined;
    loading: boolean;
    error: RequestError | undefined;
}

export interface CurrentPairState {
    isActive: boolean | undefined,
    inputCurrency: string,
    outputCurrency: string,
    loading: boolean
}
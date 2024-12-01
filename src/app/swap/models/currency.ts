import { type RequestError } from "./request";

export interface GetCurrencyResponse {
    name: string,
    symbol: string,
    network: string,
    contract_address: string,
    has_extra_id: boolean,
    extra_id: string,
    image: string,
    warnings_from: string[],
    warnings_to: string[],
    validation_address: string,
    validation_extra: string,
    address_explorer: string,
    tx_explorer: string,
    confirmations_from: string,
    isFiat: boolean
}

export interface Currency extends GetCurrencyResponse {
    isPair: boolean
}

export interface UseRangeState {
    loading: boolean,
    error: RequestError | undefined,
    response: GetRangeResponse | undefined
}

export interface GetRangeResponse {
    min: number | null,
    max: number | null
}

export interface UseCurrencyState {
    loading: boolean,
    error: RequestError | undefined,
    response: GetCurrencyResponse | undefined
}

export enum Currencies {
    BTC = "btc",
    ETH = "eth",
    USDC_ETH = "usdc"
}

export const chain_suffixes = [
    "base",
    "mainnet",
    "sui",
    "zk",
    "kavaevm",
    "kava",
    "ron",
    "tron",
    "cronos",
    "gt",
    "ar",
    "okc",
    "xtz",
    "sol",
    "bep2",
    "ton",
    "eth",
    "strk",
    "ftm",
    "avaxc",
    "trc20",
    "spl",
    "cron",
    "earb",
    "celo",
    "bep20",
    "xlm",
    "poly",
    "op",
    "-bsc",
    "dot",
    "near",
    "kcc",
    "eop",
    "arb",
    "heco",
    "algo",
    "erc20",
    "bsc",
    "eos",
    "manta",
    "linea",
    "scr",
    "trx",
    "bnb",
    "bnova",
    "matic"
];
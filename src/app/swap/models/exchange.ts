import { type GetCurrencyResponse } from "./currency";

export interface CreateExchangePayload {
    fixed: boolean,
    currency_from: string,
    currency_to: string,
    amount: number,
    address_to: string,
    extra_id_to: string | undefined,
    user_refund_address: string | undefined,
    user_refund_extra_id: string | undefined
}

export interface CreateExchangeResponse {
    address_from: string;
    address_to: string;
    amount_from: string;
    amount_to: string;
    currencies: Record<string, GetCurrencyResponse>;
    currency_from: string;
    currency_to: string;
    expected_amount: string;
    extra_id_from: string | null;
    extra_id_to: string | null;
    id: string;
    redirect_url: string | null;
    status: string;
    timestamp: string;
    trace_id: string;
    tx_from: string | null;
    tx_to: string | null;
    type: "floating" | "fixed";
    updated_at: string;
    user_refund_address: string | null;
    user_refund_extra_id: string | null;
    valid_until: string | null;
}
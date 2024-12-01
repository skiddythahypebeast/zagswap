import { type GetCurrencyResponse } from "../swap/models";

export interface GetOrderResponse {
    id: string;
    type: "fixed" | "variable";
    timestamp: string;
    updated_at: string;
    valid_until: string;
    currency_from: string;
    currency_to: string;
    amount_from: string;
    expected_amount: string;
    amount_to: string;
    address_from: string;
    address_to: string;
    extra_id_from?: string;
    extra_id_to?: string;
    user_refund_address?: string;
    user_refund_extra_id?: string;
    tx_from?: string;
    tx_to?: string;
    status: "confirming" | "confirmed" | "failed" | "pending";
    redirect_url: string;
    currencies: Record<string, GetCurrencyResponse>
}
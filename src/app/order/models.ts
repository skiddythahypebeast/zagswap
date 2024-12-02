import { type GetCurrencyResponse } from "../swap/models";

export type OrderStatus = "confirming" | "exchanging" | "expired" | "finished" | "sending" | "refunded" | "verifying" | "confirmed" | "failed" | "pending" | "waiting";

export interface GetOrderResponse {
    id: string;
    type: "fixed" | "floating";
    timestamp: string;
    updated_at: string;
    valid_until: string | null;
    currency_from: string;
    currency_to: string;
    amount_from: string;
    expected_amount: string;
    amount_to: string;
    address_from: string;
    address_to: string;
    extra_id_from: string | null;
    extra_id_to: string | null;
    user_refund_address: string | null;
    user_refund_extra_id: string | null;
    tx_from: string | null;
    tx_to: string | null;
    status: OrderStatus;
    redirect_url: string | null;
    currencies: Record<string, GetCurrencyResponse>,
    trace_id: string
}
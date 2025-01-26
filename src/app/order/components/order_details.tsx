/* eslint-disable @next/next/no-img-element */
"use client"

import Image from "next/image";
import { type OrderStatus, type GetOrderResponse } from "../models";
import { CopyButton } from "./copy_button";
import { type RequestError, type GetCurrencyResponse } from "~/app/swap/models";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CHAIN_COLORS } from "~/app/swap/models/colors";

// in order of status change flow
const statusIndexes: Record<OrderStatus, number> = {
    waiting: 0,
    confirming: 1,
    confirmed: 1,
    verifying: 1,
    pending: 2,
    exchanging: 2,
    sending: 3,
    finished: 4,
    expired: 4,
    refunded: 4,
    failed: 4
}

const useOrderDetailPolling = (order_details: GetOrderResponse, orderId: string) => {
    const [state, setState] = useState<GetOrderResponse>(order_details);

    useEffect(() => {
        const interval = window.setInterval(() => {
            // TODO - error handling
            void fetch(`/api/order/${orderId}`, { method: "GET" })
                .then((data: Response) => data.json() as Promise<GetOrderResponse>)
                .catch((data: Response) => data.json() as Promise<RequestError>)
                .then(async result => {
                    if ("error" in result) {
                        return;
                    } else {
                        result.id = orderId;
                        setState(result);
                    }
                });
        }, 10000);
        return () => window.clearInterval(interval); 
    }, [orderId]);

    return state
}

export const OrderDetails = ({ order_details, currency_from, currency_to, order_id }: { order_details: GetOrderResponse, currency_from: GetCurrencyResponse, currency_to: GetCurrencyResponse, order_id: string }) => {
    const orderDetails = useOrderDetailPolling(order_details, order_id);
    const statusIndex = statusIndexes[orderDetails.status];
    return (
        <div className="w-[500px] xl:max-w-[80%] lg:max-w-[80%] md:max-w-[80%] max-w-[95%] gap-2 flex flex-col bg-bg3 dark:bg-dark-bg3 dark:shadow-dark-shadow rounded-xl p-5 text-text dark:text-dark-text">
            <CopyButton value={orderDetails.id} className="dark:border-dark-border dark:border-[1px] px-2 py-1 rounded-md lex justify-between w-full flex flex-row gap-2 items-center opacity-70 hover:opacity-100">
                <p className="text-sm font-bold text-nowrap">Order ID:</p>
                <p className="fade-in text-sm font-semibold truncate font-mono text-right w-full">{orderDetails.id}</p>
                <img src="/icons/copy.svg" className="w-3 h-3 dark:filter dark:invert" alt="Icon"/>
            </CopyButton>
            {statusIndex >= 4 && <OrderResult 
                currency_from={currency_from} 
                currency_to={currency_to}
                status={orderDetails.status}
                orderDetails={orderDetails}/>}
            {statusIndex == 0 && <DepositDetails
                amount={orderDetails.amount_from}
                currency={currency_from}
                from={orderDetails.address_from} />}
            {statusIndex > 0 && statusIndex < 4 && <p className="text-center font-sofia font-bold text-primary mt-5 text-2xl border-2 border-primary opacity-80 rounded-xl">Order in progress</p>}
            {currency_from.has_extra_id && orderDetails.extra_id_from && statusIndex < 4 && <CopyButton 
                value={orderDetails.extra_id_from} 
                className="flex flex-row rounded-lg items-center justify-between px-5 bg-amber-500 bg-opacity-30 border-b-2 border-b-amber-500 py-2">
                    <p className="text-sm font-bold">{currency_from.extra_id}:</p>
                    <div className="flex flex-row items-center gap-5">
                        <p className="text-sm font-medium">{orderDetails.extra_id_from}</p>
                        <img src="/icons/copy.svg" className="w-4 h-4 dark:filter dark:invert" alt="Icon"/>
                    </div>
            </CopyButton>}
            {statusIndex < 4 && <RecieveDetails
                title="Receive"
                direction="to"
                amount={orderDetails.amount_to} 
                currency={currency_to} 
                extraId={orderDetails.extra_id_to}
                from={orderDetails.address_to} />}
            {statusIndex < 4 && <OrderProgress 
                status={orderDetails.status} />}
        </div>
    )
}

const OrderResult = ({ orderDetails, currency_from, currency_to, status }: { orderDetails: GetOrderResponse, status: OrderStatus, currency_from: GetCurrencyResponse, currency_to: GetCurrencyResponse }) => {
    const [showDetails, toggleDetails] = useState(false);
    return (
        <div className="flex flex-col gap-2 items-center rounded-lg p-5">
            <div className="flex flex-col items-center gap-2">
                <h2 className={`${status === "finished" ? "text-green-500" : ""} text-2xl font-medium text-center`}>Order {status === "refunded" ? "failed" : status}</h2>
                <div className="h-40 flex items-center justify-center">
                    {status === "finished" && <Image src="/icons/green-check.svg" className="opacity-80" alt="" height={150} width={150}/>}
                    {(status === "failed" || status === "refunded") && <Image src="/icons/red-cross.svg" alt="" height={150} width={150}/>}
                    {status === "expired" && <img src="/icons/expired.svg" className="w-36 h-36 dark:filter dark:invert opacity-20" alt="Icon"/>}
                </div>
                {(status === "failed" || status === "refunded") && <div className="flex flex-col gap-2 items-center">
                    <p className="text-sm">There was an issue processing your order</p>
                </div>}
                {status === "finished" && <div className="flex flex-col gap-2 items-center">
                    <p className="text-sm">Amount received</p>
                    <p className="text-2xl font-bold text-primary dark:text-dark-primary">{orderDetails.amount_to} {orderDetails.currency_to.toUpperCase()}</p>
                </div>}
            </div>
            {!showDetails && <div className="flex flex-row gap-2">
                <button onClick={() => toggleDetails(true)} className="px-5 py-2 border-primary dark:border-dark-primary border-2 bg-primary dark:bg-dark-primary bg-opacity-20 dark:bg-opacity-20 w-fit rounded-lg">
                    <p className="text-primary dark:text-dark-primary">order details</p>
                </button>
                <Link 
                    href={`/swap?inputCurrency=${currency_from.symbol}&ouputCurrency=${currency_to.symbol}`} 
                    className="px-5 py-2 primary-button w-fit flex items-center justify-center">
                    <Image src="/icons/white-refresh.svg" alt="" height={20} width={20} />
                </Link>
            </div>}
            {showDetails && <div className="flex flex-col w-full">
                <RecieveDetails 
                    title="Send" 
                    direction="from"
                    extraId={orderDetails.extra_id_from}
                    amount={orderDetails.amount_from} 
                    currency={currency_from} 
                    from={orderDetails.address_from}/>
                <RecieveDetails 
                    direction="to"
                    title="Receive" 
                    extraId={orderDetails.extra_id_to}
                    amount={orderDetails.amount_to} 
                    currency={currency_to} 
                    from={orderDetails.address_to}/>
            </div>}
        </div>
    )
}

const DepositDetails = ({ from, amount, currency }: { from: string, amount: string, currency: GetCurrencyResponse }) => {
    return (
        <div className="p-2 gap-2 flex flex-col dark:border-dark-primary border-primary border-2 rounded-lg">
            <div className="px-2 py-1 rounded-md justify-between flex flex-row gap-2">
                <p className="text-sm font-bold">Deposit</p>
                <button className="opacity-60 hover:opacity-80">
                    <img src="/icons/info.svg" className="w-4 h-4 dark:filter dark:invert" alt="Icon"/>
                </button>
            </div>
            <CopyButton value={from} className="hover:opacity-90 opacity-70 flex flex-row justify-between h-16 gap-5 items-center xl:px-5 lg:px-5 md:px-5 px-3 rounded-lg ">
                <p className="fade-in xl:text-lg lg:text-lg md:text-lg text-md font-semibold text-center truncate">{from}</p>
                <img src="/icons/copy.svg" className="w-4 h-4 dark:filter dark:invert" alt="Icon"/>
            </CopyButton>
            <div className="flex flex-row h-10 py-1 xl:px-5 lg:px-5 md:px-5 px-3 items-center rounded-md justify-between">
                <div className="flex flex-row h-8 gap-2 items-center w-1/2 rounded-md py-1">
                    <p className="opacity-60 text-xs font-medium">send</p>
                    <p className="fade-in text-md font-mono truncate">{amount}</p>
                </div>
                {currency && <div className="flex flex-row gap-2">
                    <Image className="fade-in" src={currency?.image ?? "/icons/coin.svg"} alt="" height={25} width={25} />
                    <p className="fade-in text-md font-medium">{currency.symbol.toUpperCase()}</p>
                    <div className="fade-in px-2 rounded-full flex items-center justify-center" style={{ backgroundColor: CHAIN_COLORS[currency.network] }}>
                        <p className="text-sm font-bold text-white">{currency.network.toUpperCase()}</p>
                    </div>
                </div>} 
            </div>
        </div>
    )
}

const RecieveDetails = ({ amount, from, title, currency, direction, extraId }: { currency: GetCurrencyResponse, extraId: string | null, amount: string, from: string, title: string, direction: "to" | "from" }) => {
    return (
        <div className="flex flex-col gap-2 mt-5">
            <div className="bg-bg4 dark:bg-dark-bg4 px-2 py-1 rounded-md justify-between flex flex-row gap-2">
                <p className="text-sm font-bold">{title}</p>
            </div>
            <CopyButton value={from} className="group flex flex-row justify-between h-12 gap-5 items-center xl:px-5 lg:px-5 md:px-5 px-3 bg-bg1 dark:bg-dark-input shadow-sm shadow-shadow dark:shadow-dark-shadow rounded-lg">
                <p className="opacity-60 text-xs font-medium">{direction}</p>
                <p className="fade-in xl:text-md lg:text-md md:text-md text-sm font-semibold text-center truncate group-hover:opacity-90 opacity-70">{from}</p>
                <img src="/icons/copy.svg" className="w-3 h-3 dark:filter dark:invert" alt="Icon"/>
            </CopyButton>
            <div className="flex flex-row h-10 py-1 xl:px-5 lg:px-5 md:px-5 px-3 items-center rounded-md justify-between bg-bg1 dark:bg-dark-input shadow-sm shadow-shadow dark:shadow-dark-shadow">
                <div className="flex flex-row h-8 gap-2 items-center rounded-md py-1">
                    <p className="opacity-60 text-xs font-medium">amount</p>
                    <p className="fade-in text-md font-mono truncate">{amount}</p>
                </div>
                <div className="flex flex-row gap-2">
                    <Image className="fade-in" src={currency.image} alt="" height={20} width={20} />
                    <p className="fade-in text-sm font-medium">{currency.symbol.toUpperCase()}</p>
                    <div className="fade-in px-2 rounded-full flex items-center justify-center" style={{ backgroundColor: CHAIN_COLORS[currency.network] }}>
                        <p className="text-xs font-bold text-bg1">{currency.network.toUpperCase()}</p>
                    </div>
                </div> 
            </div>
            {currency.has_extra_id && !!extraId && <CopyButton value={extraId} className="group flex flex-row justify-between h-10 gap-5 items-center xl:px-5 lg:px-5 md:px-5 px-3 bg-bg1 dark:bg-dark-input shadow-sm shadow-shadow dark:shadow-dark-shadow rounded-lg">
                <div className="flex flex-row h-8 gap-2 items-center w-1/2 rounded-md py-1">
                    <p className="opacity-60 text-xs font-medium">{currency.extra_id}:</p>
                    <p className="fade-in text-md font-mono truncate">{extraId}</p>
                </div>
                <img src="/icons/copy.svg" className="w-4 h-4 dark:filter dark:invert" alt="Icon"/>
            </CopyButton>}
        </div>
    )
}

const OrderProgress = ({ status }: { status: OrderStatus }) => {
    const statusIndex = useMemo(() => {
        return statusIndexes[status]
    }, [status]);
    return (
        <div className="flex flex-col gap-2">
            <div className="bg-bg3 dark:bg-dark-bg3 px-2 py-1 rounded-md justify-between flex flex-row gap-2">
                <p className="text-sm font-bold">Progress</p>
            </div>
            <div className="flex flex-row w-full gap-2 px-5">
                <div className="flex-1">
                    <div className={`${statusIndex == 0 ? "bg-primary dark:bg-dark-primary animate-pulse" : statusIndex > 0 ? "bg-primary dark:bg-dark-primary" : "bg-bg5 dark:bg-dark-input"} h-3 rounded-full`}/>
                    <p className="text-xs text-center">pending deposit</p>
                </div>
                <div className="flex-1">
                    <div className={`${statusIndex == 1 ? "bg-primary dark:bg-dark-primary animate-pulse" : statusIndex > 1 ? "bg-primary dark:bg-dark-primary" : "bg-bg5 dark:bg-dark-input"} h-3 rounded-full`}/>
                    <p className="text-xs text-center">funds received</p>
                </div>
                <div className="flex-1">
                    <div className={`${statusIndex == 2 ? "bg-primary dark:bg-dark-primary animate-pulse" : statusIndex > 2 ? "bg-primary dark:bg-dark-primary" : "bg-bg5 dark:bg-dark-input"} h-3 rounded-full`}/>
                    <p className="text-xs text-center">exchanging</p>
                </div>
                <div className="flex-1">
                    <div className={`${statusIndex == 3 ? "bg-primary dark:bg-dark-primary animate-pulse" : statusIndex > 3 ? "bg-primary dark:bg-dark-primary" : "bg-bg5 dark:bg-dark-input"} h-3 rounded-full`}/>
                    <p className="text-xs text-center">sending</p>
                </div>
            </div>
        </div>
    )
}
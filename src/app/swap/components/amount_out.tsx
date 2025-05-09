"use client"

import { useTrimSuffix } from "../hooks";
import { type GetCurrencyResponse } from "../models";
import { InputContainer } from "./input_container";
import Image from "next/image";
import { TokenSearch } from "./token_search";
import { useEffect, useState } from "react";
import { CHAIN_COLORS } from "../models/colors";

interface AmountOutProps {
    outputCurrency: GetCurrencyResponse,
    loadingRate: boolean,
    amount: number,
    amountIn: number | undefined,
    showList: boolean,
    items: GetCurrencyResponse[],
    onSelect: (symbol: string) => void,
    onToggleList: (toggle: boolean) => void,
}
export const AmountOut = ({ outputCurrency, amountIn, loadingRate, onSelect: select, amount, onToggleList, showList, items }: AmountOutProps) =>  {
    const [loading, setLoading] = useState(false);
    const onSelect = (item: string) => select(item);
    const onOpen = () => onToggleList(true);
    const onClose = () => onToggleList(false);
    const trim = useTrimSuffix();

    useEffect(() => {
        setLoading(false);
    }, [outputCurrency]);

    return (
        <div className="relative h-14 w-full">
            <TokenInput
                outputCurrency={outputCurrency}
                loadingRate={loadingRate} 
                showList={onOpen}
                loading={loading}
                amountIn={amountIn}
                amount={amount} 
            />
            {showList && <div className="absolute inset-0 z-10">
                <TokenSearch
                    current={trim(outputCurrency)}
                    close={onClose} 
                    items={items}
                    onSelect={(item) => {
                        setLoading(true);
                        onSelect(item);
                    }} 
                />
            </div>}
        </div>
    )
}

interface TokenInputProps {
    outputCurrency: GetCurrencyResponse,
    amount: number,
    loadingRate: boolean,
    loading: boolean,
    amountIn: number | undefined,
    showList: () => void,
}
export const TokenInput = ({ outputCurrency, loading, loadingRate, amount, amountIn, showList }: TokenInputProps) => {
    const trim = useTrimSuffix();
    return (
        <InputContainer position="center">
            <div className="flex-1 h-full relative group flex flex-row items-center xl:px-5 lg:px-5 md:px-5 px-3 xl:gap-5 lg:gap-5 gap-2 opacity-80">
                <p className="text-sm font-semibold opacity-50">receive</p>
                <input 
                    type="number" 
                    value={amount > 0 ? amount : ""}
                    disabled
                    readOnly
                    className={`font-share-mono truncate h-full w-full outline-none xl:text-xl lg:text-xl md:text-xl text-lg py-2 bg-transparent rounded-md`}
                    placeholder={"0.0"}
                    min="0.0"
                    pattern="\d\.\d{2}"
                    step="0.01"
                />
                {amountIn && amountIn > 0 && loadingRate && <div className="absolute opacity-50 right-5 h-full flex items-center justify-center">
                    <Image src="/icons/spinner.svg" className="dark:filter dark:invert animate-spin opacity-50" height={15} width={15} alt="Icon"/>
                </div>}
            </div>

            <button type="button" className="xl:flex lg:flex md:flex hidden flex-row h-full gap-2 items-center justify-between py-2 px-5 rounded-r-lg xl:max-w-52 lg:max-w-52 md:max-w-52 w-1/2 bg-one dark:bg-three-dark" onClick={showList}>
                {!loading && <><Image src={outputCurrency.image} alt="" height={20} width={20} />
                <p className="font-bold truncate">{trim(outputCurrency)?.toUpperCase()}</p>
                    <div className="rounded-full flex items-center justify-center" style={{ backgroundColor: CHAIN_COLORS[outputCurrency.network] }}>
                    <p className="text-xs px-2 font-bold">{outputCurrency.network.toUpperCase()}</p>
                </div>
                <Image src="/icons/chevron-down.svg" className="dark:filter dark:invert" height={15} width={15} alt="Icon"/></>}
                {loading && <Image src="/icons/spinner.svg" className="dark:filter dark:invert animate-spin opacity-50" height={15} width={15} alt="Icon"/>}
            </button>

            <button type="button" className="xl:hidden lg:hidden md:hidden flex flex-row h-full gap-1 items-center justify-between py-2 px-5 rounded-r-lg xl:max-w-52 lg:max-w-52 md:max-w-52 w-1/2 bg-one dark:bg-three-dark" onClick={showList}>
                {!loading && <><Image src={outputCurrency.image} alt="" height={20} width={20} />
                <p className="font-bold text-sm truncate">{trim(outputCurrency)?.toUpperCase()}</p>
                <div className="rounded-full flex items-center justify-center" style={{ backgroundColor: CHAIN_COLORS[outputCurrency.network] }}>
                    <p className="text-xs px-2 font-bold">{outputCurrency.network.toUpperCase()}</p>
                </div>
                <Image src="/icons/chevron-down.svg" className="dark:filter dark:invert" height={15} width={15} alt="Icon"/></>}
                {loading && <Image src="/icons/spinner.svg" className="dark:filter dark:invert animate-spin opacity-50" height={15} width={15} alt="Icon"/>}
            </button>
        </InputContainer>
    )
}
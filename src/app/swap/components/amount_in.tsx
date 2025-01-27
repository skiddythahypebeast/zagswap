import Image from "next/image";
import { InputContainer } from "./input_container";
import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { useTrimSuffix } from "../hooks";
import { type GetRangeResponse, type GetCurrencyResponse } from "../models";
import { TokenSearch } from "./token_search";
import { CHAIN_COLORS } from "../models/colors";
import { InputLabel } from "~/app/components/input-label";

interface AmountInProps {
    onSelect: (symbol: string) => void,
    onToggleList: (toggle: boolean) => void,
    onAmountChanged: (event: ChangeEvent<HTMLInputElement>) => void,
    range: GetRangeResponse,
    inputCurrency: GetCurrencyResponse,
    isActivePair: boolean,
    amountIn: number | undefined,
    showList: boolean,
    items: GetCurrencyResponse[]
}
export const AmountIn = ({ onSelect, inputCurrency, range, isActivePair, amountIn, onToggleList, onAmountChanged, showList, items }: AmountInProps) =>  {
    const [loading, setLoading] = useState(false);
    const trim = useTrimSuffix();

    useEffect(() => {
        setLoading(false);
    }, [inputCurrency]);

    const onOpen = () => onToggleList(true);
    const onClose = () => onToggleList(false);

    const valid = useMemo(() => {
        if (!isActivePair) {
            return ["Invalid pair", ""] as const;
        }
        if (amountIn !== undefined && range?.min !== undefined && range?.min !== null && amountIn <= range.min) {
            return ["Min amount", range.min] as const;
        } 
        if (amountIn !== undefined && range?.max !== undefined && range.max !== null && amountIn >= range.max) {
            return ["Max amount", range.max] as const;
        }
    }, [amountIn, range, isActivePair]);

    return (
        <div className="flex flex-col gap-2 w-full">
            <InputLabel label={{ default: "Configure swap", error: valid as [string, string] | undefined }} />
            <div className="relative h-14 w-full">
                <TokenInput
                    item={inputCurrency}
                    showList={onOpen} 
                    onAmountChanged={onAmountChanged}
                    loading={loading}
                    amountIn={amountIn} 
                />
                {showList && <div className="absolute inset-0 z-10">
                    <TokenSearch
                        current={trim(inputCurrency)} 
                        close={onClose}
                        items={items}
                        onSelect={(item) => {
                            setLoading(true);
                            onSelect(item);
                        }} 
                    />
                </div>}
            </div>
        </div>
    )
}

interface TokenInputProps {
    item: GetCurrencyResponse,
    onAmountChanged: (event: ChangeEvent<HTMLInputElement>) => void,
    amountIn: number | undefined,
    loading: boolean,
    showList: () => void,
}
export const TokenInput = ({ item, loading, amountIn, showList, onAmountChanged }: TokenInputProps) => {
    const trim = useTrimSuffix();
    return (
        <InputContainer position="center">
            <div className="flex-1 h-full group flex flex-row items-center xl:pl-5 lg:px-5 md:px-5 px-3 xl:gap-5 lg:gap-5 gap-2 opacity-80">
                <p className="text-sm font-semibold opacity-50">send</p>
                <input 
                    type="number"
                    onChange={onAmountChanged}
                    value={amountIn === 0 ? amountIn : amountIn ?? ""}
                    className={`font-share-mono h-full lg:text-xl md:text-xl text-lg w-full outline-none py-2 bg-transparent rounded-md truncate`}
                    placeholder={"Enter amount"} 
                    aria-label="Enter amount"
                />
            </div>

            <button type="button" className="xl:flex lg:flex md:flex hidden flex-row h-full gap-2 items-center justify-between py-2 px-5 rounded-r-lg xl:max-w-52 lg:max-w-52 md:max-w-52 w-1/2 bg-one dark:bg-three-dark" onClick={showList}>
                {!loading && <><Image src={item.image} alt="" height={20} width={20} />
                <p className="font-bold truncate">{trim(item)?.toUpperCase()}</p>
                    <div className="rounded-full flex items-center justify-center" style={{ backgroundColor: CHAIN_COLORS[item.network] }}>
                    <p className="text-xs px-2 font-bold">{item.network.toUpperCase()}</p>
                </div>
                <Image src="/icons/chevron-down.svg" className="dark:filter dark:invert" height={15} width={15} alt="Icon"/></>}
                {loading && <Image src="/icons/spinner.svg" className="dark:filter dark:invert animate-spin opacity-50" height={15} width={15} alt="Icon"/>}
            </button>

            <button type="button" className="xl:hidden lg:hidden md:hidden flex flex-row h-full gap-1 items-center justify-between py-2 px-5 rounded-r-lg xl:max-w-52 lg:max-w-52 md:max-w-52 w-1/2 bg-one dark:bg-three-dark" onClick={showList}>
                {!loading && <><Image src={item.image} alt="" height={20} width={20} />
                <p className="font-bold text-sm truncate">{trim(item)?.toUpperCase()}</p>
                <div className="rounded-full flex items-center justify-center" style={{ backgroundColor: CHAIN_COLORS[item.network] }}>
                    <p className="text-xs px-2 font-bold">{item.network.toUpperCase()}</p>
                </div>
                <Image src="/icons/chevron-down.svg" className="dark:filter dark:invert" height={15} width={15} alt="Icon"/></>}
                {loading && <Image src="/icons/spinner.svg" className="dark:filter dark:invert animate-spin opacity-50" height={15} width={15} alt="Icon"/>}
            </button>
        </InputContainer>
    )
}
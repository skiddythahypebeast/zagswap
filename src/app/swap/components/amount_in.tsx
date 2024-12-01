import Image from "next/image";
import { InputContainer } from "./input_container";
import { type ChangeEvent, useMemo } from "react";
import { useTrimSuffix } from "../hooks";
import { chainColors, type CurrentPairState, type GetCurrencyResponse, type UseCurrencyState, type UseRangeState } from "../models";
import { TokenSearch } from "./token_search";

interface AmountInProps {
    onSelect: (symbol: string) => void,
    onToggleList: (toggle: boolean) => void,
    onAmountChanged: (event: ChangeEvent<HTMLInputElement>) => void,
    range: UseRangeState,
    item: UseCurrencyState,
    amountIn: number | undefined,
    pair: CurrentPairState,
    showList: boolean,
    items: GetCurrencyResponse[] | undefined
}
export const AmountIn = ({ onSelect, item, range, pair, amountIn, onToggleList, onAmountChanged, showList, items }: AmountInProps) =>  {
    const trim = useTrimSuffix();

    const onOpen = () => onToggleList(true);
    const onClose = () => onToggleList(false);

    const valid = useMemo(() => {
        if (!item.loading && !item.response) {
            return ["Failed to load token data", ""] as const;
        } 
        if (!range.loading && !range.response) {
            return ["Failed to load token range", ""] as const;
        }
        if (!pair.loading && !pair.isActive) {
            return ["Invalid pair", ""] as const;
        }
        if (amountIn !== undefined && range.response?.min !== undefined && range.response?.min !== null && amountIn <= range.response.min) {
            return ["Min amount", range.response.min] as const;
        } 
        if (amountIn !== undefined && range.response?.max !== undefined && range.response.max !== null && amountIn >= range.response.max) {
            return ["Max amount", range.response.max] as const;
        }
    }, [amountIn, item, range, pair]);

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className={`pointer-events-none w-full bg-slate-100 rounded-lg py-1 flex flex-row justify-between relative`}>
                <div className={`${!!valid ? "opacity-100" : "opacity-0"} text-red-500 px-2 font-bold text-sm absolute flex flex-row justify-between items-center w-full`}>
                    <p>{valid?.[0]}</p> 
                    <p>{valid?.[1]}</p>
                </div>
                <p className={`${!valid ? "opacity-100" : "opacity-0"} text-stone-800 font-bold px-2 text-sm absolute`}>Configure swap</p>
                <p className="text-sm opacity-0">hidden</p>
            </div>
            <div className="relative h-14 w-full">
                <TokenInput
                    range={range}
                    item={item}
                    showList={onOpen} 
                    onAmountChanged={onAmountChanged}
                    amountIn={amountIn} 
                />
                {showList && <div className="absolute inset-0 z-10">
                    <TokenSearch
                        current={trim(item?.response?.symbol)} 
                        close={onClose}
                        items={items}
                        onSelect={onSelect} 
                    />
                </div>}
            </div>
        </div>
    )
}

interface TokenInputProps {
    item: UseCurrencyState,
    onAmountChanged: (event: ChangeEvent<HTMLInputElement>) => void,
    amountIn: number | undefined,
    range: UseRangeState,
    showList: () => void,
}
export const TokenInput = ({ item, amountIn, range, showList, onAmountChanged }: TokenInputProps) => {
    const trim = useTrimSuffix();
    return (
        <InputContainer position="center">
            <div className="flex-1 h-full group flex flex-row items-center xl:pl-5 lg:px-5 md:px-5 px-3 xl:gap-5 lg:gap-5 gap-2 opacity-80">
                <p className="text-sm font-semibold opacity-50">send</p>
                <input 
                    type="number"
                    onChange={onAmountChanged}
                    value={amountIn === 0 ? amountIn : amountIn ?? ""}
                    className={`text-stone-800 font-mono h-full lg:text-xl md:text-xl text-lg w-full outline-none py-2 bg-transparent rounded-md`}
                    placeholder={range.loading || !item.response || item.loading ? "Loading" : "Enter amount"}
                    disabled={range.loading || !item.response || item.loading} 
                    aria-label="Enter amount"
                />
            </div>

            {!item.loading && item.response && <button type="button" className="xl:flex lg:flex md:flex hidden flex-row h-full gap-2 items-center justify-between py-2 px-5 rounded-r-lg xl:max-w-52 lg:max-w-52 md:max-w-52 w-1/2 bg-slate-100" onClick={showList}>
                <Image src={item.response.image} alt="" height={20} width={20} />
                <p className="font-bold">{trim(item.response.symbol)?.toUpperCase()}</p>
                <div className="rounded-full flex items-center justify-center" style={{ 
                    backgroundColor: chainColors[item.response.network], 
                    color: chainColors[item.response.network] 
                }}>
                    <p className="text-xs text-white px-2 font-bold">{item.response.network.toUpperCase()}</p>
                </div>
                <Image src="/icons/chevron-down.svg" alt="" height={15} width={15} />
            </button>}

            {!item.loading && item.response && <button type="button" className="xl:hidden lg:hidden md:hidden flex flex-row h-full gap-1 items-center justify-between py-2 px-5 rounded-r-lg xl:max-w-52 lg:max-w-52 md:max-w-52 w-1/2 bg-slate-100" onClick={showList}>
                <Image src={item.response.image} alt="" height={15} width={15} />
                <p className="font-bold text-sm">{trim(item.response.symbol)?.toUpperCase()}</p>
                <div className="rounded-full flex items-center justify-center" style={{ 
                    backgroundColor: chainColors[item.response.network], 
                    color: chainColors[item.response.network] 
                }}>
                    <p className="text-xs text-white px-2 font-bold">{item.response.network.toUpperCase()}</p>
                </div>
                <Image src="/icons/chevron-down.svg" alt="" height={10} width={10} />
            </button>}

            {item.loading && !item.response && <button type="button" className="flex flex-row h-full gap-2 justify-center items-center py-2 px-5 rounded-r-lg xl:max-w-52 lg:max-w-52 md:max-w-52 w-1/2 bg-slate-100">
                <Image src="/icons/spinner.svg" className="animate-spin opacity-50" alt="" height={20} width={20} />
            </button>}

            {/* //TODO handle error */}
            {!item.loading && !item.response && <button type="button" className="flex flex-row h-full gap-2 justify-center items-center py-2 px-5 rounded-r-lg xl:max-w-52 lg:max-w-52 md:max-w-52 w-1/2 bg-slate-100">
                ERROR
            </button>}
        </InputContainer>
    )
}
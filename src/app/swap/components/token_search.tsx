import { type ChangeEvent, type UIEventHandler, useEffect, useRef, useState } from "react";
import { useTokenLookup, useTrimSuffix } from "../hooks";
import { type GetCurrencyResponse } from "../models";
import { InputContainer } from "./input_container";
import Image from "next/image";
import { CHAIN_COLORS } from "../models/colors";

interface TokenSearchProps {
    close: () => void,
    current: string | undefined,
    items: GetCurrencyResponse[],
    onSelect: (symbol: string) => void
}
export const TokenSearch = ({ close, items, current, onSelect }: TokenSearchProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { currencies, handleSearchWithDebounce, next } = useTokenLookup(items);
    const [scrolling, setScrolling] = useState(false);
    const scrollable = useRef<HTMLDivElement>(null);
    const trim = useTrimSuffix();

    useEffect(() => {
        const element = inputRef.current;
        if (element) {
            element.focus()
        };
    }, [inputRef]);

    const handleScroll: UIEventHandler = (_) => {
        if (scrollable.current && !scrolling) {
            const scrollBottom  = scrollable.current.scrollTop + scrollable.current.clientHeight;
            if(scrollBottom > scrollable.current.scrollHeight - 200) {
                setScrolling(true);
                next();
            }
        }
    };

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        scrollable.current?.scrollTo(0,0);
        handleSearchWithDebounce(event);
    }

    useEffect(() => {
        setScrolling(false);
    }, [currencies]);

    return (
    <div className="w-full flex flex-col h-[600px]">
        <InputContainer position="top">
            <div className="py-2 pl-5 h-full flex items-center justify-center">
                <Image src="/icons/search.svg" alt="" height={15} width={15} />
            </div>
            <div className="flex-1 py-2 px-5 h-full">
                <input ref={inputRef} onChange={handleSearch} className="h-full w-full lg:text-xl md:text-xl text-lg text-stone-800 outline-none py-2 bg-transparent rounded-md" placeholder="Type currency or ticker" />
            </div>
            <button onClick={close} className="py-2 h-full flex items-center justify-center rounded-tr-lg px-5">
                <span className="pr-2">
                    <Image src="/icons/x-mark.svg" className="" alt="" height={15} width={15} />
                </span>
            </button>
        </InputContainer>
        <div ref={scrollable} onScroll={handleScroll} className="bg-white shadow-sm shadow-[#00000020] w-full flex-1 flex flex-col overflow-y-scroll">
            {currencies?.map(entry => (entry.symbol !== current && <button onClick={() => 
                onSelect(entry.symbol)} 
                key={entry.symbol} 
                className="bg-white hover:bg-slate-100 py-4 flex flex-row justify-between items-center px-5">
                    <span className="flex flex-row items-center gap-3">
                        <Image placeholder="empty" src={entry.image} alt="" height={25} width={25} />
                        <p className="xl:text-sm lg:text-sm md:text-sm text-xs font-bold">{trim(entry)?.toUpperCase()}</p>
                    </span>
                    <span className="flex flex-row items-center gap-3">
                        <p className="opacity-80 xl:text-sm lg:text-sm md:text-sm text-xs font-semibold">{entry.name}</p>
                        <div className="rounded-full flex items-center justify-center border-2" style={{ 
                            borderColor: CHAIN_COLORS[entry.network], 
                            color: CHAIN_COLORS[entry.network]
                        }}>
                            <p className="text-xs px-2 font-bold">{entry.network.toUpperCase()}</p>
                        </div>
                    </span>
            </button>))}
        </div>
    </div>
    )
}
"use client";

import { type ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { Networks, type GetCurrencyResponse } from "../models";

export const useTrimSuffix = () => {
    return useCallback((item: GetCurrencyResponse) => {
        let updated_name = item.symbol;
        if (updated_name !== item.network.toString() && updated_name !== `w${item.network}` && updated_name.endsWith(item.network)) {
            updated_name = updated_name.replace(item.network, "");
        }
        if (updated_name.endsWith("-")) {
            updated_name = updated_name.replace("-", "");
        }
        if (updated_name !== "op" && item.network == Networks.OPTIMISM && updated_name.endsWith("op")) {
            updated_name = updated_name.replace("op", "");
        }
        if (updated_name !== "trc20" && updated_name.endsWith("trc20")) {
            updated_name = updated_name.replace("trc20", "");
        }
        if (updated_name !== "erc20" && updated_name.endsWith("erc20")) {
            updated_name = updated_name.replace("erc20", "");
        }
        if (updated_name !== "bep20" && item.symbol.endsWith("bep20")) {
            updated_name = updated_name.replace("bep20", "");
        }
        if (updated_name !== "mainnet" && item.symbol.endsWith("mainnet")) {
            updated_name = updated_name.replace("mainnet", "");
        }
        if (updated_name !== "spl" && item.symbol.endsWith("spl")) {
            updated_name = updated_name.replace("spl", "");
        }
        if (updated_name !== "gt" && item.symbol.endsWith("gt")) {
            updated_name = updated_name.replace("gt", "");
        }
        if (updated_name !== "avaxc" && item.symbol.endsWith("avaxc")) {
            updated_name = updated_name.replace("avaxc", "");
        }
        if (updated_name !== "poly" && item.symbol.endsWith("poly")) {
            updated_name = updated_name.replace("poly", "");
        }
        if (updated_name !== "arb" && item.symbol.endsWith("arb")) {
            updated_name = updated_name.replace("arb", "");
        }
        if (updated_name !== "bnb" && updated_name !== "wbnb" && item.symbol.endsWith("bnb")) {
            updated_name = updated_name.replace("bnb", "");
        }
        if (updated_name !== "zk" && item.symbol.endsWith("zk")) {
            updated_name = updated_name.replace("zk", "");
        }
        return updated_name
    }, []);
}

export const useTokenLookup = (items: GetCurrencyResponse[]) => {
    const [all, setAll] = useState<GetCurrencyResponse[]>(items);
    const [state, setState] = useState<GetCurrencyResponse[]>();
    const [position, setPosition] = useState(1);
    const trim = useTrimSuffix();
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if(all){
            setState(all.slice(0, position * 30))
        }
    }, [position, all]);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const next = useCallback(() => {
        setPosition(position + 1);
    }, [position]);

    const search = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setPosition(1);
        setAll(() => {
            if(items && event.target.value){
                const sorted = [...items].sort((a, b) => {
                    const queryLower = event.target.value.toLowerCase();
                
                    const priorityA = computePriority(a, queryLower);
                    const priorityB = computePriority(b, queryLower);
                
                    return priorityB - priorityA;
                });
                
                function computePriority(item: GetCurrencyResponse, query: string) {
                    let priority = 0;
                
                    if (item.name.toLowerCase() === query) {
                        priority += 4;
                    }
                
                    if (item.symbol?.toLowerCase() === query || trim(item)?.toLowerCase() === query) {
                        priority += 3;
                    }
                
                    if (item.name.toLowerCase().startsWith(query)) {
                        priority += 2;
                    }
                
                    if (item.name.toLowerCase().includes(query)) {
                        priority += 1;
                    }
                
                    return priority;
                }

                return sorted;
            } else {
                return items
            }
        });
    }, [items, trim]);

    const handleSearchWithDebounce = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        if (timerRef.current) { clearTimeout(timerRef.current); }

        timerRef.current = window.setTimeout(() => {
            search(event);
        }, 150);
    }, [search]);

    return { currencies: state, handleSearchWithDebounce, next }
}
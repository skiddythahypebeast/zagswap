"use client";

import { type ChangeEvent, useCallback, useEffect, useState } from "react";
import { chain_suffixes } from "../models";
import type { GetCurrencyResponse } from "../models";

export const useTrimSuffix = () => {
    return useCallback((symbol: string | undefined) => {
        let updated_name = symbol;
        for (const suffix of chain_suffixes) {
            if (updated_name !== suffix && updated_name?.endsWith(suffix)) {
                updated_name = updated_name.replace(suffix, "");
            }
        }
        return updated_name
    }, []);
}

export const useTokenLookup = (items: GetCurrencyResponse[] | undefined) => {
    const [all, setAll] = useState<GetCurrencyResponse[] | undefined>();
    const [state, setState] = useState<GetCurrencyResponse[] | undefined>();
    const [query, setQuery] = useState<string | undefined>();
    const [position, setPosition] = useState(1);
    const trim = useTrimSuffix();

    useEffect(() => {
        setPosition(1);
        setAll(() => {
            if(items && query){
                const sorted = [...items].sort((a, b) => {
                    const queryLower = query.toLowerCase();
                
                    const priorityA = computePriority(a, queryLower);
                    const priorityB = computePriority(b, queryLower);
                
                    return priorityB - priorityA;
                });
                
                function computePriority(item: GetCurrencyResponse, query: string) {
                    let priority = 0;
                
                    if (item.name.toLowerCase() === query) {
                        priority += 4;
                    }
                
                    if (item.symbol?.toLowerCase() === query || trim(item.symbol)?.toLowerCase() === query) {
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
    }, [query, items, trim]);

    useEffect(() => {
        if(all){
            setState(all.slice(0, position * 30))
        }
    }, [position, all]);

    const next = useCallback(() => {
        setPosition(position + 1);
    }, [position]);

    const search = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setQuery(!event.target.value ? undefined : event.target.value);
    }, []);

    return { currencies: state, search, next }
}
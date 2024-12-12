import { useEffect } from "react";
import { InputContainer } from "./input_container"
import { type OutputCurrency, type GetCurrencyResponse } from "../models";
import Image from "next/image";
import Link from "next/link";
import { useValidatedStringInput, type ValidatedString } from "../hooks/input";

interface RecieverProps {
    onChange: (value: ValidatedString) => void,
    currency: OutputCurrency,
    validator: string | null | undefined
}
export const Receiver = ({ currency, onChange, validator }: RecieverProps) => {
    const { handleChange, valid, value } = useValidatedStringInput(validator, true);
    
    useEffect(() => {
        onChange({ value, valid });
    }, [onChange, value, valid]);

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className={`w-full bg-slate-200 rounded-lg py-1 px-2 flex flex-row justify-between relative`}>
                <p className={`${!valid ? "opacity-100" : "opacity-0"} text-red-500 font-bold text-sm absolute`}>Invalid receiver address</p>
                <p className={`${valid ? "opacity-100" : "opacity-0"} text-stone-800 font-bold text-sm absolute`}>Receiver address</p>
                <p className="pointer-events-none text-sm opacity-0">hidden</p>
            </div>
            <InputContainer position="center">
                <input 
                    onChange={handleChange}
                    placeholder={currency.placeholder}
                    className="h-full w-full text-stone-800 xl:text-lg lg:text-lg md:text-lg text-md outline-none py-2 px-5 bg-transparent rounded-md truncate" 
                />
            </InputContainer>
        </div>
    )
}

interface ExtraIdProps {
    onChange: (value: ValidatedString | undefined) => void,
    currency: GetCurrencyResponse,
    validator: string | null
}
export const ExtraId = ({ currency, onChange, validator }: ExtraIdProps) => {
    const { handleChange, valid, value } = useValidatedStringInput(validator, true);
    
    useEffect(() => {
        onChange({ value, valid });
    }, [onChange, value, valid]);

    useEffect(() => {
        return () => onChange(undefined);
    }, [onChange]);

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className={`w-full bg-slate-100 rounded-lg py-1 px-2 flex flex-row justify-between relative`}>
                <p className={`${!valid ? "opacity-100" : "opacity-0"} text-red-500 font-bold text-sm absolute`}>Invalid {currency.extra_id}</p>
                <p className={`${valid ? "opacity-100" : "opacity-0"} text-stone-800 font-bold text-sm absolute`}>{currency.extra_id}</p>
                <p className="pointer-events-none text-sm opacity-0">hidden</p>
                {/* TODO - add information to website or find other solutions */}
                {valid && <Link 
                    href={"https://help.coinbase.com/en/coinbase/trading-and-funding/sending-or-receiving-cryptocurrency/destination-tag-memo-faq"} 
                    target="_blank" 
                    className={`opacity-60 hover:opacity-80`}>
                        <Image src="/icons/info.svg" alt="" height={17} width={17} />
                </Link>}
            </div>
            <InputContainer position="center" size="small">
                <input 
                    onChange={handleChange}
                    placeholder={`${currency.extra_id} (optional)`}
                    className={`w-full text-stone-800 xl:text-md lg:text-md md:text-md text-md outline-none py-2 px-5 bg-transparent rounded-md truncate`} 
                />
            </InputContainer>
        </div>
    )
}
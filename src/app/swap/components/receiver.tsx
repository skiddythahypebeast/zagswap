import { useEffect } from "react";
import { InputContainer } from "./input_container"
import { chainPlaceholders, type UseCurrencyState } from "../models";
import Image from "next/image";
import Link from "next/link";
import { useValidatedStringInput, type ValidatedString } from "../hooks/input";

interface RecieverProps {
    onChange: (value: ValidatedString) => void,
    currency: UseCurrencyState,
    validator: string | null | undefined
}
export const Receiver = ({ currency, onChange, validator }: RecieverProps) => {
    const { handleChange, valid, value } = useValidatedStringInput(validator, true);
    
    useEffect(() => {
        onChange({ value, valid });
    }, [onChange, value, valid]);

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className={`w-full bg-slate-100 rounded-lg py-1 px-2 flex flex-row justify-between relative`}>
                <p className={`${!currency.loading && !valid ? "opacity-100" : "opacity-0"} text-red-500 font-bold text-sm absolute`}>Invalid receiver address</p>
                <p className={`${currency.loading || valid ? "opacity-100" : "opacity-0"} text-stone-800 font-bold text-sm absolute`}>Receiver address</p>
                <p className="pointer-events-none text-sm opacity-0">hidden</p>
            </div>
            <InputContainer position="center">
                <input 
                    onChange={handleChange}
                    placeholder={currency.loading ? "Loading" : currency.response ? chainPlaceholders[currency.response.network] : "Issue loading currency" }
                    disabled={currency.loading}
                    className="h-full w-full text-stone-800 xl:text-lg lg:text-lg md:text-lg text-md outline-none py-2 px-5 bg-transparent rounded-md" 
                />
            </InputContainer>
        </div>
    )
}

interface ExtraIdProps {
    onChange: (value: ValidatedString | undefined) => void,
    currency: UseCurrencyState,
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
                <p className={`${!currency.loading && !valid ? "opacity-100" : "opacity-0"} text-red-500 font-bold text-sm absolute`}>Invalid {currency.response?.extra_id}</p>
                <p className={`${currency.loading || valid ? "opacity-100" : "opacity-0"} text-stone-800 font-bold text-sm absolute`}>{currency.response?.extra_id}</p>
                <p className="pointer-events-none text-sm opacity-0">hidden</p>
                {/* TODO - add information to website or find other solutions */}
                {valid && currency.response && <Link 
                    href={"https://help.coinbase.com/en/coinbase/trading-and-funding/sending-or-receiving-cryptocurrency/destination-tag-memo-faq"} 
                    target="_blank" 
                    className={`opacity-60 hover:opacity-80`}>
                        <Image src="/icons/info.svg" alt="" height={17} width={17} />
                </Link>}
            </div>
            <InputContainer position="center" size="small">
                <input 
                    onChange={handleChange}
                    placeholder={currency.loading ? "Loading" : currency.response ? `${currency.response.extra_id} (optional)` : "Issue loading currency" }
                    disabled={currency.loading}
                    className={`${currency.loading ? "opacity-50" : ""} w-full text-stone-800 xl:text-md lg:text-md md:text-md text-md outline-none py-2 px-5 bg-transparent rounded-md`} 
                />
            </InputContainer>
        </div>
    )
}
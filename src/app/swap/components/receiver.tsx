import { useEffect } from "react";
import { InputContainer } from "./input_container"
import { type OutputCurrency, type GetCurrencyResponse } from "../models";
import Link from "next/link";
import { useValidatedStringInput, type ValidatedString } from "../hooks/input";
import { InputLabel } from "~/app/components/input-label";
import Image from "next/image";

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
            <InputLabel  label={{ default: "Receiver address", error: valid ? undefined : ["Invalid receiver address",""] }}/>
            <InputContainer position="center">
                <input 
                    onChange={handleChange}
                    placeholder={currency.placeholder}
                    className="h-full w-full xl:text-lg lg:text-lg md:text-lg text-md outline-none py-2 px-5 bg-transparent rounded-md truncate" 
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
            <div className={`w-full bg-four dark:bg-four-dark rounded-lg py-1 px-2 flex flex-row justify-between relative`}>
                <p className={`${!valid ? "opacity-100" : "opacity-0"} text-red-500 font-bold text-sm absolute`}>Invalid {currency.extra_id}</p>
                <p className={`${valid ? "opacity-100" : "opacity-0"} text-text dark:text-text-dark font-bold text-sm absolute`}>{currency.extra_id}</p>
                <p className="pointer-events-none text-sm opacity-0">hidden</p>
                {/* TODO - add information to website or find other solutions */}
                {valid && <Link 
                    href={"https://help.coinbase.com/en/coinbase/trading-and-funding/sending-or-receiving-cryptocurrency/destination-tag-memo-faq"} 
                    target="_blank" 
                    className={`opacity-60 hover:opacity-80`}>
                    <Image src="/icons/info.svg" className="dark:filter dark:invert" height={15} width={15} alt="Icon"/>
                </Link>}
            </div>
            <InputContainer position="center" size="small">
                <input 
                    onChange={handleChange}
                    placeholder={`${currency.extra_id} (optional)`}
                    className={`w-full xl:text-md lg:text-md md:text-md text-md outline-none py-2 px-5 bg-transparent rounded-md truncate`} 
                />
            </InputContainer>
        </div>
    )
}
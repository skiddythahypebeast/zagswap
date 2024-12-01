import { type ChangeEvent, useEffect, useState } from "react";
import { InputContainer } from "./input_container"
import { chainPlaceholders, type UseCurrencyState } from "../models";

interface RecieverProps {
    onChange: (address: string) => void,
    currency: UseCurrencyState,
    loadingRate: boolean
}
export const Receiver = ({ loadingRate, currency, onChange }: RecieverProps) => {
    const [invalidReceiver, setInvalidReceiver] = useState(false);
    const [localAddressInput, setLocalAddressInput] = useState<string>("");

    useEffect(() => {
        if (localAddressInput && currency.response && localAddressInput !== "") {
            const expression = new RegExp(currency.response.validation_address);
            if (expression.test(localAddressInput)) {
                onChange(localAddressInput);
                setInvalidReceiver(false);
            } else {
                setInvalidReceiver(true);
            }
        } else {
            setInvalidReceiver(false);
            onChange("");
        }
    }, [localAddressInput, currency.response, onChange]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLocalAddressInput(event.target.value);
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className={`pointer-events-none w-full bg-slate-100 rounded-lg py-1 px-2 flex flex-row justify-between relative`}>
                <p className={`${!loadingRate && !currency.loading && invalidReceiver ? "opacity-100" : "opacity-0"} text-red-500 font-bold text-sm absolute`}>Invalid receiver address</p>
                <p className={`${loadingRate || currency.loading || !invalidReceiver ? "opacity-100" : "opacity-0"} text-stone-800 font-bold text-sm absolute`}>Receiver address</p>
                <p className="pointer-events-none text-sm opacity-0">hidden</p>
            </div>
            <InputContainer position="center">
                <input 
                    onChange={handleChange}
                    value={currency.loading ? "" : localAddressInput}
                    placeholder={currency.loading ? "Loading" : currency.response ? chainPlaceholders[currency.response.network] : "Issue loading currency" }
                    disabled={loadingRate || currency.loading}
                    className="h-full w-full text-stone-800 lg:text-lg md:text-lg text-md outline-none py-2 px-5 bg-transparent rounded-md" 
                />
            </InputContainer>
        </div>
    )
}
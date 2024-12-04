"use client";

import { useExchange, useSimpleSwapForm } from "../hooks";
import { useEffect, useState } from "react";
import { AmountOut } from "./amount_out";
import { AmountIn } from "./amount_in";
import { useCurrentPair } from "../hooks/pairs";
import Image from "next/image";
import { InputContainer } from "./input_container";
import { type GetRangeResponse, type GetCurrencyResponse } from "../models";

interface SwapFormProps { 
  outputCurrency: GetCurrencyResponse, 
  inputCurrency: GetCurrencyResponse, 
  allCurrencies: GetCurrencyResponse[],
  range: GetRangeResponse, 
  isActivePair: boolean 
};
export const SwapForm = ({ outputCurrency, inputCurrency, allCurrencies, isActivePair, range }: SwapFormProps) => {
    const fixed = false;
    const [list, toggleList] = useState(0);
    const [loading, setLoading] = useState(false);
    const { updateInputCurrency, updateOutputCurrency, switchDirection } = useCurrentPair(inputCurrency, outputCurrency);
    const { form, handleAmountInChange, handleExtraIdChange, handleReceiverChange, submit } = useSimpleSwapForm(
      inputCurrency,
      outputCurrency,
      range, 
      fixed,
      isActivePair
    );

    useEffect(() => {
      setLoading(false);
    }, [inputCurrency, outputCurrency]);

    const { exchange } = useExchange(form.amountIn, range, inputCurrency, outputCurrency, fixed, isActivePair);

    return (
        <form onSubmit={submit} className="w-full flex flex-col items-center justify-start gap-1">
          <AmountIn
            range={range}
            showList={list == 1}
            amountIn={form.amountIn}
            onToggleList={(toggle) => toggleList(toggle ? 1 : 0)}
            isActivePair={isActivePair}
            inputCurrency={inputCurrency}
            onSelect={(symbol) => {
              updateInputCurrency(symbol);
              toggleList(0);
            }}
            onAmountChanged={handleAmountInChange}
            items={allCurrencies}
          />
          <div className="relative w-full flex items-center justify-center h-0 z-20">
            {list == 0 && <button 
              onClick={() => {
                setLoading(true);
                switchDirection();
              }} 
              type="button" 
              disabled={loading}
              className="absolute h-8 w-8 top-[50%] -translate-y-[50%] bg-slate-100 shadow-sm shadow-[#00000020] flex items-center justify-center p-1 rounded-lg">
                {!loading && <Image src="/icons/refresh.svg" className="opacity-70" alt="" height={15} width={20} />}
                {loading  && <Image src="/icons/spinner.svg" className="opacity-50 animate-spin" alt="" height={15} width={20} />}
            </button>}
          </div>
          <AmountOut
            showList={list == 2}
            amount={exchange.amountOut}
            outputCurrency={outputCurrency}
            amountIn={form.amountIn}
            onSelect={(symbol) => {
              updateOutputCurrency(symbol);
              toggleList(0);
            }}
            onExtraIdChanged={handleExtraIdChange}
            onReceiverChanged={handleReceiverChange}
            onToggleList={(toggle) => toggleList(toggle ? 2 : 0)}
            loadingRate={exchange.loading} 
            items={allCurrencies}
          />
          <div className="relative w-full flex items-center justify-center h-0 z-50"/>
          <InputContainer position="center">
            <button disabled={!form.valid} type="submit" className={`${!form.valid ? "opacity-50" : "opacity-90 hover:opacity-100"} transition-all duration-300 w-full py-5 h-full bg-blue-400 flex flex-row items-center justify-center gap-5`}>
              <p className="text-lg font-semibold text-white">Create exchange</p>
              {form.submitting && <Image className="animate-spin" src="/icons/white-spinner.svg" alt="" height={15} width={15} />}
            </button>
          </InputContainer>
        </form>
    )
}
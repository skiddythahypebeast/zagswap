"use client";

import { useAllCurrencies, useCurrency, useRange, useSimpleSwapForm } from "../hooks";
import { useState } from "react";
import { AmountOut } from "./amount_out";
import { AmountIn } from "./amount_in";
import { useAllPairs, useCurrentPair } from "../hooks/pairs";
import Image from "next/image";
import { InputContainer } from "./input_container";

export const SwapForm = ({ outputCurrency, inputCurrency }: { outputCurrency: string, inputCurrency: string }) => {
    const fixed = false;
    const [list, toggleList] = useState(0);
  
    const { state: pairs } = useAllPairs(fixed);
    const { state: currentPair, updateInputCurrency, updateOutputCurrency, switchDirection } = useCurrentPair(pairs, outputCurrency, inputCurrency);
    const { currencies } = useAllCurrencies();
    const { state: range } = useRange(currentPair, fixed);
    const { state: item } = useCurrency(currentPair.inputCurrency, currencies);
    const { state: itemB } = useCurrency(currentPair.outputCurrency, currencies);
    const { form, exchange, handleAmountInChange, handleReceiverChange, submit } = useSimpleSwapForm(currentPair, range, fixed, itemB.response?.validation_address);

    return (
        <form onSubmit={submit} className="w-full flex flex-col items-center justify-start gap-1">
          <AmountIn
            range={range}
            pair={currentPair}
            showList={list == 1}
            amountIn={form.amountIn}
            onToggleList={(toggle) => toggleList(toggle ? 1 : 0)}
            item={item}
            onSelect={(symbol) => {
              updateInputCurrency(symbol);
              toggleList(0);
            }}
            onAmountChanged={handleAmountInChange}
            items={currencies}
          />
          <div className="relative w-full flex items-center justify-center h-0 z-20">
            {list == 0 && <button 
              onClick={switchDirection} 
              type="button" 
              className="absolute h-8 w-8 top-[50%] -translate-y-[50%] bg-slate-100 shadow-sm shadow-[#00000020] flex items-center justify-center p-1 rounded-lg">
                <Image src="/icons/refresh.svg" className="opacity-70" alt="" height={15} width={20} />
            </button>}
          </div>
          <AmountOut 
            showList={list == 2}
            amount={exchange.amountOut}
            outputCurrency={currentPair.outputCurrency}
            amountIn={form.amountIn}
            onSelect={(symbol) => {
              updateOutputCurrency(symbol);
              toggleList(0);
            }}
            onReceiverChanged={handleReceiverChange}
            onToggleList={(toggle) => toggleList(toggle ? 2 : 0)}
            loadingRate={exchange.loading} 
            items={currencies}
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
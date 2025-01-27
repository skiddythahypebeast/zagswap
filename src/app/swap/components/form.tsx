"use client";

import { useExchange, useSimpleSwapForm } from "../hooks";
import { useEffect, useState } from "react";
import { AmountOut } from "./amount_out";
import { AmountIn } from "./amount_in";
import { useCurrentPair } from "../hooks/pairs";
import { type GetRangeResponse, type GetCurrencyResponse, type OutputCurrency } from "../models";
import { useSession } from "next-auth/react";
import { ExtraId, Receiver } from "./receiver";
import { ButtonContainer } from "~/app/components/button-container";

interface SwapFormProps { 
  outputCurrency: OutputCurrency, 
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
    const { data: session } = useSession();
    const { form, handleAmountInChange, handleExtraIdChange, handleReceiverChange, submit } = useSimpleSwapForm(
      inputCurrency,
      outputCurrency,
      range, 
      fixed,
      isActivePair
    );
    const { exchange } = useExchange(
      form.amountIn, 
      range, 
      inputCurrency, 
      outputCurrency, 
      fixed, 
      isActivePair, 
      session?.user.fee
    );

    useEffect(() => {
      setLoading(false);
    }, [inputCurrency, outputCurrency]);

    return (
      <form onSubmit={submit} className="w-full bg-three dark:bg-five-dark shadow-inner p-4 rounded-xl shadow-shade dark:shadow-shade-dark flex flex-col items-center justify-start gap-1">
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
            className="absolute h-8 w-8 top-[50%] -translate-y-[50%] bg-three dark:bg-three-dark shadow-sm shadow-shade dark:shadow-shade-dark flex items-center justify-center p-1 rounded-lg">
              {!loading && <img src="/icons/refresh.svg" className="w-5 h-5 dark:filter dark:invert opacity-70" alt="Icon"/>}
              {loading  && <img src="/icons/spinner.svg" className="w-5 h-5 dark:filter dark:invert opacity-50 animate-spin" alt="Icon"/>}
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
          onToggleList={(toggle) => toggleList(toggle ? 2 : 0)}
          loadingRate={exchange.loading} 
          items={allCurrencies}
        />
        <div className="h-0"/>
        <Receiver
          currency={outputCurrency}
          validator={outputCurrency.validation_address}
          onChange={handleReceiverChange}/>
        {outputCurrency.has_extra_id && <ExtraId
          validator={outputCurrency.validation_extra}
          currency={outputCurrency}
          onChange={handleExtraIdChange}/>}
        <div className="relative w-full flex items-center justify-center h-0 z-50"/>
        <ButtonContainer>
          <button disabled={!form.valid || loading || form.submitting} type="submit" className={`${(!form.valid || loading || form.submitting) ? "opacity-50 grayscale" : "opacity-90 hover:opacity-100"} transition-all duration-300 w-full py-5 h-full primary-button flex flex-row items-center justify-center gap-5`}>
            <p className="text-lg font-semibold text-white">Create order</p>
            {(form.submitting || loading) && <img src="/icons/spinner.svg" className="w-5 h-5 dark:filter dark:invert animate-spin" alt="Icon"/>}
          </button>
        </ButtonContainer>
        <div className={`w-full rounded-lg pt-2 flex flex-row items-center justify-between`}>
          <p className={`font-bold px-2 text-sm`}>Fee</p>
          <span className="flex flex-row gap-2 items-center justify-center bg-primary/50 dark:bg-primary-dark/50 rounded-full p-1 px-2">
            <p className={`font-bold px-1 text-sm`}>{session?.user.fee ?? "2%"}</p>
            <img src="/icons/info.svg" className="w-5 h-5 dark:filter dark:invert opacity-50" alt="Icon"/>
          </span>
        </div>
      </form>
    )
}
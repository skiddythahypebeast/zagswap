/* eslint-disable @next/next/no-img-element */
"use client"

import { InputContainer } from "./components/input-container"
import { type ChangeEvent, type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export const TrackOrder = () => {
    const [showSearch, setShowSearch] = useState(false);

    const openSearch = () => setShowSearch(true);
    const closeSearch = () => setShowSearch(false);

    const [value, setValue] = useState("");
    const router = useRouter();

    const handleSubmit = (event: FormEvent) =>  {
        event.preventDefault();
        router.push(`/order/${value}`);
        setValue("");
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value);

    const form = (<form onSubmit={handleSubmit} className='w-full'>
        <InputContainer size='small' position='center'>
            <div className="pl-5">
                <img src="/icons/search.svg" className="w-5 h-5 dark:filter dark:invert opacity-50" alt="Icon"/>
            </div>
            <input
                onChange={handleChange}
                value={value}
                placeholder="Track order"
                className="h-full w-full text-text dark:text-dark-text font-medium text-md outline-none py-2 px-5 bg-transparent rounded-md truncate"
            />
        </InputContainer>
    </form>);
  
    return (
        <>
            <div className="xl:flex lg:flex hidden">
                {form}
            </div>
            <div className="xl:hidden lg:hidden flex w-full justify-end items-center">
                <button onClick={openSearch} className="">
                    <img src="/icons/search.svg" className="w-5 h-5 dark:filter dark:invert opacity-80" alt="Icon"/>
                </button>
            </div>
            {showSearch && <div className="xl:hidden lg:hidden flex absolute inset-0 bg-bg1 dark:bg-dark-bg1 z-[100] flex-row items-center justify-between pl-2">
                {form}
                <button className="w-12 flex items-center justify-center" onClick={closeSearch}>
                    <img src="/icons/x-mark.svg" className="w-6 h-6 dark:filter dark:invert" alt="Icon"/>
                </button>
            </div>}
        </>
    )
  }
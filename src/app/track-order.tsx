/* eslint-disable @next/next/no-img-element */
"use client"

import { InputContainer } from "./components/input-container"
import { type ChangeEvent, type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

    const Form = () => (<form onSubmit={handleSubmit} className='w-full dark:border-[1px] dark:border-dark-border rounded-lg'>
        <InputContainer size='small' position='center'>
            <div className="pl-5">
                <img src="/icons/search.svg" className="w-5 h-5 dark:filter dark:invert opacity-50" alt="Icon"/>
            </div>
            <input
                name="track-order"
                onChange={handleChange}
                value={value}
                placeholder="Track order"
                className="h-full w-full text-text text-sm dark:text-dark-text font-medium text-md outline-none py-2 px-5 bg-transparent rounded-md truncate"/>
            <button type="submit" disabled={!value || value === ""} className="h-full aspect-square dark:bg-dark-text/20 bg-bg5 flex items-center justify-center">
                <Image src="/icons/chevron-down.svg" className="-rotate-90 dark:filter dark:invert opacity-100 dark:opacity-50" alt="" height={10} width={10} />
            </button>
        </InputContainer>
    </form>);
  
    return (
        <>
            <div className="xl:flex lg:flex hidden">
                <Form/>
            </div>
            <div className="xl:hidden lg:hidden flex w-full justify-end items-center">
                <button onClick={openSearch} className="">
                    <Image src="/icons/search.svg" className="dark:filter dark:invert opacity-50" height={15} width={15} alt="Icon"/>
                </button>
            </div>
            {showSearch && <div className="xl:hidden lg:hidden flex absolute inset-0 bg-bg1 dark:bg-dark-bg1 z-[100] flex-row items-center justify-between pl-2">
                <Form/>
                <button className="w-12 flex items-center justify-center" onClick={closeSearch}>
                    <Image src="/icons/x-mark.svg" className="dark:filter dark:invert opacity-50" height={15} width={15} alt="Icon"/>
                </button>
            </div>}
        </>
    )
  }
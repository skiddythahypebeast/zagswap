"use client"

import Image from "next/image"
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
                <Image src="/icons/search.svg" className="opacity-50" alt="" height={15} width={15}/>
            </div>
            <input
                onChange={handleChange}
                value={value}
                placeholder="Track order"
                className="h-full w-full text-stone-800 font-medium text-md outline-none py-2 px-5 bg-transparent rounded-md truncate"
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
                    <Image src="/icons/search.svg" className="opacity-80" alt="" height={15} width={15} />
                </button>
            </div>
            {showSearch && <div className="xl:hidden lg:hidden flex absolute inset-0 bg-white z-[100] flex-row items-center justify-between pl-2">
                {form}
                <button className="w-12 flex items-center justify-center" onClick={closeSearch}>
                    <Image src="/icons/x-mark.svg" alt="" height={15} width={15} />
                </button>
            </div>}
        </>
    )
  }
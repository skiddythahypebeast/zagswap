"use client"

import { type ButtonHTMLAttributes, type PropsWithChildren, useState } from "react";

interface CopyButtonProps extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
    value: string
}
export const CopyButton = ({ children, value, ...restProps }: CopyButtonProps) => {
    const [copied, setCopied] = useState(false);
    const handleClick = () => {
        setCopied(true);
        void navigator.clipboard.writeText(value);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };
    return (
        <>
            <button disabled={copied} onClick={handleClick} {...restProps} className={`${restProps.className}`}>
                {children}
            </button>
            <div className={`${copied ? "opacity-100" : "opacity-0"} z-50 transition-opacity duration-300 fixed xl:bottom-5 lg:bottom-5 md:bottom-5 bottom-2 xl:right-5 lg:right-5 md:right-5 right-2 px-5 py-2 bg-green-300 border-green-600 border-2 rounded-lg`}>
                <p className="text-green-700 xl:text-md lg:text-md md:text-md text-sm font-bold">Copied to clipboard!</p>
            </div>
        </>
    )
}
"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { type FC, type ReactNode } from "react";
import { useAccount } from "wagmi"
import { InputContainer } from "../components/input-container";

export const ActionButton: FC<{ children: ReactNode }> = ({ children }) => {
    const account = useAccount();
    const { openConnectModal } = useConnectModal();
    if (account.isConnected) return <>{children}</>;
    return (
        <InputContainer position="center">
            <button onClick={openConnectModal} className={`opacity-90 hover:opacity-100 transition-all duration-300 w-full py-5 h-full primary-button flex flex-row items-center justify-center gap-5`}>
                <p className="text-lg font-semibold text-white">Connect</p>
            </button>
        </InputContainer>
    )
}
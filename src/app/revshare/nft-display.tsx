"use client"

import Image from "next/image";
import { useClaimPreview } from "./@revshare/hooks/revshare";
import { type NFTData } from "./@revshare/models";
import { formatEther } from "ethers";
import { ButtonContainer } from "../components/button-container";
import { ActionButton } from "./action-button";

export const NFTDisplay = ({ data, type, onAction, status }: { data: NFTData, type: "mint" | "claim", onAction: (data: NFTData) => void, status: string }) => {
    const preview = useClaimPreview(BigInt(data.collectionTokenId));
    const handleClick = () => {
        onAction(data);
    }
    return (
        <div className="w-full h-[408px] nft-container p-[2px] rounded-xl flex flex-col shadow-md shadow-shadow dark:shadow-dark-shadow">
            <div className="relative w-full h-[300px] bg-bg5 dark:bg-dark-bg5 overflow-clip rounded-t-xl flex items-center justify-center">
                <Image src="/nft/nft-three.png" className="fade-in z-20 shadow-xl shadow-shadow dark:shadow-dark-shadow" alt="" height={300} width={300} />
                <Image src="/nft/nft-three.png" className="fade-in shadow-xl shadow-shadow dark:shadow-dark-shadow" alt="" fill />
                <div className="backdrop-blur-sm absolute inset-0 rounded-t-xl z-10"/>
            </div>
            <div className="flex flex-col gap-2 rounded-b-xl p-2 bg-bg3 dark:bg-dark-bg3">
                <div className="flex flex-row fade-in justify-between items-center">
                    <p className="font-medium">Balance</p>
                    <div className="flex flex-row items-center gap-1">
                        {preview !== undefined && <p className="font-mono">{formatEther(preview)}</p>}
                        {!preview && <p className="font-mono">{0}</p>}
                        <p className="font-medium">ETH</p>
                    </div>
                </div>
                <ActionButton>
                    <ButtonContainer>
                        <button onClick={handleClick} className={`opacity-90 hover:opacity-100 transition-all duration-300 w-full py-5 h-full primary-button flex flex-row items-center justify-center gap-5`}>
                            <p className="text-lg font-semibold">{type}</p>
                            {status === "pending" && <Image src="/icons/white-spinner.svg" className="animate-spin opacity-50" alt="" height={20} width={20} />}
                        </button>
                    </ButtonContainer>
                </ActionButton>
            </div>
        </div>
    )
}

export const NFTDisplayLoader = ({ type }: { type: "claim" | "mint" }) => {
    return (
        <div className="w-full h-[408px] nft-container p-[2px] rounded-xl flex flex-col shadow-md shadow-shadow dark:shadow-dark-shadow">
            <div className="relative h-[300px] w-full overflow-clip rounded-t-xl flex items-center justify-center">
                <div className="gradient-loader backdrop-blur-md opacity-50 absolute inset-0 z-10"/>
            </div>
            <div className="flex flex-col gap-2 rounded-b-xl p-2 bg-bg3 dark:bg-dark-bg3">
                <div className="flex flex-row justify-between items-center gradient-loader rounded-md">
                    <p className="font-medium opacity-0">Balance</p>
                    <div className="flex flex-row items-center gap-1">
                        <p className="font-medium opacity-0">ETH</p>
                    </div>
                </div>
                <ButtonContainer>
                    <button disabled className={`opacity-50 transition-all duration-300 w-full py-5 h-full primary-button flex flex-row items-center justify-center gap-5`}>
                        <p className="text-lg font-semibold">{type}</p>
                    </button>
                </ButtonContainer>
            </div>
        </div>
    )
}

export const NFTDisplayMessage = ({ message, button }: { message: string, button: { onClick: (() => void) | undefined, text: string } | undefined }) => {
    return (
        <div className="w-full h-[408px] nft-container p-[2px] rounded-xl flex flex-col shadow-md shadow-shadow dark:shadow-dark-shadow">
            <div className="relative h-[300px] w-full overflow-clip rounded-t-xl flex items-center justify-center">
                <p className="text-sm font-bold text-center w-full opacity-50">{message}</p>
            </div>
            <div className="flex flex-col gap-2 rounded-b-xl p-2">
                <div className="flex flex-row justify-between items-center rounded-md">
                    <p className="font-medium opacity-0">Balance</p>
                    <div className="flex flex-row items-center gap-1">
                        <p className="font-medium opacity-0">ETH</p>
                    </div>
                </div>
                <ButtonContainer>
                    {button && <button onClick={button.onClick} className={`opacity- transition-all duration-300 w-full py-5 h-full primary-button flex flex-row items-center justify-center gap-5`}>
                        <p className="text-lg font-semibold">{button.text}</p>
                    </button>}
                </ButtonContainer>
            </div>
        </div>
    )
}
"use client"

import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import { NFTCarousel, NFTCarouselSkeleton, NFTCarouselText } from "./carousel";
import { useAllTokens } from "../hooks/revshare";

export const ClaimInterface = () => {
    const { data, loading } = useAllTokens();
    const account = useAccount();
    const router = useRouter();
    const { openConnectModal } = useConnectModal();
    return (
        <div className="w-full xl:p-5 lg:p-5 md:p-5 p-2 flex flex-col items-center justify-start gap-2  rounded-xl">
            {!loading && data && data.assets.length != 0 && <NFTCarousel data={data} />}
            {!loading && data && data.assets.length == 0 && <NFTCarouselText button={{
                onClick: () => router.push("/revshare/mint"),
                text: "Mint"
            }} message="Could not find any NFT's" />}
            {!loading && !data && !account.isConnected && <NFTCarouselText button={{
                onClick: openConnectModal,
                text: "Connect"
            }} message="Connect your wallet to view NFT's and claim rewards" />}
            {!loading && !data && account.isConnected && <NFTCarouselText button={undefined} message="Something went wrong while loading NFT data" />}
            {loading && <NFTCarouselSkeleton/>}
        </div>
    )
}
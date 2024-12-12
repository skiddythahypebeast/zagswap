import { useCallback, useEffect, useRef, useState } from "react";
import { useClaimRevenue } from "../hooks/revshare";
import { type NFTData, type FetchNftResponse } from "../models";
import { NFTDisplay, NFTDisplayLoader, NFTDisplayMessage } from "../../nft-display";
import Image from "next/image";
import Link from "next/link";
import { env } from "~/env";

export const NFTCarousel = ({ data }: { data: FetchNftResponse }) => {
    const [active, setActive] = useState(0);
    const [holderWidth, setHolderWidth] = useState(0);
    const scroller = useRef<HTMLDivElement>(null);
    const nftHolder = useRef<HTMLDivElement>(null);

    const updateHolderWidth = useCallback(() => {
        if (nftHolder.current) {
            setHolderWidth(nftHolder.current.clientWidth);
        }
    }, [nftHolder]);

    useEffect(() => {
        updateHolderWidth();
        window.addEventListener('resize', updateHolderWidth);
        return () => window.removeEventListener('resize', updateHolderWidth);
    }, [updateHolderWidth]);

    useEffect(() => {
        if (scroller.current) {
            scroller.current.scrollTo(active * holderWidth, 0);
        }
    }, [active, holderWidth]);

    const moveSlide = useCallback((direction: "left" | "right") => {
        if (direction == "left" && active > 0) {
            setActive(active - 1);
        }
        if (direction == "right" && active < data.assets.length - 1) {
            setActive(active + 1);
        }
    }, [data, active]);

    return (
        <div ref={nftHolder} className="w-full relative flex-1 flex items-center">
            <button onClick={() => moveSlide("left")} disabled={active == 0} className={`${active === 0 ? "opacity-50" : "opacity-100"} bg-slate-400 pr-[1px] py-[1px] h-10 w-10 absolute top-1/2 -translate-y-1/2 shadow-md shadow-[#00000020] left-0 z-50`}>
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-bl from-slate-200 to-white">
                    <Image src="/icons/chevron-down.svg" className="rotate-90 opacity-80" alt="" height={15} width={15}/>
                </div>
            </button>
            <div ref={scroller} className="overflow-x-hidden shadow-md shadow-[#00000020] rounded-xl scroll-smooth grid grid-flow-col">
                {data.assets.map((data, index) => <NFTCarouselItem 
                    width={holderWidth}
                    data={data} 
                    index={index} 
                    key={data.collectionTokenId} />)}
            </div>
            <button onClick={() => moveSlide("right")} disabled={active >= data.assets.length - 1} className={`${active >= data.assets.length - 1 ? "opacity-50" : "opacity-100"} bg-slate-400 pl-[1px] py-[1px] h-10 w-10 absolute top-1/2 -translate-y-1/2 shadow-md shadow-[#00000020] right-0 z-50`}>
                <div className="h-full w-full flex justify-center bg-gradient-to-br from-slate-200 to-white items-center">
                    <Image src="/icons/chevron-down.svg" className="-rotate-90 opacity-80" alt="" height={15} width={15}/>
                </div>
            </button>
        </div>
    );
};

export const NFTCarouselItem = ({ data, index, width }: { data: NFTData, index: number, width: number }) => {
    const { claim, status } = useClaimRevenue();

    const handleClaim = (item: NFTData) => {
        claim(BigInt(item.collectionTokenId));
    }
    
    return (
        <div className="relative" key={data.collectionTokenId + index} style={{ width }}>
            <Link href={`https://opensea.io/assets/ethereum/${env.NEXT_PUBLIC_REVSHARE_ADDRESS}/${data.collectionTokenId}`} target="_blank" className="absolute top-5 z-20 right-5 bg-[#00000040] opacity-80 hover:opacity-100 p-2 rounded-md">
                <Image src="/icons/white-link.svg" alt="" height={20} width={20} />
            </Link>
            <NFTDisplay 
                type="claim"
                status={status}
                onAction={handleClaim} 
                data={data} />
        </div>
    )
}

export const NFTCarouselSkeleton = () => {
    return (
        <div className="w-full fade-in relative flex-1 flex items-center">
            <div className={`w-[100%] h-full flex items-center justify-center`}>
                <NFTDisplayLoader type="claim" />
            </div>
        </div>
    );
};

export const NFTCarouselText = ({ message, button }: { message: string, button: { text: string, onClick: (() => void) | undefined } | undefined }) => {
    return (
        <div className="w-full fade-in relative flex-1 flex items-center">
            <div className={`w-[100%] h-full flex items-center justify-center`}>
                <NFTDisplayMessage button={button} message={message} />
            </div>
        </div>
    );
};
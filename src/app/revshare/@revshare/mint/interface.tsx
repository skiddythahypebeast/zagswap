"use client";

import { NFTDisplay } from "../../nft-display";
import { useTokenMint } from "../hooks/revshare";

export const MintInterface = () => {
    const { mint, status } = useTokenMint();
    return (
        <div className="flex xl:p-5 lg:p-5 md:p-5 p-2 flex-col rounded-xl gap-5">
            <NFTDisplay
                status={status}
                onAction={mint}
                type="mint" 
                data={{
                    chain: "",
                    collectionAddress: "",
                    collectionName: "",
                    collectionTokenId: "",
                    description: "",
                    imageUrl: "",
                    name: "",
                    network: ""
                }}/>
        </div>
    )
}
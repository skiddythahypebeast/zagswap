"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { env } from "~/env";
import { parseEther } from "viem";
import { type QuicknodeResponse, type FetchNftResponse } from "../models";

export const useAllTokens = () => {
    const [data, setData] = useState<FetchNftResponse | undefined>();
    const [loading, setLoading] = useState(true);
    const account = useAccount();

    const timerRef = useRef<number | null>(null);
    
    const handleFetch = useCallback((address: string) => {
        void fetch(`${env.NEXT_PUBLIC_PROVIDER_URL}`, {
            method: "POST",
            body: JSON.stringify({
                method: "qn_fetchNFTs",
                params: [{
                    wallet: address,
                    page: 1,
                    perPage: 20,
                    contracts: [
                        env.NEXT_PUBLIC_REVSHARE_ADDRESS
                    ]
                }],
                id: "1",
                jsonrpc: "2.0"
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(data => data.json())
        .catch(console.error)
        .then((data: QuicknodeResponse<FetchNftResponse>) => setData(data.result))
        .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (timerRef.current) { clearTimeout(timerRef.current); }
        timerRef.current = window.setTimeout(() => {
            if(!account.isConnecting && account.isConnected && account.address) {
                const address = account.address;
                setLoading(true);
                handleFetch(address);
            } else {
                setLoading(false);
                setData(undefined);
            }
        }, 500);
    }, [account, handleFetch]);

    return { data, loading };
};

export const useTokenMint = () => {
    const { writeContract, status } = useWriteContract();
    
    const mint = () => {
        writeContract({
            abi: [{
                "inputs": [],
                "name": "mint",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "payable",
                "type": "function"
            }] as const,
            address: env.NEXT_PUBLIC_REVSHARE_ADDRESS as `0x${string}`,
            functionName: "mint",
            value: parseEther("0.5")
        })
    }

    return { mint, status };
}

export const useClaimRevenue = () => {
    const { writeContract, status } = useWriteContract();
    
    const claim = useCallback((tokenId: bigint) => {
        writeContract({
            abi: [{
                "inputs": [
                    {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                    }
                ],
                "name": "claim",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }] as const,
            address: env.NEXT_PUBLIC_REVSHARE_ADDRESS as `0x${string}`,
            functionName: "claim",
            args: [tokenId]
        })
    }, [writeContract])

    return { claim, status };
}

export const useClaimPreview = (tokenId: bigint) => {
    const account = useAccount();

    const { data } = useReadContract({ 
        account: account.address,
        abi: [{
            "inputs": [
                {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
                }
            ],
            "name": "previewClaim",
            "outputs": [
                {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }] as const,
        functionName: "previewClaim", 
        address: env.NEXT_PUBLIC_REVSHARE_ADDRESS as `0x${string}`,
        args: [tokenId],
    });

    return data;
};
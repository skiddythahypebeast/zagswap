import CredentialsProvider, { type CredentialInput } from "next-auth/providers/credentials"

import type { NextAuthOptions } from "next-auth"
import { Interface, verifyMessage } from "ethers";
import { JsonRpcProvider } from "ethers";
import { Contract } from "ethers";
import { erc20Abi } from "viem";
import { env } from "~/env";

const USDC_TOKEN_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

type EthereumCredentials = "message" | "signature" | "csfrToken" | "redirect" | "callbackUrl" | "json";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider<Record<EthereumCredentials, CredentialInput>>({
            name: 'Sign in with Ethereum',
            credentials: {
                callbackUrl: {},
                csfrToken: {},
                json: {},
                message: {},
                redirect: {},
                signature: {},
            },
            async authorize(credentials) {
                const { message, signature } = credentials ?? {};
                if (!message || !signature) { return null }
                const address = recoverAddressFromSignature(message, signature);
                
                if (address) {
                    const provider = new JsonRpcProvider(env.PROVIDER_URL, "mainnet");
                    const token_contract = new Contract(USDC_TOKEN_ADDRESS, new Interface(erc20Abi), provider);
                    if(token_contract.balanceOf){
                        const token_balance = await token_contract.balanceOf(address) as bigint;
                        return {
                            fee: token_balance > 1000000 ? "1%" : "2%", 
                            token_balance: token_balance.toString(),
                            id: address
                        };
                    } else {
                      throw new Error(`Invalid ABI for contract address: ${USDC_TOKEN_ADDRESS}`)
                    }
                } else {
                    return null;
                }
            },
        }),
    ],
    session: {
      strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.token_balance = user.token_balance;
                token.fee = user.fee;
                if (parseInt(user.token_balance) > 1000000) {
                    token.swap_api_key = env.API_KEY_FREE;
                } else {
                    token.swap_api_key = env.API_KEY_WITH_FEE;                    
                }
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                id: token.sub,
                fee: token.fee,
                token_balance: token.token_balance
            };
    
            return session;
        },
    }
};

function recoverAddressFromSignature(message: string, signature: string): string | null {
    try {
        const recoveredAddress = verifyMessage(message, signature);
        return recoveredAddress;
    } catch (error) {
        console.error("Signature verification failed:", error);
        return null;
    }
}
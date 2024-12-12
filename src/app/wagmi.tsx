"use client"

import { getDefaultConfig, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type Session } from 'next-auth';
import { SessionProvider, signOut, useSession } from 'next-auth/react';
import { useEffect, type ReactNode } from 'react';
import { createStorage, cookieStorage, WagmiProvider, useAccount } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';

declare module 'wagmi' {
    interface Register {
        config: typeof config
    }
}

const config = getDefaultConfig({
  appName: 'token-swap',
  projectId: 'YOUR_PROJECT_ID',
  storage: createStorage({
    storage: cookieStorage,
  }),
  chains: [sepolia],
  ssr: true,
});

const queryClient = new QueryClient();

export const Web3Provider = ({ children, session }: { children: ReactNode, session: Session | null}) => {
  return (
    <SessionProvider refetchInterval={0} session={session}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitSiweNextAuthProvider>
            <RainbowKitProvider 
              modalSize="compact" 
              theme={lightTheme({
                borderRadius: "medium",
                accentColor: "#3b82f6",
                fontStack: "system",
                overlayBlur: "small",
                accentColorForeground: "white"
            })}>
              <AccountChangeProvider>
                {children}
              </AccountChangeProvider>
            </RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </SessionProvider>
  );
};

const AccountChangeProvider = ({ children }: { children: ReactNode }) => {
  const account = useAccount();
  const { data: session } = useSession();
    
  useEffect(() => {
    if(account.address && session) {
      if (session.user.id != account.address) {
        void signOut();
      }
    }
  }, [account, session]);

  return <>{children}</>
}
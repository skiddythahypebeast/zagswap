"use client"

import { darkTheme, getDefaultConfig, lightTheme, RainbowKitProvider, type Theme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type Session } from 'next-auth';
import { SessionProvider, signOut, useSession } from 'next-auth/react';
import { type FC, useEffect, type ReactNode } from 'react';
import { createStorage, cookieStorage, WagmiProvider, useAccount } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';
import { type AvatarComponentProps } from 'node_modules/@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/AvatarContext';
import Image from 'next/image';
import Blockies from 'react-blockies';

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

const config = getDefaultConfig({
  appName: 'Zagreus',
  projectId: 'YOUR_PROJECT_ID',
  storage: createStorage({
    storage: cookieStorage,
  }),
  chains: [sepolia],
  ssr: true,
});

const queryClient = new QueryClient();

const Avatar: FC<AvatarComponentProps> = ({ address, size = 40, ensImage }) => {

  if (ensImage) {
    return (
      <div style={{ width: size, height: size }}>
        <Image src={ensImage} alt="Avatar" width={size} height={size} style={{ borderRadius: '50%' }} />
      </div>
    );
  }

  return (
    <Blockies seed={address} size={100}/>
  );
};

export const Web3Provider = ({ children, session }: { children: ReactNode, session: Session | null}) => {
  const darkMode = darkTheme({
    borderRadius: "medium",
    accentColor: "#3CD2FB",
    fontStack: "system",
    overlayBlur: "small",
    accentColorForeground: "white",
  });
  
  const lightMode = lightTheme({
    borderRadius: "medium",
    accentColor: "#3b82f6",
    fontStack: "system",
    overlayBlur: "small",
    accentColorForeground: "white"
  });

  const customTheme: Theme = {
    darkMode: {
      ...darkMode,
      colors: {
        ...darkMode.colors,
        accentColor: "#3CD2FB70",
        accentColorForeground: "#ffffff",
        actionButtonBorder: "transparent",
        actionButtonBorderMobile: "transparent",
        actionButtonSecondaryBackground: "#3CD2FB70",
        menuItemBackground: "#18181b", // chain select item
        modalBackdrop: "#00000050",
        modalBackground: "#09090b",
        
        connectButtonText: "#cfd8dc",
        connectButtonBackground: "#0F0F11",
        connectButtonInnerBackground: "#09090b",
        // connectionIndicator: "",

        modalText: "#cfd8dc",
        modalTextSecondary: "#cfd8dc70",
        // modalBorder: "#cfd8dc",
        // modalTextDim: "",
      }
    },
    lightMode
  }
  return (
    <SessionProvider refetchInterval={0} session={session}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitSiweNextAuthProvider>
            <RainbowKitProvider 
              avatar={Avatar}
              showRecentTransactions
              appInfo={{ appName: "Zagreus" }}
              modalSize="compact"
              theme={customTheme}>
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
/* eslint-disable @next/next/no-img-element */
"use client"

import { ConnectButton as Rainbowconnect } from '@rainbow-me/rainbowkit';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAccount } from 'wagmi';

export const ConnectButton = () => {
  const [loading, setLoading] = useState(true);
  const { address, isConnecting, isConnected } = useAccount();
  const { data: session, status } = useSession();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); }
    timerRef.current = window.setTimeout(() => {
      if(status === "loading" || isConnecting) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    }, 500);
  }, [status, isConnecting]);

  const label = useMemo(() => {
    if (!address || !isConnected) {
      return "Connect"
    } else if (!session) {
      return "Sign"
    } else {
      return ""
    }
  }, [address, isConnected, session]);

  if(!loading){
    return <Rainbowconnect 
      chainStatus={{
        smallScreen: "icon",
        largeScreen: "name"
      }}
      label={label}
      accountStatus={{
        smallScreen: "avatar",
        largeScreen: "address"
      }} />;
  } else {
    return <div className="primary-button h-10 aspect-square flex items-center justify-center">
      <img src="/icons/spinner.svg" className="w-5 h-5 dark:filter dark:invert animate-spin opacity-50" alt="Icon"/>
    </div>
  }
};
/* eslint-disable @next/next/no-img-element */
"use client"

import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import { CustomConnect } from './custom-connect';

export const ConnectButton = () => {
  const [loading, setLoading] = useState(true);
  const { isConnecting } = useAccount();
  const { status } = useSession();
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

  if(!loading){
    return <CustomConnect />;
  } else {
    return <div className="dark:bg-dark-bg3 dark:border-[1px] dark:border-dark-border rounded-md h-8 aspect-square flex items-center justify-center">
      <img src="/icons/spinner.svg" className="w-5 h-5 dark:filter dark:invert animate-spin opacity-50" alt="Icon"/>
    </div>
  }
};
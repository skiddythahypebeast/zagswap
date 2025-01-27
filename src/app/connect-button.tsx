"use client"

import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import { CustomConnect } from './custom-connect';
import Image from 'next/image';

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
    return <div className="dark:bg-three-dark dark:border-[1px] dark:border-border-dark rounded-md h-8 aspect-square flex items-center justify-center">
      <Image src="/icons/spinner.svg" className="dark:filter dark:invert animate-spin opacity-50" height={15} width={15} alt="Icon"/>
    </div>
  }
};
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';

export const CustomConnect = () => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');
        return (
          <div {...(!ready && { 'aria-hidden': true, 'style': { opacity: 0, pointerEvents: 'none', userSelect: 'none' }})}>
            {(() => {
              if (!connected) {
                return (<button onClick={openConnectModal} type="button" className='flex flex-row gap-3 dark:bg-dark-bg3 py-1 px-3 rounded-lg h-full dark:border-[1px] dark:border-dark-border'>
                    <p className='text-sm font-semibold'>Connect</p>
                </button>);
              }
              if (chain.unsupported) {
                return (<button onClick={openChainModal} type="button" className='flex flex-row gap-3 dark:bg-dark-bg3 py-1 px-3 rounded-lg h-full border-[2px] border-red-500'>
                    <p className='text-sm font-semibold text-red-400'>Wrong network</p>
                </button>);
              }
              return (
                <div className='flex flex-row gap-1 dark:bg-dark-bg3 p-1 rounded-lg h-full dark:border-[1px] dark:border-dark-border'>
                  <button onClick={openChainModal} className='flex items-center' type="button">
                    {chain.hasIcon && (
                      <div className='h-full flex flex-row items-center justify-center'>
                        {chain.iconUrl && (<Image alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} height={24} width={24}/>)}
                      </div>
                    )}
                  </button>
                  <button onClick={openAccountModal} className='px-3 bg-bg2 dark:bg-transparent rounded-md' type="button">
                    <p className='text-sm font-semibold'>{account.displayName}</p>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
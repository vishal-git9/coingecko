// src/components/Layout/WalletConnect.tsx
import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Button } from '../ui/button'

export const WalletConnect: React.FC = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    type="button"

                    className="px-6 py-2 bg-[#A9E851] text-black font-medium hover:bg-green-600 transition-colors shadow-lg"
                  >
                    Connect Wallet
                  </Button>
                )
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="px-6 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                  >
                    Wrong network
                  </button>
                )
              }

              return (
                <div className="flex items-center gap-3">
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 20,
                          height: 20,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 20, height: 20 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="flex items-center gap-3 px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
                  >
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {account.displayName}
                      </p>
                      {account.displayBalance && (
                        <p className="text-xs text-gray-400">
                          {account.displayBalance}
                        </p>
                      )}
                    </div>
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

// src/App.tsx
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PortfolioCard } from './components/Portfolio/PortfolioCard'
import { AddTokenModal } from './components/AddTokenModal/AddTokenModal'
import { WalletConnect } from './components/Layout/WalletConnect'
import { loadFromStorage } from './store/slices/portfolioSlice'
import '@rainbow-me/rainbowkit/styles.css'
import type { AppDispatch } from './store'
import type { PortfolioState } from './types'
import { config } from './config/wagmi'
import { WatchlistTable } from './components/Portfolio/WatchlistTable'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 30 * 1000,
    },
  },
})

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [isAddTokenModalOpen, setIsAddTokenModalOpen] = useState<boolean>(false)

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const savedData = localStorage.getItem('tokenPortfolio')
        if (savedData) {
          const parsed: Partial<PortfolioState> = JSON.parse(savedData)
          dispatch(loadFromStorage(parsed))
        }
      } catch (error) {
        console.error('Failed to load data from localStorage:', error)
      }
    }
    loadStoredData()
  }, [dispatch])

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <RainbowKitProvider >
          <div className="min-h-screen bg-gray-950 text-white">
            {/* Header - Exact match */}
            <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h1 className="text-sm lg:text-xl font-semibold text-white">Token Portfolio</h1>
                  </div>
                <WalletConnect />
              </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
              <div className="space-y-8">
                {/* Portfolio Card */}
                <PortfolioCard />               
                {/* Watchlist Table */}
                <WatchlistTable />
              </div>
            </main>

            <AddTokenModal
              isOpen={isAddTokenModalOpen}
              onClose={() => setIsAddTokenModalOpen(false)}
            />
          </div>
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  )
}

export default App

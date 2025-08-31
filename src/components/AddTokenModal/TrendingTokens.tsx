// src/components/AddTokenModal/TrendingTokens.tsx
import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { useGetTrendingCoinsQuery } from '../../store/slices/apiSlice'

interface TrendingTokensProps {
  selectedTokens: string[]
  onToggleSelection: (coinId: string) => void
  isTokenSelected: (coinId: string) => boolean
}

// Skeleton Component for Trending Tokens
const TrendingTokensSkeleton: React.FC = () => {
  return (
    <div className="space-y-1">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="flex items-center gap-3 p-3 rounded-lg">
          <Skeleton className="w-10 h-10 rounded-full bg-gray-700" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32 bg-gray-700" />
            <Skeleton className="h-3 w-16 bg-gray-700" />
          </div>
          <Skeleton className="w-5 h-5 rounded-full bg-gray-700" />
        </div>
      ))}
    </div>
  )
}

export const TrendingTokens: React.FC<TrendingTokensProps> = ({
  selectedTokens,
  onToggleSelection,
  isTokenSelected,
}) => {
  const { data: trendingData, isLoading } = useGetTrendingCoinsQuery()

  if (isLoading) {
    return <TrendingTokensSkeleton />
  }

  const trendingCoins = trendingData?.coins || []

  return (
    <div className="space-y-1">
      {trendingCoins.slice(0, 8).map((trendingCoin) => {
        const coin = trendingCoin.item
        const isSelected = isTokenSelected(coin.id)
        
        return (
          <div
            key={coin.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/30 transition-all duration-200 cursor-pointer group"
            onClick={() => onToggleSelection(coin.id)}
          >
            {/* Token Icon */}
            <div className="relative">
              <img 
                src={coin.thumb} 
                alt={coin.name}
                className="w-10 h-10 rounded-full flex-shrink-0"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement!
                  parent.innerHTML = `<div class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center"><span class="text-white font-bold text-sm">${coin.symbol.charAt(0).toUpperCase()}</span></div>`
                }}
              />
            </div>
            
            {/* Token Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white text-sm group-hover:text-gray-100 transition-colors">
                {coin.name}
              </p>
              <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                ({coin.symbol.toUpperCase()})
              </p>
            </div>
            
            {/* Radio Button - Exact match to image */}
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              isSelected 
                ? 'border-white bg-white' 
                : 'border-gray-600 group-hover:border-gray-500'
            }`}>
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-gray-900"></div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

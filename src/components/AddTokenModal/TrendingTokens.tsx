// src/components/AddTokenModal/TrendingTokens.tsx
import React from 'react'
import { useGetTrendingCoinsQuery } from '../../store/slices/apiSlice'

interface TrendingTokensProps {
  selectedTokens: string[]
  onToggleSelection: (coinId: string) => void
  isTokenSelected: (coinId: string) => boolean
}

export const TrendingTokens: React.FC<TrendingTokensProps> = ({
  selectedTokens,
  onToggleSelection,
  isTokenSelected,
}) => {
  const { data: trendingData, isLoading } = useGetTrendingCoinsQuery()

  if (isLoading) {
    return (
      <div className="px-6 py-2">
        <h3 className="text-xs font-medium text-gray-500 mb-4 uppercase tracking-wider">Trending</h3>
        <div className="space-y-1">
          {[...Array(7)].map((_, index) => (
            <div key={index} className="flex items-center gap-3 p-3 animate-pulse">
              <div className="w-9 h-9 bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-16"></div>
              </div>
              <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const trendingCoins = trendingData?.coins || []

  return (
    <div className="px-6 py-2">
      <h3 className="text-xs font-medium text-gray-500 mb-4 uppercase tracking-wider">Trending</h3>
      <div className="space-y-1">
        {trendingCoins.slice(0, 8).map((trendingCoin) => {
          const coin = trendingCoin.item
          const isSelected = isTokenSelected(coin.id)
          
          return (
            <div
              key={coin.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-all duration-150 group"
              onClick={() => onToggleSelection(coin.id)}
            >
              {/* Token Icon */}
              <img 
                src={coin.thumb} 
                alt={coin.name}
                className="w-9 h-9 rounded-full flex-shrink-0"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement!
                  parent.innerHTML = `<div class="w-9 h-9 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center"><span class="text-white font-bold text-xs">${coin.symbol.charAt(0).toUpperCase()}</span></div>`
                }}
              />
              
              {/* Token Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm">
                  {coin.name}
                </p>
                <p className="text-xs text-gray-400">
                  ({coin.symbol.toUpperCase()})
                </p>
              </div>
              
              {/* Radio Button */}
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                isSelected 
                  ? 'border-white bg-white' 
                  : 'border-gray-500 group-hover:border-gray-400'
              }`}>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

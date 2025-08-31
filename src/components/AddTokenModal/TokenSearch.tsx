// src/components/AddTokenModal/TokenSearch.tsx
import React from 'react'
import { useSearchCoinsQuery } from '../../store/slices/apiSlice'

interface TokenSearchProps {
  searchTerm: string
  selectedTokens: string[]
  onToggleSelection: (coinId: string) => void
  isTokenSelected: (coinId: string) => boolean
}

export const TokenSearch: React.FC<TokenSearchProps> = ({
  searchTerm,
  selectedTokens,
  onToggleSelection,
  isTokenSelected,
}) => {
  const { data: searchData, isLoading } = useSearchCoinsQuery(searchTerm, {
    skip: searchTerm.length < 2,
  })

  if (isLoading) {
    return (
      <div className="px-6 py-2">
        <h3 className="text-xs font-medium text-gray-500 mb-4 uppercase tracking-wider">Search Results</h3>
        <div className="space-y-1">
          {[...Array(5)].map((_, index) => (
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

  const searchResults = searchData?.coins || []

  if (searchResults.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-12 h-12 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-gray-300 mb-1">No tokens found</h3>
        <p className="text-xs text-gray-500">Try searching for a different token.</p>
      </div>
    )
  }

  return (
    <div className="px-6 py-2">
      <h3 className="text-xs font-medium text-gray-500 mb-4 uppercase tracking-wider">Search Results</h3>
      <div className="space-y-1">
        {searchResults.slice(0, 10).map((coin) => {
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
                  parent.innerHTML = `<div class="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center"><span class="text-white font-bold text-xs">${coin.symbol.charAt(0).toUpperCase()}</span></div>`
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

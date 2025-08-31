// src/components/AddTokenModal/TokenSearch.tsx
import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { useSearchCoinsQuery } from '../../store/slices/apiSlice'

interface TokenSearchProps {
  searchTerm: string
  selectedTokens: string[]
  onToggleSelection: (coinId: string) => void
  isTokenSelected: (coinId: string) => boolean
}

// Search Results Skeleton
const SearchResultsSkeleton: React.FC = () => {
  return (
    <div className="space-y-1">
      <div className="mb-4">
        <Skeleton className="h-4 w-32 bg-gray-700" />
      </div>
      {[...Array(5)].map((_, index) => (
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
    return <SearchResultsSkeleton />
  }

  const searchResults = searchData?.coins || []

  if (searchResults.length === 0 && searchTerm.length >= 2) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-800/50 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-gray-300 mb-1">No tokens found</h3>
        <p className="text-xs text-gray-500">Try searching for a different token name or symbol.</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="mb-4">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Search Results</h3>
      </div>
      {searchResults.slice(0, 10).map((coin) => {
        const isSelected = isTokenSelected(coin.id)
        return (
          <div
            key={coin.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/30 transition-all duration-200 cursor-pointer group"
            onClick={() => onToggleSelection(coin.id)}
          >
            {/* Token Icon */}
            <img 
              src={coin.thumb} 
              alt={coin.name}
              className="w-10 h-10 rounded-full flex-shrink-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement!
                parent.innerHTML = `<div class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center"><span class="text-white font-bold text-sm">${coin.symbol.charAt(0).toUpperCase()}</span></div>`
              }}
            />
            
            {/* Token Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white text-sm group-hover:text-gray-100 transition-colors">
                {coin.name}
              </p>
              <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                ({coin.symbol.toUpperCase()})
              </p>
            </div>
            
            {/* Radio Button */}
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

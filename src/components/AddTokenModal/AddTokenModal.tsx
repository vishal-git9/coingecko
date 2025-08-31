// src/components/AddTokenModal/AddTokenModal.tsx
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { TrendingTokens } from './TrendingTokens'
import { TokenSearch } from './TokenSearch'
import type { AppDispatch } from '../../store'
import { addCoinsToWatchlist } from '../../store/slices/portfolioSlice'

interface AddTokenModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AddTokenModal: React.FC<AddTokenModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('')
      setSelectedTokens([])
    }
  }, [isOpen])

  const handleAddToWatchlist = (): void => {
    if (selectedTokens.length > 0) {
      dispatch(addCoinsToWatchlist(selectedTokens))
      setSelectedTokens([])
      setSearchTerm('')
      onClose()
    }
  }

  const toggleTokenSelection = (coinId: string, coinData?: any): void => {
    setSelectedTokens(prev => {
      if (prev.includes(coinId)) {
        return prev.filter(id => id !== coinId)
      } else {
        return [...prev, coinId]
      }
    })
  }

  const isTokenSelected = (coinId: string): boolean => {
    return selectedTokens.includes(coinId)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 z-40" onClick={onClose} />
      
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-2xl w-full max-w-2xl border border-gray-700 overflow-hidden">
          
          <div className="p-6 pb-4">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search tokens (e.g., ETH, SOL)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {searchTerm ? (
              <TokenSearch
                searchTerm={searchTerm}
                selectedTokens={selectedTokens}
                onToggleSelection={toggleTokenSelection}
                isTokenSelected={isTokenSelected}
              />
            ) : (
              <TrendingTokens
                selectedTokens={selectedTokens}
                onToggleSelection={toggleTokenSelection}
                isTokenSelected={isTokenSelected}
              />
            )}
          </div>

          <div className="p-6 pt-4 border-t border-gray-800 flex justify-end">
            <button
              onClick={handleAddToWatchlist}
              disabled={selectedTokens.length === 0}
              className="px-6 py-2 bg-green-500 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
            >
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// src/components/AddTokenModal/AddTokenModal.tsx
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addCoinsToWatchlist } from '../../store/slices/portfolioSlice'
import {
  Dialog,
  DialogContent,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Search } from 'lucide-react'
import { TrendingTokens } from './TrendingTokens'
import { TokenSearch } from './TokenSearch'
import type { AppDispatch } from '../../store'

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

  const toggleTokenSelection = (coinId: string): void => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 text-white p-0 gap-0 overflow-hidden">
        {/* Modal Header  */}
        <div className="flex flex-col p-6 pb-4 space-y-4">
          <div className="flex items-center justify-between">
           
           
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search tokens (e.g., ETH, SOL)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Content Area  */}
        <div className="px-6 pb-6">
          <div className="pr-2 h-[420px] w-full overflow-scroll overflow-x-hidden">
            {searchTerm ? (
              <TokenSearch
                searchTerm={searchTerm}
                selectedTokens={selectedTokens}
                onToggleSelection={toggleTokenSelection}
                isTokenSelected={isTokenSelected}
              />
            ) : (
              <div className="space-y-1">
                <div className="mb-4">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Trending</h3>
                </div>
                <TrendingTokens
                  selectedTokens={selectedTokens}
                  onToggleSelection={toggleTokenSelection}
                  isTokenSelected={isTokenSelected}
                />
              </div>
            )}
          </div>

          {/* Footer  */}
          <div className="flex items-center justify-end pt-4 mt-4 border-t border-gray-800/50">
            <Button
              onClick={handleAddToWatchlist}
              disabled={selectedTokens.length === 0}
              className="px-6 py-2 bg-[#A9E851] hover:bg-green-500 text-black text-sm font-medium rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Add to Wishlist
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

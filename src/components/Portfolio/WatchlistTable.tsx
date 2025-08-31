// src/components/Portfolio/WatchlistTable.tsx
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  updateHoldings, 
  removeCoinFromWatchlist, 
  setLastUpdated,
  setCurrentPage,
  setItemsPerPage
} from '../../store/slices/portfolioSlice'
import { useGetCoinsMarketDataQuery } from '../../store/slices/apiSlice'
import { SparklineChart } from './SparklineChart'
import { formatCurrency, formatPercentage } from '../../utils/formatters'
import type { AppDispatch, RootState } from '../../store'

export const WatchlistTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { watchlist, holdings, currentPage, itemsPerPage } = useSelector((state: RootState) => state.portfolio)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [tempHolding, setTempHolding] = useState<string>('')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const { data: coinsData, isLoading, refetch } = useGetCoinsMarketDataQuery(watchlist, {
    skip: watchlist.length === 0,
  })

  // Pagination logic
  const paginationData = useMemo(() => {
    if (!coinsData) return { paginatedCoins: [], totalPages: 0, totalItems: 0 }
    
    const totalItems = coinsData.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedCoins = coinsData.slice(startIndex, endIndex)
    
    return { paginatedCoins, totalPages, totalItems }
  }, [coinsData, currentPage, itemsPerPage])

  const { paginatedCoins, totalPages, totalItems } = paginationData

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleEditHolding = (coinId: string, currentHolding: number): void => {
    setEditingId(coinId)
    setTempHolding(currentHolding.toString())
    setOpenMenuId(null)
  }

  const handleSaveHolding = (coinId: string): void => {
    const numericValue = parseFloat(tempHolding)
    if (!isNaN(numericValue) && numericValue >= 0) {
      dispatch(updateHoldings({ coinId, amount: numericValue }))
    }
    setEditingId(null)
    setTempHolding('')
  }

  const handleCancelEdit = (): void => {
    setEditingId(null)
    setTempHolding('')
  }

  const handleKeyPress = (e: React.KeyboardEvent, coinId: string): void => {
    if (e.key === 'Enter') {
      handleSaveHolding(coinId)
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const handleRefresh = (): void => {
    refetch()
    dispatch(setLastUpdated(Date.now()))
  }

  const handleRemoveCoin = (coinId: string): void => {
    dispatch(removeCoinFromWatchlist(coinId))
    setOpenMenuId(null)
  }

  const toggleMenu = (coinId: string): void => {
    setOpenMenuId(openMenuId === coinId ? null : coinId)
  }

  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setCurrentPage(page))
    }
  }

  const handleItemsPerPageChange = (newItemsPerPage: number): void => {
    dispatch(setItemsPerPage(newItemsPerPage))
  }

  const renderPaginationNumbers = () => {
    const pages = []
    const maxVisible = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            i === currentPage
              ? 'bg-green-500 text-white'
              : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {i}
        </button>
      )
    }

    return pages
  }

  if (watchlist.length === 0) {
    return (
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No tokens in watchlist</h3>
          <p className="text-gray-500">Add some tokens to get started with tracking your portfolio.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
        <div className="animate-pulse">
          {[...Array(itemsPerPage)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-6 border-b border-gray-800 last:border-b-0">
              <div className="w-10 h-10 bg-gray-800 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-800 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-800 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-800 rounded w-20"></div>
              <div className="h-4 bg-gray-800 rounded w-16"></div>
              <div className="h-4 bg-gray-800 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Token</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Price</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">24h %</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Sparkline (7d)</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Holdings</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Value</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedCoins.map((coin) => {
              const holding = holdings[coin.id] || 0
              const value = coin.current_price * holding

              return (
                <tr key={coin.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={coin.image} 
                        alt={coin.name}
                        className="w-10 h-10 rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder-token.png'
                        }}
                      />
                      <div>
                        <p className="font-medium text-white">{coin.name}</p>
                        <p className="text-sm text-gray-400">({coin.symbol.toUpperCase()})</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">
                      {formatCurrency(coin.current_price)}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`font-medium ${
                      coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formatPercentage(coin.price_change_percentage_24h)}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="w-24 h-12">
                      <SparklineChart 
                        data={[]} 
                        isPositive={coin.price_change_percentage_24h >= 0}
                        color={coin.price_change_percentage_24h >= 0 ? '#10B981' : '#EF4444'}
                      />
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    {editingId === coin.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={tempHolding}
                          onChange={(e) => setTempHolding(e.target.value)}
                          onKeyDown={(e) => handleKeyPress(e, coin.id)}
                          className="w-24 px-3 py-1 bg-gray-800 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          step="any"
                          min="0"
                          placeholder="Select"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveHolding(coin.id)}
                          className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditHolding(coin.id, holding)}
                        className="text-white hover:text-green-400 transition-colors"
                      >
                        {holding.toFixed(4)}
                      </button>
                    )}
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">
                      {formatCurrency(value)}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 relative">
                    <button 
                      onClick={() => toggleMenu(coin.id)}
                      className="text-gray-400 hover:text-white transition-colors p-1 rounded"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>

                    {openMenuId === coin.id && (
                      <div 
                        ref={menuRef}
                        className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 py-1"
                      >
                        <button
                          onClick={() => handleEditHolding(coin.id, holding)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-3"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Holdings
                        </button>
                        <button
                          onClick={() => handleRemoveCoin(coin.id)}
                          className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors flex items-center gap-3"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-gray-800 bg-gray-900">
        <div className="flex items-center justify-between text-sm text-gray-400">
          {/* Left side - Results info */}
          <div className="flex items-center gap-4">
            <span>
              {((currentPage - 1) * itemsPerPage) + 1} — {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
            </span>
            
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span>Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Right side - Pagination controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>{currentPage} of {totalPages} pages</span>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-1 px-3 py-1 text-blue-400 hover:text-blue-300 transition-colors"
                disabled={isLoading}
              >
                <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Prices
              </button>
            </div>
            
            {/* Pagination buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-gray-800 border border-gray-700 text-gray-300 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>
              
              {/* Page numbers */}
              {renderPaginationNumbers()}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-gray-800 border border-gray-700 text-gray-300 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

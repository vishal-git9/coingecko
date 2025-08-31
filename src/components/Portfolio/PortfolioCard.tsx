// src/components/Portfolio/PortfolioCard.tsx
import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DonutChart } from './DonutChart'
import { setLastUpdated } from '../../store/slices/portfolioSlice'
import { formatCurrency } from '../../utils/formatters'
import { useGetCoinsMarketDataQuery } from '../../store/slices/apiSlice'
import type { AppDispatch, RootState } from '../../store'

const CHART_COLORS = [
  '#F97316', // Bitcoin - Orange
  '#8B5CF6', // Ethereum - Purple  
  '#F59E0B', // Binance Coin - Yellow
  '#EF4444', // Cardano - Red
  '#10B981', // Dogecoin - Green
  '#06B6D4', // Solana - Cyan
  '#3B82F6', // Polkadot - Blue
  '#84CC16', // Chainlink - Lime
  '#EC4899', // Litecoin - Pink
  '#8B5CF6', // Polygon - Purple variant
]

export const PortfolioCard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { watchlist, holdings, lastUpdated } = useSelector((state: RootState) => state.portfolio)
  
  const { data: coinsData, isLoading, refetch } = useGetCoinsMarketDataQuery(watchlist, {
    skip: watchlist.length === 0,
    pollingInterval: 30000, // Update every 30 seconds
  })

  const portfolioData = useMemo(() => {
    if (!coinsData) return []
    
    return coinsData.map(coin => {
      const holding = holdings[coin.id] || 0
      const value = coin.current_price * holding
      
      return {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h,
        holding,
        value,
      }
    })
    // REMOVE THIS FILTER - Include ALL tokens, even with zero holdings
    // .filter(item => item.value > 0) 
  }, [coinsData, holdings])

  const portfolioTotal = portfolioData.reduce((sum, token) => sum + token.value, 0)

  // Include ALL tokens with holdings > 0 OR show all tokens with their holdings
  const chartData = portfolioData
    .filter(token => token.holding > 0) // Only show tokens with actual holdings
    .map((token, index) => ({
      id: token.id,
      name: token.name,
      symbol: token.symbol,
      value: token.value,
      color: CHART_COLORS[index % CHART_COLORS.length],
      percentage: portfolioTotal > 0 ? (token.value / portfolioTotal) * 100 : 0,
    }))

  // Handle refresh with timestamp update
  const handleRefresh = async () => {
    try {
      await refetch()
      dispatch(setLastUpdated(Date.now()))
    } catch (error) {
      console.error('Failed to refresh data:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-6 bg-gray-800 rounded w-32 mb-4"></div>
            <div className="h-12 bg-gray-800 rounded w-48 mb-6"></div>
            <div className="h-4 bg-gray-800 rounded w-40"></div>
          </div>
          <div className="w-64 h-64 bg-gray-800 rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
      <div className="flex items-start justify-between">
        {/* Left side - Portfolio Total */}
        <div className="flex-1">
          <h2 className="text-gray-400 text-sm font-medium mb-2">Portfolio Total</h2>
          <p className="text-5xl font-bold text-white mb-6">
            {formatCurrency(portfolioTotal)}
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            </p>
          )}
        </div>
        
        {/* Right side - Chart and Legend */}
        <div className="flex items-center gap-8">
          {/* Donut Chart */}
          <div className="w-64 h-64 relative">
            {chartData.length > 0 ? (
              <DonutChart data={chartData} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-full">
                <p className="text-gray-400 text-sm">No holdings to display</p>
              </div>
            )}
          </div>
          
          {/* Legend - Show ALL tokens with holdings */}
          <div className="w-[200px]">
            <h3 className="text-gray-400 text-sm font-medium mb-4">Portfolio Breakdown</h3>
            <div className="h-[200px] overflow-auto scrollbar-primary">
              <div className="space-y-3 pr-2">
                {chartData.length > 0 ? (
                  chartData.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-300 text-sm truncate">
                          {item.name} ({item.symbol.toUpperCase()})
                        </span>
                      </div>
                      <span className="text-gray-400 text-sm font-medium flex-shrink-0">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Add holdings to see portfolio breakdown</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

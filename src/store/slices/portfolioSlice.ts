// src/store/slices/portfolioSlice.ts
import { createSlice, type PayloadAction, } from '@reduxjs/toolkit'

export interface PortfolioState {
  watchlist: string[] 
  holdings: Record<string, number>
  lastUpdated: number | null
  currentPage: number
  itemsPerPage: number
}

// Default tokens in watchlist
const DEFAULT_WATCHLIST = [
  'bitcoin',
  'ethereum', 
  'binancecoin',
  'cardano',
  'dogecoin',
  'solana',
  'polkadot',
  'chainlink',
  'litecoin',
  'polygon'
]

// Default holdings for sample data
const DEFAULT_HOLDINGS = {
  'bitcoin': 0.5,
  'ethereum': 2.5,
  'binancecoin': 10,
  'cardano': 1000,
  'dogecoin': 5000,
  'solana': 25,
  'polkadot': 50,
  'chainlink': 100,
  'litecoin': 5,
  'polygon': 500
}

const initialState: PortfolioState = {
  watchlist: DEFAULT_WATCHLIST,
  holdings: DEFAULT_HOLDINGS,
  lastUpdated: null,
  currentPage: 1,
  itemsPerPage: 5,
}

interface UpdateHoldingsPayload {
  coinId: string
  amount: number
}

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addCoinsToWatchlist: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach(coinId => {
        if (!state.watchlist.includes(coinId)) {
          state.watchlist.push(coinId)
          if (!state.holdings[coinId]) {
            state.holdings[coinId] = 0
          }
        }
      })
    },
    removeCoinFromWatchlist: (state, action: PayloadAction<string>) => {
      state.watchlist = state.watchlist.filter(id => id !== action.payload)
      delete state.holdings[action.payload]
      
      const totalPages = Math.ceil(state.watchlist.length / state.itemsPerPage)
      if (state.currentPage > totalPages && totalPages > 0) {
        state.currentPage = totalPages
      }
    },
    updateHoldings: (state, action: PayloadAction<UpdateHoldingsPayload>) => {
      const { coinId, amount } = action.payload
      state.holdings[coinId] = amount
      state.lastUpdated = Date.now() // Update timestamp when holdings change
    },
    setLastUpdated: (state, action: PayloadAction<number>) => {
      state.lastUpdated = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload
      state.currentPage = 1 // Reset to first page when changing page size
    },
    loadFromStorage: (state, action: PayloadAction<Partial<PortfolioState>>) => {
      return { ...state, ...action.payload }
    },
  },
})

export const {
  addCoinsToWatchlist,
  removeCoinFromWatchlist,
  updateHoldings,
  setLastUpdated,
  setCurrentPage,
  setItemsPerPage,
  loadFromStorage,
} = portfolioSlice.actions

export default portfolioSlice.reducer

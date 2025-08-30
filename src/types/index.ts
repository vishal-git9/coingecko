// src/types/index.ts
export interface Token {
    id: string
    name: string
    symbol: string
    image: string
    current_price?: number
    market_cap_rank?: number
    market_cap?: number
    price_change_percentage_24h?: number
    sparkline_in_7d?: {
      price: number[]
    }
  }
  
  export interface WatchlistToken extends Token {
    holding: number
    value: number
  }
  
  export interface PriceData {
    [tokenId: string]: {
      usd: number
      usd_24h_change: number
      usd_market_cap?: number
      sparkline_7d?: number[]
    }
  }
  
  export interface PortfolioState {
    watchlist: Token[]
    holdings: Record<string, number>
    lastUpdated: number | null
    isLoading: boolean
    error: string | null
  }
  
  export interface SearchResult {
    coins: Token[]
    exchanges: any[]
    icos: any[]
    categories: any[]
    nfts: any[]
  }
  
  export interface TrendingResponse {
    coins: Array<{
      item: Token & {
        coin_id: number
        score: number
      }
    }>
  }
  
  export interface ChartData {
    id: string
    name: string
    symbol: string
    value: number
    color: string
    percentage: number
  }
  
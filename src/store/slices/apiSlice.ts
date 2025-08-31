// src/store/slices/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface CoinGeckoToken {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  price_change_percentage_24h: number
  total_volume: number
  circulating_supply: number
  last_updated: string
}

export interface SearchCoin {
  id: string
  name: string
  api_symbol: string
  symbol: string
  market_cap_rank: number
  thumb: string
  large: string
}

export interface SearchResponse {
  coins: SearchCoin[]
  exchanges: any[]
  icos: any[]
  categories: any[]
  nfts: any[]
}

export interface TrendingCoin {
  id: string
  coin_id: number
  name: string
  symbol: string
  market_cap_rank: number
  thumb: string
  small: string
  large: string
  slug: string
  price_btc: number
  score: number
  data: {
    price: number
    price_btc: string
    price_change_percentage_24h: Record<string, number>
    market_cap: string
    market_cap_btc: string
    total_volume: string
    total_volume_btc: string
    sparkline: string
    content: any
  }
}

export interface TrendingResponse {
  coins: Array<{
    item: TrendingCoin
  }>
  nfts: any[]
  categories: any[]
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.coingecko.com/api/v3',
    prepareHeaders: (headers) => {
      headers.set('accept', 'application/json')
      headers.set('x-cg-demo-api-key', 'CG-hAMBgJAAWaYmiVx7wNS7oNki')
      return headers
    },
  }),
  tagTypes: ['Prices', 'Search', 'Trending'],
  endpoints: (builder) => ({
    // Get market data for specific coins
    getCoinsMarketData: builder.query<CoinGeckoToken[], string[]>({
      query: (coinIds) => 
        `/coins/markets?vs_currency=usd&ids=${coinIds.join(',')}&order=market_cap_desc&per_page=250&page=1&sparkline=true&locale=en`,
      providesTags: ['Prices'],
    }),
    
    // Search for coins
    searchCoins: builder.query<SearchResponse, string>({
      query: (searchTerm) => `/search?query=${encodeURIComponent(searchTerm)}`,
      providesTags: ['Search'],
    }),
    
    // Get trending coins
    getTrendingCoins: builder.query<TrendingResponse, void>({
      query: () => '/search/trending',
      providesTags: ['Trending'],
    }),
  }),
})

export const {
  useGetCoinsMarketDataQuery,
  useSearchCoinsQuery,
  useGetTrendingCoinsQuery,
} = apiSlice

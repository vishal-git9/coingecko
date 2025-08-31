// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import portfolioSlice from './slices/portfolioSlice'
import { apiSlice } from './slices/apiSlice'
import { localStorageMiddleware } from './middleware/localStorageMiddleware'

export const store = configureStore({
  reducer: {
    portfolio: portfolioSlice,
    api: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    })
      .concat(apiSlice.middleware)
      .concat(localStorageMiddleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

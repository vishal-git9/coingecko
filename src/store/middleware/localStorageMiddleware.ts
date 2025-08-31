// src/store/middleware/localStorageMiddleware.ts

export const localStorageMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action)

  // Save portfolio state to localStorage after certain actions
  const actionsToSave = [
    'portfolio/addCoinsToWatchlist',
    'portfolio/removeCoinFromWatchlist', 
    'portfolio/updateHoldings',
    'portfolio/setLastUpdated',
    'portfolio/setCurrentPage',
    'portfolio/setItemsPerPage',
  ]

  if (actionsToSave.some(actionType => action.type === actionType)) {
    try {
      const { portfolio } = store.getState()
      localStorage.setItem('tokenPortfolio', JSON.stringify({
        watchlist: portfolio.watchlist,
        holdings: portfolio.holdings,
        lastUpdated: portfolio.lastUpdated,
        currentPage: portfolio.currentPage,
        itemsPerPage: portfolio.itemsPerPage,
      }))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }

  return result
}

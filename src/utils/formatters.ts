// src/utils/formatters.ts
export const formatCurrency = (amount: number): string => {
  if (amount === 0) return '$0.00'
  
  if (amount < 0.01) {
    return `$${amount.toFixed(6)}`
  }
  
  if (amount < 1) {
    return `$${amount.toFixed(4)}`
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export const formatPercentage = (percentage: number): string => {
  const sign = percentage >= 0 ? '+' : ''
  return `${sign}${percentage.toFixed(2)}%`
}

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

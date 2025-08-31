// src/components/Portfolio/SparklineChart.tsx
import React from 'react'

interface SparklineChartProps {
  data: number[]
  isPositive: boolean
  color: string
}

export const SparklineChart: React.FC<SparklineChartProps> = ({ 
  isPositive,
  color 
}) => {
  // Generate sample sparkline path
  const generateSparkline = () => {
    const points = 20
    const width = 96
    const height = 48
    const values = []
    
    for (let i = 0; i < points; i++) {
      const trend = isPositive ? Math.random() * 0.3 + 0.7 : Math.random() * 0.3 + 0.2
      values.push(trend * height)
    }
    
    const path = values
      .map((value, index) => {
        const x = (index * width) / (points - 1)
        const y = height - value
        return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
      })
      .join(' ')
    
    return path
  }

  return (
    <svg width="96" height="48" className="overflow-visible">
      <defs>
        <linearGradient id={`gradient-${isPositive ? 'positive' : 'negative'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={generateSparkline()}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

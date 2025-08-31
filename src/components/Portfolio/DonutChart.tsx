// src/components/Portfolio/DonutChart.tsx
import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface ChartDataItem {
  id: string
  name: string
  symbol: string
  value: number
  color: string
  percentage: number
}

interface DonutChartProps {
  data: ChartDataItem[]
}

export const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
  const chartData = {
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: data.map(item => item.color),
        borderWidth: 0,
        cutout: '70%',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  }

  return (
    <div className="w-full h-full">
      <Doughnut data={chartData} options={options} />
    </div>
  )
}

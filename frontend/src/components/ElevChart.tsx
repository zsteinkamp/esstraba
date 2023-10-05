import React from "react"
import {
  CategoryScale,
  TimeSeriesScale,
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js"
import { Line } from "react-chartjs-2"
import type { Point } from "gpxparser"
import "chartjs-adapter-moment"

interface ElevChartProps {
  routePoints: Point[]
}

ChartJS.register(
  CategoryScale,
  TimeSeriesScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
)

function ElevChart({ routePoints }: ElevChartProps) {
  const chartData = routePoints.map(p => {
    return { x: p.time, y: p.ele * 3.28 }
  })

  const options = {
    scales: {
      y: { title: { display: true, text: "Elevation (ft)" } },
      x: {
        type: "timeseries",
        display: true,
      },
    },
  }

  const data = {
    type: "line",
    datasets: [
      {
        data: chartData,
      },
    ],
  }

  return <Line options={options} data={data} />
}
export default ElevChart

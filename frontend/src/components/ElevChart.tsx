import React from "react"
import {
  CategoryScale,
  TimeSeriesScale,
  Chart as ChartJS,
  Decimation,
  LinearScale,
  Filler,
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
  Decimation,
  Filler,
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
      },
    },
    plugins: {
      decimation: {
        enabled: true,
        algorithm: "lttb",
      },
    },
  }

  const data = {
    type: "line",
    datasets: [
      {
        borderColor: "rgb(255, 0, 0)",
        fill: {
          target: "origin",
          above: "rgba(255, 102, 102, .5)",
        },
        data: [...chartData],
      },
    ],
  }

  return <Line options={options} data={data} />
}
export default ElevChart

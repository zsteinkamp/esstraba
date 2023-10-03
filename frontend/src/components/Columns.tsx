import { ReactNode } from "react"
import moment from "moment"
import Elevation from "./Elevation"
import Distance from "./Distance"

export type ColumnType = {
  field: string
  label?: string
  buttonClass?: string
  defaultSortAscending?: boolean
  comparator?: (a: string, b: string) => number
  markup?: (val: string, rowIdx: number, colIdx: number) => ReactNode
  hidden?: boolean
}

const dateFormatter = (input: string, format: string): string => {
  //console.log("DATEFORMATTER", { input })
  return moment(input, "x").format(format)
}
const elevationFormatter = (input: string): ReactNode => {
  return <Elevation input={input} />
}
const distanceFormatter = (input: string): ReactNode => {
  return <Distance input={input} />
}

const comparatorFloat = (a: string, b: string) => {
  const fa = parseFloat(a)
  const fb = parseFloat(b)

  const ina = isNaN(fa)
  const inb = isNaN(fb)
  if (ina && inb) {
    return 0
  }
  if (ina) {
    return -1
  }
  if (inb) {
    return 1
  }

  //console.log('CF', { fa, fb })

  if (fa == fb) {
    return 0
  }
  return fa < fb ? -1 : 1
}

const typeMap = {
  "Alpine Ski": "⛷️",
  Hike: "🥾",
  "Inline Skate": "🛼",
  Ride: "🚴",
  Run: "🏃",
  "Stand Up Paddling": "🏄",
  Swim: "🏊",
  Walk: "🚶",
  Workout: "🏋️",
  Yoga: "🧘",
} as { [key: string]: string }

export const columns: ColumnType[] = [
  {
    field: "Activity Date",
    comparator: comparatorFloat,
    markup: (val, rowIdx, colIdx) => {
      return (
        <div
          key={`r${rowIdx}c${colIdx}d`}
          className="text-center text-xs leading-7"
        >
          <span className="hidden md:inline">
            {dateFormatter(val, "ddd, MMM DD, YYYY")}
          </span>
          <span className="inline md:hidden">
            {dateFormatter(val, "dd M/D/YY")}
          </span>
        </div>
      )
    },
  },
  {
    field: "Activity ID",
    hidden: true,
  },
  {
    field: "Activity Name",
    defaultSortAscending: true,
    markup: (val, rowIdx, colIdx) => {
      return (
        <div key={`r${rowIdx}c${colIdx}d`} className="pl-2">
          {val}
        </div>
      )
    },
  },
  {
    field: "Activity Type",
    label: "Type",
    defaultSortAscending: true,
    markup: (val, rowIdx, colIdx) => {
      return (
        <div key={`r${rowIdx}c${colIdx}m`} className="text-center">
          {typeMap[val]} <span className="text-xs">{val}</span>
        </div>
      )
    },
  },
  {
    field: "Elevation Gain",
    label: "Ascent",
    comparator: comparatorFloat,
    markup: (val, rowIdx, colIdx) => {
      return (
        <div key={`r${rowIdx}c${colIdx}f`} className="text-center">
          {elevationFormatter(val)}
        </div>
      )
    },
  },
  {
    field: "Distance",
    comparator: comparatorFloat,
    markup: (val, rowIdx, colIdx) => {
      return (
        <div key={`r${rowIdx}c${colIdx}d`} className="text-center">
          {distanceFormatter(val)}
        </div>
      )
    },
  },
  {
    field: "Media",
    comparator: comparatorFloat,
    markup: (val, rowIdx, colIdx) => {
      return (
        <div key={`r${rowIdx}c${colIdx}m`} className="text-center">
          {val}
        </div>
      )
    },
  },
  {
    field: "Activity Description",
    label: "Description",
    buttonClass: "hidden md:block",
    markup: (val, rowIdx, colIdx) => {
      return (
        <div
          key={`r${rowIdx}c${colIdx}s`}
          className="text-xs pl-2 hidden md:block"
        >
          {val}
        </div>
      )
    },
  },
]

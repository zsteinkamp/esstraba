"use client"

import { ReactNode, useState } from "react"
import { Link } from "react-router-dom"
import moment from "moment"

interface ActivityGridProps {
  activities: Record<string, string>[]
}
const ActivityGrid = ({ activities }: ActivityGridProps) => {
  const dateFormatter = (input: string): string => {
    //console.log('DATEFORMATTER', { input })
    return moment(new Date(parseFloat(input))).format("ddd, MMM DD, YYYY")
  }
  const elevationFormatter = (input: string): string => {
    const numVal = parseInt((parseFloat(input) * 3.28).toString())
    return isNaN(numVal) ? "" : numVal.toLocaleString() + " ft"
  }
  const distanceFormatter = (input: string): string => {
    const numVal =
      parseInt(((100 * parseFloat(input)) / 1609.34).toString()) / 100.0
    return isNaN(numVal) ? "" : numVal.toLocaleString() + " mi"
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

  type ColumnType = {
    field: string
    label?: string
    defaultSortAscending?: boolean
    comparator?: (a: string, b: string) => number
    markup?: (val: string, rowIdx: number, colIdx: number) => ReactNode
    hidden?: boolean
  }

  const columns: ColumnType[] = [
    {
      field: "Activity Date",
      comparator: comparatorFloat,
      markup: (val, rowIdx, colIdx) => {
        return (
          <div key={`r${rowIdx}c${colIdx}d`} className="text-center">
            {dateFormatter(val)}
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
            {val}
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
      markup: (val, rowIdx, colIdx) => {
        return (
          <div key={`r${rowIdx}c${colIdx}s`} className="text-xs pl-2">
            {val}
          </div>
        )
      },
    },
  ]

  const [currFilter, setCurrFilter] = useState("")
  const [currSort, setCurrSort] = useState({
    field: columns[0].field,
    colIdx: 0,
    sortAscending: false,
  })

  const getRows = () => {
    const ret = activities
      .map(activity => {
        const rowObj = {} as Record<string, string>
        let foundFilter = !currFilter
        for (const colSpec of columns) {
          const column = colSpec.field
          rowObj[column] = activity[column]
          const value = rowObj[column]
          if (column === "Activity Date") {
            rowObj[column] = Date.parse(value).valueOf().toString()
          } else if (column === "Media") {
            rowObj[column] = (value && value.split("|").length.toString()) || ""
          }
          if (
            currFilter &&
            rowObj[column].toLowerCase().indexOf(currFilter) > -1
          ) {
            foundFilter = true
          }
        }
        if (!foundFilter) {
          return null
        }
        return rowObj
      })
      .filter(a => a !== null)

    const column = columns[currSort.colIdx]
    ret.sort((a, b) => {
      if (a === null) {
        return -1
      }
      if (b === null) {
        return 1
      }
      const acf = a[column.field]
      const bcf = b[column.field]
      //console.log('DEEP IN SORT', { column, acf, bcf })
      let ascendingResult = 0
      if (column.comparator) {
        //console.log('CUSTOM COMPARATOR', column.comparator)
        ascendingResult = column.comparator(acf, bcf)
      } else {
        if (acf == bcf) {
          ascendingResult = 0
        }
        ascendingResult = acf < bcf ? -1 : 1
      }
      return ascendingResult * (currSort.sortAscending ? 1 : -1)
    })
    return ret
  }

  const PAGE_SIZE = 100
  //console.log({ rows, columns })
  const rows = getRows()
  const rowElems = rows
    .slice(0, PAGE_SIZE)
    .map((row, rowIdx) => {
      //console.log('ROW', row)
      if (row === null) {
        return null
      }
      return (
        <Link
          key={`l${rowIdx}`}
          className="contents dataRow"
          to={`/activity/${row["Activity ID"]}`}
        >
          {columns
            .map((col, colIdx) => {
              if (row === null) {
                return null
              }
              return col.hidden ? null : col.markup ? (
                col.markup(row[col.field], rowIdx, colIdx)
              ) : (
                <div key={`r${rowIdx}c${colIdx}`}>{row[col.field]}</div>
              )
            })
            .filter(a => a)}
        </Link>
      )
    })
    .filter(a => a)

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrFilter(e.target.value.trim().toLowerCase())
  }
  const handleSort = (colIdx: number) => {
    setCurrSort({
      field: columns[colIdx].field,
      colIdx,
      sortAscending:
        currSort.colIdx === colIdx
          ? !currSort.sortAscending
          : !!columns[colIdx].defaultSortAscending,
    })
  }

  return (
    <div
      key="p"
      className="datagrid pt-2 w-full grid grid-cols-[2fr_4fr_1fr_1fr_1fr_1fr_4fr]"
    >
      <div></div>
      <div className="filter">
        <input
          onChange={handleFilterChange}
          type="text"
          className="w-full p-2 border-2 rounded focus:outline-none focus-visible:none"
          placeholder="Keyword filter..."
        />
      </div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div className="text-right">
        Activities: <strong>{rows.length} </strong>
        <span className="text-sm italic text-slate-500">
          {rows.length > PAGE_SIZE ? ` (First ${PAGE_SIZE} shown...)` : null}
        </span>
      </div>
      {columns.map((col, idx) => {
        if (col.hidden) {
          return null
        }
        return (
          <div className="button" key={`b${idx}`}>
            <button
              onClick={() => handleSort(idx)}
              className={`w-full leading-10 border bg-gray-300 whitespace-nowrap rounded relative ${
                col.field === currSort.field
                  ? "bg-red-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {col.label || col.field}
              {col.field === currSort.field ? (
                currSort.sortAscending ? (
                  <span className="pl-1">⬆</span>
                ) : (
                  <span className="pl-1">️⬇</span>
                )
              ) : null}
            </button>
          </div>
        )
      })}
      {rowElems}
    </div>
  )
}

export default ActivityGrid
"use client"

import { columns } from "./Columns"
import { useContext } from "react"
import { SetHeader } from "./Header"
import { RowQueryContextType, RowQueryState } from "../App"
import { Link } from "react-router-dom"
import moment from "moment"

interface ActivityGridProps {
  activities: Record<string, string>[]
}
const ActivityGrid = ({ activities }: ActivityGridProps) => {
  const { rowQuery, setRowQuery } = useContext(
    RowQueryState,
  ) as RowQueryContextType

  const currFilter = rowQuery.currFilter
  const currSort = rowQuery.currSort

  //console.log("ACTIVITIES", { activities })
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
            rowObj[column] = (
              moment.utc(value, "MMM D, YYYY, H:mm:ss A").unix() * 1000
            ).toString()
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
  //console.log({ columns })
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
    setRowQuery({
      ...rowQuery,
      currFilter: e.target.value.trim().toLowerCase(),
    })
  }
  const handleSort = (colIdx: number) => {
    setRowQuery({
      ...rowQuery,
      currSort: {
        colIdx,
        sortAscending:
          currSort.colIdx === colIdx
            ? !currSort.sortAscending
            : !!columns[colIdx].defaultSortAscending,
      },
    })
  }

  return (
    <>
      <div className="text-right pr-2"></div>
      <div
        key="p"
        className="datagrid pl-2 pr-2 pb-2 pt-2 w-full grid grid-cols-[2fr_4fr_1fr_1fr_1fr_1fr] md:grid-cols-[2fr_4fr_1fr_1fr_1fr_1fr_4fr]"
      >
        <div></div>
        <div className="filter">
          <input
            onChange={handleFilterChange}
            type="text"
            className="w-full p-2 border-2 rounded focus:outline-none focus-visible:none"
            placeholder="Keyword filter..."
            value={currFilter || undefined}
          />
        </div>
        <div className=""></div>
        <div className=""></div>
        <div className=""></div>
        <div className=""></div>
        <div className="hidden md:block"></div>
        {columns.map((col, idx) => {
          if (col.hidden) {
            return null
          }
          return (
            <div className={`pt-1 ${col.buttonClass}`} key={`b${idx}`}>
              <SetHeader>
                <div>
                  <span className="text-sm italic text-slate-200">
                    Activities: <strong>{rows.length} </strong>
                    {rows.length > PAGE_SIZE
                      ? ` (First ${PAGE_SIZE} shown...)`
                      : null}
                  </span>
                </div>
              </SetHeader>
              <button
                onClick={() => handleSort(idx)}
                className={`w-full leading-10 border bg-gray-300 whitespace-nowrap rounded relative m-2 ${
                  col.field === columns[currSort.colIdx].field
                    ? "bg-red-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {col.label || col.field}
                {col.field === columns[currSort.colIdx].field ? (
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
    </>
  )
}

export default ActivityGrid

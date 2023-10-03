"use client"

import { columns } from "./Columns"
import { useContext } from "react"
import { SetHeader } from "./Header"
import { RowQueryContextType, RowQueryState, RowQueryType } from "../App"
import { Link } from "react-router-dom"
import moment from "moment"
import ReactSlider from "react-slider"

interface ActivityGridProps {
  activities: Record<string, string>[]
}
const ActivityGrid = ({ activities }: ActivityGridProps) => {
  const { rowQuery, setRowQuery } = useContext(
    RowQueryState,
  ) as RowQueryContextType

  const currFilter = rowQuery.currFilter
  const currSort = rowQuery.currSort
  const dateRange = rowQuery.dateRange

  //console.log("ACTIVITIES", { activities })
  const getRows = () => {
    const ret = {
      minDate: Infinity as number,
      maxDate: -Infinity as number,
      rows: [] as (Record<string, string> | null)[],
    }

    //console.log("IN getRows()")

    ret.rows = activities
      .map(activity => {
        const rowObj = {} as Record<string, string>
        let foundFilter = !currFilter // tricky move - if there is no filter then foundFilter===true
        let dateMs = null
        for (const colSpec of columns) {
          const column = colSpec.field
          rowObj[column] = activity[column]
          const value = rowObj[column]
          if (column === "Activity Date") {
            dateMs = moment.utc(value, "MMM D, YYYY, H:mm:ss A").unix() * 1000
            rowObj[column] = dateMs.toString()
          } else if (column === "Media") {
            rowObj[column] = (value && value.split("|").length.toString()) || ""
          }
          if (
            currFilter &&
            rowObj[column].toLowerCase().indexOf(currFilter) === -1
          ) {
            foundFilter = true
          }
          if (dateMs && (dateMs < dateRange.min || dateMs > dateRange.max)) {
            foundFilter = false
          }
        }
        // get min/max dates of activities
        if (dateMs) {
          if (dateMs < ret.minDate) {
            ret.minDate = dateMs
          }
          if (dateMs > ret.maxDate) {
            ret.maxDate = dateMs
          }
        }
        if (!foundFilter) {
          return null
        }
        return rowObj
      })
      .filter(a => a !== null)

    const column = columns[currSort.colIdx]
    ret.rows.sort((a, b) => {
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
  const { minDate, maxDate, rows } = getRows()
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

  //console.log({ min: minDate, max: maxDate })

  const formatDateMs = (dateMs: number): string => {
    return moment(dateMs, "x").format("MMM YYYY")
  }

  type SliderValue = number[]
  type TimeoutType = null | number | NodeJS.Timeout

  let debounceSlider = null as TimeoutType
  const handleSliderChange = (args: SliderValue) => {
    if (debounceSlider !== null) {
      clearTimeout(debounceSlider)
    }
    debounceSlider = setTimeout(() => {
      setRowQuery((rowQuery: RowQueryType): RowQueryType => {
        const newRowQuery = { ...rowQuery }
        newRowQuery.dateRange.min = args[0]
        newRowQuery.dateRange.max = args[1]
        return newRowQuery
      })
      //console.log("timeout hit", args, rowQuery.dateRange)
    }, 300)
  }

  return (
    <>
      <SetHeader>
        <div>
          <span className="text-sm italic">
            Activities: <strong>{rows.length} </strong>
            {rows.length > PAGE_SIZE ? (
              <span className="text-red-300">(First {PAGE_SIZE} shown...)</span>
            ) : null}
          </span>
        </div>
      </SetHeader>
      <div className="text-right pr-2"></div>
      <div
        key="p"
        className="datagrid pb-8 pt-2 grid grid-cols-[2fr_4fr_1fr_1fr_1fr_1fr] md:grid-cols-[12rem_1fr_5rem_5rem_5rem_5rem_1fr]"
      >
        <div className="pl-1 pr-1">
          {minDate !== Infinity && (
            <ReactSlider
              className="dateSlider"
              thumbClassName="dateSliderThumb"
              trackClassName="dateSliderTrack"
              min={minDate}
              max={maxDate}
              defaultValue={[rowQuery.dateRange.min, rowQuery.dateRange.max]}
              onChange={handleSliderChange}
              ariaLabel={["Lower thumb", "Upper thumb"]}
              ariaValuetext={state =>
                `Thumb value ${formatDateMs(state.valueNow)}`
              }
              renderThumb={(props, state) => (
                <div {...props}>{formatDateMs(state.valueNow)}</div>
              )}
              withTracks
              pearling
            />
          )}
        </div>
        <div className="pt-1 pb-2 filter">
          <input
            onChange={handleFilterChange}
            type="text"
            className="w-full p-2 border-2 rounded focus:outline-none focus-visible:none"
            placeholder="Keyword filter..."
            value={currFilter || ""}
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
            <div
              className={`pt-1 pb-1 ml-0.5 mr-0.5 ${col.buttonClass}`}
              key={`b${idx}`}
            >
              <button
                onClick={() => handleSort(idx)}
                className={`w-full leading-10 border bg-gray-300 whitespace-nowrap rounded relative ${
                  col.field === columns[currSort.colIdx].field
                    ? "bg-red-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {col.label || col.field}
                {col.field === columns[currSort.colIdx].field ? (
                  <span className="font-white pl-2">
                    {
                      /* unicode arrows */
                      currSort.sortAscending ? "\u2191" : "\u2193"
                    }
                  </span>
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

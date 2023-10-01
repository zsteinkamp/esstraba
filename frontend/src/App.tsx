import ActivityList from "./ActivityList"
import Activity from "./Activity"
//import reportWebVitals from "./reportWebVitals"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { ReactNode, useState } from "react"
import { createContext } from "react"

export type CurrSortType = {
  colIdx: number
  sortAscending: boolean
}
export type RowQueryType = {
  currFilter: string | null
  currSort: CurrSortType
}
export type HeaderChildrenType = ReactNode | null

export type HeaderChildrenContextType = {
  headerChildren: HeaderChildrenType
  setHeaderChildren: (headerChildren: HeaderChildrenType) => void
}
export type RowQueryContextType = {
  rowQuery: RowQueryType
  setRowQuery: (rowQuery: RowQueryType) => void
}

export const HeaderChildrenState =
  createContext<HeaderChildrenContextType | null>(null)
export const RowQueryState = createContext<RowQueryContextType | null>(null)

function App() {
  const [rowQuery, setRowQuery] = useState<RowQueryType>({
    currFilter: null,
    currSort: {
      colIdx: 0,
      sortAscending: false,
    },
  })
  const [headerChildren, setHeaderChildren] = useState<HeaderChildrenType>(null)

  return (
    <HeaderChildrenState.Provider value={{ headerChildren, setHeaderChildren }}>
      <RowQueryState.Provider value={{ rowQuery, setRowQuery }}>
        <Header />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ActivityList />} />
            <Route path="/activity/:activityId" element={<Activity />} />
          </Routes>
        </BrowserRouter>
        <Footer />
      </RowQueryState.Provider>
    </HeaderChildrenState.Provider>
  )
}

export default App

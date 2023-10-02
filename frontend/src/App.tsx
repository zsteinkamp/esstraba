import ActivityList from "./ActivityList"
import Activity from "./Activity"
//import reportWebVitals from "./reportWebVitals"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { useState, ReactElement, useContext, createContext } from "react"

export type CurrSortType = {
  colIdx: number
  sortAscending: boolean
}
export type RowQueryType = {
  currFilter: string | null
  currSort: CurrSortType
}

export type HeaderContentType = ReactElement | null

export interface HeaderContextType {
  header: HeaderContentType
  setHeader: (content: HeaderContentType) => void
}

// Create the context
// from https://kyleshevlin.com/updating-state-with-a-component
export const HeaderContext = createContext<HeaderContextType>({
  header: null,
  setHeader: () => {
    return
  },
})

// Create our provider
export function HeaderProvider({ children }: { children?: ReactElement }) {
  const [header, setHeader] = useState<HeaderContentType>(null)
  return (
    <HeaderContext.Provider value={{ header, setHeader }}>
      {children}
    </HeaderContext.Provider>
  )
}

// Custom hook for consuming the context
export const useHeaderContext = () => useContext(HeaderContext)

// Hook specifically for updating the heading
// Name provides a little more context where it gets used
export const useUpdateHeader = (value: HeaderContentType) => {
  useHeaderContext().setHeader(value)
}

export type RowQueryContextType = {
  rowQuery: RowQueryType
  setRowQuery: (rowQuery: RowQueryType) => void
}

export const RowQueryState = createContext<RowQueryContextType | null>(null)

function App() {
  const [rowQuery, setRowQuery] = useState<RowQueryType>({
    currFilter: null,
    currSort: {
      colIdx: 0,
      sortAscending: false,
    },
  })

  return (
    <RowQueryState.Provider value={{ rowQuery, setRowQuery }}>
      <HeaderProvider>
        <>
          <Header />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ActivityList />} />
              <Route path="/activity/:activityId" element={<Activity />} />
            </Routes>
          </BrowserRouter>
          <Footer />
        </>
      </HeaderProvider>
    </RowQueryState.Provider>
  )
}

export default App

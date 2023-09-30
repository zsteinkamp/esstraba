import ActivityList from "./ActivityList"
import Activity from "./Activity"
//import reportWebVitals from "./reportWebVitals"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Logo from "./components/Logo"
import Footer from "./components/Footer"
import { ReactNode, useState } from "react"
import { createContext } from "react"

export type CurrSortType = {
  colIdx: number
  sortAscending: boolean
}

export type AppStateType = {
  headerChildren: ReactNode | null
  currFilter: string | null
  currSort: CurrSortType
}
export type AppContextType = {
  appState: AppStateType
  setAppState: (appState: AppStateType) => void
}

export const AppState = createContext<AppContextType | null>(null)

function App() {
  const [appState, setAppState] = useState<AppStateType>({
    headerChildren: null,
    currFilter: null,
    currSort: {
      colIdx: 0,
      sortAscending: false,
    },
  })
  return (
    <AppState.Provider value={{ appState, setAppState }}>
      <Logo />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ActivityList />} />
          <Route path="/activity/:activityId" element={<Activity />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </AppState.Provider>
  )
}

export default App

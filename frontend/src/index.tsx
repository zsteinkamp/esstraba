import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import ActivityList from "./ActivityList"
import Activity from "./Activity"
//import reportWebVitals from "./reportWebVitals"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Logo from "./components/Logo"
import Footer from "./components/Footer"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <BrowserRouter>
    <Logo />
    <Routes>
      <Route path="/" element={<ActivityList />} />
      <Route path="/activity/:activityId" element={<Activity />} />
    </Routes>
    <Footer />
  </BrowserRouter>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals(console.log)

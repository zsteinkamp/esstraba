import { AppContextType, AppState } from "../App"
import { useContext } from "react"

interface LogoProps {
  className?: string
}

const Logo = ({ className = "" }: LogoProps) => {
  const { appState } = useContext(AppState) as AppContextType
  return (
    <div
      className={`grid grid-cols-2 items-bottom bg-red-600 border-t-red-600 border-t-2 border-b-red-600 border-b-2 ${className}`}
    >
      <div className="logo">
        <a href="/">
          E<span className="text-2xl">sstraba</span>! 🎉
        </a>
      </div>
      <div className="text-right text-white grid content-end justify-end pr-2.5">
        {appState.headerChildren}
      </div>
    </div>
  )
}

export default Logo

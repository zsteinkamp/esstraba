import { HeaderChildrenContextType, HeaderChildrenState } from "../App"
import { useContext } from "react"

interface HeaderProps {
  className?: string
}

const Header = ({ className = "" }: HeaderProps) => {
  const { headerChildren } = useContext(
    HeaderChildrenState,
  ) as HeaderChildrenContextType
  return (
    <div
      className={`text-white grid grid-cols-2 items-bottom bg-red-600 border-t-red-600 border-t-2 border-b-red-600 border-b-2 ${className}`}
    >
      <div className="logo font-bold h-[2.5rem] text-3xl pl-2.5 pt-0.5 uppercase italic">
        <a href="/">
          E<span className="text-2xl">sstraba</span>! 🎉
        </a>
      </div>
      <div className="text-right text-white grid content-end justify-end pr-2.5">
        {headerChildren}
      </div>
    </div>
  )
}

export default Header

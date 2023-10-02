import { useHeaderContext } from "../App"
import { useEffect, ReactElement } from "react"

interface HeaderProps {
  className?: string
}

export function SetHeader({ children }: { children: ReactElement | null }) {
  const hc = useHeaderContext()
  if (hc) {
    const { setHeader } = hc

    useEffect(() => {
      setHeader(children)
    }, [children, setHeader])

    return null
  }
}

const Header = ({ className = "" }: HeaderProps) => {
  const hc = useHeaderContext()
  let header = null
  if (hc) {
    header = hc.header
  }
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
        {header}
      </div>
    </div>
  )
}

export default Header

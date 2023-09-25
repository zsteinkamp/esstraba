import { ReactNode } from "react"

interface LogoProps {
  children?: ReactNode
  className?: string
}
const Logo = ({ children, className = "" }: LogoProps) => {
  return (
    <div
      className={`grid grid-cols-2 items-bottom bg-red-600 border-t-red-600 border-t-2 border-b-red-600 border-b-2 ${className}`}
    >
      <div className="logo">
        <a href="/">
          E<span className="text-2xl">sstraba</span>! 🎉
        </a>
      </div>
      <div className="text-right text-white">{children}</div>
    </div>
  )
}

export default Logo

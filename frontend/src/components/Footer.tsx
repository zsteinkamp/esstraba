interface FooterProps {
  className?: string
}
const Footer = ({ className = "" }: FooterProps) => {
  return (
    <div
      className={`fixed w-full bg-white h-[1.95rem] z-[1000] pt-[0.3rem] pl-4 pr-4 border-t-red-600 border-t-4 text-xs bottom-0 footer grid grid-cols-2 ${className}`}
    >
      <div className="text-slate-600">
        <a target="_blank" href="https://steinkamp.us/">
          by Zack Steinkamp
        </a>
      </div>
      <div className="text-right italic text-slate-600">
        <a target="_blank" href="https://github.com/zsteinkamp/esstraba">
          Get your own{" "}
          <strong>
            E<span className="text-[80%]">SSTRABA</span>! 🎉
          </strong>
        </a>
      </div>
    </div>
  )
}

export default Footer

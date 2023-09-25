interface FooterProps {
  className?: string
}
const Footer = ({ className = "" }: FooterProps) => {
  return (
    <div className={`fixed bottom-0 footer grid grid-cols-2 ${className}`}>
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

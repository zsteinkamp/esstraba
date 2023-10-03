interface ElapsedTimeProps {
  input: string | number
  className?: string
}
const ElapsedTime = ({ input, className = "" }: ElapsedTimeProps) => {
  let seconds = typeof input === "string" ? parseFloat(input) : input
  if (isNaN(seconds)) {
    return <span>¿que?</span>
  }
  const days = Math.round(seconds / 86400)
  seconds -= days * 86400
  const hours = Math.round(seconds / 3600)
  seconds -= hours * 3600
  const minutes = Math.round(seconds / 60)

  const durationArr = []
  if (days > 0) {
    durationArr.push(
      <>
        {days}
        <span className="unit">d </span>
      </>,
    )
  }
  if (hours > 0) {
    durationArr.push(
      <>
        {hours}
        <span className="unit">h </span>
      </>,
    )
  }
  if (minutes > 0) {
    durationArr.push(
      <>
        {minutes}
        <span className="unit">m </span>
      </>,
    )
  }

  return <span className={`elapsedTime ${className}`}>{durationArr}</span>
}

export default ElapsedTime

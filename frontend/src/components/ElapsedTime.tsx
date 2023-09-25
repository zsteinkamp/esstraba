interface ElapsedTimeProps {
  input: string | number
  className?: string
}
const ElapsedTime = ({ input, className = "" }: ElapsedTimeProps) => {
  let seconds = typeof input === "string" ? parseFloat(input) : input
  if (isNaN(seconds)) {
    return <span>¿que?</span>
  }
  const days = parseInt((seconds / 86400).toString())
  seconds -= days * 86400
  const hours = parseInt((seconds / 3600).toString())
  seconds -= hours * 3600
  const minutes = parseInt((seconds / 60).toString())

  const durationArr = []
  if (days > 0) {
    if (days === 1) {
      durationArr.push("1 day")
    } else {
      durationArr.push(days + " days")
    }
  }
  if (hours > 0) {
    if (hours === 1) {
      durationArr.push("1 hour")
    } else {
      durationArr.push(hours + " hours")
    }
  }
  if (minutes > 0) {
    if (minutes === 1) {
      durationArr.push("1 minute")
    } else {
      durationArr.push(minutes + " minutes")
    }
  }

  return (
    <span className={`elapsedTime ${className}`}>{durationArr.join(" ")}</span>
  )
}

export default ElapsedTime

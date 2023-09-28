interface SpeedProps {
  time: string | number
  distance: string | number
  type: string
  className?: string
}
const Speed = ({ time, distance, type, className = "" }: SpeedProps) => {
  const timeSec = typeof time === "string" ? parseFloat(time) : time
  const distMet = typeof distance === "string" ? parseFloat(distance) : distance
  if (isNaN(timeSec) || isNaN(distMet)) {
    return <span>¿que?</span>
  }

  const metersSec = distMet / timeSec
  const mph = (metersSec * 3600) / 1609.34

  if (type === "Run") {
    return (
      <span className={`elevation ${className}`}>
        {(Math.round(600 / mph) / 10.0).toLocaleString()} min/mile
      </span>
    )
  }
  return (
    <span className={`speed ${className}`}>
      {(Math.round(10 * mph) / 10.0).toLocaleString()} mi/hr
    </span>
  )
}

export default Speed

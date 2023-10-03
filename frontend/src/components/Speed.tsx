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
    const minMile = 60 / mph
    const paceMins = Math.floor(minMile)
    let paceSecs = Math.round((minMile - paceMins) * 60).toString()
    if (paceSecs.length === 1) {
      paceSecs = "0" + paceSecs
    }
    return (
      <span className={`elevation ${className}`}>
        <span className="value">
          {paceMins}:{paceSecs}
        </span>
        <span className="unit">/mi</span>
      </span>
    )
  }
  return (
    <span className={`speed ${className}`}>
      <span className="value">
        {(Math.round(10 * mph) / 10.0).toLocaleString()}
      </span>
      <span className="unit">mi/hr</span>
    </span>
  )
}

export default Speed

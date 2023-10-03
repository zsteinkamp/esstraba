interface DistanceProps {
  unit?: "miles"
  input: string | number
  className?: string
}
const Distance = ({ unit = "miles", input, className = "" }: DistanceProps) => {
  const meters = typeof input === "string" ? parseFloat(input) : input
  if (isNaN(meters)) {
    return <span>¿que?</span>
  }

  if (unit === "miles") {
    return (
      <span className={`distance ${className}`}>
        <span className="value">
          {(Math.round((100 * meters) / 1609.34) / 100.0).toFixed(2)}
        </span>
        <span className="unit">mi</span>
      </span>
    )
  }
}

export default Distance

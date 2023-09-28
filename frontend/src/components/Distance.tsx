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
        {(Math.round((100 * meters) / 1609.34) / 100.0).toLocaleString()} miles
      </span>
    )
  }
}

export default Distance

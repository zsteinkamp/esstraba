interface ElevationProps {
  unit?: "feet"
  input: string | number
  className?: string
}
const Elevation = ({
  unit = "feet",
  input,
  className = "",
}: ElevationProps) => {
  const meters = typeof input === "string" ? parseFloat(input) : input
  if (isNaN(meters)) {
    return <span>¿que?</span>
  }

  if (unit === "feet") {
    return (
      <span className={`elevation ${className}`}>
        {Math.round(meters * 3.28).toLocaleString()} feet
      </span>
    )
  }
}

export default Elevation

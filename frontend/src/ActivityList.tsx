import { useEffect, useState } from "react"
import ActivityGrid from "./components/ActivityGrid"

function ActivityList() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch("/api/activity")
      .then(res => res.json())
      .then(data => {
        setActivities(data.activities)
        setError(null)
        setLoading(false)
      })
  }, [])

  const wrap = (msg: string) => {
    return (
      <div className="h-96 grid justify-center items-center">
        <div>{msg}</div>
      </div>
    )
  }

  if (error) {
    return wrap("Error")
  }
  if (loading) {
    return wrap("Loading")
  }
  return <ActivityGrid activities={activities} />
}

export default ActivityList

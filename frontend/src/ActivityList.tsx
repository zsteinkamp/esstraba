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

  if (error) {
    return <div>Error...</div>
  }
  if (loading) {
    return <div>Loading...</div>
  }
  return <ActivityGrid activities={activities} />
}

export default ActivityList

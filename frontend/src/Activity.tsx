import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import moment from "moment"
import Map from "./components/Map"
import ElapsedTime from "./components/ElapsedTime"
import Elevation from "./components/Elevation"
import Distance from "./components/Distance"

function Activity() {
  const [activity, setActivity] = useState({} as Record<string, string>)
  const [gpxBody, setGpxBody] = useState("")
  const [loading, setLoading] = useState(true)
  const [currPhoto, setCurrPhoto] = useState("")
  const [error, setError] = useState(false)
  const { activityId } = useParams()

  useEffect(() => {
    setLoading(true)
    fetch(`/api/activity/${activityId}`)
      .then(res => res.json())
      .then(data => {
        setActivity(data.activity)
      })
      .catch(e => {
        console.error("ERROR", e)
        setError(true)
      })
      .finally(() => {
        setLoading(false)
      })
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCurrPhoto("")
      }
    }
    window.addEventListener("keydown", handleEsc)

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [])

  useEffect(() => {
    if (!activity["Filename"]) {
      return
    }
    // Now get GPX
    setLoading(true)
    fetch(`/activities/${activity["Filename"].split("/")[1]}`)
      .then(res => res.text())
      .then(data => {
        setGpxBody(data)
      })
      .catch(e => {
        console.error("GPX ERROR", e)
        setError(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [activity])

  if (loading) {
    return <p>Loading Activity...</p>
  }
  if (error) {
    return <p>Error!</p>
  }

  // IMAGES
  const media =
    activity &&
    activity["Media"] &&
    activity["Media"].split("|").map(mediaFname => {
      return (
        mediaFname && (
          <div key={mediaFname}>
            <img
              src={`/${mediaFname}`}
              alt="title"
              onClick={() => setCurrPhoto(mediaFname)}
              className="aspect-square object-cover rounded"
            />
          </div>
        )
      )
    })

  const activityDate = moment(new Date(activity["Activity Date"])).format(
    "dddd, MMMM DD, YYYY @ HH:MM",
  )

  return (
    <>
      <div className="grid grid-cols-2">
        <div className="h-[calc(100vh-4.5rem)] border">
          {gpxBody && <Map gpxBody={gpxBody} />}
        </div>
        <div className="pt-12 pl-4 pr-4 h-[calc(100vh-4.5rem)] overflow-auto">
          <h1 className="text-center activityTitle">
            {activity["Activity Name"]}
          </h1>
          <p className="text-slate-600 text-center text-sm">{activityDate}</p>
          <p className="pt-4 pb-4 text-[80%] text-center">
            {activity["Activity Description"]}
          </p>
          <div className="grid gap-2 grid-cols-2">
            <p className="activityDataLabel">Elapsed Time:</p>
            <p className="activityDataValue">
              <ElapsedTime input={activity["Elapsed Time"]} />
            </p>
            <p className="activityDataLabel">Elevation Gain:</p>
            <p className="activityDataValue">
              <Elevation input={activity["Elevation Gain"]} />
            </p>
            <p className="activityDataLabel">Elevation High:</p>
            <p className="activityDataValue">
              <Elevation input={activity["Elevation High"]} />
            </p>
            <p className="activityDataLabel">Distance:</p>
            <p className="activityDataValue">
              <Distance input={activity["Distance"]} />
            </p>
            <p className="activityDataLabel">Calories:</p>
            <p className="activityDataValue">
              {parseInt(activity["Calories"]) || "-"}
            </p>
            <p className="activityDataLabel">Gear:</p>
            <p className="activityDataValue">
              {activity["Activity Gear"] || "-"}
            </p>
            <p className="activityDataLabel">Download:</p>
            <p className="activityDataValue">
              <a href={`/${activity["Filename"]}`}>GPX</a>
            </p>
          </div>
          {media && (
            <div className="grid content-center pt-4 grid-cols-4 gap-2 pr-4">
              {media}
            </div>
          )}
        </div>
      </div>
      {currPhoto && (
        <div
          className="shade"
          onClick={() => {
            setCurrPhoto("")
          }}
        >
          <img src={`/${currPhoto}`} />
        </div>
      )}
    </>
  )
}

export default Activity

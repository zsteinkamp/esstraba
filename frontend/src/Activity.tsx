import { ReactNode, useEffect, useContext, useState } from "react"
import { HeaderChildrenContextType, HeaderChildrenState } from "./App"
import { useParams } from "react-router-dom"
import moment from "moment"
import Map from "./components/Map"
import ElapsedTime from "./components/ElapsedTime"
import Elevation from "./components/Elevation"
import Distance from "./components/Distance"
import Speed from "./components/Speed"
import { useHotkeys } from "react-hotkeys-hook"
import { Key } from "ts-key-enum"

function Activity() {
  const { setHeaderChildren } = useContext(
    HeaderChildrenState,
  ) as HeaderChildrenContextType
  const [activity, setActivity] = useState({} as Record<string, string>)
  const [gpxBody, setGpxBody] = useState("")
  const [loading, setLoading] = useState(true)
  const [currPhotoIdx, setCurrPhotoIdx] = useState(null as number | null)
  const [error, setError] = useState(false)
  const { activityId } = useParams()

  useEffect(() => {
    setHeaderChildren(null)

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
  }, [])

  // IMAGES
  let media = [] as ReactNode[]
  let mediaFnames = [] as string[]

  const nextPhoto = () => {
    if (currPhotoIdx !== null && media.length > 0) {
      setCurrPhotoIdx((currPhotoIdx + 1) % media.length)
    }
  }
  const prevPhoto = () => {
    if (currPhotoIdx !== null && media.length > 0) {
      setCurrPhotoIdx((media.length + currPhotoIdx - 1) % media.length)
    }
  }

  useHotkeys(Key.Escape, () => setCurrPhotoIdx(null), [currPhotoIdx, media])
  useHotkeys(["n", "f", Key.ArrowRight, Key.ArrowDown], () => nextPhoto(), [
    currPhotoIdx,
    media,
  ])
  useHotkeys(["p", "b", Key.ArrowLeft, Key.ArrowUp], () => prevPhoto(), [
    currPhotoIdx,
    media,
  ])

  if (activity && activity["Media"]) {
    mediaFnames = activity["Media"].split("|")
    media = mediaFnames.map((mediaFname, idx) => {
      return (
        mediaFname && (
          <div key={mediaFname}>
            <img
              src={`/${mediaFname}`}
              alt="title"
              onClick={() => setCurrPhotoIdx(idx)}
              className="aspect-square object-cover rounded cursor-pointer"
            />
          </div>
        )
      )
    })
  }

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

  const utcActivityDate = moment.utc(activity["Activity Date"]).unix() * 1000
  const activityDate = moment(utcActivityDate).format(
    "dddd, MMMM DD, YYYY @ h:mm a",
  )

  return (
    <>
      <div className="grid grid-rows-2 md:grid-rows-1 md:grid-cols-2">
        <div className="h-[50vh] md:h-[calc(100vh-4.5rem)] border">
          {gpxBody && (
            <Map
              gpxBody={gpxBody}
              vertMeters={parseInt(activity["Elevation Gain"])}
            />
          )}
        </div>
        <div className="pt-4 md:pt-12 pl-4 pr-4 md:h-[calc(100vh-4.5rem)] md:overflow-auto">
          <h1 className="text-center activityTitle">
            {activity["Activity Name"]}
          </h1>
          <p className="text-slate-600 text-center text-sm">{activityDate}</p>
          <p className="pt-4 pb-4 text-[80%] text-center">
            {activity["Activity Description"]}
          </p>
          <div className="grid gap-2 grid-cols-2">
            <p className="activityDataLabel">Distance:</p>
            <p className="activityDataValue">
              <Distance input={activity["Distance"]} />
            </p>
            <p className="activityDataLabel">Moving Time:</p>
            <p className="activityDataValue">
              <ElapsedTime input={activity["Moving Time"]} />
            </p>
            <p className="activityDataLabel">Average Speed:</p>
            <p className="activityDataValue">
              <Speed
                time={activity["Moving Time"]}
                distance={activity["Distance"]}
                type={activity["Activity Type"]}
              />
            </p>
            <p className="activityDataLabel">Elevation Gain:</p>
            <p className="activityDataValue">
              <Elevation input={activity["Elevation Gain"]} />
            </p>
            <p className="activityDataLabel">Elevation High:</p>
            <p className="activityDataValue">
              <Elevation input={activity["Elevation High"]} />
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
            <div className="grid content-center pt-4 grid-cols-4 gap-2">
              {media}
            </div>
          )}
        </div>
      </div>
      {media.length > 0 && currPhotoIdx !== null && (
        <div
          className="absolute z-[1001] top-0 left-0 w-full h-full shade cursor-pointer grid content-center justify-center"
          onClick={() => {
            setCurrPhotoIdx(null)
          }}
        >
          <img
            src={`/${mediaFnames[currPhotoIdx]}`}
            className="cursor-pointer object-contain max-w[90vw] max-h[90vh] border-2 border-black"
          />
        </div>
      )}
    </>
  )
}

export default Activity

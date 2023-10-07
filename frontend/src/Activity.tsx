import { ReactNode, useEffect, useState } from "react"
import { SetHeader } from "./components/Header"
import { useNavigate, useParams } from "react-router-dom"
import moment from "moment"
import MapGl from "./components/MapGl"
import ElapsedTime from "./components/ElapsedTime"
import Elevation from "./components/Elevation"
import Distance from "./components/Distance"
import Speed from "./components/Speed"
import { useHotkeys } from "react-hotkeys-hook"
import { Key } from "ts-key-enum"
import GpxParser, { Point } from "gpxparser"
import ElevChart from "./components/ElevChart"

function Activity() {
  //const { setHeaderChildren } = useContext(
  //  HeaderChildrenState,
  //) as HeaderChildrenContextType
  const [activity, setActivity] = useState({} as Record<string, string>)
  const [gpxBody, setGpxBody] = useState("")
  const [loading, setLoading] = useState(true)
  const [currPhotoIdx, setCurrPhotoIdx] = useState(null as number | null)
  const [error, setError] = useState(false)
  const { activityId } = useParams()
  const navigate = useNavigate()

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
  }, [])

  // IMAGES
  let media = [] as ReactNode[]
  let mediaFnames = [] as string[]

  const nextPhoto = () => {
    //console.log("NEXT")
    if (currPhotoIdx !== null && media.length > 0) {
      setCurrPhotoIdx((currPhotoIdx + 1) % media.length)
    }
  }
  const prevPhoto = () => {
    //console.log("PREV")
    if (currPhotoIdx !== null && media.length > 0) {
      setCurrPhotoIdx((media.length + currPhotoIdx - 1) % media.length)
    }
  }
  const handleEsc = () => {
    //console.log("HANDLE ESC", { currPhotoIdx })
    if (currPhotoIdx !== null) {
      //console.log(">> CLOSE PHOTO")
      // photo is displayed, so close it
      return setCurrPhotoIdx(null)
    } else {
      //console.log(">> GO BACK")
      // no photo showing, so go back
      navigate(-1)
    }
  }

  useHotkeys(Key.Escape, handleEsc, [currPhotoIdx])
  useHotkeys(["n", "f", Key.ArrowRight, Key.ArrowDown], nextPhoto, [
    currPhotoIdx,
    media,
  ])
  useHotkeys(["p", "b", Key.ArrowLeft, Key.ArrowUp], prevPhoto, [
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

  const wrap = (msg: string) => {
    return (
      <div className="h-96 grid justify-center items-center">
        <div>{msg}</div>
      </div>
    )
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
    return wrap("Loading Activity...")
  }
  if (error) {
    return wrap("Error!")
  }

  const utcActivityDate =
    moment.utc(activity["Activity Date"], "MMM D, YYYY, H:mm:ss A").unix() *
    1000
  const activityDate = moment(utcActivityDate).format(
    "dddd, MMMM D, YYYY @ h:mm a",
  )

  const calories = parseInt(activity["Calories"])
  let calorieStr = "-"
  if (!isNaN(calories)) {
    calorieStr = calories.toLocaleString()
  }

  let routePoints = [{ lat: 0, lon: 0, ele: 0, time: new Date() } as Point]
  const gpxParser = new GpxParser()
  gpxParser.parse(gpxBody)
  if (gpxParser.tracks && gpxParser.tracks[0]) {
    routePoints = gpxParser.tracks[0].points
  }
  //console.log("POINTS=", routePoints.length)

  return (
    <>
      <SetHeader />
      <div className="flex flex-1 flex-col flex-shrink lg:flex-row">
        <div className="h-[50vh] lg:h-[calc(100vh-4.5rem)] lg:w-[calc(100vw-30rem)]">
          {gpxBody && <MapGl routePoints={routePoints} />}
        </div>
        <div className="pt-4 lg:pt-12 pl-4 pr-4 lg:h-[calc(100vh-4.5rem)] lg:overflow-auto mx-auto lg:w-[30rem]">
          <h1 className="text-center pb-2">{activity["Activity Name"]}</h1>
          <p className="text-slate-600 text-center text-sm">{activityDate}</p>
          <div className="datagrid grid gap-2 grid-cols-2 pt-8">
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
            <p className="activityDataLabel">Max Elevation:</p>
            <p className="activityDataValue">
              <Elevation input={activity["Elevation High"]} />
            </p>
            <p className="activityDataLabel">Calories:</p>
            <p className="activityDataValue value">{calorieStr}</p>
            <p className="activityDataLabel">Gear:</p>
            <p className="activityDataValue value">
              {activity["Activity Gear"] || "-"}
            </p>
            <p className="activityDataLabel">Download:</p>
            <p className="activityDataValue value">
              <a href={`/${activity["Filename"]}`}>GPX</a>
            </p>
          </div>
          <p className="m-auto pl-2 pr-2 pt-8 pb-4 text-sm leading-6 max-w-[30rem]">
            {activity["Activity Description"]}
          </p>
          <div className="pb-12 w-[100%]">
            <ElevChart routePoints={routePoints} />
          </div>
          {media && (
            <div className="grid content-center pt-8 pb-12 lg:pb-4 grid-cols-3 gap-2">
              {media}
            </div>
          )}
        </div>
      </div>
      {media.length > 0 && currPhotoIdx !== null && (
        <div
          className="fixed z-[1001] top-0 left-0 w-full h-full shade cursor-pointer grid content-center justify-center"
          onClick={() => {
            setCurrPhotoIdx(null)
          }}
        >
          <div className="bg-black p-12 pb-4">
            <img
              src={`/${mediaFnames[currPhotoIdx]}`}
              className="cursor-pointer object-contain max-w-[85vw] max-h-[85vh] drop-shadow-xl rounded-lg"
            />
            <div className="flex justify-between text-slate-600 pt-4 pl-4 pr-4 text-xs">
              <p>{mediaFnames[currPhotoIdx].split("/").slice(-1)}</p>
              <p className="text-right">
                {currPhotoIdx + 1} of {media.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Activity

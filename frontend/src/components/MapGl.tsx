import Map, {
  CircleLayer,
  Layer,
  LineLayer,
  NavigationControl,
  Source,
} from "react-map-gl"
import type { MapRef } from "react-map-gl"
import { useRef, useState } from "react"
import type { Feature } from "geojson"
import type { Point } from "gpxparser"
import "mapbox-gl/dist/mapbox-gl.css"

interface MapProps {
  routePoints: Point[]
}

const mapStyleSatellite = "mapbox://styles/mapbox/satellite-streets-v12"
const mapStyleTopo = "mapbox://styles/mapbox/outdoors-v12"

function MapGL({ routePoints }: MapProps) {
  let minLat = routePoints[0].lat
  let minLon = routePoints[0].lon
  let maxLat = routePoints[0].lat
  let maxLon = routePoints[0].lon

  const mapRef = useRef<MapRef>(null)

  for (const point of routePoints) {
    minLat = Math.min(minLat, point.lat)
    minLon = Math.min(minLon, point.lon)
    maxLat = Math.max(maxLat, point.lat)
    maxLon = Math.max(maxLon, point.lon)
  }

  const recenter = () => {
    if (!mapRef.current) {
      return
    }
    mapRef.current.fitBounds(
      [
        [minLon, minLat],
        [maxLon, maxLat],
      ],
      { pitch: 60, padding: 40, duration: 5000 },
    )
  }

  const [mapStyle, setMapStyle] = useState(mapStyleTopo)

  const toggleMap = () => {
    if (!mapRef.current) {
      return
    }
    const newMapStyle =
      mapStyle === mapStyleSatellite ? mapStyleTopo : mapStyleSatellite

    mapRef.current.getMap().setStyle(newMapStyle)
    setMapStyle(newMapStyle)
  }

  setTimeout(recenter, 1000)

  const avgLat = (minLat + maxLat) / 2
  const avgLon = (minLon + maxLon) / 2

  const routeLine: Feature = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: routePoints.map(({ lat, lon }) => [lon, lat]),
    },
    properties: {},
  }
  const routeLineStyle: LineLayer = {
    id: "route",
    type: "line",
    paint: {
      "line-width": 5,
      "line-color": "#ff0000",
    },
  }

  const startPoint: Feature = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [routePoints[0].lon, routePoints[0].lat],
    },
    properties: {},
  }
  const startPointStyle: CircleLayer = {
    id: "start",
    type: "circle",
    paint: {
      "circle-radius": 10,
      "circle-color": "#00ff00",
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 5,
    },
  }
  const endPoint: Feature = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [
        routePoints[routePoints.length - 1].lon,
        routePoints[routePoints.length - 1].lat,
      ],
    },
    properties: {},
  }
  const endPointStyle: CircleLayer = {
    id: "end",
    type: "circle",
    paint: {
      "circle-radius": 10,
      "circle-color": "#ff0000",
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 5,
    },
  }

  return (
    <>
      <div className="relative">
        <div className="absolute z-[1002] left-2 top-2 mapboxgl-ctrl mapboxgl-ctrl-group">
          <div className="tools-box">
            <button onClick={recenter}>
              <svg
                focusable="false"
                viewBox="0 0 24 24"
                aria-hidden="true"
                style={{ fontSize: "20px" }}
              >
                <title>Reset map</title>
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="absolute z-[1002] left-2 top-11 mapboxgl-ctrl mapboxgl-ctrl-group">
          <div className="tools-box">
            <button onClick={toggleMap} className="text-center">
              <svg
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-globe ml-1"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                {" "}
                <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />{" "}
              </svg>
            </button>
          </div>
        </div>
      </div>
      <Map
        ref={mapRef}
        mapboxAccessToken="pk.eyJ1IjoienN0ZWlua2FtcCIsImEiOiJjbG5henR0NGEwMmU3Mm1saWU0YzF0MzM1In0.INYw6WGQM_ST1QZL_PcTtg"
        initialViewState={{
          longitude: avgLon,
          latitude: avgLat,
          zoom: 8,
        }}
        style={{ width: "100%", height: "100%" }}
        dragRotate={true}
        mapStyle={mapStyle}
        terrain={{ source: "mapbox-dem", exaggeration: 1.5 }}
      >
        <NavigationControl showCompass={true} />
        <Source
          id="mapbox-dem"
          type="raster-dem"
          url="mapbox://mapbox.mapbox-terrain-dem-v1"
          tileSize={512}
          maxzoom={14}
        ></Source>
        <Source id="route" type="geojson" data={routeLine}>
          <Layer {...routeLineStyle} />
        </Source>
        <Source id="end-point" type="geojson" data={endPoint}>
          <Layer {...endPointStyle} />
        </Source>
        <Source id="start-point" type="geojson" data={startPoint}>
          <Layer {...startPointStyle} />
        </Source>
      </Map>
    </>
  )
}
export default MapGL

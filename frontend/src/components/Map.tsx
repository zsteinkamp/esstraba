import {
  MapContainer,
  Marker,
  TileLayer,
  Polyline,
  LayersControl,
} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { LatLngExpression } from "leaflet"
import GpxParser from "gpxparser"
import L from "leaflet"

interface MapProps {
  gpxBody: string
  vertMeters: number
}

const Map = ({ gpxBody, vertMeters }: MapProps) => {
  let routePoints = [{ lat: 0, lon: 0 }]
  const gpxParser = new GpxParser()
  gpxParser.parse(gpxBody)
  if (gpxParser.tracks && gpxParser.tracks[0]) {
    routePoints = gpxParser.tracks[0].points
  }

  const positions = routePoints.map(p => [p.lat, p.lon] as LatLngExpression)

  let minLat = routePoints[0].lat
  let minLon = routePoints[0].lon
  let maxLat = routePoints[0].lat
  let maxLon = routePoints[0].lon

  for (const point of routePoints) {
    minLat = Math.min(minLat, point.lat)
    minLon = Math.min(minLon, point.lon)
    maxLat = Math.max(maxLat, point.lat)
    maxLon = Math.max(maxLon, point.lon)
  }

  const avgLat = (minLat + maxLat) / 2
  const avgLon = (minLon + maxLon) / 2

  const deltaLat = maxLat - minLat
  const deltaLon = maxLon - minLon
  const deltaMax = Math.max(deltaLat, deltaLon)

  const zooms = [
    [0.6, 10],
    [0.4, 11],
    [0.1, 12],
    [0.06, 13],
    [0.02, 14],
    [0.015, 15],
    [0.01, 16],
  ]

  let zoom = 16
  for (const k of zooms) {
    if (deltaMax > k[0]) {
      zoom = k[1]
      break
    }
  }

  //console.log("ZOOM", { deltaMax, deltaLat, deltaLon, zoom })

  const startPoint = routePoints[0]
  const startIcon = new L.Icon({
    iconUrl: "/images/marker-start.png",
    iconSize: new L.Point(17, 17),
    iconAnchor: [9, 9],
    className: "map-icon",
  })
  const endPoint = routePoints[routePoints.length - 1]
  const endIcon = new L.Icon({
    iconUrl: "/images/marker-end.png",
    iconSize: new L.Point(17, 17),
    iconAnchor: [9, 9],
    className: "map-icon",
  })

  const showTopo = vertMeters > 50

  return (
    (avgLat && avgLon && (
      <MapContainer
        center={[avgLat, avgLon]}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <LayersControl position="topright">
          <LayersControl.Overlay checked={!showTopo} name="Street">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay checked={showTopo} name="Topographic">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.Overlay>
        </LayersControl>
        <Polyline pathOptions={{ color: "#F00" }} positions={positions} />
        <Marker icon={startIcon} position={[startPoint.lat, startPoint.lon]} />
        <Marker icon={endIcon} position={[endPoint.lat, endPoint.lon]} />
      </MapContainer>
    )) || (
      <p className="text-red-600 italic w-[50vw] h-[50vw] text-center leading-[50vw]">
        Map Error :(
      </p>
    )
  )
}

export default Map

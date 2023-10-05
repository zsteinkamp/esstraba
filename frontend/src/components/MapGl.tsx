import Map, {
  CircleLayer,
  Layer,
  LineLayer,
  NavigationControl,
  Source,
} from "react-map-gl"
import type { Feature } from "geojson"
import type { Point } from "gpxparser"
import "mapbox-gl/dist/mapbox-gl.css"

interface MapProps {
  routePoints: Point[]
  vertMeters: number
}

function MapGL({ routePoints, vertMeters }: MapProps) {
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

  // use outdoors map for anything but flat
  const mapStyle =
    vertMeters < 50
      ? "mapbox://styles/mapbox/streets-v9"
      : "mapbox://styles/mapbox/outdoors-v12"

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
    <Map
      mapboxAccessToken="pk.eyJ1IjoienN0ZWlua2FtcCIsImEiOiJjbG5henR0NGEwMmU3Mm1saWU0YzF0MzM1In0.INYw6WGQM_ST1QZL_PcTtg"
      initialViewState={{
        longitude: avgLon,
        latitude: avgLat,
        zoom: zoom,
      }}
      style={{ width: "100%", height: "100%" }}
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
  )
}
export default MapGL

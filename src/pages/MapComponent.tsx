import { Component } from 'react';
import mapboxgl, { LngLatLike, Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { locationArrays } from './Data';
import { start } from './Data';


interface MapComponentProps {}

interface MapComponentState {}

class MapComponent extends Component<MapComponentProps, MapComponentState> {
  private mapContainer: HTMLDivElement | null = null;

  componentDidMount() {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiaGltYW5zaHUtNDEzIiwiYSI6ImNsb2UyNXF4dTA5NHAybG8xN2E4Y3dybDUifQ.QNDOZArwvDLbSRQb-VGWZQ';

      let pathCoordinates: string[] = [];

// Iterate through locationArrays and extract coordinates
locationArrays.forEach((location) => {
  console.log(`testing location ${location}`)
  pathCoordinates.push(location[0] + ',' + location[1]);
});

// Join the coordinates with semicolons to create the location URL
const locationUrl: string = pathCoordinates.join(';');

console.log("Location URL", locationUrl);

const mapContainer = document.getElementById('map-container'); // Replace with your container element

const map: Map = new mapboxgl.Map({
  container: mapContainer as HTMLElement,
  style: 'mapbox://styles/mapbox/streets-v12',
  center: start,
  zoom: 14,
  accessToken: mapboxgl.accessToken, // Replace with your Mapbox access token
});

async function getRoute(end: LngLatLike) {
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${locationUrl}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
    { method: 'GET' }
  );

  const json = await query.json();
  const data = json.routes[0];
  const route = data.geometry.coordinates;

  const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: route,
    },
  };
  
  if (map.getSource('route')) {
    (map.getSource('route') as mapboxgl.GeoJSONSource).setData(geojson);
  } else {
    map.addSource('route', {
      type: 'geojson',
      data: geojson,
    });
  
    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#3887be',
        'line-width': 5,
        'line-opacity': 0.75,
      },
    });
  }  

}

map.on('load', () => {
  getRoute(start);

  map.addLayer({
    id: 'start',
    type: 'circle',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: start,
            },
          },
        ],
      },
    },
    paint: {
      'circle-radius': 10,
      'circle-color': 'green',
    },
  });

  // Add middle points in the Route
  map.addLayer({
    id: 'middle',
    type: 'circle',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: locationArrays
          .slice(1, locationArrays.length - 1)
          .map((location) => ({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: location,
            },
          })),
      },
    },
    paint: {
      'circle-radius': 10,
      'circle-color': 'blue',
    },
  });

  map.addLayer({
    id: 'end',
    type: 'circle',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: locationArrays[locationArrays.length - 1],
            },
          },
        ],
      },
    },
    paint: {
      'circle-radius': 10,
      'circle-color': 'red',
    },
  });
});
  }


  render() {
    return (
      <div id='map-container'
        ref={(el) => (this.mapContainer = el)}
        style={{ width: '100%', height: '400px' }}
      ></div>
    );
  }
}

export default MapComponent;

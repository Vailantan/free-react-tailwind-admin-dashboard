import { useEffect, useState } from 'react';

let start: [number, number] = [72.861557,19.212009 ];
let middle: [number, number] = [73.09450355771682, 19.209335211943735];
let middle1: [number, number] = [73.16411718299877, 19.22094659590561];
let end: [number, number] = [73.04813854552916, 19.281370522244107];
const locationArrays: [number, number][][] = [];
interface Location {
  location: string;
  lat: number;
  lng: number;
}

interface DataProps {
  locationsData: Location[];
}

function Data({ locationsData }: DataProps): JSX.Element {
 
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const accessToken = 'pk.eyJ1IjoiaGltYW5zaHUtNDEzIiwiYSI6ImNsb2UyNXF4dTA5NHAybG8xN2E4Y3dybDUifQ.QNDOZArwvDLbSRQb-VGWZQ';

    // Build the locations string for the API URL
    const locationsString = locationsData.map(loc => `${loc.lng},${loc.lat}`).join(';');
    console.log(`location string is ${locationsString}`);
    const apiUrl = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${start[0]},${start[1]};${locationsString}?access_token=${accessToken}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((jsonData) => {
        setData(jsonData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [locationsData]);
  
  try {
    data.waypoints.forEach((waypoint: any) => {
      const { waypoint_index, location } = waypoint;

     
      if (!locationArrays[waypoint_index]) {
        locationArrays[waypoint_index] = [];

      }

      
      locationArrays[waypoint_index] = location;
      console.log(`Test ${ locationsData[waypoint_index]}`)
    });
  } catch (error) {}

  console.log("Location, data",locationsData[0]);

  return <div></div>;
}

export default Data;
export { start, middle, middle1, end, locationArrays };

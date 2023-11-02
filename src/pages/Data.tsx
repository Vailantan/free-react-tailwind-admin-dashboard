import React, { useEffect, useState } from 'react';
// import { pathUrl } from './Map';

let start: [number, number] = [73.13059951156671, 19.23967290574368];
let middle: [number, number] = [73.09450355771682, 19.209335211943735];
let middle1: [number, number] = [73.16411718299877, 19.22094659590561];
let end: [number, number] = [73.04813854552916, 19.281370522244107];
const locationArrays: [number, number][][] = [];

function Data(): JSX.Element {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Replace with your Mapbox access token
    const accessToken =
      'pk.eyJ1IjoiaGltYW5zaHUtNDEzIiwiYSI6ImNsb2UyNXF4dTA5NHAybG8xN2E4Y3dybDUifQ.QNDOZArwvDLbSRQb-VGWZQ';

    // Define the URL for the API request
    const apiUrl = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${start[0]},${start[1]};${middle[0]},${middle[1]};${middle1[0]},${middle1[1]};${end[0]},${end[1]}?access_token=${accessToken}`;
    //const apiUrl = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${pathUrl}?access_token=${accessToken}`;

    // Make the API request using the fetch function
    fetch(apiUrl)
      .then((response) => response.json())
      .then((jsonData) => {
        setData(jsonData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Iterate through the waypoints and group locations by waypoint_index
  try {
    data.waypoints.forEach((waypoint: any) => {
      const { waypoint_index, location } = waypoint;

      // If the locationArrays array doesn't have a subarray for this waypoint_index yet, create one
      if (!locationArrays[waypoint_index]) {
        locationArrays[waypoint_index] = [];
      }

      // Add the location into the corresponding subarray based on waypoint_index
      locationArrays[waypoint_index] = location;
    });
  } catch (error) {}

  console.log("Location, data",locationArrays);

  return <div></div>;
}

export default Data;
export { start, middle, middle1, end, locationArrays };

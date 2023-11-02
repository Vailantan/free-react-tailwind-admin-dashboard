import React, { useState } from 'react';
import MapComponent from './MapComponent';
import Data from './Data';

// let pathUrl: string ='';
// let coordinates: string[] = [];

const mapOptions = {
  zoom: 6,
  center: {
    lat: 20.5937, // Centered on India
    lng: 78.9629,
  },
};

const stateData = [
  {
    name: 'Vailantan',
    location: 'Bhiwandi',
    wasteCategory: 'E-Waste',
    weight: '100 kg',
    lat: 19.7515,
    lng: 75.7139,
  },
  {
    name: 'Himanshu',
    location: 'Kalyan',
    wasteCategory: 'Paper',
    weight: '50 kg',
    lat: 26.8467,
    lng: 80.9462,
  },
  {
    name: 'Trevelyn',
    location: 'Dombivali',
    wasteCategory: 'Plastic',
    weight: '75 kg',
    lat: 11.1271,
    lng: 78.6569,
  },
  {
    name: 'Amey',
    location: 'Ulhasnagar',
    wasteCategory: 'Dry Waste',
    weight: '120 kg',
    lat: 15.3173,
    lng: 75.7139,
  },
  // {
  //   name: 'Wesley',
  //   location: 'Thiruvananthapuram',
  //   wasteCategory: 'Glass',
  //   weight: '60 kg',
  //   lat: 10.8505,
  //   lng: 76.2711,
  // },
  // Add more states and their data here
];

export default function Dashboard() {
  const [selectedLocation, setSelectedLocation] = useState(mapOptions.center);
  const [isComponentVisible, setIsComponentVisible] = useState(false);

  const handleClick = () => {
    setIsComponentVisible(true);
  };


  const changeMapLocation = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

    // coordinates.push(selectedLocation.lat+','+selectedLocation.lng);

    // // pathUrl = coordinates.join(';');
    // console.log("Path URL", coordinates);

  return (
    <div>
      <Data/>
      {/* <iframe
        width="1500px"
        height={400}
        src={`https://maps.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}&t=&zoom=6&maptype=roadmap&ie=UTF8&iwloc=&output=embed`}
      ></iframe> */}
      <button onClick={handleClick}>Load Map on Click</button><br/><br/><br/>
      {isComponentVisible && <MapComponent />}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Location
              </th>
              <th scope="col" className="px-6 py-3">
                Waste Category
              </th>
              <th scope="col" className="px-6 py-3">
                Weight
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {stateData.map((state, index) => (
              <tr key={index} className=" border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" onClick={() => changeMapLocation(state.lat, state.lng)}>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {state.name}
                </th>
                <td className="px-6 py-4">
                  {state.location}
                </td>
                <td className="px-6 py-4">
                  {state.wasteCategory}
                </td>
                <td className="px-6 py-4">
                  {state.weight}
                </td>
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// export {pathUrl};
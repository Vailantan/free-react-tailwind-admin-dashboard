import { useState } from 'react';
import MapComponent from './MapComponent';
import Data, { locationArrays } from './Data';
import axios from 'axios';
import  { useEffect} from 'react';
import { db } from '../Configuration/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

interface User {
  id: string;
  username: string;
  wasteCategories: string;
  rubberQty: number;
  paperQty: number;
  metalQty:number;
  ewasteQty: number;
  glassQty: number;
  plasticQty: number;
  plasticWeight: number;
  metalWeight: number;
  glassWeight: number;
  ewasteWeight: number;
  rubberWeight: number;
  paperWeight: number;
  status: string;
  location: string;
  lat?: number;
  lng?: number;
}

interface User2 
{
  id: string;
  bin_id:string;
  weight:number;
  location:string;
  username:string;
  lat?: number;
  lng?: number;
}

async function getLatLng(location: string) {
  try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);

      if (response.data[0]) {
          return {
              lat: parseFloat(response.data[0].lat),
              lng: parseFloat(response.data[0].lon)
          };
      } else {
          console.log('No results found');
          return null;
      }
  } catch (error) {
      console.error(error);
      return null;
  }
}





const mapOptions = {
  zoom: 6,
  center: {
    lat: 20.5937, 
    lng: 78.9629,
  },
};


export default function Dashboard() {
  const [users, setUsers] = useState<User2[]>([]);
  const [locations, setLocations] = useState<Array<{location: string, lat: number, lng: number}>>([]);

  useEffect(() => {
    const fetchData = async () => {
      



      const usersCollectionRef = collection(db, 'inventory'); // Reference the specific Firestore path
      const usersSnapshot = await getDocs(usersCollectionRef);
      const usersData = usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as User2);
    
      const locationsData = [];

      for (const user of usersData) {
        
        const latLng = await getLatLng(user.location);
        if (latLng) {
          user.lat = latLng.lat;
          user.lng = latLng.lng;

          locationsData.push({location: user.location, lat: latLng.lat, lng: latLng.lng});
        }
      
      }
      

      setUsers(usersData);
      setLocations(locationsData);
      console.log(` latitude is ${locationArrays[0]}`);
    };

    fetchData();
  }, []);

  const [selectedLocation, setSelectedLocation] = useState(mapOptions.center);
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  

  const handleClick = () => {
    setIsComponentVisible(true);
  };


  const changeMapLocation = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };



  return (
    <div>
      <Data locationsData={locations}/>
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
                Bin ID
              </th>
              <th scope="col" className="px-6 py-3">
                Location
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
          {users.map(user => (
    <tr key={user.username} className=" border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" onClick={() => changeMapLocation(state.lat, state.lng)}>
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {user.username}
      </th>
      <td className="px-6 py-4">
        {user.bin_id}
      </td>
      <td className="px-6 py-4">
        {user.location}
      </td>
     
      <td className="px-6 py-4">
        {`${user.weight}KG`}
      </td>
    </tr>
  ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


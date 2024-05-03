import  { useEffect,useState} from 'react';
import { db } from '../Configuration/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
interface User2 
{
  id: string;
  bin_id:string;
  weight:number;
  location:string;
  username:string;

}

const TableOne = () => {
  const [users, setUsers] = useState<User2[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      



      const usersCollectionRef = collection(db, 'inventory'); // Reference the specific Firestore path
      const usersSnapshot = await getDocs(usersCollectionRef);
      const usersData = usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as User2);
    
     
      

      setUsers(usersData);
   
    };

    fetchData();
  }, []);
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
    
      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Name
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Weight
            </h5>
          </div>
         
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Amount
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Location
            </h5>
          </div>
        </div>

        <div className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-4">
          {users.map(user=>(
            <>
  <div  className="flex items-center gap-3 p-2.5 xl:p-5">
  <p className="hidden text-black dark:text-white sm:block">{user.username}</p>
</div>
<div className="flex items-center justify-center p-2.5 xl:p-5">
            <p className="text-black dark:text-white">{user.weight}</p>
          </div>
          <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
            <p className="text-black dark:text-white">590 Rs</p>
          </div>
          <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
            <p className="text-black dark:text-white">{user.location}</p>
          </div>
</>


          ))}

        </div>

      

      


       

      </div>
    </div>
  );
};

export default TableOne;

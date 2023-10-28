import { useEffect, useState } from 'react';
import { db } from '../Configuration/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
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
}

const Verify = () => {
  const [users, setUsers] = useState<User[]>([]);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const usersCollectionRef = collection(db, 'users', 'brz@gmail.com', 'submits'); // Reference the specific Firestore path
  
      const usersSnapshot = await getDocs(usersCollectionRef);
  
      setUsers(usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as User));
      
    };
    fetchData();
  }, []);

  const handleRowClick = (user: User) => {
 
    navigate('/accept-reject', { state: { user } });

};


  return (
<div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
  <div className="flex flex-col">
    <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
      <div className="p-2.5 xl:p-5">
        <h5 className="text-sm font-medium uppercase xsm:text-base">
          Username
        </h5>
      </div>
      <div className="p-2.5 text-center xl:p-5">
        <h5 className="text-sm font-medium uppercase xsm:text-base">
          Waste Categories
        </h5>
      </div>
      <div className="p-2.5 text-center xl:p-5">
        <h5 className="text-sm font-medium uppercase xsm:text-base">
          Total Qty
        </h5>
      </div>
      <div className="hidden p-2.5 text-center sm:block xl:p-5">
        <h5 className="text-sm font-medium uppercase xsm:text-base">
          Total Weight
        </h5>
      </div>
      <div className="hidden p-2.5 text-center sm:block xl:p-5">
        <h5 className="text-sm font-medium uppercase xsm:text-base">
          Status
        </h5>
      </div>
    </div>
    {users.map(user => (
  // Add a condition to check if username is not null before rendering
  user.username != null && (
    <div key={user.username} onClick={() => handleRowClick(user)} className={`grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5 hover:bg-gray-200 dark:hover-bg-meta-5`}>
      <div className="flex items-center gap-3 p-2.5 xl:p-5">
        <p className="hidden text-black dark:text-white sm:block">{user.username}</p>
      </div>

      <div className="flex items-center justify-center p-2.5 xl:p-5">
        <p className="text-black dark:text-white">{user.wasteCategories}</p>
      </div>

      <div className="flex items-center justify-center p-2.5 xl:p-5">
        <p className="text-black dark:text-white">{Number(user.paperQty) + Number(user.glassQty) + Number(user.rubberQty) + Number(user.metalQty) + Number(user.ewasteQty) + Number(user.plasticQty)}</p>
      </div>

      <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
        <p className="text-black dark:text-white">{`${Number(user.plasticWeight) + Number(user.metalWeight) + Number(user.ewasteWeight) + Number(user.rubberWeight) + Number(user.paperWeight) + Number(user.glassWeight)}KG`}</p>
      </div>

      <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
        <p className="text-black dark:text-white">{user.status}</p>
      </div>
    </div>
  )
))}

  </div>
</div>

  );
};

export default Verify;
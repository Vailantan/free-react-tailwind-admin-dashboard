// AcceptReject.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db, storage } from '../Configuration/firebaseConfig';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import "../style/Buttons.css"
import ReactApexChart from 'react-apexcharts';
interface User {
  username: string;
  wasteCategories: string;
  totalQty: number;
  plasticQty: number;
  paperQty: number;
  rubbberQty: number;
  glassQty: number;
  ewasteQty: number;
  metalQty: number;
  totalWeight: number;
  status: string;
  imgPath: string;
}

const AcceptReject = () => {
  const [plasticQty,setplasticQty] = useState();
  const [glassQty,setglassQty] = useState();
  const [rubberQty,setrubberQty] = useState();
  const [ewasteQty,setewasteQty] = useState();
  const [paperQty,setpaperQty] = useState();
  const [metalQty,setmetalQty] = useState();
  console.log(`${Number(plasticQty)} plastic quantity`)


  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state as { user: User };
  const [imageUrl, setImageUrl] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', user.user.username));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setplasticQty(userData.plasticQty);
        setglassQty(userData.glassQty);
        setrubberQty(userData.rubberQty);
        setewasteQty(userData.ewasteQty);
        setpaperQty(userData.paperQty);
        setmetalQty(userData.metalQty);
      }
    };
  
    fetchData();
  }, [user.user.username]);
  const [chartState, setChartState] = useState({
    series: [Number(paperQty),Number(rubberQty), Number(glassQty), Number(metalQty), Number(ewasteQty),Number(plasticQty)],
    options: {
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['Paper', 'Rubber','Glass', 'Metal', 'E-Waste','Plastic'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    }
  });
  useEffect(() => {
    const fetchImage = async () => {
      const imageRef = ref(storage, user.user.imgPath);
     
      const url = await getDownloadURL(imageRef);

      setImageUrl(url);
    };
    fetchImage();
  }, [user.user.imgPath]);
  const handleAccept = async () => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', user.user.username));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      const userRef = doc(db, 'users', docId);
      await setDoc(userRef, { status: 'Verified' }, { merge: true });
    }
  
    navigate('/verify');
  };

  const handleReject = async () => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', user.user.username));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      const userRef = doc(db, 'users', docId);
      await setDoc(userRef, { status: 'Rejected' }, { merge: true });
    }
  
    navigate('/verify');
  };

  return (
    <div>
      {imageUrl && <img src={imageUrl} style={{maxWidth:"40%",height:"auto"}} alt="User" />}
      <div style={{    width: "100%", position: "absolute",  top: "79%",left:"55%"
}}> 
      <button style={{    left: "-15px",width: "17%"}} className="button-3" onClick={handleAccept}>Accept</button>
      <button className="button-3" style={{backgroundColor:"red",width: "17%"}} onClick={handleReject}>Reject</button>
      </div>
      <div id="chart" style={{position: "absolute",
    left: "633px",
    top: "200px"
}}>
      <ReactApexChart options={chartState.options} series={chartState.series} type="pie" width={380} />
    </div>
     
      

    </div>

  );
};

export default AcceptReject;

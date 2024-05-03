import { useState, useEffect , useRef,ChangeEvent} from "react";
import * as React from "react";
import CircularProgress from "@mui/joy/CircularProgress";
import "/src/style/verify.css";
import "react-multi-carousel/lib/styles.css";
import Button from '@mui/material/Button';
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import PersonIcon from "@mui/icons-material/Person";
import Typography from "@mui/joy/Typography";
import Loader1 from "../common/Loader1";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Modal from '@mui/material/Modal';
import Carousel  from "react-multi-carousel";
import Box from '@mui/material/Box';
import { db } from '../Configuration/firebaseConfig';
import {  doc, updateDoc ,getDoc,setDoc} from 'firebase/firestore';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 4 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
    slidesToSlide: 3 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 767, min: 464 },
    items: 2,
    slidesToSlide: 1 // optional, default to 1.
  }
};

interface Item {
  Item_name: string;
  Category: string;
  Qty: string;
  Weight: string;
  accept: string;
  images: string[];
  verify: boolean;
  response:string;
}


interface UserData {
  username: string;
  items: Item[];
  date: string;
  bin_id: string;
  email:string;

}


const Verify: React.FC = () => {  
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
  const [textValue, setTextValue] = useState('');
  const location = useRef("");
  const globalWeight = useRef(0);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [counter, setCount] = useState(0);
  const [disable, setDisable] = useState(true);
  const totalItem =useRef(0);
  const scrollableDivRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const [selectedToggle, setSelectedToggle] = useState<string | null>(null);
  const [view, setView] = React.useState("list");
  const global_count =useRef(0);
  const [open, setOpen] = React.useState(false);
  const stylemodal = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const email= userData.find((user) => user.bin_id === selectedUser)?.email || ""
  const handleClick = async () => {

  
  const username= userData.find((user) => user.bin_id === selectedUser)?.username || ""
  
  console.log(`address is   and selected Use is ${selectedUser}`)
  const documentPath = `MobileAppUsers/${email}/bindata/${selectedUser}`;

  try {
    // Update the data with status 'verified'
    await updateDoc(doc(db, documentPath), { bin_status: 'Verified' });
   
  } catch (error) {
    console.error('Error updating data:', error);
  }
  const userRef = doc(db, 'MobileAppUsers', email);

try {
    const docSnapshot = await getDoc(userRef);
    
    if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const address = userData.address;
       location.current = address;
        console.log("Address:", address);
    } else {
        console.log("Document does not exist.");
    }
} catch (error) {
    console.error("Error getting document:", error);
}
const userRef2 = doc(db, 'MobileAppUsers', email, 'bindata', selectedUser);
try {
  const docSnapshot = await getDoc(userRef2);
  
  if (docSnapshot.exists()) {
    const userData = docSnapshot.data();
    const items: Item[] = userData.items || []; // Define items as an array of Item interface
    
    let totalWeight = 0;
    
    // Iterate through the items array
    items.forEach((item: Item) => { // Explicitly type item as Item
        // Convert the weight field to a number and add to totalWeight
        if(item.accept ==="true")
        {
          totalWeight += parseFloat(item.Weight.toString()) || 0;
          console.log(` weight is ${totalWeight}`)
        }
        
    });
    console.log(`  Total weight is ${totalWeight}`)

   globalWeight.current = totalWeight;
    console.log("Total Weight of all items:", totalWeight);
  } else {
      console.log("Document does not exist.");
  }
} catch (error) {
  console.error("Error rgetting document:", error);
}
const inventoryData = {
  username:username ,
  location: location.current,
  weight: globalWeight.current,
  bin_id: selectedUser,
};

  console.log(inventoryData);
  const inventoryRef = doc(db, 'inventory', selectedUser);

  try {
    await setDoc(inventoryRef, inventoryData);
    console.log('Data added successfully to Firestore!');
  } catch (error) {
    console.error('Error adding data to Firestore:', error);
  }
    setOpen(true);
    fetchData1();
  };


  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const handleButtonChange = (
    event: React.MouseEvent<HTMLElement>,
    nextView: string
  ) => {
    setView(nextView);
  };
  const fetchData1 = async () => {
    const response = await fetch("https://valley.pythonanywhere.com/verify-bins");
    const data = await response.json();
    setSelectedUser(data[0].bin_id);
    setSelectedItemIndex(0);
    setUserData(data);
  };
  useEffect(() => {
    
     totalItem.current= userData.find((user) => user.bin_id === selectedUser)?.items?.length || 0
  }, [selectedUser]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://valley.pythonanywhere.com/verify-bins");
      const data = await response.json();
      setSelectedUser(data[0].bin_id);
      setSelectedItemIndex(0);
      setUserData(data);
      console.log(data)
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (counter == 100) setDisable(false);
    else setDisable(true);
  }, [counter]);

  const handleUserSelect = (bin_id: string) => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop = 0;
    }
    console.log("=================");
    console.log(`Bin id is ${bin_id} from handle user`);
              
    const selectedIndex = userData.findIndex((user) => user.bin_id === bin_id);
    console.log(`selected user index is ${selectedIndex}`)
    if(userData.length%2===0)
    {
      console.log("true")
      var centerIndex = Math.floor(userData.length / 2)-1;
    }
    else 
    {var centerIndex = Math.floor(userData.length / 2);}

    if (selectedIndex !== centerIndex) {
      const selectedUser1 = userData[selectedIndex];
      const centerUser = userData[centerIndex];

      userData[selectedIndex] = centerUser;
      userData[centerIndex] = selectedUser1;

      setUserData([...userData]);
    }

    setSelectedUser(bin_id);
    setSelectedItemIndex(0);
    countItem(selectedUser);
   
  };

  const handleAcceptReject = async (value: string) => {
    try {
      const updatedUserData = await Promise.all(userData.map(async (user) => {
        if (value === "false") {
          console.log("Rejected item");
          handleOpenModal();
        }
        if (user.bin_id === selectedUser) {
          user.items[selectedItemIndex].accept = value;
          user.items[selectedItemIndex].verify = true;
          console.log(`Verified equal to true for ${selectedUser}`);
          
  
          const documentPath = `MobileAppUsers/${email}/bindata/${selectedUser}`;
       
          const docRef = doc(db, documentPath);

          // Fetch the existing data
          const docSnapshot = await getDoc(docRef);
          if (docSnapshot.exists()) {
            const existingData = docSnapshot.data();
        
            // Update the 'accept' field to true for the first item in the 'Items' array
            if (existingData && Array.isArray(existingData.items)) {
              existingData.items[selectedItemIndex].accept = value;
        
              // Save the updated data back to Firestore
              await updateDoc(docRef, existingData);
            } else {
              console.error('Invalid data structure or missing Items array.');
            }
          } else {
            console.error('Document does not exist.');
          }
        }
        return user;


      }));
  
      // Now set the updated data to state
      setUserData(updatedUserData);
      countItem(selectedUser);
      

    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  useEffect(() => {
    countItem(selectedUser);
  }, [userData, selectedUser]);

  const countItem = async (id: string) => {
    var count = 0;
    console.log("=================");
    console.log(`bin id is ${id} from countItem `);
    userData.map((user) => {
      if (user.bin_id === id) {
        user.items.map((item) => {
          if (item.verify === true) {
            console.log("chagning count");
            count = count + 1;
          }
        });
      }
    });

    console.log("=================");
    console.log(`total item : ${totalItem.current}`);
    const calculatedCount = (count * 100) / totalItem.current;
    global_count.current = calculatedCount;
    console.log(`value of count ${count}`);
    setCount(calculatedCount);
    console.log(`global count  is ${global_count.current}`);
    console.log("=================");
  };

  const handleNextItem =async () => {


    if (selectedItemIndex < totalItem.current - 1) {
      setLoading(true); // Set loading state to true when starting to load next item
      const documentPath = `MobileAppUsers/${email}/bindata/${selectedUser}`;
      const docRef = doc(db, documentPath);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const existingData = docSnapshot.data();
        // Update the 'accept' field to true for the first item in the 'Items' array
        if (existingData && Array.isArray(existingData.items)) {
          existingData.items[selectedItemIndex].response = textValue;
          setTextValue("");
          // Save the updated data back to Firestore
          await updateDoc(docRef, existingData);
        } else {
          console.error("Invalid data structure or missing Items array.");
        }
      } else {
        console.error("Document does not exist.");
      }
      setSelectedItemIndex((prevIndex) => prevIndex + 1);
      setLoading(false); // Reset loading state when done loading next item
    }
  };
  const handleTextArea = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setTextValue(value);
    console.log(textValue); // Logs the value whenever it changes
  };
  const handlePrevItem = () => {
    setSelectedItemIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const currentItem = selectedUser
    ? userData.find((user) => user.bin_id === selectedUser)?.items[
        selectedItemIndex
      ]
    : null;

  return (
    <div>
      {userData.length == 0 && <Loader1 />}
      {loading && <Loader1 />}
      {userData.length > 0 && (
        <>
        <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={stylemodal}>
        <Typography id="modal-modal-title"  component="h2">
            Reject Feedback
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
       
            <textarea rows={2} cols={40} style={{ border: '1px solid black'}} onChange={handleTextArea}>

              
            </textarea>
          </Typography>
        </Box>
      </Modal>
          <div className ="verifycontent">
            <div>
              <div  className="usercontent">
                <div>
                  {currentItem && (
                    <div style={{width:"255px"}}>
                     <Typography 
                        sx={{color:"white"}}
                        level="h1"
                        noWrap={false}
                        variant="plain"
                        >
                          {currentItem.Item_name.toUpperCase()}
                          {currentItem.accept==="false" && !loading && (<span style={{position:"absolute",top:"121px",left:"285px"}}>  <img  style={{width:"49px"}} src="https://i.imgur.com/Jb2epuK.gif"></img></span> )}
                        {currentItem.accept==="true" && !loading &&( <span style={{position:"absolute",top:"108px"}}>  <img style={{width:"70px"}} src="	https://i.imgur.com/pVaIIIN.gif"></img></span> )}
                          {currentItem.accept==="" && !loading && (<span style={{position:"absolute",top:"108px"}}>  <img style={{width:"70px"}} src="		https://i.imgur.com/Xh33s5y.gif"></img></span> )}
                        </Typography>
                      
                      <Typography
                        sx={{color:"white"}}
                        level="h3"
                        noWrap={false}
                        variant="plain"
                        >
                          Category: {currentItem.Category}
                </Typography>
                <Typography
                        sx={{color:"white"}}
                        level="h3"
                        noWrap={false}
                        variant="plain"
                        >
                          Quantity: {currentItem.Qty}
                </Typography>
                <Typography
                        sx={{color:"white"}}
                        level="h3"
                        noWrap={false}
                        variant="plain"
                        >
                          Weight: {currentItem.Weight}
                </Typography>
                      

                      <div>
                          <br></br>
                        <button  className="accept" onClick={() => handleAcceptReject("true")}> ACCEPT </button>
                        <button  className="deny" onClick={() => handleAcceptReject("false")} >  DENY </button>
                        
                      </div>
                   
                    
                    </div>
                  )}
                </div>
                <div>
                    <CircularProgress
                      color="primary"
                      sx={{ "--CircularProgress-size": "300px"}}
                      determinate
                      value={global_count.current}
                      
                    >
                      <img src="avaatar.svg" style={{ maxWidth: "85%" }}></img>
                    </CircularProgress>
                </div>

              </div>
              <div style={{width:"900px"}}>
                  {currentItem && (
            
                <div style={{marginTop:"28px"}}>
                  <h3>Photo Slider</h3>
                  <div >
                    <Carousel
                      responsive={responsive}
                      autoPlay={true}
                      swipeable={true}
                      draggable={true}
                      showDots={true}
                      infinite={true}
                      partialVisible={false}
                      dotListClass="custom-dot-list-style"
                      >
                      {currentItem.images.map((imageUrl, index) => {
                        return (
                          <div className="slider" key={index}>
                            <img src={imageUrl} alt="trash" />
                          </div>
                        );
                      })}
                    </Carousel>
                  </div>
                  

                  
                 
                  <button onClick={handlePrevItem} type="button" className="text-white bg-blue-700 hover:bg-blue-800 ring-4 focus:outline-none ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
<svg className="w-4 h-4" style={{transform:"rotate(180deg)"}} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
</svg>  
</button>

        <button
          onClick={handleNextItem}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 ring-4 focus:outline-none ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </button>
      
                 
                  <Button variant="contained" color="success" disabled={disable} onClick={handleClick} style={{left: "60%"}}>
                   Submit
                 </Button>
                  
                  <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}  sx={{ zIndex: '2'}}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%'}}
        >
          Bin Added into Inventory!
        </Alert>
      </Snackbar>
                </div>
            
            )} 
          
              </div>
            
            </div>
            <div className="username">
                
                <div className="scrollable-div" ref={scrollableDivRef}>
                  
                  <ToggleButtonGroup
                    orientation="vertical"
                    value={view}
                    exclusive
                    onChange={handleButtonChange}
                  >
                    {userData.map((user,index) => (
                      <ToggleButton
                        value={user.bin_id}
                        aria-label={user.bin_id}
                        key={`${user.bin_id}`}
                        onClick={() => {
                          handleUserSelect(user.bin_id);
                          setSelectedToggle(user.bin_id);
                          console.log(`The index value is ${index}`);
                        }}
                        style={{
                          left:
                            selectedToggle === user.bin_id ? "-32.5px" : "0px",
                          marginTop: "10px",
                          borderRadius: "50px",
                          width:
                            selectedToggle === user.bin_id ? "170%" : "140%",
                          backgroundColor:
                            selectedToggle === user.bin_id
                              ? "lightgray"
                              : "white",
                          transition: "width 0.2s ease-out",
                        }}
                      >
                        <PersonIcon />
                        {user.username}-{user.bin_id}
                      </ToggleButton>
                    ))}
                     
                  </ToggleButtonGroup>
                </div>
            </div>
          </div>
           
          
          
        </>
      )}
    </div>
  );
};

export default Verify;

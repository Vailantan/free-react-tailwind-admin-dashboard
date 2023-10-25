import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth ,db, storage } from '../Configuration/firebaseConfig';
import { } from '../Configuration/firebaseConfig';
import "../style/Login.css";

type UserData = {
  EmailId: string;
  Password: string;
  // Add other properties here as needed
};

export default function Home() {
  const navigate = useNavigate();
  let getdata: Record<string, UserData> = {};

  useEffect(() => {
    Axios.get('https://e-waste-22842-default-rtdb.firebaseio.com/register.json')
      .then((res) => (getdata = res.data))
      .catch((err) => console.log(err));
  }, []);

  const register = (event: React.FormEvent) => {
    event.preventDefault();
 
    
    const email = (event.target as HTMLFormElement).elements.email.value;
    const password = (event.target as HTMLFormElement).elements.password.value;
    // let flag = true;



    signInWithEmailAndPassword(auth,email,password).then(data=>{
      navigate("/");
    }).catch(err=>{
      alert("Invalid credential");
    })

    // const keys = Object.keys(getdata);
    // for (let i = 0; i < keys.length; i++) {
    //   const user = getdata[keys[i]];
    //   if (user.EmailId === email && user.Password === password) {
    //     alert("Login Successful");
    //     navigateDashboard();
    //     flag = false;
    //   }
    // }

    // if (flag) {
    //   alert("Login unsuccessful");
    //   // navigate('/home');
    // flag = true;
    // }
  };

  const navigateDashboard = () => {
    navigate('/home');
  };

  const inputs = document.querySelectorAll(".input");
  console.log(inputs);

  function addcl(this: HTMLInputElement) {
    let parent = this.parentNode!.parentNode as HTMLElement;
    parent.classList.add("focus");
  }

  function remcl(this: HTMLInputElement) {
    let parent = this.parentNode!.parentNode as HTMLElement;
    if (this.value === "") {
      parent.classList.remove("focus");
    }
  }

  inputs.forEach((input) => {
    input.addEventListener("focus", addcl);
    input.addEventListener("blur", remcl);
  });

  return (
    <>
     <img className="" src="	https://i.imgur.com/0fh06Fw.png
" alt="Logo" style={{    width: "5%",
  left: "43px", top:"25px",position:"absolute"}} />
      <img className="wave" src="wave.png" alt="Wave" />
      <div className="container">
        <div className="img">
          <img src="waste.svg" alt="Waste" />
        </div>
        <div className="login-content">
          <form onSubmit={register}>
          
            <h2 className="title">Welcome</h2>
            <div className="input-div one">
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div className="div">
               
                <input type="email" name="email" placeholder='Email' />
              </div>
            </div>
            <div className="input-div pass">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
               
                <input type="password" className="input" name="password"  placeholder='Password' />
              </div>
            </div>
            <input type="submit" className="btn1" style={{	backgroundImage: "linear-gradient(to right, #32be8f, #38d39f, #32be8f)"}} value="Login" />
          </form>
        </div>
      </div>
    </>
  );
}

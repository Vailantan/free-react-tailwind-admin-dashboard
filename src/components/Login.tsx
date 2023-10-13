import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
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
    // console.log(event.target.email.value);
    
    const email = (event.target as HTMLFormElement).elements.email.value;
    const password = (event.target as HTMLFormElement).elements.password.value;
    let flag = true;

    const keys = Object.keys(getdata);
    for (let i = 0; i < keys.length; i++) {
      const user = getdata[keys[i]];
      if (user.EmailId === email && user.Password === password) {
        alert("Login Successful");
        navigateDashboard();
        flag = false;
      }
    }

    if (flag) {
      alert("Login unsuccessful");
      // navigate('/home');
    flag = true;
    }
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
      <img className="wave" src="wave.png" alt="Wave" />
      <div className="container">
        <div className="img">
          <img src="waste.svg" alt="Waste" />
        </div>
        <div className="login-content">
          <form onSubmit={register}>
            <img src="avaatar.svg" alt="Avatar" />
            <h2 className="title">Welcome</h2>
            <div className="input-div one">
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div className="div">
                <h5>Email Id</h5>
                <input type="email" className="input" name="email" />
              </div>
            </div>
            <div className="input-div pass">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <h5>Password</h5>
                <input type="password" className="input" name="password" />
              </div>
            </div>
            <input type="submit" className="btn1" style={{	backgroundImage: "linear-gradient(to right, #32be8f, #38d39f, #32be8f)"}} value="Login" />
          </form>
        </div>
      </div>
    </>
  );
}

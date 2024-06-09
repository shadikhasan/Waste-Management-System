import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useStateContext } from "../contexts/ContextProvider";

import LOGIN_COVER from "../assets/green.jpg";
import {ResetPassword} from "../components";



const Login = () => {
  const { authToken, setAuthToken, setAuthUsername } = useStateContext();
  const navigate = useNavigate('/');

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isForgot, setIsForgot] = useState(false);

  const handleReset = () => {
    setIsForgot(!isForgot);
  }

  const notify_wrong_password = (e) => toast.error(e);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`${import.meta.env.VITE_BASEURL}/auth/login/`);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASEURL}/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!data.errors) {
        localStorage.setItem("token", data.token.access);
        setAuthUsername(username);
        setAuthToken(data.token.access);
      } else {
        notify_wrong_password("Incorrect username or password!");
      }
    } catch (error) {
      console.log(error.message);
      notify_wrong_password("Incorrect username or password!");
    }
  };

  return (
    <>
      {!isForgot ? (
        <div className="w-full h-screen flex items-start">
          <div className="relative w-1/2 h-full flex flex-col item-center">
            <div className="absolute flex flex-col top-[10%] left-[10%]">
              <p className="text-2xl text-[#2c2b2b] font-bold">Welcome To</p>
              <p className="text-3xl text-[#2c2b2b] font-extrabold">
                Waste Management System
              </p>
            </div>
            <img src={LOGIN_COVER} alt="" className="h-full object-cover" />
          </div>

          <div className="w-1/2 h-full flex flex-col py-8 px-14 justify-between bg-[#f5f5f5]">
            <h1 className="text-[#060606] text-xl font-semibold">
              {" "}
              Waste Management System
            </h1>
            <div className="w-full flex flex-col">
              <h2 className="font-semibold text-3xl mt-4 mb-1">Log In</h2>
              <p className="text-base mb-3">
                Welcome back! Provide you username and password to sign in.
              </p>
              <form onSubmit={handleSubmit} className="w-full flex flex-col">
                <input
                  className="w-full text-black py-2 my-1 bg-transparent border-b-2 outline-none focus:outline-none focus:border-[#03C9D7]"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  className="w-full text-black py-2 my-1 bg-transparent border-b-2 outline-none focus:outline-none focus:border-[#03C9D7]"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 my-3 bg-[#03C9D7] rounded-md text-white hover:bg-[#1e666b]"
                >
                  Log in
                </button>
              </form>
              <div className="w-full flex justify-center items-center p-3">
                <p>Forget Password? </p>
                <button className="px-3 text-[#03C9D7] hover:font-bold" onClick={handleReset}>
                  Click
                </button>
              </div>
            </div>
            <div className="w-full flex items-center justify-center">
              <p className=" text-gray-700 text-center">
                © 2024 All rights reserved
              </p>
            </div>
          </div>
        </div>
      ) : (
        <ResetPassword handleReset={handleReset}/>
      )}
      <ToastContainer/>
    </>
  );
};

export default Login;

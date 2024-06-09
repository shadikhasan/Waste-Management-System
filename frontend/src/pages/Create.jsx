import React, { useEffect, useState } from 'react'
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Create = () => {
  const {authToken} = useStateContext();
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const nofify_error = (e) => toast.error(e);

  const nofify_success = (e) => {
    setUsername("");
    setFirst_name("");
    setLast_name("");
    setEmail("");
    setPassword2("");
    setPassword("");
    toast.success(e);
  }

  const navigate = useNavigate();

  useEffect(() => {
    if(authToken === "") {
      navigate('/');
    }
  },[])
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if( password != password2) {
      nofify_error("Password and confirm password did not match!");
      return;
    }
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASEURL}/users/`, {
      username,
      first_name,
      last_name,
      email,
      password
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
    if(!res.data) {
      nofify_error("Email or username already exist!")
    } else {
      nofify_success("User created successfully!");
    }
    } catch (error) {
      
    }
  }
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div className="">
      <div className="w-full flex flex-col">
        <div className="flex justify-center items-center">
          <h2 className="font-semibold text-xl mt-4 mb-1 pb-8">
            Create A New User Here
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col px-20">
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
            type="text"
            placeholder="First Name"
            value={first_name}
            onChange={(e) => setFirst_name(e.target.value)}
            required
          />
          <input
            className="w-full text-black py-2 my-1 bg-transparent border-b-2 outline-none focus:outline-none focus:border-[#03C9D7]"
            type="text"
            placeholder="Last Name"
            value={last_name}
            onChange={(e) => setLast_name(e.target.value)}
            required
          />
          <input
            className="w-full text-black py-2 my-1 bg-transparent border-b-2 outline-none focus:outline-none focus:border-[#03C9D7]"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <input
            className="w-full text-black py-2 my-1 bg-transparent border-b-2 outline-none focus:outline-none focus:border-[#03C9D7]"
            type="password"
            placeholder="Confirm Password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-2 my-3 bg-[#03C9D7] rounded-md text-white hover:bg-[#1e666b]"
          >
            Cretae User
          </button>
        </form>
      </div>
    </div>
    <ToastContainer/>
    </div>
  )
}

export default Create

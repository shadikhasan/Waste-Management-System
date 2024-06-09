import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPasswordComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [tokenEndpint, setTokenEndpoint] = useState("");
  const path = location.pathname;

  function extractResetTokenFromURL(url) {
    const pattern = /\/auth\/reset-password\/([^/]+)\/([^/]+)/;
    const matches = url.match(pattern);
    if (matches && matches.length === 3) {
      return matches[1] + '/' + matches[2];
    }
    return null;
  }

  useEffect(() => {
    setTokenEndpoint(extractResetTokenFromURL(path))
  },[])

  const handleSubmitForChangePassword = async (e) => {
    e.preventDefault();
    console.log(tokenEndpint)
    if (password != password2) {
      toast.error("Password and confirm password have to be same!")
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASEURL}/auth/reset-password/${tokenEndpint}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );
      const data = await response.json();

      if (!data.errors) {
        toast.success('Password has been send successfully!')
        navigate("/auth/login");
      } else {
        toast.error('Token Expired!')
        navigate("/auth/login");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
          <div className=" bg-gray-200 rounded-lg shadow-lg w-3/4 sm:w-5/6 md:w-2/4 lg:w-1/3 px-8 py-6">
            <h2 className="text-center text-green-800 text-2xl font-bold mb-4 uppercase">
              Your Password
            </h2>
            <form
              onSubmit={handleSubmitForChangePassword}
              className="flex flex-col items-center"
            >
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 bg-white border border-gray-300 rounded-md px-4 mb-4 focus:outline-none focus:border-green-500"
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="w-full h-12 bg-white border border-gray-300 rounded-md px-4 mb-4 focus:outline-none focus:border-green-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:bg-green-600 transition duration-300"
              >
                Reset Password
              </button>
            </form>
          </div>
          <ToastContainer/>
        </div>
  )
}

export default ResetPasswordComponent

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiTicktick } from "react-icons/si";

// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const ResetPassword = ({handleReset}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [sent, setSent] = useState(false);
  const [tokenEndpint, setTokenEndpoint] = useState("");

  // const notify = () => toast.error("Email is not valid!");
  // const notify_p = () =>
  //   toast.error("Password and Confirm Password are not matched!");
  // const notify_email = () =>
  //   toast.success("Check Email At `http://localhost:3000/`");
  // const notify_password = () =>
  //   toast.success("Password Has Been Changed Successfully!");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASEURL}/auth/send-reset-password-email/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (!data.errors) {
        setSent(() => true);
      } else {
        //notify();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmitForChangePassword = async (e) => {
    e.preventDefault();
    if (password != password2) {
      notify_p();
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASEURL}/auth/reset-password${tokenEndpint}`,
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
        //notify_password();
        navigate("/");
      } else {
        //notify();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center h-[10%]">
          <p className="text-[#03C9D7] font-semibold text-2xl">Waste Management System</p>
        </div>
      <div className="w-full h-[80%] flex justify-center items-center">
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl w-[60%] shadow-md">
        {!sent ? (
          <div className="w-full flex flex-col">
            <div className="flex justify-center items-center">
            <h2 className="font-semibold text-xl mt-4 mb-1 pb-8">Enter Your Email Below To Reset Password</h2>
            </div>
            <form onSubmit={handleSubmit} className="w-full flex flex-col px-20">
              <input
                className="w-full text-black py-2 my-1 bg-transparent border-b-2 outline-none focus:outline-none focus:border-[#03C9D7]"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full py-2 my-3 bg-[#03C9D7] rounded-md text-white hover:bg-[#1e666b]"
              >
                Submit
              </button>
            </form>
            <div className="w-full flex justify-center items-center p-3">
              <button
                className="px-3 text-[#03C9D7] hover:font-bold"
                onClick={handleReset}
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl flex justify-center items-center">
            <div className="flex flex-col w-1/2 justify-center items-center">
              <p className="py-3 text-xl">A email has been sent! </p>
              <SiTicktick className="text-green-500"/>
              <button
                className="px-3 text-[#03C9D7] text-xl hover:font-bold py-3"
                onClick={handleReset}
              >
                Log in page
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
      <div className="w-full flex items-center justify-center h-[10%]">
              <p className=" text-gray-700 text-center">
                © 2024 All rights reserved
              </p>
            </div>
    </div>
  );
};

export default ResetPassword;

import React, { useState } from "react";

const ChangePassword = ({ changeState }) => {
  const [old_password, setPassword] = useState("");
  const [new_password, setPassword2] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASEURL}/auth/change-password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ old_password, new_password }),
        }
      );
      const data = await response.json();
      if (!data.errors) {
        changeState();
        //toast.success("Password hab been changed successfully!")
      } else {
        //notMatched();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="">
      <div className="w-full flex flex-col">
        <div className="flex justify-center items-center">
          <h2 className="font-semibold text-xl mt-4 mb-1 pb-8">
            Change Your Password Below
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col px-20">
          <input
            className="w-full text-black py-2 my-1 bg-transparent border-b-2 outline-none focus:outline-none focus:border-[#03C9D7]"
            type="password"
            placeholder="Old Password"
            value={old_password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className="w-full text-black py-2 my-1 bg-transparent border-b-2 outline-none focus:outline-none focus:border-[#03C9D7]"
            type="password"
            placeholder="New Password"
            value={new_password}
            onChange={(e) => setPassword2(e.target.value)}
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
            onClick={changeState}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

import React, { useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";

const ChangeProfile = ({profileState, fullUser}) => {
  const {authToken} = useStateContext();
  const [first_name, setFirst_name] = useState(fullUser.first_name);
  const [last_name, setLast_name] = useState(fullUser.last_name);
  const [email, setEmail] = useState(fullUser.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BASEURL}/profile/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ first_name, last_name, email }),
      });
      const data = await response.json();
      if (!data.errors) {
        profileState();
      } else {
        //notMatched();
      }
    } catch (error) {
      console.log(error.message);
    }
    profileState();
  };

  return (
    <div className="">
      <div className="w-full flex flex-col">
        <div className="flex justify-center items-center">
          <h2 className="font-semibold text-xl mt-4 mb-1 pb-8">
            Update Your Profile Below
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col px-20">
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
            onClick={profileState}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeProfile;

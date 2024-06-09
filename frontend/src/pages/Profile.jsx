import React, { useState, useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { MdVpnKey } from "react-icons/md";
import { FaUserEdit, FaUserTie } from "react-icons/fa";
import { MdAlternateEmail, MdCreateNewFolder, MdWork } from "react-icons/md";
import { SiNamemc } from "react-icons/si";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChangePassword, ChangeProfile } from "../components";

import PROFILE_COVER from "../assets/mmanager.jpg";

function calculateTimeDifference(created_at) {
  const createdAtDate = new Date(created_at);
  const currentDate = new Date();
  const timeDifference = currentDate - createdAtDate;
  const days = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24)
  );
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes };
}

const Profile = () => {
  const { authToken, setAuthToken, authUserId, handleLogOut } =
    useStateContext();

  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [rolename, setRolename] = useState("");
  const [created_at, setCreated_at] = useState({});
  const [isChanging, setIsChanging] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  const [fullUser, setFullUser] = useState({});

  const navigate = useNavigate();

  async function populateProfile() {
    try {
      const response = await axios.get("http://127.0.0.1:8000/profile", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = response.data[0];
      setFullUser(data);
      setEmail(() => data.email);
      setFirstname(() => data.first_name);
      setLastname(() => data.last_name);
      setUsername(() => data.username);
      setRolename(() => data.role_name);
      setCreated_at(() => calculateTimeDifference(data.created_at));
      setUid(() => data.id);
    } catch (error) {
      setAuthToken("");
      navigate("/");
      console.log(error.message);
    }
  }
  useEffect(() => {
    if (authToken === "") {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (authToken != "") {
      if (!authUserId) {
        //navigate("/");
      } else {
        populateProfile();
      }
    } else {
      navigate("/");
    }
  }, [isProfile]);

  const changeState = () => {
    setIsProfile(false);
    setIsChanging(!isChanging);
  };

  const profileState = () => {
    setIsChanging(false);
    setIsProfile(!isProfile);
    console.log("clicked");
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      {!isChanging && !isProfile && (
        <div className="w-full flex flex-col">
          <div className="w-full h-[20%] p-5 flex flex-row justify-between">
            <div className="w-[20%]">
              <h1 className="text-2xl font-semibold">Profile Info.</h1>
            </div>
            <div className="w-[80%] flex flex-row items-end justify-end">
              <button className="flex flex-row justify-center items-center hover:text-red-500" onClick={changeState}>
                <div className="flex flex-row justify-end items-center px-2">
                  <MdVpnKey className="px-1 text-[#03C9D7] text-4xl" />
                  <span className="text-lg font-semibold">Change Password</span>
                </div>
              </button>
              <button className="flex flex-row justify-center items-center hover:text-red-500" onClick={profileState}>
                <div className="flex flex-row justify-end items-center px-2">
                  <FaUserEdit className="px-1 text-[#03C9D7] text-4xl" />
                  <span className="text-lg font-semibold">Edit Profile</span>
                </div>
              </button>
            </div>
          </div>
          <div className="w-full h-[80%] p-5 flex justify-between items-center">
            <div className="flex flex-col justify-start items-start py-4 w-[50%]">
              <div className="flex flex-row justify-start items-center w-full py-3">
                <span>
                  <FaUserTie className="text-xl text-[#03c8d7]" />
                </span>{" "}
                <p className="pl-3 font-serif text-lg">{username}</p>
              </div>
              <div className="flex flex-row justify-start items-center w-full py-3">
                <span>
                  <SiNamemc className="text-xl text-[#03c8d7]" />
                </span>{" "}
                <p className="pl-3 font-serif text-lg">
                  {firstname} {lastname}
                </p>
              </div>
              <div className="flex flex-row justify-start items-center w-full py-3">
                <span>
                  <MdAlternateEmail className="text-xl text-[#03c8d7]" />
                </span>{" "}
                <p className="pl-3 font-serif text-lg">{email}</p>
              </div>
              <div className="flex flex-row justify-start items-center w-full py-3">
                <span>
                  <MdWork className="text-xl text-[#03c8d7]" />
                </span>{" "}
                <p className="pl-3 font-serif text-lg">{rolename}</p>
              </div>
              <div className="flex flex-row justify-start items-center w-full py-3">
                <span>
                  <MdCreateNewFolder className="text-xl text-[#03c8d7]" />
                </span>{" "}
                <p className="pl-3 font-serif text-lg">
                  Account Created
                  <span>
                    {created_at.days ? ` ${created_at.days} days ` : " "}
                    {created_at.hours ? `${created_at.hours} hours ` : ""}
                    {created_at.minutes} minutes ago
                  </span>
                </p>
              </div>
            </div>
            <div className="w-[50%] flex justify-end items-center pr-11">
              <img src={PROFILE_COVER} alt="" />
            </div>
          </div>
        </div>
      )}
      {
        isChanging && <ChangePassword changeState={changeState}/>
      }
      {
        isProfile && <ChangeProfile profileState={profileState} fullUser={fullUser}/>
      }
    </div>
  );
};

export default Profile;

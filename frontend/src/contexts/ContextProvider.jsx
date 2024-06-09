import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [authToken, setAuthToken] = useState("");
  const [authUsername, setAuthUsername] = useState("");
  const [authUserId, setAuthUserId] = useState(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authRole, setAuthRole] = useState(null);

  const decodeToken = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  };


  const handleLogOut = () => {
    localStorage.removeItem("token");
    setAuthToken("");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = decodeToken(token);
      setAuthUserId(user);
      if (user) {
        setAuthToken(token);
        setAuthUserId(user.user_id);
      } else {
        setAuthToken("");
      }
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASEURL}/profile/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if(response.data) {
        const data = response.data[0];
        setAuthUsername(data.username);
        setAuthEmail(data.email);
        setAuthRole(data.role);
        if(data.role === 4) {
          setAuthToken("");
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchUser();
  },[authToken])

  return (
    <StateContext.Provider
      value={{ activeMenu, setActiveMenu, authToken, setAuthToken,handleLogOut, authUsername, setAuthUsername, authUserId, setAuthUserId, authRole}}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);

import React, { useEffect, useState } from "react";
import axios from "axios";

import { useStateContext } from "../contexts/ContextProvider";

import { useNavigate } from "react-router-dom";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { MdDelete, MdEditDocument } from "react-icons/md";

const Users = () => {
  const { authToken } = useStateContext();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [idToEdit, setIdToEdit] = useState(null);
  const [selectedRole, setSelectedRole] = useState("system-admin");
  const [role, setRole] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASEURL}/users/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (res.data) {
        setUsers(res.data);
      } else {
        console.error("Failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (authToken === "") {
      navigate("/");
      return;
    }
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BASEURL}/users/${id}/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
    fetchUsers();
  };

  const changeUserData = async (id) => {
    try {
      console.log(role);
      const res = await axios.patch(
        `${import.meta.env.VITE_BASEURL}/users/${id}/`,
        {
          username: username,
          first_name: first_name,
          last_name: last_name,
          email: email
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setIdToEdit(null);
      setEmail("");
      setUsername("");
      setFirst_name("");
      setLast_name("");
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (user) => {
    setIdToEdit(user.id);
    setEmail(user.email);
    setUsername(user.username);
    setFirst_name(user.first_name);
    setLast_name(user.last_name);
  };

  const nullIdToEdit = () => {
    setIdToEdit(null);
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div className="w-full h-full flex flex-col">
        <div className="w-full flex flex-row justify-between items-center px-5">
          <h1 className="text-3xl font-semibold">Users</h1>
          <div className="flex flex-row justify-end items-center">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 border-2 border-[#03C9D7] focus:border-[#03C9D7] focus:outline-none rounded-md"
            />
          </div>
        </div>

        <div className="w-full px-5 py-7 flex flex-col justify-start item-center">
          {/* table Header*/}
          <div className="flex flex-row justify-evenly items-center border-2 border-[#03C9D7] rounded-md p-2 font-semibold text-lg mb-2">
            <div className="w-1/4 flex justify-center items-center">
              <span>Full Name</span>
            </div>
            <div className="w-1/4 flex justify-center items-center">
              <span>Email Address</span>
            </div>
            <div className="w-1/4 flex justify-center items-center">
              <span>User Role</span>
            </div>
            <div className="w-1/4 flex justify-center items-center">
              <FaArrowAltCircleDown className="text-xl text-[#03C9D7]" />
            </div>
          </div>

          {/* table Header*/}
          {filteredUsers.map((user) => (
            <>
              <div
                className="flex flex-row justify-evenly items-center py-2 border-l-4 my-2 border-[#03C9D7] bg-gray-50 rounded-sm"
                key={user.id}
              >
                <div className="w-1/4 flex justify-center items-center">
                  <span>
                    {user.first_name} {user.last_name}
                  </span>
                </div>
                <div className="w-1/4 flex justify-center items-center">
                  <span>{user.email}</span>
                </div>
                <div className="w-1/4 flex justify-center items-center">
                  <span>{user.role_name}</span>
                </div>
                <div className="w-1/4 flex justify-center items-center">
                  <div className="flex flex-row justify-between items-center">
                    <button
                      className="px-5 text-2xl text-sky-500 hover:text-sky-800"
                      onClick={() => handleEdit(user)}
                    >
                      <MdEditDocument />
                    </button>
                    <button
                      className="px-5 text-2xl text-red-500 hover:text-red-800"
                      onClick={() => handleDelete(user.id)}
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              </div>
              {idToEdit === user.id && (
                <div className="w-full flex justify-center items-center">
                <div className="w-[50%] flex flex-col justify-center item-center py-5 mx-5">
                  <div className="flex justify-center items-center px-4 w-full">
                    <p className="font-semibold">Change User</p>
                  </div>
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

                  <div className="flex flex-row justify-center items-center">
                    <button
                      onClick={() => changeUserData(user.id)}
                      className="p-2 text-sky-400 hover:text-sky-600 font-semibold"
                    >
                      Change
                    </button>
                    <button
                      onClick={nullIdToEdit}
                      className="p-2 text-red-400 hover:text-red-600 font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;

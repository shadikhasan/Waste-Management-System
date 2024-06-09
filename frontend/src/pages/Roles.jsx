import React, { useEffect, useState } from "react";
import axios from "axios";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { MdDelete, MdEditDocument } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Roles = () => {
  const { authToken } = useStateContext();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [idToEdit, setIdToEdit] = useState(null);
  const [selectedRole, setSelectedRole] = useState("system-admin");
  const [role, setRole] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) =>
    user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) || user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  const notify_sucess = (e) => toast.success(e);


  const fetchUsers = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/users/`, {
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

  const changeRole = async () => {
    try {
      console.log(role);
      const res = await axios.put(
        `http://127.0.0.1:8000/users/${idToEdit}/roles/`,
        {
          role: role,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setIdToEdit(null);
      fetchUsers();
      notify_sucess("Role has been changed!")
    } catch (error) {
      console.error(error);
    }
  };
  const handleEdit = (id, role_name) => {
    setIdToEdit(id);
    setSelectedRole(role_name);
  };

  const nullIdToEdit = () => {
    setIdToEdit(null);
    setSelectedRole("");
  };

  useEffect(() => {
    if (selectedRole === "System Admin") setRole(1);
    if (selectedRole === "STS Manager") setRole(2);
    if (selectedRole === "Land Field Manager") setRole(3);
    if (selectedRole === "Unassigned") setRole(4);
    if (selectedRole === "Contractor Manager") setRole(5);
  }, [selectedRole]);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div className="w-full h-full flex flex-col">
        <div className="w-full flex flex-row justify-between items-center px-5">
          <h1 className="text-3xl font-semibold">Roles Management</h1>
          <div className="flex flex-row justify-end items-center">
            <input type="text" 
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
                      onClick={() => handleEdit(user.id, user.role_name)}
                    >
                      <MdEditDocument />
                    </button>
                  </div>
                </div>
              </div>
              {idToEdit === user.id && (
                <div className="w-full flex flex-row justify-center py-5 mx-5">
                  <div className="flex justify-center items-center px-4">
                    <p className="font-semibold">Change Role:</p>
                  </div>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="mx-4"
                  >
                    <option value="System Admin">System Admin</option>
                    <option value="STS Manager">STS Manager</option>
                    <option value="Land Field Manager">
                      Land Field Manager
                    </option>
                    <option value="Unassigned">Unassigned</option>
                    <option value="Contractor Manager">Contractor Manager</option>
                  </select>
                  <button
                    onClick={changeRole}
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
              )}
            </>
          ))}
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Roles;

import React, { useState, useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { FaArrowAltCircleDown, FaInfoCircle } from "react-icons/fa";
import { MdDelete, MdEditDocument } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CreateThirdPartyContractors } from "../components";
const initial_contractor = {
  name: "",
  contract_id: "",
  reg_id: "",
  reg_date: "",
  tin: "",
  contact_number: "",
  workforce_size: null,
  payment_per_ton: null,
  waste_per_day: null,
  contruct_duration: null,
  area_of_collection: null,
  degignated_sts: null,
};

const ThirdPartyContractor = () => {
  const { authToken } = useStateContext();
  const navigate = useNavigate();

  const [tpc, setTpc] = useState([initial_contractor]);
  const [idToEdit, setIdToEdit] = useState(null);
  const [contractor, setContractor] = useState(initial_contractor);
  const [searchQuery, setSearchQuery] = useState("");

  const [isAdding, setIsAdding] = useState(false);
  const [isInfo, setIsInfor] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const notify_success = (e) => toast.success(e);
  const notify_error = (e) => toast.error(e);

  const filteredUsers = tpc.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.reg_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchContractors = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASEURL}/third-party-contractors/`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json"
          },
        }
      );
      console.log(res);
      if (res.data) {
        setTpc(res.data);
      } else {
        notify_error("Faild to fetch third party contractors");
      }
    } catch (error) {
      console.error(error);
      notify_error("Faild to fetch third party contractors");
    }
  };

  useEffect(() => {
    if (authToken === "") {
      navigate("/");
    } else fetchContractors();
  }, [isAdding]);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASEURL}/third-party-contractors/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      notify_success("Third party contractor has beeen deleted successfully!");
      setContractor(initial_contractor);
    } catch (error) {
      console.error(error);
    }
    fetchContractors();
  };

  const handleEdit = (company) => {
    setContractor(initial_contractor);
    setIdToEdit(company.id);
    setIsEditing(!isEditing);
    setIsInfor(false);
  };

  const nullIdToEdit = () => setIdToEdit(null);

  const handleAdding = () => setIsAdding(!isAdding);
  const handleInfo = (company) => {
    setContractor(company);
    setIdToEdit(company.id);
    setIsInfor(!isInfo);
    setIsEditing(false);
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      {!isAdding ? (
        <div className="w-full h-full flex flex-col">
          <div className="w-full flex flex-row justify-between items-center px-5">
            <h1 className="text-3xl font-semibold">
              Third Party Contractor List
            </h1>
            <div className="flex flex-row justify-end items-center">
              <button
                className="px-4 mx-2 flex flex-row justify-center items-center bg-gray-50 rounded-lg py-2"
                onClick={handleAdding}
              >
                <p className="pr-3 font-semibold">Add</p>
                <IoMdPersonAdd className="text-2xl text-[#03C9D7]" />
              </button>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 border-2 border-[#03C9D7] focus:border-[#03C9D7] focus:outline-none rounded-md px-2"
              />
            </div>
          </div>

          <div className="w-full px-5 py-7 flex flex-col justify-start item-center">
            {/* table Header*/}
            <div className="flex flex-row justify-evenly items-center border-2 border-[#03C9D7] rounded-md p-2 font-semibold text-lg mb-2">
              <div className="w-1/4 flex justify-center items-center">
                <span>Name</span>
              </div>
              <div className="w-1/4 flex justify-center items-center">
                <span>Reg. ID</span>
              </div>
              <div className="w-1/4 flex justify-center items-center">
                <span>Area of Collection</span>
              </div>
              <div className="w-1/4 flex justify-center items-center">
                <FaArrowAltCircleDown className="text-xl text-[#03C9D7]" />
              </div>
            </div>

            {/* table Header*/}
            {filteredUsers.map((company) => (
              <>
                <div
                  className="flex flex-row justify-evenly items-center py-2 border-l-4 my-2 border-[#03C9D7] bg-gray-50 rounded-sm"
                  key={company.reg_id}
                >
                  <div className="w-1/4 flex justify-center items-center">
                    <span>{company.name}</span>
                  </div>
                  <div className="w-1/4 flex justify-center items-center">
                    <span>{company.reg_id}</span>
                  </div>
                  <div className="w-1/4 flex justify-center items-center">
                    <span>{company.area_of_collection}</span>
                  </div>
                  <div className="w-1/4 flex justify-center items-center">
                    <div className="flex flex-row justify-between items-center">
                      <button
                        className="px-5 text-2xl text-sky-500 hover:text-sky-800"
                        onClick={() => handleInfo(company)}
                      >
                        <FaInfoCircle />
                      </button>
                      <button
                        className="px-5 text-2xl text-sky-500 hover:text-sky-800"
                        onClick={() => handleEdit(company)}
                      >
                        <MdEditDocument />
                      </button>
                      <button
                        className="px-5 text-2xl text-red-500 hover:text-red-800"
                        onClick={() => handleDelete(company.id)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                </div>
                {isEditing && idToEdit === company.id && (
                  <div className="w-full flex justify-center items-center ">
                    <div className="w-[50%] flex flex-col justify-center item-center py-5 mx-5 m-2 rounded-lg bg-slate-50 px-10 shadow-md">
                      <div className="flex justify-center items-center px-4 w-full">
                        <p className="font-semibold">Update Contractor</p>
                      </div>
                      <input
                        className="w-full text-black py-2 my-1 bg-transparent border-b-2 outline-none focus:outline-none focus:border-[#03C9D7]"
                        type="text"
                        placeholder="Name of Company"
                        value={contractor.name}
                        onChange={(e) =>
                          setContractor({ ...contractor, name: e.target.value })
                        }
                      />
                      <input
                        className="w-full text-black py-2 my-1 bg-transparent border-b-2 outline-none focus:outline-none focus:border-[#03C9D7]"
                        type="text"
                        placeholder="Contract ID"
                        value={contractor.contract_id}
                        onChange={(e) =>
                          setContractor({
                            ...contractor,
                            contract_id: e.target.value,
                          })
                        }
                      />
                      <input
                        className="w-full text-black py-2 my-1 bg-transparent border-b-2 outline-none focus:outline-none focus:border-[#03C9D7]"
                        type="text"
                        placeholder="Registration ID"
                        value={contractor.reg_id}
                        onChange={(e) =>
                          setContractor({
                            ...contractor,
                            reg_id: e.target.value,
                          })
                        }
                      />
                      <input
                        className="w-full text-black py-2 my-1 bg-transparent border-b-2 outline-none focus:outline-none focus:border-[#03C9D7]"
                        type="text"
                        placeholder="TIN of Company"
                        value={contractor.tin}
                        onChange={(e) =>
                          setContractor({ ...contractor, tin: e.target.value })
                        }
                      />
                      <input
                        className="w-full text-black py-2 my-1 bg-transparent border-b-2 outline-none focus:outline-none focus:border-[#03C9D7]"
                        type="text"
                        placeholder="Contact Number"
                        value={contractor.contact_number}
                        onChange={(e) =>
                          setContractor({
                            ...contractor,
                            contact_number: e.target.value,
                          })
                        }
                      />
                      <input
                        className="w-full text-black py-2 my-1 bg-transparent border-b-2 outline-none focus:outline-none focus:border-[#03C9D7]"
                        type="number"
                        placeholder="Workforce Size"
                        value={contractor.workforce_size}
                        onChange={(e) =>
                          setContractor({
                            ...contractor,
                            workforce_size: e.target.value,
                          })
                        }
                      />
                      <input
                        className="w-full text-black py-2 my-1 bg-transparent border-b-2 outline-none focus:outline-none focus:border-[#03C9D7]"
                        type="number"
                        placeholder="Payment Per Ton"
                        value={contractor.payment_per_ton}
                        onChange={(e) =>
                          setContractor({
                            ...contractor,
                            payment_per_ton: e.target.value,
                          })
                        }
                      />
                      <input
                        className="w-full text-black py-2 my-1 bg-transparent border-b-2 outline-none focus:outline-none focus:border-[#03C9D7]"
                        type="number"
                        placeholder="Waste per day"
                        value={contractor.waste_per_day}
                        onChange={(e) =>
                          setContractor({
                            ...contractor,
                            waste_per_day: e.target.value,
                          })
                        }
                      />
                      <input
                        className="w-full text-black py-2 my-1 bg-transparent border-b-2 outline-none focus:outline-none focus:border-[#03C9D7]"
                        type="number"
                        placeholder="Contruct Duration"
                        value={contractor.contruct_duration}
                        onChange={(e) =>
                          setContractor({
                            ...contractor,
                            contruct_duration: e.target.value,
                          })
                        }
                      />
                      <input
                        className="w-full text-black py-2 my-1 bg-transparent border-b-2 outline-none focus:outline-none focus:border-[#03C9D7]"
                        type="number"
                        placeholder="Area of Collection"
                        value={contractor.area_of_collection}
                        onChange={(e) =>
                          setContractor({
                            ...contractor,
                            area_of_collection: e.target.value,
                          })
                        }
                      />

                      <div className="flex flex-row justify-center items-center">
                        <button
                          onClick={() => changeUserData(company.id)}
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
                {/* Showing Info */}
                {isInfo && idToEdit === company.id && (
                  <>
                    <div className="w-full flex justify-center items-center m-5">
                      <div className="w-[80%] m-1 bg-slate-50 rounded-lg p-5 flex flex-col justify-start items-start">
                        <div className="px-5 py-2">
                          <span className="font-serif font-semibold">Name : </span> {contractor.name}
                        </div>
                        <div className="px-5 py-2">
                          <span className="font-serif font-semibold">Contract ID : </span> {contractor.contract_id}
                        </div>
                        <div className="px-5 py-2">
                          <span className="font-serif font-semibold">Registration ID : </span> {contractor.reg_id}
                        </div>
                        <div className="px-5 py-2">
                          <span className="font-serif font-semibold">Registration Date : </span> {contractor.reg_date}
                        </div>
                        <div className="px-5 py-2">
                          <span className="font-serif font-semibold">Phone : </span> {contractor.contact_number}
                        </div>
                        <div className="px-5 py-2">
                          <span className="font-serif font-semibold">Workforce size : </span>{" "}
                          {contractor.workforce_size}
                        </div>
                        <div className="px-5 py-2">
                          <span className="font-serif font-semibold">Payment per tonnage of waste : </span>{" "}
                          {contractor.payment_per_ton}
                        </div>
                        <div className="px-5 py-2">
                          <span className="font-serif font-semibold">Required amount of waste per day : </span>{" "}
                          {contractor.waste_per_day}
                        </div>
                        <div className="px-5 py-2">
                          <span className="font-serif font-semibold">Contract duration : </span>{" "}
                          {contractor.contruct_duration}
                        </div>
                        <div className="px-5 py-2">
                          <span className="font-serif font-semibold">Area of collection : </span>{" "}
                          {contractor.area_of_collection}
                        </div>
                        <div className="px-5 py-2">
                          <span className="font-serif font-semibold">Designated STS : </span>{" "}
                          {contractor.degignated_sts}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            ))}
          </div>
        </div>
      ) : (
        <>
          <CreateThirdPartyContractors
            initial={initial_contractor}
            handleAdding={handleAdding}
          />
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default ThirdPartyContractor;

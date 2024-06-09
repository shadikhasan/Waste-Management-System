import React, { useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  AiOutlineAreaChart,
  AiOutlineBarChart,
  AiOutlineStock,
} from "react-icons/ai";
import { FiPieChart } from "react-icons/fi";
import { MdSpaceDashboard, MdOutlineCancel, MdOutlineWork } from "react-icons/md";
import { ImBin2 } from "react-icons/im";
import { FaPersonCircleExclamation } from "react-icons/fa6";
import { IoPersonAdd } from "react-icons/io5";
import { ImProfile } from "react-icons/im";
import { RiContractFill } from "react-icons/ri";
import { IoMdContacts } from "react-icons/io";
import { RiStockLine } from "react-icons/ri";
import { FaHandsWash } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

import { useStateContext } from "../contexts/ContextProvider";

const links = [
  {
    title: "Dashboard",
    links: [
      {
        name: "dashboard",
        role: [1,2,3,5],
        icon: <MdSpaceDashboard />,
      },
    ],
  },

  {
    title: "Pages",
    links: [
      {
        name: "profile",
        role: [1,2,3,5],
        icon: <ImProfile />,
      },
      {
        name: "users",
        role: [1],
        icon: <IoMdContacts />,
      },
      {
        name: "create",
        role: [1],
        icon: <IoPersonAdd />,
      },
      {
        name: "roles",
        role: [1],
        icon: <MdOutlineWork />,
      },
      {
        name: "third-party-contractor",
        role: [1],
        icon: <RiContractFill />,
      },
    ],
  },
  {
    title: "Managers",
    links: [
      {
        name: "landfill",
        role: [1,2,3,5],
        icon: <FaPersonCircleExclamation />,
      },
      {
        name: "sts",
        role: [1,2,3,5],
        icon: <FaPersonCircleExclamation />,
      },
      {
        name: "contractor",
        role: [1,2,3,5],
        icon: <FaPersonCircleExclamation />,
      },
    ],
  },
  {
    title: "Waste Stations",
    links: [
      {
        name: "landfill-station",
        role: [1,2,3,5],
        icon: <ImBin2 />,
      },
      {
        name: "sts-station",
        role: [1,2,3,5],
        icon: <ImBin2 />,
      },
      {
        name: "local-station",
        role: [1,2,3,5],
        icon: <ImBin2 />,
      },
    ],
  },
  {
    title: "Waste Management",
    links: [
      {
        name: "waste-transfer",
        role: [1,2,3,5],
        icon: <ImBin2 />,
      },
    ],
  },
  {
    title: "Charts",
    links: [
      {
        name: "line",
        role: [1,2,3],
        icon: <AiOutlineStock />,
      },
      {
        name: "area",
        role: [1,2,3],
        icon: <AiOutlineAreaChart />,
      },

      {
        name: "bar",
        role: [1,2,3],
        icon: <AiOutlineBarChart />,
      },
      {
        name: "pie",
        role: [1,2,3],
        icon: <FiPieChart />,
      },
      {
        name: "financial",
        role: [1,2,3],
        icon: <RiStockLine />,
      },
    ],
  },
];

const currentColor = "#03C9D7";

const Sidebar = () => {
  const navigate = useNavigate();
  const { activeMenu, setActiveMenu , handleLogOut, authRole} = useStateContext();

  useEffect(() => {
    console.log(authRole);
  }, [])

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined) {
      //setActiveMenu(false);
    }
  };
  const logoutclicked = () => {
    handleLogOut();
    navigate('/');
  }
  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-white  text-md m-2";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 hover:bg-light-gray m-2";

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="items-center gap-3 ml-3 mt-4 flex text-xl font-semiabold tracking-tight text-slate-900"
            >
              <FaHandsWash className="text-[#03C9D7]"/> <span>Waste Manager</span>
            </Link>
            <button
              type="button"
              onClick={() => setActiveMenu(!activeMenu)}
              style={{ color: currentColor }}
              className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
            >
              <MdOutlineCancel />
            </button>
          </div>
          <div className="mt-10 ">
            {links.map((item) => (
              <div key={item.title}>
                <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                  {item.title}
                </p>
                {item.links.map((link) => (
                  link.role.find((id) => id === authRole) && <NavLink
                    to={`/${link.name}`}
                    key={link.name}
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : "",
                    })}
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                  >
                    {link.icon}
                    <span className="capitalize ">{link.name}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
          <div>
            <button
              onClick={logoutclicked}
              style={{ color: "#FA7070" }}
              className="flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 m-2 hover:font-bold"
            >
              <FiLogOut />
              <span className="capitalize">Log Out</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;

import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import { Navbar, Footer, Sidebar } from "./components";
import { Login, Profile, Users, Roles, Create, ThirdPartyContractor, Landfill, Dashboard, Sts, ContractorManager, StationLandfill, StationSTS, StationLocal, WasterTransfer } from "./pages";
import "./App.css";

import { useStateContext } from "./contexts/ContextProvider";

const AuthenticatedRoutes = ({ activeMenu }) => {
  return (
    <div className="flex relative">
      {activeMenu ? (
        <div className="w-72 fixed bg-white ">
          <Sidebar />
        </div>
      ) : (
        <div className="w-0">
          <Sidebar />
        </div>
      )}
      <div
        className={
          activeMenu
            ? "bg-main-bg min-h-screen md:ml-72 w-full  "
            : "bg-main-bg w-full min-h-screen flex-2 "
        }
      >
        <div className="fixed md:static bg-main-bg w-full ">
          <Navbar />
        </div>
        <div className="">
          <div>
            <Routes>
              {/* dashboard  */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/users" element={<Users />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/create" element={<Create />} />
              <Route path="/third-party-contractor" element={<ThirdPartyContractor />} />

              <Route path="/landfill" element={<Landfill />} />
              <Route path="/sts" element={<Sts />} />
              <Route path="/contractor" element={<ContractorManager />} />

              <Route path="/landfill-station" element={<StationLandfill />} />
              <Route path="/sts-station" element={<StationSTS />} />
              <Route path="/local-station" element={<StationLocal />} />
              
              <Route path="/waste-transfer" element={<WasterTransfer />} />
            </Routes>
          </div>
          <div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const { activeMenu, authToken } = useStateContext();

  return (
    <div>
      <BrowserRouter>
        {authToken ? (
          <AuthenticatedRoutes activeMenu={activeMenu} />
        ) : (
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
};

export default App;

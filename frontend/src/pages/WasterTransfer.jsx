import React, { useEffect, useState } from "react";
import axios, { all } from "axios";

import { useStateContext } from "../contexts/ContextProvider";

const WasterTransfer = () => {
  const { authToken } = useStateContext();

  const [allLandfill, setAllLandfill] = useState([]);
  const [allSts, setAllSts] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);

  const [long, setLong] = useState(null);
  const [lat, setLat] = useState(null);

  const [Dlong, setDLong] = useState(null);
  const [Dlat, setDLat] = useState(null);

  const [finalData, setFinalData] = useState({});

  const [source, setSource] = useState(null);
  const [dest, setDest] = useState(null);
  const [TransferID, setTransferID] = useState(null);
  const [Distance, setDistance] = useState(null);
  const [VolumeOfWaste, setVolumeOfWaste] = useState(null);
  const [Vehicle, setVehicle] = useState(null);
  const [TimeOfArrival, setTimeOfArrival] = useState("");
  const [TimeOfDeparture, setTimeOfDeparture] = useState("");

  const fetchAllLandfill = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASEURL}/landfills/`);
      if (res.data) {
        setAllLandfill(res.data);
        setDLong(res.data[0].Longitude);
        setDLat(res.data[0].Latitude);
        setDest(res.data[0].LandfillID);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchAllSts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASEURL}/sts/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (res.data) {
        setAllSts(res.data);
        setLong(res.data[0].Longitude);
        setLat(res.data[0].Latitude);
        setSource(res.data[0].STSID);
      } else {
        console.error("Failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVahicles = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASEURL}/vehicles/`);
      if (res.data) {
        setAllVehicles(res.data);
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
    fetchAllLandfill();
    fetchAllSts();
    fetchVahicles();
  }, []);

  useEffect(() => {
    setSelectedAreaSTS("");
  }, [finalData]);

  const [selectedArea, setSelectedArea] = useState(allLandfill[0]?.Location);
  const [selectedAreaSTS, setSelectedAreaSTS] = useState(allSts[0]?.Location);
  const [selectedOption, setSelectedOption] = useState("FastestRoute");

  const LF = allLandfill.filter((x) => x?.Location === selectedArea);
  const STS = allSts.filter((x) => x?.Location === selectedAreaSTS);

  useEffect(() => {
    setDLat(LF[0]?.Latitude);
    setDLong(LF[0]?.Longitude);
  }, [selectedArea]);

  useEffect(() => {
    setDLat(STS[0]?.Latitude);
    setDLong(STS[0]?.Longitude);
  }, [selectedAreaSTS]);

  const handleDistance = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASEURL}/route/`, {
        source_lat: lat,
        source_lon: long,
        dest_lat: Dlat,
        dest_lon: Dlong,
        optimize_for: selectedOption,
      });
      if (res.data) {
        setFinalData(res.data);
        setDistance(res.data.DriveDistance);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    e.preventDefault();
    const X = allVehicles.filter((e) => e.VehicleID === selectedAreaSTS);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASEURL}/waste-transfers/`,
        {
          TransferID: TransferID,
          Distance: Distance,
          VolumeOfWaste: VolumeOfWaste,
          Vehicle: X[0].VehicleID,
          Source: source,
          Destination: dest,
          TimeOfArrival: TimeOfArrival,
          TimeOfDeparture,
          TimeOfDeparture,
        }
      );
      if (res.data) {
      }
    } catch (error) {}
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl flex flex-col justify-center items-center">
      <div className=" flex flex-col justify-center items-center w-[70%] bg-slate-50 rounded-xl">
        <div>
          <div className="flex flex-row justify-between items-start py-3 my-2">
            <label
              htmlFor="select"
              className="flex justify-start items-start w-[40%]"
            >
              Landfill :
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="mx-4 p-2 w-[60%] border-1 border-[#03C9D7] focus:border-2 focus:border-[#03C9D7] rounded-lg"
            >
              {allLandfill.map((one) => (
                <option key={one.LandfillID} value={one.Location}>
                  {one.Location}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-row justify-center items-start py-3 my-2">
            <label htmlFor="select" className="w-[40%]">
              STS :
            </label>
            <select
              value={selectedAreaSTS}
              onChange={(e) => setSelectedAreaSTS(e.target.value)}
              className="mx-4 p-2 w-[60%] border-1 border-[#03C9D7] focus:border-2 focus:border-[#03C9D7] rounded-lg"
            >
              {allSts.map((one) => (
                <option key={one.LandfillID} value={one.Location}>
                  {one.Location}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-row justify-center items-start py-3 my-2">
            <label htmlFor="select" className="w-[40%]">
              Option :
            </label>
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="mx-4 p-2 w-[60%] border-1 border-[#03C9D7] focus:border-2 focus:border-[#03C9D7] rounded-lg"
            >
              <option value={"FastestRoute"}>Fastest Route</option>
              <option value={"ShortestRoute"}>Shortest Route</option>
            </select>
          </div>
          <div className="flex justify-center items-center py-3 my-2">
            <button
              className="p-2 m-2 rounded-lg bg-sky-500 flex"
              onClick={handleDistance}
            >
              Get Distance
            </button>
          </div>
        </div>
      </div>
      {finalData.DriveDistance && (
        <div className="p-4">
          <div className="text-lg">
            Distance{" "}
            <span className="text-red-500 font-semibold">
              {finalData.DriveDistance}
            </span>{" "}
            {finalData.DistanceUnit}
          </div>
          <div className="text-lg">
            Time Needed{" "}
            <span className="text-red-500 font-semibold">
              {finalData.DriveTime}
            </span>{" "}
            {finalData.TimeUnit}
          </div>
        </div>
      )}
      {finalData.DriveDistance && (
        <div className="w-full flex flex-col">
          <div className="flex justify-center items-center">
            <h2 className="font-semibold text-xl mt-4 mb-1 pb-8">
              Add Data For Waste Transfer
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="w-full flex flex-col px-20">
            <input
              className="w-full text-black py-2 my-1 bg-transparent border-b-2 outline-none focus:outline-none focus:border-[#03C9D7]"
              type="text"
              placeholder="Transfer ID"
              value={TransferID}
              onChange={(e) => setTransferID(e.target.value)}
              required
            />
            <input
              className="w-full text-black py-2 my-1 bg-transparent border-b-2 outline-none focus:outline-none focus:border-[#03C9D7]"
              type="number"
              placeholder="Distance"
              value={Distance}
              onChange={(e) => setDistance(e.target.value)}
              disabled
            />
            <input
              className="w-full text-black py-2 my-1 bg-transparent border-b-2 outline-none focus:outline-none focus:border-[#03C9D7]"
              type="number"
              placeholder="Volume Of Waste"
              value={VolumeOfWaste}
              onChange={(e) => setVolumeOfWaste(e.target.value)}
              required
            />
            {/* */}
            <div className="flex flex-row justify-center items-start py-3 my-2">
              <label htmlFor="select" className="w-[40%]">
                STS :
              </label>
              <select
                value={selectedAreaSTS}
                onChange={(e) => setSelectedAreaSTS(e.target.value)}
                className="mx-4 p-2 w-[60%] border-1 border-[#03C9D7] focus:border-2 focus:border-[#03C9D7] rounded-lg"
              >
                {allVehicles.map((one) => (
                  <option key={one.VehicleID} value={one.VehicleID}>
                    {one.Type} | {one.Capacity} Tons | {one.FuelCostLoaded}(Cost
                    Loaded) | {one.FuelCostUnloaded}(Cost Unloaded)
                  </option>
                ))}
              </select>
            </div>
            {/* */}
            <input
              className="w-full text-black py-2 my-1 bg-transparent border-b-2 outline-none focus:outline-none focus:border-black"
              type="datetime-local"
              placeholder="Time Of Arrival"
              value={TimeOfArrival}
              onChange={(e) => setTimeOfArrival(e.target.value)}
              required
              max={new Date().toISOString().split("T")[0]}
            />

            <input
              className="w-full text-black py-2 my-1 bg-transparent border-b-2 outline-none focus:outline-none focus:border-black"
              type="datetime-local"
              placeholder="Time Of Departure"
              value={TimeOfDeparture}
              onChange={(e) => setTimeOfDeparture(e.target.value)}
              required
              max={new Date().toISOString().split("T")[0]}
            />
            <button
              type="submit"
              className="w-full py-2 my-3 bg-[#03C9D7] rounded-md text-white hover:bg-[#1e666b]"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default WasterTransfer;

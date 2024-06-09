import React, { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaTruck, FaUsers } from "react-icons/fa";
import { FcFullTrash, FcManager } from "react-icons/fc";
import axios from "axios";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { MapView } from "../components";

const currentColor = "#03C9D7";

const Dashboard = () => {
  const { authToken } = useStateContext();
  const navigate = useNavigate();

  const [totalTrashCollected, setTotalTrashCollected] = useState(0);
  const [last7DaysTotalTrashCollected, setLast7DaysTotalTrashCollected] =
    useState(0);
  const [total_vehicles, setTotal_vehicles] = useState(0);
  const [total_waste_capacity, setTotal_waste_capacity] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersByRoleWithPercentage, setUsersByRoleWithPercentage] = useState(
    []
  );
  const [last7DaysData, setLast7DaysData] = useState([]);
  const [chartInitialized, setChartInitialized] = useState(false); // New state variable

  useEffect(() => {
    if (authToken === "") {
      navigate("/");
      return;
    }
    const fetchData = async () => {
      try {
        const [
          totalDumpingRecords,
          last7DaysDumpingRecords,
          vehicleSummary,
          landfillWasteCapacity,
          userSummary,
        ] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASEURL}/total-dumping-records/`),
          axios.get(`${import.meta.env.VITE_BASEURL}/last-7-days-dumping-records/`),
          axios.get(`${import.meta.env.VITE_BASEURL}/vehicle-summary/`),
          axios.get(`${import.meta.env.VITE_BASEURL}/landfill-waste-capacity/`),
          axios.get(`${import.meta.env.VITE_BASEURL}/user-summary/`),
        ]);

        console.log(`${import.meta.env.VITE_BASEURL}/total-dumping-records/`);

        const totalDumpingRecordsData = totalDumpingRecords.data;
        const last7DaysDumpingRecordsData = last7DaysDumpingRecords.data;
        const vehicleSummaryData = vehicleSummary.data;
        const landfillWasteCapacityData = landfillWasteCapacity.data;
        const userSummaryData = userSummary.data;

        const totalTrashCollectedValue = totalDumpingRecordsData.reduce(
          (sum, record) => sum + parseFloat(record.VolumeOfWaste),
          0
        );
        setTotalTrashCollected(totalTrashCollectedValue);

        const last7DaysTotalTrashCollectedValue =
          last7DaysDumpingRecordsData.reduce(
            (sum, record) => sum + parseFloat(record.VolumeOfWaste),
            0
          );
        setLast7DaysTotalTrashCollected(last7DaysTotalTrashCollectedValue);

        setTotal_vehicles(vehicleSummaryData.total_vehicles);
        setTotal_waste_capacity(landfillWasteCapacityData.total_waste_capacity);

        const totalUsersValue = userSummaryData.total_users;
        const usersByRoleWithPercentageValue =
          userSummaryData.users_by_role.map((user) => ({
            ...user,
            percentage: user.count,
          }));
        setTotalUsers(totalUsersValue);
        setUsersByRoleWithPercentage(usersByRoleWithPercentageValue);

        // Extracting last 7 days data for chart
        const last7DaysChartData = last7DaysDumpingRecordsData.map(
          (record) => ({
            date: record.date,
            wasteCollected: parseFloat(record.VolumeOfWaste),
          })
        );
        setLast7DaysData(last7DaysDumpingRecordsData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  // Cleanup function to destroy chart instance
  useEffect(() => {
    return () => {
      setChartInitialized(false); // Reset chart initialization state
    };
  }, []);

  // Chart data
  const chartData = {
    labels: last7DaysData.map((data) => data.date),
    datasets: [
      {
        label: "Waste Collected (Tons)",
        data: last7DaysData.map((data) => data.wasteCollected),
        fill: false,
        borderColor: currentColor,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div className="flex flex-row justify-between items-center mx-8 mt-8">
        <div className="rounded-lg bg-gray-50 p-4 w-80 shadow-md">
          <p className="text-[#2D7981]">Total Trash Collected</p>
          <div className="flex items-center">
            <span className="text-2xl font-bold mr-2">
              {totalTrashCollected}
            </span>
            <span className="text-sm">Tons</span>
            <FcFullTrash className="text-[#2D7981] ml-auto text-4xl" />
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4 w-80 shadow-md">
          <p className="text-[#2d7981]">Total Waste Capacity</p>
          <div className="flex items-center">
            <span className="text-2xl font-bold mr-2">
              {total_waste_capacity}
            </span>
            <span className="text-sm">Tons</span>
            <FcFullTrash className="text-[#2d7981] ml-auto text-4xl" />
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4 w-80 shadow-md">
          <p className="text-[#2d7981]">Trash Collected In Last 7 Days</p>
          <div className="flex items-center">
            <span className="text-2xl font-bold mr-2">
              {last7DaysTotalTrashCollected}
            </span>
            <span className="text-sm">Tons</span>
            <FcFullTrash className="text-[#2d7981] ml-auto text-4xl" />
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-between m-8 gap-8">
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-lg bg-gray-50 shadow-md">
            <div className=" text-[#2d7981]">
              <FaTruck className="mr-2" />
              <p>Total Trucks</p>
            </div>
            <div className="text-xl font-bold">{total_vehicles}</div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <div className="text-[#2d7981]">
              <FaUsers className="mr-2" />
              <p>Total Users </p>
            </div>
            <div className="text-xl font-bold">{totalUsers}</div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl flex-1 shadow-md">
          <div className="flex justify-center items-center text-[#2d7981]">
            <FaUsers className="mr-2" />
            <p>Total Users Per Role</p>
          </div>
          <div className="text-xl font-bold flex justify-center items-center">
            {totalUsers} users
          </div>
          <div className="mt-2">
            <p className="text-[#2d7981] flex justify-center items-center pb-3">
              Users by Role
            </p>
            <div className="flex flex-row justify-between items-center">
              {usersByRoleWithPercentage.map((user, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center mt-2 p-2 rounded-md hover:shadow-md"
                >
                  <div className="w-16 h-16 bg-[#84ecf3] rounded-full flex items-center justify-center mr-2">
                    <span className="text-6xl font-bold">
                      <FcManager />
                    </span>
                  </div>
                  <div>
                    <p className="text-lg">{user.role__Name}</p>
                    <p className="text-sm">
                      {user.percentage} {user.percentage > 1 ? "users" : "user"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-8">
        <div className="bg-gray-50 p-8 rounded-xl mt-4 w-full flex flex-col justify-center items-center shadow-md">
          <p className="text-[#2d7981] text-md">
            Waste Collected in Last 7 Days
          </p>
          <div className="p-4 w-[80%] h-[400px] flex justify-center items-center">
            <Bar
              data={{
                labels: [
                  "Today",
                  "1d ago",
                  "2d ago",
                  "3d ago",
                  "4d ago",
                  "5d ago",
                  "6d ago",
                ],
                datasets: [
                  {
                    label: "Total Waste",
                    data: last7DaysData.map((d) => d.VolumeOfWaste),
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>

      <div className="mx-8 p-5">
        <div className="flex justify-center items-center pt-5">
          <p className="text-xl">Locations of Landfill and STS</p>
        </div>
        <MapView/>
      </div>
    </div>
  );
};

export default Dashboard;

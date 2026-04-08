import { FiUsers, FiImage } from "react-icons/fi";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";

function Analytics({ formatNumber }) {

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("https://localhost:7148/api/Admin/analytics", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setTotalUsers(res.data.totalUsers);
        setTotalImages(res.data.totalImages);
        setChartData(res.data.uploadsPerDay);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4 bg-gray-50 h-full overflow-y-auto">

      {/* Title */}
      <h2 className="text-2xl font-bold mb-6 text-pink-500 ">
        PixHub Analytics
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

        <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-5 rounded-xl shadow-md flex justify-between items-center hover:scale-105 transition">
          <div>
            <p className="text-white text-sm">Total Users</p>
            <h3 className="text-xl font-bold text-white">
              {formatNumber(totalUsers)}
            </h3>
          </div>
          <FiUsers className="w-6 h-6 text-white" />
        </div>

        <div className="bg-gradient-to-r from-green-400 to-green-600 p-5 rounded-xl shadow-md flex justify-between items-center hover:scale-105 transition">
          <div>
            <p className="text-white text-sm">Total Images</p>
            <h3 className="text-xl font-bold text-white">
              {formatNumber(totalImages)}
            </h3>
          </div>
          <FiImage className="w-6 h-6 text-white" />
        </div>

      </div>

      {/* Chart Section */}
      <div className="bg-white p-3 sm:p-6 rounded-xl shadow-md">
        <h3 className="text-base sm:text-lg font-semibold mb-4">
          Uploads Over Time
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: window.innerWidth < 640 ? -10 : 20, // mobile vs desktop
              bottom: 0,
            }}
          >
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis width={30} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Analytics;
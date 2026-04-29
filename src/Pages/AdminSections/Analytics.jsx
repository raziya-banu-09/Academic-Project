import { FiUsers, FiImage } from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
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

    const isMobile = window.innerWidth < 640;


  return (
    <div className="p-4 bg-gray-50 h-full overflow-y-auto">

      {/* Title */}
      <h2 className="text-2xl font-bold mb-6 text-pink-500 ">
        PixHub Analytics
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

        <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-2xl shadow-md flex justify-between items-center hover:scale-105 transition">
          <div>
            <p className="text-white text-sm">Total Users</p>
            <h3 className="text-xl font-bold text-white">
              {formatNumber(totalUsers)}
            </h3>
          </div>
          <FiUsers className="w-6 h-6 text-white" />
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-4 rounded-2xl shadow-md flex justify-between items-center hover:scale-105 transition">
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
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md">
      <h3 className="text-base sm:text-lg font-semibold mb-4 text-fuchsia-800">
        Uploads Over Time
      </h3>

      <ResponsiveContainer width="100%" height={isMobile ? 220 : 300}>
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: isMobile ? 10 : 20,
            left: isMobile ? -5 : 10,   
            bottom: 5,
          }}
        >
          {/* Light grid */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          {/* X Axis */}
          <XAxis
            dataKey="date"
            tick={{ fontSize: isMobile ? 9 : 12 }}
            interval={isMobile ? "preserveStartEnd" : 0} // reduces labels
            tickMargin={8}
            padding={{ right: 20 }}
          />

          {/* Y Axis */}
          <YAxis
            width={isMobile ? 25 : 30}
            tick={{ fontSize: isMobile ? 9 : 12 }}
          />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />

          {/* Line */}
          <Line
            type="monotone"
            dataKey="count"
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={false} 
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  
    </div>
  );
}

export default Analytics;
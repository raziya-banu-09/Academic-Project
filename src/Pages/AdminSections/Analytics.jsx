import { FiUsers, FiImage } from "react-icons/fi";

function Analytics({ totalUsers, totalImages, formatNumber }) {
  return (
    <>
      <h1 className="text-2xl font-bold text-center text-pink-500 font-[Poppins] mb-6">
        Admin Dashboard
      </h1>

      <div className="flex flex-col sm:flex-row p-2 justify-center gap-6 mb-6">

        <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4 h-24 flex items-center justify-between rounded-lg shadow-md transform transition duration-300 hover:scale-105 cursor-pointer w-full sm:w-120">
          <div>
            <p className="text-white text-sm">Total Users</p>
            <h3 className="text-lg font-bold text-white">{formatNumber(totalUsers)}</h3>
          </div>
          <FiUsers className="w-5 h-5 text-white" />
        </div>

        <div className="bg-gradient-to-r from-green-400 to-green-600 p-4 h-24 flex items-center justify-between rounded-lg shadow-md transform transition duration-300 hover:scale-105 cursor-pointer w-full sm:w-120">
          <div>
            <p className="text-white text-sm">Total Images</p>
            <h3 className="text-lg font-bold text-white">{formatNumber(totalImages)}</h3>
          </div>
          <FiImage className="w-5 h-5 text-white" />
        </div>

      </div>
    </>
  );
}

export default Analytics;
import React, { useState, useEffect } from "react";
import {
  FiUsers, FiImage, FiCheck, FiX, FiEdit, FiLogOut,
  FiMail, FiUserPlus, FiBarChart2, FiBell
} from "react-icons/fi";
import { Link } from "react-router-dom";
import Logo from '../Components/Logo';
import CloseButton from '../Components/CloseButton';

function AdminDashboard() {
  const [isEditing, setIsEditing] = useState(false);
  const [photo, setPhoto] = useState("https://i.pinimg.com/736x/d7/d0/13/d7d013aa4c1ee9bc96fc8ee329467d34.jpg");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setEmail(storedUser.email);
      setName(storedUser.username);
    }
  }, []);

  const [totalUsers, setTotalUsers] = useState(20000);
  const [totalImages, setTotalImages] = useState(809000);

  const pendingImages = [
    { id: 1, src: "https://i.pinimg.com/736x/a0/c0/c2/a0c0c2ffd113c7ac217be4b9113bf6f6.jpg" },
    { id: 2, src: "https://i.pinimg.com/1200x/29/67/62/2967628f8a4562bced4cdc73c9693884.jpg" },
    { id: 3, src: "https://i.pinimg.com/736x/4f/4c/4c/4f4c4cb2ad25925fba847b1a6fd4d78a.jpg" },
    { id: 4, src: "https://images.pexels.com/photos/1027811/pexels-photo-1027811.jpeg" },
    { id: 5, src: "https://i.pinimg.com/736x/63/2d/b6/632db665d5040160dcc0b4077480b7be.jpg" },
    { id: 6, src: "https://i.pinimg.com/736x/41/cf/6a/41cf6a72b3f638bf3bca9a677381d61c.jpg" },
    { id: 7, src: "https://i.pinimg.com/736x/4f/d8/51/4fd8513a20ebab568ae0afb64bc46804.jpg" },
    { id: 8, src: "https://i.pinimg.com/736x/f8/b0/d5/f8b0d5dd7988f532e35b9910458d9e8a.jpg" },
    { id: 9, src: "https://i.pinimg.com/1200x/9d/9b/df/9d9bdf1e1ad8688245dffa376c6a4630.jpg" },
    { id: 10, src: "https://i.pinimg.com/736x/76/95/a9/7695a947bfe79476bb07c9abb1062531.jpg" },
    { id: 11, src: "https://i.pinimg.com/1200x/10/0f/27/100f2754eb7fd5c7723fa3dcf2556945.jpg" },
    { id: 12, src: "https://i.pinimg.com/1200x/70/9a/84/709a84f2a7bae13582f5c56a983a7182.jpg" },
  ];

  const handleLogout = () => alert("Logged out successfully!");
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(0) + "k";
    return num;
  };

  return (
    <div className="min-h-screen max-w-full flex flex-col bg-gradient-to-br from-pink-50 to-blue-50">

      <header className="shadow-md bg-white w-full sticky top-0 z-50 flex justify-between items-center">
        <Logo />
        <CloseButton />
      </header>
      <div className="flex-1 flex flex-col md:flex-row pt-4 px-4 gap-4 md:gap-6">
        {/* Left Sidebar */}
        <div className="w-full md:w-[330px] bg-white shadow-xl rounded-2xl p-6 flex flex-col h-auto md:h-[calc(100vh-5rem)]">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <img src={photo} alt="Admin" className="w-32 h-32 rounded-full object-cover" />
              <label className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full cursor-pointer">
                <FiEdit className="w-4 h-4" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
            </div>

            {/* Name Edit */}
            <div className="flex flex-col items-center w-full">
              {!isEditing ? (
                <div className="flex items-center gap-2">
                  <p className="text-gray-800 font-semibold break-words text-center">{name}</p>
                  <FiEdit className="text-blue-500 w-5 h-5 cursor-pointer hover:scale-110 transition"
                    onClick={() => setIsEditing(true)} />
                </div>
              ) : (
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  onBlur={() => setIsEditing(false)} autoFocus
                  className="border border-gray-300 rounded-lg px-2 py-1 text-sm text-center w-full" />
              )}
            </div>

            <div className="w-full flex flex-col sm:flex-row sm:items-center">
              {/* Label + Icon */}
              <label className="flex items-center mb-2 sm:mb-0 sm:w-20">
                <FiMail className="mr-2 ml-1 w-5 h-4 text-blue-500" />
                <span className="text-md ">Email:</span>
              </label>

              {/* Email Input Field */}
              <input
                type="text"
                value={email}
                readOnly
                className="w-full border border-gray-400 rounded-lg ml-2 px-4 py-2 text-sm bg-gray-100 cursor-not-allowed"
              />

            </div>
          </div>

          {/* Sidebar Menu */}
          <div className="mt-2 space-y-0">
            <button className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
              <FiUsers className="mr-2 text-green-500" /> Registered Users
            </button>
            <button className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
              <FiUserPlus className="mr-2 text-purple-500" /> New Users
            </button>
            <button className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
              <FiBarChart2 className="mr-2 text-orange-500" /> Analytics
            </button>
            <button className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
              <FiBell className="mr-2 text-red-500" /> Notifications
            </button>
            {/* Logout Button */}
            <div className="mt-4 flex justify-center">
              <Link to="/">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition text-sm sm:text-base"
                >
                  <FiLogOut className="w-5 h-5" /> Logout
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex-1 bg-white shadow-xl rounded-2xl p-4 overflow-hidden md:h-[calc(100vh-5rem)]"
        >
          <h1 className="text-2xl font-bold text-center text-pink-500 font-[Poppins] mb-6">Admin Dashboard</h1>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row p-2 justify-center gap-6 mb-6">
            {/* Total Users */}
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4 h-24 
                          flex items-center justify-between rounded-lg shadow-md 
                          transform transition duration-300 hover:scale-105 cursor-pointer 
                          w-full sm:w-120">
              <div>
                <p className="text-white text-sm">Total Users</p>
                <h3 className="text-lg font-bold text-white">{formatNumber(totalUsers)}</h3>
              </div>
              <FiUsers className="w-5 h-5 text-white" />
            </div>

            {/* Total Images */}
            <div className="bg-gradient-to-r from-green-400 to-green-600 p-4 h-24 
                          flex items-center justify-between rounded-lg shadow-md 
                          transform transition duration-300 hover:scale-105 cursor-pointer 
                          w-full sm:w-120">
              <div>
                <p className="text-white text-sm">Total Images</p>
                <h3 className="text-lg font-bold text-white">{formatNumber(totalImages)}</h3>
              </div>
              <FiImage className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Pending Images Section */}
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Images for Approval</h2>
          <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 border-white rounded-2xl">
              {pendingImages.map((img) => (
                <div key={img.id} className="relative overflow-hidden rounded-xl shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer">
                  <img src={img.src} alt={"Pending" + img.id} className="w-full h-64 object-cover rounded-xl" />
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-6">
                    <button className="flex items-center bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition">
                      <FiCheck className="mr-1" /> Accept
                    </button>
                    <button className="flex items-center bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition">
                      <FiX className="mr-1" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
export default AdminDashboard;
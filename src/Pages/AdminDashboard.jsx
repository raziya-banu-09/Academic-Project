import React, { useState, useEffect } from "react";
import {
  FiUsers, FiImage, FiEdit, FiLogOut,
  FiMail, FiBarChart2, FiGrid, FiTrendingUp
} from "react-icons/fi";
import { Link } from "react-router-dom";
import Logo from '../Components/Logo';
import CloseButton from '../Components/CloseButton';
import Analytics from "../Pages/AdminSections/Analytics";
import ImagesApproval from "../Pages/AdminSections/ImagesApproval";
import AddCategory from "../Pages/AdminSections/AddCategory";
import RegisteredUsers from "./AdminSections/RegisteredUsers";
import { IoMdImages } from "react-icons/io";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function AdminDashboard() {

  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [photo, setPhoto] = useState("https://i.pinimg.com/736x/d7/d0/13/d7d013aa4c1ee9bc96fc8ee329467d34.jpg");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  //get admin profile
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("https://localhost:7148/api/Admin/admin-profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setName(res.data.username);
        setEmail(res.data.email);

        if (res.data.profileImage) {
          setPhoto("data:image/jpeg;base64," + res.data.profileImage);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  //admin profile update
  const [selectedFile, setSelectedFile] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file); // store file
    setPhoto(URL.createObjectURL(file)); // preview image
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();

      formData.append("Username", name);

      if (selectedFile) {
        formData.append("ProfileImage", selectedFile);
      }

      await axios.put(
        "https://localhost:7148/api/Admin/update-admin-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Profile updated successfully");

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  const [activeSection, setActiveSection] = useState("dashboard");


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };


  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(0) + "k";
    return num;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen max-w-full flex flex-col bg-gradient-to-br from-pink-50 to-blue-50"
    >

      <header className="shadow-md bg-white w-full sticky top-0 z-50 flex justify-between items-center overflow-hidden">
        <Logo />
        <CloseButton />
      </header>
      <div className="flex-1 flex flex-col md:flex-row pt-4 px-4 gap-4 md:gap-6">
        {/* Left Sidebar */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full md:w-[300px] bg-white shadow-lg rounded-2xl p-5 flex flex-col justify-between h-auto md:h-[calc(100vh-5rem)]"
        >

          {/* TOP SECTION */}
          <div className="flex flex-col items-center gap-3">

            {/* Profile Image */}
            <div className="relative group">
              <img
                src={photo}
                alt="Admin"
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition">

                <label
                  title="Change photo"
                  className="bg-white text-blue-600 p-2 rounded-full cursor-pointer hover:scale-110 transition"
                >
                  <FiEdit className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </label>

                <button
                  title="Remove photo"
                  className="bg-white text-red-500 h-8 w-8 rounded-full hover:scale-110 transition"
                  onClick={() => {
                    setPhoto("https://i.pinimg.com/736x/d7/d0/13/d7d013aa4c1ee9bc96fc8ee329467d34.jpg");
                    setSelectedFile(null);
                  }}
                >
                  ✕
                </button>

              </div>
            </div>

            {/* Name */}
            <p className="text-lg font-semibold text-gray-800">{name}</p>

            {/* Email */}
            <div className="w-fit text-center block text-gray-900 md:mb-0 mb-1.5">
              <p className="text-sm bg-gray-100 rounded-lg outline-none px-2 py-2 cursor-not-allowed">{email}</p>
            </div>

          </div>

          {/* MENU SECTION */}
          <div>

            <motion.button
              whileHover={{ x: 6 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center w-full p-2 rounded-lg hover:bg-gray-100 ${activeSection === "registeredUsers" ? "bg-gray-100" : ""}`}
              onClick={() => setActiveSection("registeredUsers")}
            >
              <FiUsers className="mr-2 text-green-500" /> Registered Users
            </motion.button>

            <motion.button
              whileHover={{ x: 6 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setActiveSection("category")}
            >
              <FiGrid className="mr-2 text-purple-500" /> Add Category
            </motion.button>

            <motion.button
              whileHover={{ x: 6 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setActiveSection("analytics")}
            >
              <FiBarChart2 className="mr-2 text-orange-500" /> Analytics
            </motion.button>

            <motion.button
              whileHover={{ x: 6 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setActiveSection("images")}
            >
              <FiImage className="mr-2 text-red-500" /> Images for Approval
            </motion.button>

          </div>

          {/* LOGOUT */}
          <div className="flex justify-center mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-fit flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white"
              onClick={handleLogout}
            >
              <FiLogOut /> Logout
            </motion.button>

          </div>

        </motion.div>

        {/* Right Sidebar */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 bg-white rounded-2xl p-5 overflow-y-auto md:h-[calc(100vh-5rem)]" >

          {/* Dashboard Welcome Panel */}
          {activeSection === "dashboard" && (
            <div className="h-full w-full flex items-center justify-center">

              <div className="w-full h-full rounded-2xl p-10 flex flex-col justify-center 
    bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 text-black
    relative overflow-hidden">

                {/* Background Glow Circles */}
                <div className="absolute w-72 h-72 bg-white/10 rounded-full -top-20 -left-20 blur-2xl"></div>
                <div className="absolute w-72 h-72 bg-white/10 rounded-full -bottom-20 -right-20 blur-2xl"></div>

                {/* Content */}
                <div className="relative z-10 max-w-2xl">

                  <h1 className="text-4xl font-bold mb-4">
                    Welcome Back, Admin 👋
                  </h1>

                  <p className="text-lg text-black/90 mb-8 font-[Poppins]">
                    Manage your platform efficiently. Approve images, organize
                    categories, and monitor user activity from this admin dashboard.
                    Use the sidebar to navigate between different sections.
                  </p>

                  {/* Feature Highlights */}
                  <div className="flex flex-wrap gap-4">

                    <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md px-5 py-3 rounded-lg">
                      <IoMdImages className="text-xl" />
                      <span className="font-medium">Image moderation</span>
                    </div>

                    <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md px-5 py-3 rounded-lg">
                      <FiTrendingUp className="text-xl" />
                      <span className="font-medium">Platform Analytics</span>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* Registered Users Section */}
          {activeSection === "registeredUsers" && <RegisteredUsers />}

          {/* Category Section */}
          {activeSection === "category" && <AddCategory />}

          {/* Analytics Section */}
          {activeSection === "analytics" && (
            <Analytics
              formatNumber={formatNumber}
            />
          )}

          {/* Image Approval Section */}
          {activeSection === "images" && <ImagesApproval />
          }

        </motion.div>
      </div >
    </motion.div >
  );
}
export default AdminDashboard;
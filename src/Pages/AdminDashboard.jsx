import React, { useState, useEffect, useCallback, memo } from "react";
import {
  FiUsers, FiImage, FiEdit, FiLogOut,
  FiBarChart2, FiGrid, FiTrendingUp, FiMenu, FiX, FiHome
} from "react-icons/fi";
import Logo from '../Components/Logo';
import CloseButton from '../Components/CloseButton';
import Analytics from "../Pages/AdminSections/Analytics";
import ImagesApproval from "../Pages/AdminSections/ImagesApproval";
import AddCategory from "../Pages/AdminSections/AddCategory";
import RegisteredUsers from "./AdminSections/RegisteredUsers";
import { IoMdImages } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const MENU_ITEMS = [
  { id: "registeredUsers", label: "Registered Users",   icon: <FiUsers />,     color: "text-green-500",  bg: "bg-green-50"  },
  { id: "category",        label: "Add Category",        icon: <FiGrid />,      color: "text-purple-500", bg: "bg-purple-50" },
  { id: "analytics",       label: "Analytics",           icon: <FiBarChart2 />, color: "text-orange-500", bg: "bg-orange-50" },
  { id: "images",          label: "Images for Approval", icon: <FiImage />,     color: "text-red-500",    bg: "bg-red-50"    },
];

const SidebarContent = memo(({
  isMobile, photo, name, email,
  activeSection, onSectionChange, onPhotoChange, onRemovePhoto, onLogout,
}) => (
  <div className={`flex flex-col ${isMobile ? "h-full" : "justify-between h-full"}`}>
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        <img
          src={photo}
          alt="Admin"
          className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-pink-200"
        />
        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all duration-300">
          <label title="Change photo" className="bg-white text-blue-600 p-1.5 rounded-full cursor-pointer hover:scale-110 transition">
            <FiEdit className="w-3.5 h-3.5" />
            <input type="file" accept="image/*" className="hidden" onChange={onPhotoChange} />
          </label>
          <button
            title="Remove photo"
            className="bg-white text-red-500 h-7 w-7 rounded-full hover:scale-110 transition text-xs font-bold"
            onClick={onRemovePhoto}
          >✕</button>
        </div>
      </div>

      <p className="text-base font-semibold text-gray-800">{name}</p>

      <div className="w-fit text-center mb-3">
        <p className="text-xs bg-gray-100 rounded-lg px-3 py-2 cursor-not-allowed text-gray-500">{email}</p>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-1" />
    </div>

    {/* MENU */}
    <div className="flex flex-col gap-1 flex-1 mt-2">
      {MENU_ITEMS.map((item) => (
        <motion.button
          key={item.id}
          whileHover={{ x: 5, transition: { duration: 0.15 } }}
          whileTap={{ scale: 0.97 }}
          className={`
            flex items-center w-full px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium
            ${activeSection === item.id
              ? `${item.bg} ${item.color} shadow-sm`
              : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"}
          `}
          onClick={() => onSectionChange(item.id)}
        >
          <span className={`mr-3 text-base ${activeSection === item.id ? item.color : "text-gray-800"}`}>
            {item.icon}
          </span>
          {item.label}
          {activeSection === item.id && (
            <motion.span
              layoutId="activeIndicator"
              className={`ml-auto w-1.5 h-1.5 rounded-full ${item.color.replace("text-", "bg-")}`}
            />
          )}
        </motion.button>
      ))}
    </div>

    {/* LOGOUT */}
    <div className="flex justify-center mt-4 pt-4 border-t border-gray-100">
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-400 text-white text-sm font-medium shadow-md shadow-red-100"
        onClick={onLogout}
      >
        <FiLogOut className="text-base" /> Logout
      </motion.button>
    </div>
  </div>
));


function AdminDashboard() {
  const navigate = useNavigate();

  const [photo, setPhoto] = useState("https://i.pinimg.com/736x/d7/d0/13/d7d013aa4c1ee9bc96fc8ee329467d34.jpg");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://localhost:7148/api/Admin/admin-profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setName(res.data.username);
        setEmail(res.data.email);
        if (res.data.profileImage) {
          setPhoto("data:image/jpeg;base64," + res.data.profileImage);
        }
      })
      .catch(console.error);
  }, []);

  const handlePhotoChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPhoto(URL.createObjectURL(file));
  }, []);

  const handleRemovePhoto = useCallback(() => {
    setPhoto("https://i.pinimg.com/736x/d7/d0/13/d7d013aa4c1ee9bc96fc8ee329467d34.jpg");
    setSelectedFile(null);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  const handleSectionChange = useCallback((sectionId) => {
    setActiveSection(sectionId);
    setMobileSidebarOpen(false);
  }, []);

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
    try {
      const formData = new FormData();
      formData.append("Username", name);
      if (selectedFile) formData.append("ProfileImage", selectedFile);
      await axios.put("https://localhost:7148/api/Admin/update-admin-profile", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      alert("Profile updated successfully");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(0) + "k";
    return num;
  };

  const sectionLabels = {
    dashboard: "Dashboard",
    registeredUsers: "Registered Users",
    category: "Add Category",
    analytics: "Analytics",
    images: "Images for Approval",
  };

  const sidebarProps = {
    photo, name, email, activeSection,
    onSectionChange: handleSectionChange,
    onPhotoChange: handlePhotoChange,
    onRemovePhoto: handleRemovePhoto,
    onLogout: handleLogout,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen max-w-full flex flex-col bg-gradient-to-br from-pink-50 to-blue-50"
    >
      {/* Header */}
      <header className="shadow-md bg-white w-full sticky top-0 z-50 flex justify-between items-center overflow-hidden">
        <Logo />
        <motion.button
          className="md:hidden flex items-center justify-center w-10 h-10 mr-2 rounded-xl text-gray-900 hover:bg-gray-100 transition"
          onClick={() => setMobileSidebarOpen(true)}
          whileTap={{ scale: 0.9 }}
          aria-label="Open sidebar"
        >
          <FiMenu className="text-xl" />
        </motion.button>
        <div className="hidden md:block">
          <CloseButton />
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 h-full w-[90vw] max-w-[300px] bg-white shadow-2xl z-50 md:hidden flex flex-col p-5 rounded-l-3xl"
            >
              <div className="flex justify-end mb-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileSidebarOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
                >
                  <FiX className="text-base" />
                </motion.button>
              </div>
              <SidebarContent isMobile={true} {...sidebarProps} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col md:flex-row pt-4 px-4 gap-4 md:gap-6">

        {/* Desktop Sidebar — motion only fires once on mount, never again */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:flex w-full md:w-[300px] bg-white shadow-lg rounded-2xl p-5 flex-col justify-between h-auto md:h-[calc(100vh-5rem)]"
        >
          <SidebarContent isMobile={false} {...sidebarProps} />
        </motion.div>

        {/* Mobile section label */}
        <div className="md:hidden flex items-center gap-3 px-1 -mt-1 mb-1">
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-widest">
            {sectionLabels[activeSection]}
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
        </div>

        {/* Right Content — plain div, no key, no remount */}
        <div className="flex-1 bg-white rounded-2xl p-4 md:p-5 overflow-y-auto md:h-[calc(100vh-5rem)] mb-4 md:mb-0 shadow-lg">

          {activeSection === "dashboard" && (
            <div className="h-full w-full flex items-center justify-center min-h-[60vh] md:min-h-0">
              <div className="w-full h-full rounded-2xl p-6 md:p-10 flex flex-col justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 text-black relative overflow-hidden">
                <div className="absolute w-72 h-72 bg-white/10 rounded-full -top-20 -left-20 blur-2xl" />
                <div className="absolute w-72 h-72 bg-white/10 rounded-full -bottom-20 -right-20 blur-2xl" />
                <div className="relative z-10 max-w-2xl">
                  <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Welcome Back, Admin 👋</h1>
                  <p className="text-sm md:text-lg text-black/90 mb-6 md:mb-8 font-[Poppins] leading-relaxed">
                    Manage your platform efficiently. Approve images, organize categories, and monitor
                    user activity from this admin dashboard. Use the sidebar to navigate between different sections.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md px-4 py-2.5 rounded-xl text-sm md:text-base">
                      <IoMdImages className="text-lg" /><span className="font-medium">Image moderation</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md px-4 py-2.5 rounded-xl text-sm md:text-base">
                      <FiTrendingUp className="text-lg" /><span className="font-medium">Platform Analytics</span>
                    </div>
                  </div>
                  {/* Mobile quick-nav tiles */}
                  <div className="grid grid-cols-2 gap-2.5 mt-6 md:hidden">
                    {MENU_ITEMS.map((item) => (
                      <motion.button
                        key={item.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSectionChange(item.id)}
                        className="flex flex-col items-center justify-center gap-1.5 bg-white/60 backdrop-blur-md px-2 py-3.5 rounded-xl shadow-sm w-full"
                      >
                        <span className={`text-xl ${item.color}`}>{item.icon}</span>
                        <span className="text-gray-700 text-[11px] font-semibold leading-tight text-center w-full">{item.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "registeredUsers" && <RegisteredUsers />}
          {activeSection === "category"         && <AddCategory />}
          {activeSection === "analytics"        && <Analytics formatNumber={formatNumber} />}
          {activeSection === "images"           && <ImagesApproval />}

        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 24 }}
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 shadow-2xl z-30 px-2 py-2 flex justify-around items-center"
      >
        {MENU_ITEMS.slice(0, 2).map((item) => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.85 }}
            onClick={() => handleSectionChange(item.id)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl relative"
          >
            {activeSection === item.id && (
              <motion.div layoutId="bottomNavActive" className={`absolute inset-0 rounded-xl ${item.bg}`}
                transition={{ type: "spring", stiffness: 380, damping: 30 }} />
            )}
            <span className={`relative text-lg ${activeSection === item.id ? item.color : "text-gray-400"}`}>{item.icon}</span>
            <span className={`relative text-[9px] font-semibold ${activeSection === item.id ? item.color : "text-gray-400"}`}>
              {item.label.split(" ")[0]}
            </span>
          </motion.button>
        ))}

        {/* Home — center */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => handleSectionChange("dashboard")}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl relative"
        >
          {activeSection === "dashboard" && (
            <motion.div layoutId="bottomNavActive" className="absolute inset-0 rounded-xl bg-blue-50"
              transition={{ type: "spring", stiffness: 380, damping: 30 }} />
          )}
          <span className={`relative text-lg ${activeSection === "dashboard" ? "text-blue-500" : "text-gray-400"}`}>
            <FiHome />
          </span>
          <span className={`relative text-[9px] font-semibold ${activeSection === "dashboard" ? "text-blue-500" : "text-gray-400"}`}>
            Home
          </span>
        </motion.button>

        {MENU_ITEMS.slice(2).map((item) => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.85 }}
            onClick={() => handleSectionChange(item.id)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl relative"
          >
            {activeSection === item.id && (
              <motion.div layoutId="bottomNavActive" className={`absolute inset-0 rounded-xl ${item.bg}`}
                transition={{ type: "spring", stiffness: 380, damping: 30 }} />
            )}
            <span className={`relative text-lg ${activeSection === item.id ? item.color : "text-gray-400"}`}>{item.icon}</span>
            <span className={`relative text-[9px] font-semibold ${activeSection === item.id ? item.color : "text-gray-400"}`}>
              {item.label.split(" ")[0]}
            </span>
          </motion.button>
        ))}
      </motion.nav>

      <div className="md:hidden h-16" />
    </motion.div>
  );
}

export default AdminDashboard;
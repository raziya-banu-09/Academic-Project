import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiEdit,
  FiLogOut,
  FiPhone,
  FiUpload,
  FiLock,
  FiMail,
  FiTrash2,
} from "react-icons/fi";
import Logo from "../Components/Logo";
import CloseButton from "../Components/CloseButton";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserProfile() {

  const navigate = useNavigate();
  const [photo, setPhoto] = useState("/profileImage.png");
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [savedImages, setSavedImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [activeTab, setActiveTab] = useState("saved");
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [loadingUploaded, setLoadingUploaded] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempContact, setTempContact] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("https://localhost:7148/api/User/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setName(data.username);
        setEmail(data.email);
        setContact(data.contactNumber);
        if (data.profileImage) {
          setPhoto(`data:image/jpeg;base64,${data.profileImage}`);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("username", tempName);
      formData.append("contactNumber", tempContact);
      if (selectedFile) formData.append("ProfileImage", selectedFile);

      await axios.put(
        "https://localhost:7148/api/User/update-profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setName(tempName);
      setContact(tempContact);

      if (password) {
        await axios.put(
          "https://localhost:7148/api/User/update-password",
          { password },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Password updated successfully!");
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setPassword("");
      setSelectedFile(null);

    } catch (error) {
      console.error(error);
      toast.error("Update failed!");
    }
  };

  const handlePasswordSave = async () => {
    const token = localStorage.getItem("token");

    if (!password) {
      toast.error("Password cannot be empty!");
      return;
    }

    try {
      await axios.put(
        "https://localhost:7148/api/User/update-password",
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Password updated successfully!");
      setPassword("");
      setShowPasswordBox(false);
    } catch (error) {
      console.error(error);
      toast.error("Password update failed!");
    }
  };

  const handlePasswordCancel = () => {
    setPassword("");
    setShowPasswordBox(false);
  };

  useEffect(() => {
    const fetchSavedImages = async () => {
      try {
        setLoadingSaved(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("https://localhost:7148/api/Save/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedImages(res.data || []);
      } catch (err) {
        console.error("Error fetching saved images", err);
      } finally {
        setLoadingSaved(false);
      }
    };

    if (activeTab === "saved") fetchSavedImages();
  }, [activeTab]);

  useEffect(() => {
    const fetchUploadedImages = async () => {
      try {
        setLoadingUploaded(true);
        const token = localStorage.getItem("token");

        const userRes = await axios.get("https://localhost:7148/api/User/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userId = userRes.data.userId;

        const res = await axios.get(`https://localhost:7148/api/image/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formatted = res.data.map(img => ({
          id: img.imageId,
          imageUrl: img.imageUrl,
          title: img.title,
          description: img.description,
          categoryId: img.categoryId
        }));

        setUploadedImages(formatted);
      } catch (err) {
        console.error("Error loading uploaded images", err);
      } finally {
        setLoadingUploaded(false);
      }
    };

    if (activeTab === "uploaded") fetchUploadedImages();
  }, [activeTab]);

  const handleDeleteUploaded = (id) => {
    toast(
      ({ closeToast }) => (
        <div className="w-[260px] text-center">
          <div className="text-2xl mb-2">⚠️</div>
          <p className="text-sm text-gray-700 mb-4">
            Do you really want to delete this image?
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={closeToast}
              className="px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem("token");
                  await axios.delete(`https://localhost:7148/api/image/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  setUploadedImages(prev => prev.filter(img => img.id !== id));
                  toast.success("Image deleted successfully!");
                } catch (err) {
                  console.error(err);
                  toast.error("Delete failed ❌");
                }
                closeToast();
              }}
              className="px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false, draggable: false }
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const imagesToShow = activeTab === "saved" ? savedImages : uploadedImages;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen max-w-full overflow-hidden flex flex-col bg-gradient-to-br from-pink-50 to-blue-50"
    >
      {/* HEADER */}
      <header className="shadow-md bg-white w-full sticky top-0 z-50 flex justify-between items-center px-3 md:px-0">
        <Logo />
        <CloseButton />
      </header>

      <div className="flex-1 flex flex-col md:flex-row pt-2 md:pt-4 px-3 md:px-4 gap-4 md:gap-6">

        {/* ── LEFT SIDEBAR ─────────────────────────────────────── */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-[320px] bg-white shadow-xl rounded-2xl p-4 md:p-6 flex flex-col h-auto md:h-[calc(100vh-5rem)]"
        >
          {/* Edit / Cancel / Done row */}
          <div className="w-full mb-3">
            {!isEditing ? (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setTempName(name);
                    setTempContact(contact);
                    setIsEditing(true);
                  }}
                  className="text-blue-600 font-medium cursor-pointer"
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center text-sm font-medium">
                <button onClick={() => setIsEditing(false)} className="text-gray-600">
                  Cancel
                </button>
                <span className="font-semibold text-gray-800">Edit Profile</span>
                <button onClick={handleSaveChanges} className="text-blue-600 cursor-pointer">
                  Done
                </button>
              </div>
            )}
          </div>

          {/* ── VIEW MODE ── */}
          {!isEditing ? (
           
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">

              {/* Mobile: row layout */}
              <div className="flex md:hidden w-full items-center gap-4 bg-gray-50 rounded-2xl p-4">
                <img
                  src={photo}
                  alt="User"
                  className="w-20 h-20 rounded-full object-cover shadow-lg flex-shrink-0 border-2 border-white"
                />
                <div className="text-left min-w-0">
                  <p className="text-base font-bold text-gray-800 truncate">{name}</p>
                  <p className="text-xs text-gray-500 truncate">{email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {contact ? contact : "No contact added"}
                  </p>
                </div>
              </div>

              {/* Desktop: original centred layout (hidden on mobile) */}
              <img
                src={photo}
                alt="User"
                className="hidden md:block w-32 h-32 rounded-full object-cover shadow-xl"
              />
              <div className="hidden md:block">
                <p className="text-xl font-bold">{name}</p>
                <p className="text-gray-500">{email}</p>
              </div>
              <div className="hidden md:block w-full bg-gray-50 rounded-xl p-4 text-sm space-y-2">
                <p><strong>Contact:</strong> {contact ? contact : "Not added"}</p>
              </div>
            </div>

          ) : (
            /* ── EDIT MODE (unchanged) ── */
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex-1 flex flex-col space-y-5"
            >
              <div className="flex flex-col items-center gap-2">
                <label className="relative cursor-pointer group">
                  <img
                    src={photo}
                    alt="User"
                    className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-white"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center text-white text-lg transition">
                    <FiEdit />
                  </div>
                  <input
                    type="file"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setSelectedFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => setPhoto(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                <button
                  onClick={() => { setPhoto("/profileImage.png"); setSelectedFile(null); }}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove Photo
                </button>
              </div>

              <div className="text-sm space-y-3">
                <div>
                  <label className="block text-gray-600 mb-1.5 text-xs font-medium">Username</label>
                  <input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5 text-xs font-medium">Contact Number</label>
                  <input
                    value={tempContact}
                    onChange={(e) => setTempContact(e.target.value)}
                    className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5 text-xs font-medium">New Password</label>
                  <input
                    type="password"
                    placeholder="Leave blank to keep current"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* LOGOUT */}
          <div className="flex justify-center mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-fit flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-400 text-white"
              onClick={handleLogout}
            >
              <FiLogOut /> Logout
            </motion.button>
          </div>
        </motion.div>

        {/* ── RIGHT PANEL ──────────────────────────────────────── */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 bg-white shadow-xl rounded-2xl p-3 md:p-4 overflow-hidden h-auto md:h-[calc(100vh-5rem)]"
        >
          {/*
           * DESKTOP header: original layout (tabs left, upload button right)
           * MOBILE header: upload button full-width on top, tabs as a pill switcher below
           */}

          {/* ── Mobile header ── */}
          <div className="flex md:hidden flex-col gap-3 mb-3">
            {/* Upload button — full width */}
            <Link to="/upload" className="w-full">
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="bg-pink-500 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 w-full font-medium"
              >
                Upload <FiUpload />
              </motion.button>
            </Link>

            {/* Pill tab switcher */}
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
              {["saved", "uploaded"].map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                        : "text-gray-500"
                    }`}
                  >
                    {tab === "saved" ? "Saved" : "Uploaded"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Desktop header (original, hidden on mobile) ── */}
          <div className="hidden md:flex flex-row justify-between items-end border-b border-gray-200 mb-2 gap-2">
            <Link to="/upload" className="w-auto order-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-pink-500 text-white px-5 py-2 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                Upload <FiUpload />
              </motion.button>
            </Link>

            <div className="flex gap-2 order-1">
              {["saved", "uploaded"].map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-6 py-2 font-semibold capitalize rounded-t-lg transition ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg border border-gray-200 border-b-0"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {tab === "saved" ? "Saved Images" : "Uploaded Images"}
                    {isActive && (
                      <motion.span
                        layoutId="activeTabGlow"
                        className="absolute inset-x-2 -bottom-1 h-1 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* ── IMAGES GRID ── */}
          <div className="overflow-y-auto overflow-x-hidden h-[calc(100%-3.5rem)]">
            {(activeTab === "saved" && loadingSaved) ||
            (activeTab === "uploaded" && loadingUploaded) ? (
              <div className="h-full flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
              </div>

            ) : imagesToShow.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-gray-500 text-center">
                <p className="text-lg font-semibold">
                  {activeTab === "saved" ? "No saved images yet" : "No uploaded images yet"}
                </p>
              </div>

            ) : (
              <div className="grid grid-cols-2 mt-3 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 w-full pb-6">
                {imagesToShow.map((img) => {
                  const id = img.id || img.imageId;
                  const imageSrc = img.imageUrl;

                  return (
                    <motion.div
                      key={id}
                      whileHover={{ scale: 1.03 }}
                      className="relative rounded-xl shadow-lg overflow-hidden"
                    >
                      <img
                        src={imageSrc}
                        alt="img"
                        className="w-full h-36 md:h-60 object-cover cursor-pointer"
                        onClick={() => navigate(`/image/${id}`, { state: { image: img } })}
                      />

                      {activeTab === "uploaded" && (
                        <div className="absolute top-2 right-2 flex gap-1.5">
                          <button
                            onClick={() => navigate("/edit-image", { state: { image: img } })}
                            className="bg-blue-500 text-white hover:bg-blue-600 p-1.5 rounded-full"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUploaded(id)}
                            className="bg-red-500 text-white hover:bg-red-600 p-1.5 rounded-full"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default UserProfile;
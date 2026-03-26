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
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

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


  //user profile update handler  
  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();

      formData.append("username", name);
      formData.append("contactNumber", contact);

      if (selectedFile) {
        formData.append("ProfileImage", selectedFile);
      }

      const response = await axios.put(
        "https://localhost:7148/api/User/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile updated successfully");

      // Update profile photo dynamically without reloading
      if (selectedFile) {
        const reader = new FileReader();

        reader.onloadend = () => {
          setPhoto(reader.result); // show new image immediately
        };

        reader.readAsDataURL(selectedFile);

      }

    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  const handlePasswordSave = async () => {
    const token = localStorage.getItem("token");

    if (!password) {
      alert("Password cannot be empty");
      return;
    }

    try {
      await axios.put(
        "https://localhost:7148/api/User/update-password",
        {
          password: password
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Password updated successfully");
      setPassword("");
      setShowPasswordBox(false);

    } catch (error) {
      console.error("Password update failed", error);
      alert("Password update failed");
    }
  };

  const handlePasswordCancel = () => {
    setPassword("");
    setShowPasswordBox(false);
  };

  /* Load saved images */
  useEffect(() => {
    const fetchSavedImages = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://localhost:7148/api/Save/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSavedImages(res.data || []);
      } catch (err) {
        console.error("Error fetching saved images", err);
      }
    };

    if (activeTab === "saved") {
      fetchSavedImages();
    }
  }, [activeTab]);

  /* Load uploaded images */
  useEffect(() => {
  const fetchUploadedImages = async () => {
    try {
      const token = localStorage.getItem("token");

      const userRes = await axios.get(
        "https://localhost:7148/api/User/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const userId = userRes.data.userId;

      const res = await axios.get(
        `https://localhost:7148/api/image/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const formatted = res.data.map(img => ({
        id: img.imageId,
        imageUrl: img.imageUrl
      }));

      setUploadedImages(formatted);

    } catch (err) {
      console.error("Error loading uploaded images", err);
    }
  };

  if (activeTab === "uploaded") {
    fetchUploadedImages();
  }

}, [activeTab]);

  const handleDeleteUploaded = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7148/api/image/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUploadedImages(prev => prev.filter(img => img.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete image");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const imagesToShow =
    activeTab === "saved" ? savedImages : uploadedImages;

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

        {/* LEFT SIDEBAR */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-[320px] bg-white shadow-xl rounded-2xl p-4 md:p-6 flex flex-col h-auto md:h-[calc(100vh-5rem)]"
        >
          <div className="flex-1 flex flex-col items-center space-y-6">

            <div className="relative">
              <img
                src={photo}
                alt="User"
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover shadow-lg"
              />
              <label className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full cursor-pointer">
                <FiEdit />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setSelectedFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPhoto(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>

            {!isEditing ? (
              <div className="flex items-center gap-2">
                <p className="font-semibold text-center">{name}</p>
                <FiEdit
                  className="text-blue-500 cursor-pointer"
                  onClick={() => setIsEditing(true)}
                />
              </div>
            ) : (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setIsEditing(false)}
                autoFocus
                className="border rounded-lg px-2 py-1 text-sm"
              />
            )}

            {/* EMAIL */}
            <div className="w-full flex flex-col sm:flex-row gap-2 px-1 md:px-2">
              <div className="flex items-center gap-2">
                <FiMail className="text-amber-600 w-5 h-5" />
                <span className="text-gray-800 font-medium">Email:</span>
              </div>
              <input
                type="text"
                value={email}
                readOnly
                onChange={(e) => setEmail(e.target.value)}
                className="cursor-not-allowed w-full border border-gray-400 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600"
              />
            </div>

            {/* CONTACT */}
            <div className="w-full flex flex-col sm:flex-row gap-2 px-1 md:px-2">
              <div className="flex items-center gap-2">
                <FiPhone className="text-green-600 w-5 h-5" />
                <span className="text-gray-800 font-medium">Contact:</span>
              </div>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* PASSWORD */}
            <div className="w-full px-1 md:px-2">
              <div className="flex items-center justify-between mb-2">
                <div
                  onClick={() => setShowPasswordBox(true)}
                  className="flex gap-2 cursor-pointer"
                >
                  <FiLock className="text-red-600 w-5 h-5" />
                  <span className="text-gray-800 font-medium">
                    Change Password
                  </span>
                </div>

                {showPasswordBox && (
                  <div className="flex gap-3 text-lg">
                    <button
                      onClick={handlePasswordSave}
                      className="text-green-600"
                    >
                      ✅
                    </button>

                    <button
                      onClick={handlePasswordCancel}
                      className="text-red-600"
                    >
                      ✖
                    </button>
                  </div>
                )}
              </div>

              {showPasswordBox && (
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm"
                />
              )}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-4 py-2 rounded-lg bg-green-500 text-white"
              onClick={handleSaveChanges}
            >
              Save Changes
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white"
              onClick={handleLogout}
            >
              <FiLogOut /> Logout
            </motion.button>

          </div>
        </motion.div>

        {/* RIGHT PANEL */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 bg-white shadow-xl rounded-2xl p-3 md:p-4 overflow-hidden h-auto md:h-[calc(100vh-5rem)]"        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-gray-200 mb-2 gap-2">

            {/* UPLOAD BUTTON */}
            <Link to="/upload" className="w-full sm:w-auto order-1 sm:order-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-pink-500 text-white px-4 md:px-5 py-2 rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Upload <FiUpload />
              </motion.button>
            </Link>

            {/* TABS */}
            <div className="flex gap-2 order-2 sm:order-1">
              {["saved", "uploaded"].map((tab) => {
                const isActive = activeTab === tab;

                return (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-4 md:px-6 py-2 font-semibold capitalize rounded-t-lg transition
        ${isActive
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

          {/* IMAGES */}
          <div className="overflow-y-auto overflow-x-hidden h-[calc(100%-3.5rem)]">

            {imagesToShow.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-gray-500 text-center">
                <p className="text-lg font-semibold">
                  {activeTab === "saved"
                    ? "No saved images yet"
                    : "No uploaded images yet"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full pb-6">

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
                        className="w-full h-48 md:h-60 object-cover cursor-pointer"
                        onClick={() =>
                          navigate(`/image/${id}`, { state: { image: img } })
                        }
                      />

                      {activeTab === "uploaded" && (
                        <button
                          onClick={() => handleDeleteUploaded(id)}
                          className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600 p-2 rounded-full"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
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
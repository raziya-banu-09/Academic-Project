import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "../Components/Button";
import Logo from "../Components/Logo";
import { Link, useNavigate } from "react-router-dom";
import { FiUploadCloud, FiX } from "react-icons/fi";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const ImageUpload = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);


  const handleDivClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setTitle("");
    setDescription("");
    setCategory("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
  if (!selectedFile) return setError("Please select an image.");
  if (!title.trim() || !description.trim() || !category)
    return setError("Please fill all the details.");

  try {
    const token = localStorage.getItem("token");

    // ✅ GET USER ID FROM PROFILE API (SAFE WAY)
    const userRes = await axios.get(
      "https://localhost:7148/api/User/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const userId = userRes.data.userId; // ✅ IMPORTANT

    console.log("USER ID:", userId);

    const formData = new FormData();
    formData.append("File", selectedFile);
    formData.append("Title", title);
    formData.append("Description", description);
    formData.append("CategoryId", Number(category)); // ensure number
    formData.append("UserId", userId);

    await axios.post(
      "https://localhost:7148/api/image/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Image uploaded successfully!");
    navigate("/user-profile");

  } catch (err) {
    console.error("Upload failed", err.response?.data);

    const backendError = err.response?.data;

    if (backendError?.errors) {
      const messages = Object.values(backendError.errors)
        .flat()
        .join(", ");
      setError(messages);
    } else {
      setError(backendError?.title || "Upload failed");
    }
  }
};

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://localhost:7148/api/category/all");

        setCategoriesList(
          res.data.map((c, index) => ({
            id: c.id || c.Id || index+1,       
            title: c.title || c.Title       
          }))
        );

      } catch (err) {
        console.error("Failed to fetch categories", err);
        setCategoriesList([]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Logo />

      <div className="flex justify-center px-4 sm:px-8 mt-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-2xl p-4 sm:p-8 w-full max-w-6xl min-h-[480px]"
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">

            {/* LEFT : UPLOAD */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="md:w-1/2 flex items-center justify-center"
            >
              <div
                onClick={handleDivClick}
                className={`relative w-full h-48 sm:h-56 md:h-[360px] flex flex-col items-center justify-center cursor-pointer rounded-xl transition
              ${previewUrl
                    ? "bg-white"
                    : "border-2 border-dashed border-rose-400 bg-rose-50 hover:bg-rose-100 md:m-5"
                  }`}
              >
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt="preview"
                      className="max-h-full max-w-full rounded-lg object-contain"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Tap to change image
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center px-4">
                    <FiUploadCloud className="text-3xl text-rose-500 mb-2" />
                    <p className="text-rose-600 font-semibold text-base sm:text-lg">
                      Tap here to upload image
                    </p>
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </motion.div>

            {/* RIGHT : FORM */}
            <div className="md:w-1/2 flex flex-col justify-between m-0 md:m-4">

              <div className="space-y-4">

                <div>
                  <label className="font-semibold text-gray-700 text-sm">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setError("");
                    }}
                    className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 bg-neutral-100"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 text-sm">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setError("");
                    }}
                    className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 bg-neutral-100 h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 text-sm">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      console.log("Selected Category ID:", e.target.value);
                    }}
                    className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 bg-neutral-100"
                  >
                    <option value="">Select category</option>

                    {categoriesList.map((cat, index) => (
                      <option key={cat.id || index} value={cat.id}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>

              <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-3 sm:gap-6 mt-8 md:mt-8">

                <Button
                  onClick={handleUpload}
                  className="flex items-center justify-center gap-2 rounded-xl bg-rose-500 text-white px-6 py-2.5 text-sm"
                >
                  <FiUploadCloud />
                  Upload
                </Button>

                <Link to="/user-profile" className="w-full sm:w-auto">
                  <Button
                    onClick={handleCancel}
                    className="flex items-center justify-center gap-2 rounded-xl bg-neutral-200 text-gray-800 px-6 py-2.5 text-sm"
                  >
                    <FiX />
                    Cancel
                  </Button>
                </Link>

              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ImageUpload; 
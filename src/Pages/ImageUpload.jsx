import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "../Components/Button";
import Logo from "../Components/Logo";
import { Link, useNavigate } from "react-router-dom";
import { FiUploadCloud, FiX } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  const editImage = location.state?.image;
  const isEditMode = !!editImage;

  useEffect(() => {
    if (isEditMode) {
      setPreviewUrl(editImage.imageUrl);
      setTitle(editImage.title || "");
      setDescription(editImage.description || "");
      setCategory(editImage.categoryId || "");
    }
  }, [editImage]);

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

  const urlToFile = async (url, filename) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const handleUpload = async () => {
    if (!previewUrl) {
      return setError("Please select an image.");
    }

    try {
      const token = localStorage.getItem("token");

      // ✅ Get user ID
      const userRes = await axios.get(
        "https://localhost:7148/api/User/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const userId = userRes.data.userId;

      let fileToUpload = selectedFile;

      // ✅ If no new image selected → reuse old image
      if (!fileToUpload && previewUrl) {
        fileToUpload = await urlToFile(previewUrl, "existing-image.jpg");
      }

      // ✅ Prepare form data
      const formData = new FormData();
      formData.append("File", fileToUpload);
      formData.append("Title", title || "");
      formData.append("Description", description || "");
      formData.append("CategoryId", Number(category) || 0);
      formData.append("UserId", userId);

      // =============================
      // 🔥 EDIT MODE
      // =============================
      if (isEditMode) {

        // 1️⃣ Upload new (edited) image
        await axios.post(
          "https://localhost:7148/api/image/upload",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // 2️⃣ Delete old image (avoid duplicates)
        await axios.delete(
          `https://localhost:7148/api/image/${editImage.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast.success("Image updated & sent for approval!");

      } else {

        // =============================
        // 🟢 NORMAL UPLOAD
        // =============================
        await axios.post(
          "https://localhost:7148/api/image/upload",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast.success("Image uploaded successfully!");
      }

      // ✅ Redirect
      navigate("/user-profile");

    } catch (err) {
      console.error("FULL ERROR:", err.response);

      const backendError = err.response?.data;

      if (backendError?.errors) {
        const messages = Object.values(backendError.errors)
          .flat()
          .join(", ");
        toast.error(messages);
      } else {
        toast.error(backendError?.title || "Operation failed");
      }
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://localhost:7148/api/category/all");

        setCategoriesList(
          res.data.map((c, index) => ({
            id: c.id || c.Id || index + 1,
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
                    <option value="">-- Select --</option>

                    {categoriesList.map((cat, index) => (
                      <option key={cat.id || index} value={cat.id}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>

              <div className="flex flex-row md:justify-end gap-3 mt-8 w-full">
  
  {/* Upload Button */}
  <Button
    onClick={handleUpload}
    className="w-1/2 md:w-auto flex items-center justify-center gap-2 rounded-xl bg-rose-500 text-white px-4 py-2.5 text-sm"
  >
    <FiUploadCloud />
    {isEditMode ? "Update" : "Upload"}
  </Button>

  {/* Cancel Button */}
  <Link to="/user-profile" className="w-1/2 md:w-auto">
    <Button
      onClick={handleCancel}
      className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-200 text-gray-800 px-4 py-2.5 text-sm"
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
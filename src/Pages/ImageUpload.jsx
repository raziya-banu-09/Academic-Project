import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import Button from "../Components/Button";
import Logo from "../Components/Logo";
import { Link, useNavigate } from "react-router-dom";
import { FiUploadCloud, FiX } from "react-icons/fi";

const ImageUpload = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

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

  const handleUpload = () => {
    if (!selectedFile) {
      setError("Please select an image to upload.");
      return;
    }

    if (!title.trim() || !description.trim() || !category.trim()) {
      setError("Please fill all the details.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const newImage = {
        id: Date.now(),
        title,
        description,
        category,
        urls: {
          small: reader.result,
        },
      };

      const existingImages =
        JSON.parse(localStorage.getItem("uploadedImages")) || [];

      localStorage.setItem(
        "uploadedImages",
        JSON.stringify([newImage, ...existingImages])
      );

      alert("Image uploaded successfully!");
      navigate("/user-profile");
    };

    reader.readAsDataURL(selectedFile);
  };


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
              ${
                previewUrl
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

              {/* TITLE */}
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
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 bg-neutral-100 focus:ring-2 focus:ring-rose-400 text-sm"
                />
              </div>

              {/* DESCRIPTION */}
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
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 bg-neutral-100 h-24 resize-none focus:ring-2 focus:ring-rose-400 text-sm"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="font-semibold text-gray-700 text-sm">
                  Category
                </label>
                <input
                  type="text"
                  list="category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setError("");
                  }}
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 bg-neutral-100 focus:ring-2 focus:ring-rose-400 text-sm"
                />
                <datalist id="category">
                  <option value="Nature" />
                  <option value="Travel" />
                  <option value="Animals" />
                  <option value="Tech" />
                  <option value="Style" />
                  <option value="Food" />
                  <option value="Art" />
                  <option value="Sports" />
                  <option value="Gaming" />
                  <option value="Music" />
                </datalist>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-3 sm:gap-6 mt-8 md:mt-8">

              {/* Upload */}
              <Button
                onClick={handleUpload}
                className="flex items-center justify-center gap-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 px-6 py-2.5 text-sm transition hover:scale-105 shadow-md w-full sm:w-auto"
              >
                <FiUploadCloud className="text-lg shrink-0" />
                Upload
              </Button>

              {/* Cancel */}
              <Link to="/user-profile" className="w-full sm:w-auto">
                <Button
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 rounded-xl bg-neutral-200 text-gray-800 hover:bg-neutral-300 px-6 py-2.5 text-sm transition hover:scale-105 w-full sm:w-auto"
                >
                  <FiX className="text-lg shrink-0" />
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
}

export default ImageUpload;

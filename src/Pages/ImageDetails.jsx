import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../Components/Logo";
import CloseButton from "../Components/CloseButton";
import { FaRegHeart } from "react-icons/fa";
import { MdSaveAlt } from "react-icons/md";
import { GoBookmarkFill } from "react-icons/go";

const ImageDetails = () => {
  const profileImage =
    localStorage.getItem("profileImage") || "/profileImage.png";

  const { state } = useLocation();
  const navigate = useNavigate();
  const imageData = state?.image;

  const [likes, setLikes] = useState(imageData?.likes || 0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!imageData) return;
    const savedImages =
      JSON.parse(localStorage.getItem("savedImages")) || [];
    setSaved(savedImages.some((img) => img.id === imageData.id));
  }, [imageData]);

  const handleLike = () => {
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    setLiked(!liked);
  };

  const handleSaveAll = () => {
    let savedImages =
      JSON.parse(localStorage.getItem("savedImages")) || [];

    if (saved) {
      savedImages = savedImages.filter((img) => img.id !== imageData.id);
    } else {
      savedImages.push(imageData);
    }

    localStorage.setItem("savedImages", JSON.stringify(savedImages));
    setSaved(!saved);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imageData.urls.full);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${imageData.id}.jpg`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  if (!imageData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg font-semibold">Image not found</p>
        <button
          onClick={() => navigate("/home")}
          className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 overflow-hidden">
      <header className="shadow-md bg-white w-full sticky top-0 z-50 flex justify-between items-center">
        <Logo />
        <CloseButton />
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-6">

          {/* LEFT PANEL */}
          <div className="bg-white rounded-3xl shadow-lg p-4 flex flex-col">
            <div className="flex items-center justify-center">
              <img
                src={imageData.urls.full}
                className="max-h-[70vh] object-contain rounded-2xl"
                alt=""
              />
            </div>

            <div className="flex items-center mt-4">
              <img
                src={profileImage}
                className="w-9 h-9 rounded-full mr-3"
                alt=""
              />
              <div>
                <p className="font-semibold text-gray-800">
                  {imageData.user.username}
                </p>
                <p className="text-xs text-gray-500">Photographer</p>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-white rounded-3xl shadow-lg p-6 flex flex-col">

            <div className="flex justify-end mb-10 md:mt-6">
              <button
                onClick={handleSaveAll}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition
                  ${saved ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}
                `}
              >
                <GoBookmarkFill />
                {saved ? "Saved" : "Save"}
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm uppercase tracking-wide text-gray-400 mb-1">
                Category
              </p>
              <p className="text-gray-700 font-medium mb-4">
                {imageData.category || "No category specified"}
              </p>

              <p className="text-sm uppercase tracking-wide text-gray-400 mb-1 mt-10">
                Description
              </p>
              <p className="text-gray-700 font-medium leading-relaxed">
                {imageData.alt_description || "No description available"}
              </p>
            </div>

            <div className="flex gap-6 mt-auto mb-6">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition
                  ${liked ? "bg-red-500 text-white" : "bg-gray-100 hover:bg-gray-200"}
                `}
              >
                <FaRegHeart />
                {likes}
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 rounded-full bg-gray-100 hover:bg-gray-200 font-medium"
              >
                <MdSaveAlt />
                Download
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ImageDetails;

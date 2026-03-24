import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../Components/Logo";
import CloseButton from "../Components/CloseButton";
import { FaRegHeart } from "react-icons/fa";
import { MdSaveAlt } from "react-icons/md";
import { GoBookmarkFill } from "react-icons/go";
import axios from "axios";

const ImageDetails = () => {
  const ProfileImage =
    localStorage.getItem("ProfileImage") || "/profileImage.png";

  const token = localStorage.getItem("token");

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const { state } = useLocation();
  const navigate = useNavigate();

  const [imageData, setImageData] = useState(state?.image || null);


  //Likes count fetch
  useEffect(() => {
    if (!imageData) return;

    const fetchLikes = async () => {
      try {
        const res = await axios.get(
          `https://localhost:7148/api/Like/count/${imageData.imageId}`
        );
        setLikes(res.data.likes);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLikes();
  }, [imageData]);

  useEffect(() => {
    if (imageData) return;

    const id = state?.image?.imageId || window.location.pathname.split("/").pop();

    fetch(`https://localhost:7148/api/Image/${id}`)
      .then(res => res.json())
      .then(data => setImageData(data))
      .catch(err => console.error(err));
  }, []);

  const handleLike = async () => {
    try {
      if (!token) return;

      if (!liked) {
        await axios.post(
          `https://localhost:7148/api/Like/${imageData.imageId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.delete(
          `https://localhost:7148/api/Like/${imageData.imageId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      const res = await axios.get(
        `https://localhost:7148/api/Like/count/${imageData.imageId}`
      );

      setLikes(res.data.likes);
      setLiked(!liked);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!imageData) return;

    const fetchLikeStatus = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `https://localhost:7148/api/Like/isliked/${imageData.imageId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLiked(res.data.isLiked);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLikeStatus();
  }, [imageData]);

  useEffect(() => {
    if (!imageData || !token) return;

    const fetchSaveStatus = async () => {
      try {
        const res = await axios.get(
          `https://localhost:7148/api/Save/isSaved/${imageData.imageId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setSaved(res.data.isSaved);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSaveStatus();
  }, [imageData]);

  const handleSaveAll = async () => {
    try {
      if (!token) return;

      if (!saved) {
        await axios.post(
          `https://localhost:7148/api/Save/${imageData.imageId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.delete(
          `https://localhost:7148/api/Save/${imageData.imageId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setSaved(!saved);

    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await axios.post(
          `https://localhost:7148/api/Download/${imageData.imageId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      const response = await fetch(imageData.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${imageData.imageId}.jpg`;

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
                src={imageData.imageUrl}
                className="max-h-[70vh] object-contain rounded-2xl"
                alt=""
              />
            </div>

            <div className="flex items-center mt-4">
              <img
                src={imageData.profileImage || "/profileImage.png"}
                className="w-9 h-9 rounded-full mr-3"
                alt=""
              />
              <div>
                <p className="font-semibold text-gray-800">
                  {imageData.username}
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
                {imageData.categoryName || "No category specified"}
              </p>

              <p className="text-sm uppercase tracking-wide text-gray-400 mb-1 mt-10">
                Description
              </p>
              <p className="text-gray-700 font-medium leading-relaxed">
                {imageData.description || "No description available"}
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

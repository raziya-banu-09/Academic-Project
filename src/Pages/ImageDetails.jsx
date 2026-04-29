import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../Components/Logo";
import CloseButton from "../Components/CloseButton";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MdSaveAlt } from "react-icons/md";
import { GoBookmarkFill } from "react-icons/go";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const ImageDetails = () => {

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const role =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      setIsAdmin(role === "admin");
    }
  }, []);

  const ProfileImage =
    localStorage.getItem("ProfileImage") || "/profileImage.png";

  const token = localStorage.getItem("token");

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const { state } = useLocation();
  const navigate = useNavigate();

  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const imageId =
    state?.image?.imageId || window.location.pathname.split("/").pop();

  // ---------------- IMAGE FETCH ----------------
  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(`https://localhost:7148/api/Image/details/${imageId}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        setImageData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [imageId]);

  // ---------------- LIKE COUNT ----------------
  useEffect(() => {
    if (!imageData) return;
    axios
      .get(`https://localhost:7148/api/Like/count/${imageData.imageId}`)
      .then(res => setLikes(res.data.likes))
      .catch(err => console.error(err));
  }, [imageData]);

  // ---------------- LIKE STATUS ----------------
  useEffect(() => {
    if (!imageData || !token) return;
    axios
      .get(`https://localhost:7148/api/Like/isliked/${imageData.imageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setLiked(res.data.isLiked))
      .catch(err => console.error(err));
  }, [imageData]);

  // ---------------- SAVE STATUS ----------------
  useEffect(() => {
    if (!imageData || !token) return;
    axios
      .get(`https://localhost:7148/api/Save/is-saved/${imageData.imageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setSaved(res.data.isSaved))
      .catch(err => console.error(err));
  }, [imageData]);

  // ---------------- LIKE HANDLER ----------------
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

  // ---------------- SAVE HANDLER ----------------
  const handleSaveAll = async () => {
    try {
      if (!token) return;
      if (!saved) {
        await axios.post(
          `https://localhost:7148/api/Save/${imageData.imageId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSaved(true);
      } else {
        await axios.delete(
          `https://localhost:7148/api/Save/${imageData.imageId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSaved(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- DOWNLOAD ----------------
  const handleDownload = async () => {
    try {
      if (token) {
        await axios.post(
          `https://localhost:7148/api/Download/${imageData.imageId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center overflow-x-hidden bg-gradient-to-br from-slate-50 via-pink-50 to-blue-50">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-pink-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-pink-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-sm font-medium text-slate-400 tracking-widest uppercase">Loading</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-pink-50 to-blue-50 px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <span className="text-3xl">🖼️</span>
          </div>
          <p className="text-lg font-semibold text-slate-700 mb-2">Image not found</p>
          <p className="text-sm text-slate-400 mb-6 text-center">This image may have been removed or the link is broken.</p>
          <button
            onClick={() => navigate("/home")}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-2xl font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-blue-50/40">

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 w-full sticky top-0 z-50 flex justify-between items-center shadow-sm">
        <Logo />
        <CloseButton/>
      </header>

      <main className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-10">

        {/* Card wrapper */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl sm:rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-white overflow-hidden">
          <div className="flex flex-col lg:grid lg:grid-cols-2 min-h-[85vh] lg:min-h-0">

            {/* ── LEFT: Image Panel ── */}
            <div className="relative bg-gradient-to-br from-slate-100 to-slate-200/60 flex flex-col">

              {/* Image */}
              <div className="flex items-center justify-center p-2 sm:p-4">
                <img
                  src={imageData.imageUrl}
                  className="max-w-full max-h-[65vh] object-contain rounded drop-shadow-xl"
                  alt=""
                />
              </div>

              {/* Author strip */}
              <div className="flex items-center gap-3 px-5 py-4 bg-white/60 backdrop-blur-md border-t border-white/70">
                <div className="relative flex-shrink-0">
                  <img
                    src={imageData.profileImage || "/profileImage.png"}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                    alt=""
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white"></span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">
                    {imageData.username}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">Photographer</p>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Details Panel ── */}
            <div className="flex flex-col px-5 py-6 sm:px-8 sm:py-8 gap-6 lg:overflow-y-auto">

              {/* Save button row */}
              {!isAdmin && (
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveAll}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm
                      ${saved
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200 shadow-md"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                  >
                    <GoBookmarkFill className={saved ? "text-white" : "text-slate-500"} />
                    {saved ? "Saved" : "Save"}
                  </button>
                </div>
              )}

              {/* Metadata */}
              <div className="flex flex-col gap-5 flex-1">

                {/* Title */}
                <div className="bg-slate-50/80 rounded-2xl px-5 py-4 border border-slate-100">
                  <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-slate-400 mb-1.5">
                    Title
                  </p>
                  <p className="text-slate-800 font-semibold text-base sm:text-lg leading-snug">
                    {imageData.title || "No title available"}
                  </p>
                </div>

                {/* Category */}
                <div className="bg-slate-50/80 rounded-2xl px-5 py-4 border border-slate-100">
                  <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-slate-400 mb-1.5">
                    Category
                  </p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-pink-100 to-blue-100 text-pink-700 rounded-full text-sm font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 inline-block"></span>
                    {imageData.categoryName || "Uncategorized"}
                  </span>
                </div>

                {/* Description */}
                <div className="bg-slate-50/80 rounded-2xl px-5 py-4 border border-slate-100 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-slate-400 mb-1.5">
                    Description
                  </p>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                    {imageData.description || "No description available"}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">

                {/* Like */}
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 flex-1 justify-center sm:flex-none
                    ${liked
                      ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200"
                      : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-500"
                    }`}
                >
                  {liked
                    ? <FaHeart className="text-white text-base" />
                    : <FaRegHeart className="text-base" />
                  }
                  <span>{likes} {likes === 1 ? "Like" : "Likes"}</span>
                </button>

                {/* Download */}
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-200 hover:opacity-90 transition-opacity flex-1 justify-center sm:flex-none"
                >
                  <MdSaveAlt className="text-base" />
                  Download
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ImageDetails;
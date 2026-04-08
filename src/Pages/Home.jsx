import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../Components/Logo';
import SearchBar from '../Components/SearchBar';
import ImageGallery from './ImageGallery';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { jwtDecode } from "jwt-decode";
import { IoCloseOutline } from "react-icons/io5";

const Home = () => {
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryId, setCategoryId] = useState(null);

  useEffect(() => {
    if (location.state?.categoryId) {
      setCategoryId(location.state.categoryId);
      setSearchTerm(location.state.categoryName);
    } else {
      setCategoryId(null);
      setSearchTerm("");
    }
  }, [location.key]);

  const [profileImage, setProfileImage] = useState("/profileImage.png");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("https://localhost:7148/api/User/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.profileImage) {
          setProfileImage(`data:image/jpeg;base64,${data.profileImage}`);
        }
      });
  }, []);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      setIsAdmin(role === "admin");
    }
  }, []);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.div
      className="min-h-screen max-w-full flex flex-col bg-gradient-to-br from-pink-50 to-blue-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Navbar */}
      <motion.header
        className="bg-white shadow-md sticky top-0 z-50"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between gap-3 px-4">

          {/* Logo — hidden on mobile */}
          <div className="hidden md:flex flex-shrink-0">
            <Logo />
          </div>

          {/* Search Bar */}
          {/* Mobile: takes all space between left edge and 3-dots; Desktop: centered absolutely */}
          <div className="flex-1 md:flex-none md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:w-[40%]">
            <SearchBar
              value={searchTerm}
              setValue={setSearchTerm}
              onEnterSearch={() => setSearchQuery(searchTerm)}
              onClear={() => {
                setSearchTerm('');
                setSearchQuery('');
                setCategoryId(null);
              }}
            />
          </div>

          {/* Right: Desktop links + avatar */}
          <div className="hidden md:flex items-center space-x-10 flex-shrink-0">
            <Link to="/categories" className="relative group text-blue-500 font-bold">
              Categories
              <span className="absolute left-1/2 -bottom-1 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </Link>
            <Link to="/about" className="relative group text-pink-500 font-bold">
              About & Contact
              <span className="absolute left-1/2 -bottom-1 w-0 h-[2px] bg-pink-500 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </Link>
            <Link to={isAdmin ? "/admin-dashboard" : "/user-profile"}>
              <motion.img
                src={profileImage}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover cursor-pointer ring-2 ring-offset-2 ring-pink-200"
                whileHover={{ scale: 1.1 }}
              />
            </Link>
          </div>

          {/* Mobile: 3-dots */}
          <div className="md:hidden relative flex-shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <HiOutlineDotsVertical className="w-5 h-5 text-gray-600" />
            </button>

            <AnimatePresence>
              {isMobileMenuOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    className="fixed inset-0 z-[998] bg-black/30 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />

                  {/* Sidebar panel */}
                  <motion.div
                    className="fixed top-0 right-0 h-full w-72 bg-white z-[999] flex flex-col shadow-2xl"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-blue-50">
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Menu</p>
                      <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors"
                      >
                        <IoCloseOutline className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>

                    {/* Profile */}
                    <Link
                      to={isAdmin ? "/admin-dashboard" : "/user-profile"}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-4 px-5 py-5 hover:bg-gray-50 transition-colors">
                        <div className="relative flex-shrink-0">
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-pink-200 shadow"
                          />
                          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white"></span>
                        </div>
                        <div>
                          <p className="text-base font-bold text-gray-800">
                            {isAdmin ? "Admin Panel" : "My Profile"}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">View your account →</p>
                        </div>
                      </div>
                    </Link>

                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-4" />

                    {/* Nav links */}
                    <div className="flex flex-col px-3 py-3 gap-1">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-1">Explore</p>
                      <Link
                        to="/categories"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-100 text-lg flex-shrink-0">🗂️</span>
                        <div>
                          <p>Categories</p>
                          <p className="text-xs text-gray-400 font-normal">Browse by category</p>
                        </div>
                      </Link>
                      <Link
                        to="/about"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-pink-500 hover:bg-pink-50 transition-colors"
                      >
                        <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-pink-100 text-lg flex-shrink-0">💬</span>
                        <div>
                          <p>About & Contact</p>
                          <p className="text-xs text-gray-400 font-normal">Learn more & reach us</p>
                        </div>
                      </Link>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-4" />

                    {/* Footer */}
                    <div className="mt-auto px-5 py-5 border-t border-gray-100">
                      <p className="text-xs text-center text-gray-300 font-medium">PixHub © 2025</p>
                    </div>

                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ImageGallery
            searchTerm={searchQuery}
            categoryId={categoryId}
          />
        </motion.div>
      </main>

    </motion.div>
  );
};

export default Home;
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../Components/Logo';
import SearchBar from '../Components/SearchBar';
import ImageGallery from './ImageGallery';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineDotsVertical } from "react-icons/hi";
import  {jwtDecode} from "jwt-decode";
import ImageGalleryDemo from './ImageGalleryDemo';


const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ctgrySearch, setCtgrySearch] = useState(false);
  const location = useLocation();

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

  useEffect(() => {
    if (!location.state?.category) {
      setCtgrySearch(true);
    }
  }, []);


  useEffect(() => {
    if (location.state && location.state.category) {
      setSearchTerm(location.state.category);
      setCtgrySearch(true);
    }
  }, [location.key]);

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
      transition={{ duration: 0.5 }}>

      {/* Navbar */}
      <motion.header className="bg-white shadow-md sticky top-0 z-50"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">

          {/* Left: Logo */}
          <div className='hidden md:block'>
            <Logo />
          </div>

          {/* Center: Search Bar */}
          <div className='px-2'>
            <SearchBar
              value={searchTerm}
              setValue={setSearchTerm}
              onEnterSearch={() => setCtgrySearch(true)}
              onClear={() => {
                setSearchTerm('');
                setCtgrySearch(true);
              }}
            />
          </div>

          {/* Right: Buttons & Profile */}
          <div className="hidden md:flex items-center md:space-x-20 md:px-7">

            <Link to="/categories" className="text-blue-500 font-[Arial] text-[17px] font-bold hover:underline transition">
              Categories

            </Link>
            <Link to="/about" className=" text-pink-500 font-[Arial] text-[17px] font-bold hover:underline transition">
              About & Contact

            </Link>

            <Link to={isAdmin ? "/admin-dashboard" : "/user-profile"}>
              <motion.img
                src={profileImage}
                alt="Profile"
                className="w-11 h-11 rounded-full object-cover cursor-pointer mr-1"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </Link>

          </div>
          <div className="md:hidden relative mr-2">
            <HiOutlineDotsVertical
              className="w-6 h-6 text-gray-700 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />

            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  className="absolute -right-1 ht-0 top-12 bg-white shadow-lg rounded-md p-3 w-44 z-50 flex flex-col space-y-3"

                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >

                  <div className="flex items-start justify-between mb-3">
                    <Link to={isAdmin ? "/admin-dashboard" : "/user-profile"}>

                      <div className="flex items-center space-x-3">

                        <img src={profileImage} alt="Profile" className="w-9 h-9 rounded-full object-cover" />

                        <div className="flex flex-col leading-tight">
                          <span className="font-semibold text-gray-800 text-sm">
                            {isAdmin ? "Admin" : "User"}

                          </span>
                          <span className="text-xs text-gray-500">
                            View profile
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <Link to="/categories" className="font-bold text-blue-500" onClick={() => setIsMobileMenuOpen(false)}>
                    Categories
                  </Link>

                  <Link to="/about" className="font-bold text-pink-500" onClick={() => setIsMobileMenuOpen(false)} >
                    About & Contact
                  </Link>

                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="bg-red-500 text-white font-semibold border rounded-2xl px-2 py-1"
                  >
                    Close
                  </button>

                </motion.div>
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
            searchTerm={searchTerm}
            ctgrySearch={ctgrySearch}
            resetTrigger={() => setCtgrySearch(false)}
          />
        </motion.div>
      </main>

    </motion.div>
  );
};

export default Home;

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Logo from "../Components/Logo";
import CloseButton from "../Components/CloseButton";
import React, { useEffect, useState } from "react";
import { RiCameraLensAiFill } from "react-icons/ri";

export default function Categories() {

  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate("/home", {
      state: {
        categoryId: category.categoryId,
        categoryName: category.title
      }
    });
  };

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://localhost:7148/api/category/all");
      const data = await response.json();

      const formatted = data.map(c => ({
        categoryId: c.categoryId,
        title: c.title,
        subtitle: c.subtitle,
        searchKey: c.title.toLowerCase(),
        image: c.imageUrl
      }));

      setCategories(formatted);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-blue-50 via-white to-pink-50 relative overflow-hidden">

      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-pink-300 opacity-30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-blue-300 opacity-30 blur-3xl rounded-full"></div>

      <header className="m-0 bg-white shadow-sm w-full sticky top-0 z-50 flex justify-between items-center ">
        <Logo />
        <CloseButton />
      </header>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mt-6 mb-6 max-w-2xl px-4"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent">
          Discover Creative Categories
        </h1>

        <p className="text-gray-600 mt-3 text-sm sm:text-base">
          Explore curated collections and find inspiration tailored to your style.
        </p>
      </motion.div>

      {loading ? (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-8 mb-10 max-w-7xl px-5 z-10">

    {categories.map((ctgry) => (
      <motion.div
        key={ctgry.categoryId}
        onClick={() => handleCategoryClick(ctgry)}
        className="relative rounded-3xl overflow-hidden shadow-lg group cursor-pointer border border-white/40 backdrop-blur-sm hover:shadow-2xl transition duration-300"
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        <img
          src={ctgry.image}
          alt={ctgry.title}
          loading="lazy"
          className="w-full h-72 object-cover transform group-hover:scale-110 transition duration-700 ease-in-out"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-5">

          <p className="text-lg sm:text-xl font-bold text-white drop-shadow">
            {ctgry.title}
          </p>

          <h2 className="text-sm font-semibold text-white/90 drop-shadow">
            {ctgry.subtitle}
          </h2>

        </div>
      </motion.div>
    ))}

  </div>
)}
    </div>
  );
}
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Logo from "../Components/Logo";
import CloseButton from "../Components/CloseButton";
import React, { useEffect, useState } from "react";

export default function Categories() {

  const navigate = useNavigate();

  const handleCategoryClick = (searchKey) => {
    navigate("/home", {
      state: { category: searchKey }
    });
  };


  //add category
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
    <div className="min-h-screen max-w-full flex flex-col bg-white items-center">
      {/* Header */}
      <header className="m-0 bg-white shadow-sm w-full sticky top-0 z-50 flex justify-between items-center ">
        <Logo />
        <CloseButton />
      </header>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center md:mb-4 max-w-2xl"
      >
        <h1 className="text-2xl sm:text-3xl font-semibold text-blue-900  py-3">
          Explore by category & discover ideas you love.
        </h1>
      </motion.div>
     

      {/* Grid */}
      <div className="grid grid-cols-1 overflow-hidden sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-8 mb-7 max-w-7xl px-5">
        {categories.map((ctgry) => (
          <motion.div
            key={ctgry.categoryId}
            onClick={() => handleCategoryClick(ctgry.searchKey)}

            className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.98 }}
          >
            <img
              src={ctgry.image}
              alt={ctgry.title}
              loading="lazy"
              className="w-full h-72 object-cover transform group-hover:scale-110 transition duration-700 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-5">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg sm:text-xl font-bold text-white drop-shadow"
              >
                {ctgry.title}
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm font-semibold text-white drop-shadow"
              >
                {ctgry.subtitle}
              </motion.h2>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 
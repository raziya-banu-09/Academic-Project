import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Logo from "../Components/Logo";
import CloseButton from "../Components/CloseButton";

const categories = [
  {
    title: "Nature",
    subtitle: "Embracing Earth’s Beauty",
    searchKey: "nature",
    image: "https://i.pinimg.com/1200x/9d/9b/df/9d9bdf1e1ad8688245dffa376c6a4630.jpg",
  },
  {
    title: "Travel",
    subtitle: "Collecting Memories, Not Things",
    searchKey: "travel",
    image: "https://i.pinimg.com/736x/5a/7a/64/5a7a64a7b50cd2fbf3b1c01d9563bb10.jpg",
  },
  {
    title: "Technology",
    subtitle: "Connecting People, Powering Progress",
    searchKey: "tech",
    image: "https://i.pinimg.com/736x/36/fc/6a/36fc6a5a3f2568addceaacc0084b1ece.jpg",
  },
  {
    title: "Style",
    subtitle: "Your Style, Your Identity",
    searchKey: "fashion",
    image: "https://i.pinimg.com/736x/d2/fd/24/d2fd241871827549d74243c607b7e0a2.jpg",
  },
  {
    title: "Food",
    subtitle: "Delicious Journeys Begin Here",
    searchKey: "food",
    image: "https://i.pinimg.com/736x/83/47/59/8347599f696cf11a264c9557dac86e31.jpg",
  },
  {
    title: "Art",
    subtitle: "Art Speaks When Words Fail",
    searchKey: "artwork",
    image: "https://i.pinimg.com/1200x/0d/64/58/0d6458fd744de384df5e69ed076c23ed.jpg",
  },
  {
    title: "Sports",
    subtitle: "Born to Play, Trained to Win",
    searchKey: "sports",
    image: "https://i.pinimg.com/736x/3b/ee/5f/3bee5f3e1547a92cf69ff308d8f8aa81.jpg",
  },
  {
    title: "Cakes",
    subtitle: "Baking Memories, One Cake at a Time",
    searchKey: "cakes",
    image: "https://i.pinimg.com/1200x/6d/19/6f/6d196ff6b11a651dab01cbec5e23c988.jpg",
  },
  {
  title: "Space",
  subtitle: "Beyond Earth and Imagination",
  searchKey: "space",
  image: "https://i.pinimg.com/1200x/00/25/79/0025793674c9e244231325267a3d20dd.jpg",
},
  {
    title: "Cat",
    subtitle: "Caring for Cats, One Paw at a Time",
    searchKey: "cat",
    image: "https://i.pinimg.com/736x/55/3d/9c/553d9cfb283a1d60102ece0a9d36f727.jpg",
  },
  {
    title: "Insects",
    subtitle: "The Hidden Kingdom of Bugs",
    searchKey: "insect",
    image: "https://i.pinimg.com/736x/52/f4/59/52f459d61d977adb468c4eac83eddc3f.jpg",
  },
  {
    title: "Dog",
    subtitle: "A Loyal Friend for Life",
    searchKey: "dog",
    image: "https://i.pinimg.com/736x/72/f4/b8/72f4b8c335352cb334cf19c6bb3443ce.jpg",
  },
  {
    title: "Music",
    subtitle: "Feel the Rhythm of Life",
    searchKey: "music",
    image: "https://i.pinimg.com/1200x/d8/09/89/d809890dcf60b83c6f79b05e17be905b.jpg",
  },
  {
    title: "Gaming",
    subtitle: "Play, Compete, Conquer",
    searchKey: "gaming",
    image: "https://i.pinimg.com/736x/18/3b/b2/183bb28332ccf9bd1ab96d37690f6b21.jpg",
  },
  {
    title: "Ocean",
    subtitle: "Dive into the Blue Wonders",
    searchKey: "ocean",
    image: "https://i.pinimg.com/736x/17/aa/ac/17aaac2393ea8eeda8ffb4ead6572e90.jpg",
  }
];

export default function Categories() {

  const navigate = useNavigate();

  const handleCategoryClick = (searchKey) => {
    navigate("/home", {
      state: { category: searchKey }
    });
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
        <h1 className="text-2xl sm:text-3xl font-semibold text-blue-600  py-3">
          Explore by category & discover ideas you love.
        </h1>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-8 mb-7 max-w-7xl px-5">
        {categories.map((ctgry, idx) => (
          <motion.div
            key={idx}
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
              alt={ctgry.subtitle}
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
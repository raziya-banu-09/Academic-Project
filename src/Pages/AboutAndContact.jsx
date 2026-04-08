import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../Components/Logo";
import CloseButton from "../Components/CloseButton";
import { FaWhatsapp, FaFacebook, FaInstagram, FaSnapchat, FaTwitter } from "react-icons/fa";

export default function AboutAndContact() {
  return (
    <div className="min-h-screen max-w-full  flex flex-col bg-gradient-to-br from-pink-50 to-blue-50">
    <div className="relative overflow-hidden">
  
  <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-pink-300 opacity-30 blur-3xl rounded-full"></div>
  
  <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-blue-300 opacity-30 blur-3xl rounded-full"></div>


      {/* Header */}
      <header className="shadow-md bg-white backdrop-blur-md w-full sticky top-0 z-50 flex justify-between items-center ">
        <Logo />
        <CloseButton/>
      </header>

      {/* About Section */}
      <motion.section
        className="flex flex-col items-center justify-center text-center px-6 py-12 flex-grow"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6 cursor-default">
          About{" "}
          <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent cursor-default">
            PixHub
          </span>
        </h1>
        <p className="max-w-3xl text-lg sm:text-xl text-gray-700 font-[Calibri] leading-relaxed mb-5 md:mb-10 cursor-default">
          PixHub is your creative space to discover, save, and share inspiration.
          Built for dreamers, creators, and storytellers — it’s a place where
          imagination finds its audience.
        </p>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 gap-8 max-w-4xl  font-[Nunito Sans] cursor-pointer">
          {[
            { title: "Simple & Secure", desc: "Seamlessly share and explore with ease." },
            { title: "Creative Community", desc: "Connect with people who inspire and support." },
            { title: "Recognition", desc: "Showcase your talent and get noticed." },
            { title: "Anywhere, Anytime", desc: "Accessible on any device, whenever you need it." }
          ].map((item, i) => (
            <motion.div
              key={i}
              className="p-6 rounded-2xl  bg-zinc-50 shadow-md hover:shadow-xl transition"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        className="bg-gradient-to-r from-pink-50 to-blue-50 px-4 py-12 shadow-inner text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold text-blue-800 mb-4 cursor-default">Get in Touch</h2>
        <p className="text-gray-600 mb-6 cursor-default">We’d love to hear from you! Reach us on:</p>
        <div className="flex justify-center space-x-5 md:space-x-8 text-3xl text-gray-600">
          {[
            { icon: <FaWhatsapp />, color: "hover:text-green-500" },
            { icon: <FaFacebook />, color: "hover:text-blue-600" },
            { icon: <FaInstagram />, color: "hover:text-pink-500" },
            { icon: <FaSnapchat />, color: "hover:text-yellow-400" },
            { icon: <FaTwitter />, color: "hover:text-sky-500" }
          ].map((item, i) => (
            <motion.a
              key={i}
              href="#"
              className={`${item.color}`}
              whileHover={{ scale: 1.4}}
              whileTap={{ scale: 0.95 }}
            >
              {item.icon}
            </motion.a>
          ))}
        </div>
      </motion.section>
    </div>
    </div>
  );
}

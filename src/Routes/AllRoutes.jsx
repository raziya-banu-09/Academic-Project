import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from '../Pages/LandingPage.jsx'
import Login from '../Pages/Login.jsx'
import Register from "../Pages/Register.jsx";
import AboutAndContact from "../Pages/AboutAndContact.jsx";
import Home from "../Pages/Home.jsx";
import Categories from "../Pages/Categories.jsx";
import AdminDashboard from "../Pages/AdminDashboard.jsx";
import ImageUpload from "../Pages/ImageUpload.jsx";
import ImageDetails from "../Pages/ImageDetails.jsx";
import UserProfile from "../Pages/UserProfile.jsx";

import ProtectedRoute from './ProtectedRoute.jsx';
import AdminRoute from './AdminRoute.jsx';

const AllRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutAndContact />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/upload" element={<ProtectedRoute><ImageUpload /></ProtectedRoute>} />
        <Route path="/image/:id" element={<ProtectedRoute><ImageDetails /></ProtectedRoute>} />
        <Route path="/user-profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default AllRoutes

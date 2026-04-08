import React, { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdCancel, MdDelete } from "react-icons/md";
import { FiUploadCloud } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddCategory() {
  const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [category, setCategory] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await fetch("https://localhost:7148/api/category/all");
      const data = await response.json();
      setCategories(data);

    } catch (error) {
      console.error("Error loading categories", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryImage = (e) => {
    const file = e.target.files[0];
    if (file) setCategoryImage(file);
  };

  const handleAddCategory = async () => {

    if (!category.trim() || !categoryImage) {
      toast.error("Please fill all fields");
      return;
    }

    // check duplicate category
    const exists = categories.some(
      (cat) => cat.title.toLowerCase() === category.toLowerCase()
    );

    if (exists) {
      toast.error("Category already exists");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("Title", category);
      formData.append("Subtitle", subtitle);
      formData.append("ImageDataFile", categoryImage);

      const res = await fetch("https://localhost:7148/api/category/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        toast.success("Category added successfully 🎉");
      } else {
        toast.error("Failed to add category");
      }

      fetchCategories();

      setCategory("");
      setSubtitle("");
      setCategoryImage(null);
      setShowAddCategory(false);

    } catch (error) {
      toast.error("Server error occurred");
    }
  };

  const deleteCategory = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`https://localhost:7148/api/category/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        toast.success("Category deleted successfully");
        setCategories(categories.filter((cat) => cat.categoryId !== id));
      } else {
        toast.error("Delete failed");
      }

    } catch (error) {
      toast.error("Server error");
    }
  };

  return (
    <div className="w-full h-full flex flex-col">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 border-b pb-2">        
        <h2 className="text-xl font-bold text-pink-500">Categories</h2>

        <button
          onClick={() => setShowAddCategory(true)}
         className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-2 bg-red-100 text-red-700 font-mediumhover:bg-red-200 transition duration-200 shadow-sm text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg">
          <IoMdAdd size={18} />
          Add Category
        </button>
      </div>

      {/* CATEGORY LIST */}
      {!showAddCategory && (
        <div className="flex-1 overflow-y-auto pr-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : categories.length === 0 ? (
            <p className="text-gray-400 text-center">No categories added yet</p>
          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.length === 0 && (
                <p className="text-gray-400">No categories added yet</p>
              )}

              {categories.map((cat) => (
                <div
                  key={cat.categoryId}
                  className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={cat.imageUrl}
                    alt={cat.title}
                    className="w-full h-40 object-cover"
                  />

                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800">
                      {cat.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {cat.subtitle}
                    </p>

                    <button
                      onClick={() => deleteCategory(cat.categoryId, cat.title)} className="flex items-center gap-1 text-red-500 text-sm mt-2 hover:underline"
                    >
                      <MdDelete />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADD CATEGORY FORM */}
      {showAddCategory && (
        <div className="flex-1 overflow-y-auto px-2 sm:px-4">
          <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 w-full max-w-6xl mx-auto">

            <div className="flex flex-col lg:flex-row gap-6">

              {/* IMAGE UPLOAD */}
              <div className="lg:w-1/2 flex items-center justify-center">
                <label className="w-full h-56 md:h-[300px] lg:h-[360px] flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-xl cursor-pointer">
                  {categoryImage ? (
                    <img
                      src={URL.createObjectURL(categoryImage)}
                      alt="preview"
                      className="max-h-full max-w-full rounded-lg object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-center px-4">
                      <FiUploadCloud className="text-3xl text-blue-500 mb-2" />
                      <p className="text-blue-600 font-semibold">
                        Tap here to upload image
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    className="hidden"
                    onChange={handleCategoryImage}
                  />
                </label>
              </div>

              {/* FORM */}
              <div className="lg:w-1/2 flex flex-col justify-between">

                <div className="space-y-4">

                  {/* TITLE */}
                  <div>
                    <label className="font-semibold text-gray-700 text-sm">
                      Title:
                    </label>

                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 bg-neutral-100"
                    />
                  </div>

                  {/* SUBTITLE */}
                  <div>
                    <label className="font-semibold text-gray-700 text-sm">
                      Subtitle:
                    </label>

                    <textarea
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 bg-neutral-100 h-24 resize-none"
                    />
                  </div>

                </div>

                {/* BUTTONS */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6">

                  <button
                    onClick={handleAddCategory}
                    className="flex items-center justify-center gap-2 bg-blue-50 text-blue-800 font-medium hover:bg-blue-200 transition duration-200 shadow-sm rounded-xl px-6 py-2.5"
                  >
                    <IoMdAdd size={20} />
                    Add
                  </button>

                  <button
                    onClick={() => setShowAddCategory(false)}
                    className="flex items-center justify-center gap-2 bg-blue-50 text-blue-800 font-medium hover:bg-blue-200 transition duration-200 shadow-sm rounded-xl px-6 py-2.5"
                  >
                    <MdCancel size={20} />
                    Cancel
                  </button>

                </div>

              </div>

            </div>

          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default AddCategory;
import { FiCheck, FiX } from "react-icons/fi";
import axios from "axios";
import { useEffect, useState, useRef } from "react";

function ImagesApproval() {

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const hasFetched = useRef(false); // prevent double API call

    useEffect(() => {
        const fetchPendingImages = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("https://localhost:7148/api/admin/pending-images", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setImages(res.data);
                console.log(res.data);

            } catch (err) {
                console.error(err);
                alert("Failed to fetch pending images");
            }
        };

        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchPendingImages();
        }
    }, []);

    // accept single image
    const handleApprove = async (id) => {
        try {
            setLoading(true);
            await axios.put(`https://localhost:7148/api/admin/approve/${id}`, null, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            setImages(prev => prev.filter(img => img.imageId !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to approve image");
        } finally {
            setLoading(false);
        }
    };

    // reject single image
    const handleReject = async (id) => {
        try {
            setLoading(true);
            await axios.put(`https://localhost:7148/api/admin/reject/${id}`, null, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            setImages(prev => prev.filter(img => img.imageId !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to reject image");
        } finally {
            setLoading(false);
        }
    };

    const handleApproveAll = async () => {
        try {
            setLoading(true);
            await axios.put(`https://localhost:7148/api/admin/approve-all`, null, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            setImages([]);

        } catch (err) {
            console.error(err);
            alert("Failed to approve all images");
        } finally {
            setLoading(false);
        }
    };

    const handleRejectAll = async () => {
        try {
            setLoading(true);
            await axios.put(`https://localhost:7148/api/admin/reject-all`, null, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            setImages([]);

        } catch (err) {
            console.error(err);
            alert("Failed to reject all images");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5 border-b border-blue-300 pb-3">

                <h2 className="text-xl font-bold text-pink-500 font-[Poppins] text-center sm:text-left">
                    Pending Images for Approval
                </h2>

                <div className="flex flex-wrap justify-center sm:justify-end gap-3">

                    <button
                        onClick={handleApproveAll}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 font-medium hover:bg-green-200 transition duration-200 shadow-sm text-sm sm:text-base"
                    >
                        Accept All
                    </button>

                    <button
                        onClick={handleRejectAll}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 font-medium hover:bg-red-200 transition duration-200 shadow-sm text-sm sm:text-base"
                    >
                        Reject All
                    </button>

                </div>
            </div>

            {/* Images Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {images.map((img) => (
                        <div
                            key={img.imageId}
                            className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition duration-300"
                        >
                            {/* Image */}
                            <img
                                src={img.imageUrl}
                                alt=""
                                className="w-full h-60 object-cover group-hover:scale-105 transition duration-300"
                            />

                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />

                            <div className="absolute top-3 left-3">
                                <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-gray-800 shadow">
                                    {img.categoryName || "Unknown"}
                                </span>
                            </div>

                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 opacity-0 group-hover:opacity-100 transition duration-300">

                                {/* Accept */}
                                <button
                                    onClick={() => handleApprove(img.imageId)}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white shadow-lg hover:scale-110 hover:bg-green-600 transition"
                                >
                                    <FiCheck size={18} />
                                </button>

                                {/* Reject */}
                                <button
                                    onClick={() => handleReject(img.imageId)}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white shadow-lg hover:scale-110 hover:bg-red-600 transition"
                                >
                                    <FiX size={18} />
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {loading && (
                <div className="flex justify-center items-center h-64">
                    Loading...
                </div>
            )}

            {!loading && images.length === 0 && (
                <div className="flex justify-center items-center h-64">
                    No pending images
                </div>
            )}
        </div>
    );
}

export default ImagesApproval;
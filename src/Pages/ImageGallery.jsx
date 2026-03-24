import React, { useEffect, useState, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";

const ImageGallery = ({ searchTerm, ctgrySearch, resetTrigger }) => {
    const [images, setImages] = useState([]);
    const [page, setPage] = useState(1); // Pagination: tracks current page number
    const seenIds = useRef(new Set()); // Tracks all loaded image IDs
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
    loadImages(1);
}, []);

    const loadImages = async (pageNum) => {
    try {
        const res = await fetch(
            `https://localhost:7148/api/Image?page=${pageNum}&pageSize=20`
        );

        const data = await res.json();

        const newImages = data.data;
        const totalCount = data.totalCount;

        if (!newImages || newImages.length === 0) {
            setHasMore(false);
            return;
        }

        // remove duplicates 
        const uniqueImages = newImages.filter((img) => {
            if (seenIds.current.has(img.imageId)) return false;
            seenIds.current.add(img.imageId);
            return true;
        });

        setImages(prev => [...prev, ...uniqueImages]);

        // STOP when all images loaded
        if (seenIds.current.size >= totalCount) {
            setHasMore(false);
        }

    } catch (error) {
        console.error("Error loading images:", error);
    }
};

    const fetchMore = () => {
        const nextPage = page + 1;  // Pagination: move to next page
        loadImages(nextPage);
        setPage(nextPage);
    };

    return (
        <InfiniteScroll
            dataLength={images.length}
            next={fetchMore}
            hasMore={hasMore}
            loader={<p className="text-center text-3xl py-50">Loading ...</p>}
        >
            <div className="columns-2 md:columns-3 lg:columns-4 p-4 bg-gray-50" style={{ columnGap: "1rem" }}>
                {images.map(img => (
                    <div key={img.imageId} className="relative mb-4 break-inside-avoid group  rounded-lg overflow-hidden">
                        <img loading="lazy" src={img.imageUrl} alt={img.title || ""} className="w-full rounded-lg shadow-md transition-transform duration-500 ease-in-out group-hover:scale-110" />

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <Link to={`/image/${img.imageId}`} state={{ image: img }}>
                                <button

                                    className="w-full cursor-pointer md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-800 transition"
                                >
                                    View Details
                                </button>
                            </Link>
                        </div>

                    </div>

                ))}
            </div>
        </InfiniteScroll>
    );
};

export default ImageGallery;

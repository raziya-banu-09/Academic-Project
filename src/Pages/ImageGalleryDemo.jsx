import React, { useEffect, useState, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchImagesByCategory } from "../api/unsplash";
import { Link } from "react-router-dom";


const categories = [
  "home+decor", "nature", "butterfly", "quotes","travel", "tech", "style", "food", "art", "sports",
  "cakes", "oceans", "cat", "insects", "dog"
];

const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

const ImageGalleryDemo = ({ searchTerm, ctgrySearch, resetTrigger }) => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1); // Pagination: tracks current page number
  const seenIds = useRef(new Set()); // Tracks all loaded image IDs


  useEffect(() => {
  if (!ctgrySearch) return;

  seenIds.current.clear(); // clear all seen IDs
  setImages([]); // reset images
  setPage(1); // reset page

  const fetchFirstPage = async () => {
    if (searchTerm) {
      await loadImages(1, searchTerm || null); // only fetch the selected category
    } else {
      await loadImages(1); // fetch all if no searchTerm
    }
    resetTrigger(); // notify parent
  };

  fetchFirstPage();
}, [ctgrySearch, searchTerm]);


  const loadImages = async (pageNum, query = null) => {
    try {
      const results = query ? [await fetchImagesByCategory(query, pageNum, 30)] : //if query is exists -> fetch only that item
        await Promise.all(
          categories.map(cat => fetchImagesByCategory(cat, pageNum, 20)) // else fetch all 
        );

      const mixed = shuffleArray(results.flat());

      // Filter out duplicates using seenIds
      const uniqueImages = mixed.filter(img => {
        if (seenIds.current.has(img.id)) return false;
        seenIds.current.add(img.id);
        return true;
      });

      setImages(prev => [...prev, ...uniqueImages]);
    } catch (error) {
      console.error("Error loading images:", error);
    }
  };

  const fetchMore = () => {
    const nextPage = page + 1;  // Pagination: move to next page
    loadImages(nextPage, searchTerm); 
    setPage(nextPage);
  };

  return (
    <InfiniteScroll
      dataLength={images.length}
      next={fetchMore}
      hasMore={true}
      loader={<p className="text-center text-3xl py-50">Loading ...</p>}
    >
      <div className="columns-2 md:columns-3 lg:columns-4 p-4 bg-gray-50" style={{ columnGap: "1rem" }}>
        {images.map(img => (
          <div key={img.id} className="relative mb-4 break-inside-avoid group  rounded-lg overflow-hidden">
            <img loading="lazy" src={img.urls.small} alt={img.alt_description || ""} className="w-full rounded-lg shadow-md transition-transform duration-500 ease-in-out group-hover:scale-110" />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <Link to={`/image/${img.id}`}  state={{ image: img }}>
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

export default ImageGalleryDemo;

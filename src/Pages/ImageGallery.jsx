import React, { useEffect, useState, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import Loader from "../Components/Loader";

/* ── Skeleton card ── */
function SkeletonCard({ height }) {
  return (
    <div
      className="mb-4 break-inside-avoid rounded-2xl overflow-hidden bg-gray-200 animate-pulse"
      style={{ height }}
    />
  );
}

/* ── Random heights for skeleton variety ── */
const SKELETON_HEIGHTS = [160, 200, 240, 180, 220, 260, 150, 210];

const ImageGallery = ({ searchTerm, categoryId }) => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const seenIds = useRef(new Set());
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const cache = useRef({});
  const currentRequest = useRef(0);

  useEffect(() => {
    const key = `${searchTerm || "all"}-${categoryId || "all"}`;

    if (cache.current[key]) {
      setImages(cache.current[key]);
      setHasMore(false);
      return;
    }

    currentRequest.current++;
    setImages([]);
    setPage(1);
    seenIds.current.clear();
    setHasMore(true);
    setLoading(true);

    loadImages(1, key);
  }, [searchTerm, categoryId]);

  const loadImages = async (pageNum, cacheKey) => {
    const requestId = ++currentRequest.current;

    try {
      let url;
      if (searchTerm) {
        url = `https://localhost:7148/api/Image/search?category=${searchTerm.trim()}&page=${pageNum}&pageSize=20`;
      } else if (categoryId) {
        url = `https://localhost:7148/api/Image/gallery-by-category?categoryId=${categoryId}&page=${pageNum}&pageSize=20`;
      } else {
        url = `https://localhost:7148/api/Image?page=${pageNum}&pageSize=20`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (requestId !== currentRequest.current) return;

      const newImages = data.data;
      const totalCount = data.totalCount;

      if (!newImages || newImages.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      const uniqueImages = newImages.filter((img) => {
        if (seenIds.current.has(img.imageId)) return false;
        seenIds.current.add(img.imageId);
        return true;
      });

      let updatedImages;
      if (pageNum === 1) {
        updatedImages = uniqueImages;
        setImages(uniqueImages);
        setLoading(false);
      } else {
        updatedImages = [...images, ...uniqueImages];
        setImages(updatedImages);
      }

      if (cacheKey) cache.current[cacheKey] = updatedImages;
      if (seenIds.current.size >= totalCount) setHasMore(false);

    } catch (error) {
      setLoading(false);
    }
  };

  const fetchMore = () => {
    setPage(prevPage => {
      if (!hasMore) return prevPage;
      const nextPage = prevPage + 1;
      loadImages(nextPage);
      return nextPage;
    });
  };

  /* ── Skeleton grid (initial load) ── */
  if (loading && images.length === 0) {
    return (
      <div
        className="columns-2 md:columns-3 lg:columns-4 p-4 bg-[#fafafa]"
        style={{ columnGap: "1rem" }}
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <SkeletonCard
            key={i}
            height={SKELETON_HEIGHTS[i % SKELETON_HEIGHTS.length]}
          />
        ))}
      </div>
    );
  }

  /* ── Empty state ── */
  if (!loading && images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 gap-4">
        <div className="text-6xl">📷</div>
        <h2 className="text-2xl font-bold text-gray-700">No images found</h2>
        <p className="text-gray-400 max-w-md text-sm leading-relaxed">
          No images uploaded for this category yet. Try exploring other categories or check back later.
        </p>
        <Link to="/categories">
          <button className="mt-2 px-6 py-2.5 rounded-2xl text-sm font-semibold bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:scale-105 transition-all shadow-md shadow-pink-100">
            Browse Categories
          </button>
        </Link>
      </div>
    );
  }

  return (
    <InfiniteScroll
      dataLength={images.length}
      next={fetchMore}
      hasMore={hasMore}
      loader={
        <div className="flex justify-center py-6">
          <div className="scale-50 -my-16">
            <Loader />
          </div>
        </div>
      }
    >
      <div
        className="columns-2 md:columns-3 lg:columns-4 p-4 bg-[#fafafa]"
        style={{ columnGap: "1rem", willChange: "transform" }}
      >
        {images.map(img => (
          <ImageCard key={img.imageId} img={img} />
        ))}
      </div>
    </InfiniteScroll>
  );
};

/* ── Individual image card with shimmer skeleton ── */
function ImageCard({ img }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative mb-4 break-inside-avoid group rounded-2xl overflow-hidden bg-gray-100">
      {/* shimmer placeholder */}
      {!loaded && (
        <div className="w-full h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-2xl" />
      )}

      <img
        loading="lazy"
        src={img.imageUrl}
        alt={img.title || ""}
        className={`w-full rounded-2xl transition-all duration-500 ${
          loaded ? "opacity-100 blur-0" : "opacity-0 absolute inset-0"
        }`}
        onLoad={(e) => {
          e.target.classList.remove("blur-sm");
          setLoaded(true);
        }}
      />

      {/* hover overlay */}
      {loaded && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3">
          <Link to={`/image/${img.imageId}`} state={{ image: img }}>
            <button className="w-full py-1.5 rounded-xl cursor-pointer text-xs font-bold bg-white text-gray-800 hover:bg-pink-50 hover:text-pink-600 transition-colors shadow-md">
              View Details →
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default React.memo(ImageGallery);
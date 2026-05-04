import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Loader from "../Components/Loader";

const galleryCache = {};
const cacheExpiryTime = 30_000;
const pageSize  = 20;
const pollInterval = 30_000;

function isCacheValid(entry) {
  return entry && Date.now() - entry.timestamp < cacheExpiryTime;
}

function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = seed >>> 0;
  for (let i = a.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getDailySeed(count = 0) {
  const d = new Date();
  return (d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()) ^ count;
}

function SkeletonCard({ height }) {
  return (
    <div
      className="mb-4 break-inside-avoid rounded-2xl overflow-hidden bg-gray-200 animate-pulse"
      style={{ height }}
    />
  );
}

const SKELETON_HEIGHTS = [160, 200, 240, 180, 220, 260, 150, 210];

const ImageGallery = ({ searchTerm, categoryId }) => {
  const [images, setImages] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [fetchingAll, setFetchingAll] = useState(false);

  const reqIdRef = useRef(0);
  const pollTimerRef = useRef(null);

  const cacheKey = `${searchTerm || "all"}-${categoryId || "all"}`;

  const buildUrl = useCallback(
    (pageNum) => {
      const base = "https://localhost:7148/api/Image";
      if (searchTerm)
        return `${base}/search?category=${encodeURIComponent(searchTerm.trim())}&page=${pageNum}&pageSize=${pageSize }`;
      if (categoryId)
        return `${base}/gallery-by-category?categoryId=${categoryId}&page=${pageNum}&pageSize=${pageSize }`;
      return `${base}?page=${pageNum}&pageSize=${pageSize }`;
    },
    [searchTerm, categoryId]
  );

  // Fetches every page sequentially
  const fetchAllPages = useCallback(
    async (reqId, onFirstPage) => {
      const seenIds = new Set();
      const all = [];
      let pageNum = 1;
      let totalCount = Infinity;

      while (all.length < totalCount) {
        if (reqId !== reqIdRef.current) return null;

        let data;
        try {
          const res = await fetch(buildUrl(pageNum));
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          data = await res.json();
        } catch (err) {
          console.error(`Page ${pageNum} fetch error:`, err);
          break;
        }

        const batch = data.data ?? [];
        totalCount = data.totalCount ?? 0;

        if (batch.length === 0) break;

        const unique = batch.filter((img) => {
          if (seenIds.has(img.imageId)) return false;
          seenIds.add(img.imageId);
          return true;
        });

        all.push(...unique);

        // Immediately show page 1 so the user doesn't wait for all pages
        if (pageNum === 1 && onFirstPage) {
          onFirstPage(unique, totalCount);
        }

        if (seenIds.size >= totalCount || batch.length < pageSize ) break;

        pageNum++;
      }

      if (reqId !== reqIdRef.current) return null;
      return { images: all, totalCount: all.length };
    },
    [buildUrl]
  );

  const loadGallery = useCallback(
    async (reqId) => {
      // Serve from valid cache immediately
      const cached = galleryCache[cacheKey];
      if (isCacheValid(cached)) {
        setImages(cached.images);
        setInitialized(true);
        return;
      }

      setInitialized(false);
      setImages([]);
      setFetchingAll(true);

      const result = await fetchAllPages(reqId, (firstPage) => {
        if (reqId === reqIdRef.current) {
          setImages(firstPage);
          setInitialized(true);
        }
      });

      if (!result) {
        if (reqId === reqIdRef.current) setFetchingAll(false);
        return;
      }

      const shuffled = seededShuffle(result.images, getDailySeed(result.totalCount));

      galleryCache[cacheKey] = {
        images: shuffled,
        totalCount: result.totalCount,
        timestamp: Date.now(),
      };

      if (reqId === reqIdRef.current) {
        setImages(shuffled);
        setInitialized(true);
        setFetchingAll(false);
      }
    },
    [cacheKey, fetchAllPages]
  );

  const pollForNewImages = useCallback(async () => {
    try {
      const res = await fetch(buildUrl(1));
      if (!res.ok) return;
      const data = await res.json();
      const newTotal = data.totalCount ?? 0;
      const cached = galleryCache[cacheKey];
      const oldTotal = cached?.totalCount ?? 0;
      const batch = data.data ?? [];
      const cachedIds = new Set((cached?.images ?? []).map((i) => i.imageId));
      const hasNew = newTotal !== oldTotal || batch.some((img) => !cachedIds.has(img.imageId));

      if (hasNew) {
        delete galleryCache[cacheKey];
        const reqId = ++reqIdRef.current;
        loadGallery(reqId);
      }
    } catch {
      // silently ignore poll errors
    }
  }, [buildUrl, cacheKey, loadGallery]);

  useEffect(() => {
    const reqId = ++reqIdRef.current;
    loadGallery(reqId);

    clearInterval(pollTimerRef.current);
    pollTimerRef.current = setInterval(pollForNewImages, pollInterval);

    return () => clearInterval(pollTimerRef.current);
  }, [searchTerm, categoryId]); 

  // --- Render ---

  if (!initialized && images.length === 0) {
    return (
      <div
        className="columns-2 md:columns-3 lg:columns-4 p-4 bg-[#fafafa]"
        style={{ columnGap: "1rem" }}
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <SkeletonCard key={i} height={SKELETON_HEIGHTS[i % SKELETON_HEIGHTS.length]} />
        ))}
      </div>
    );
  }

  if (initialized && images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 gap-4">
        <div className="text-6xl">📷</div>
        <h2 className="text-2xl font-bold text-gray-700">No images found</h2>
        <p className="text-gray-400 max-w-md text-sm leading-relaxed">
          No images uploaded for this category yet. Try exploring other categories or check back
          later.
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
    <>
      <div
        className="columns-2 md:columns-3 lg:columns-4 p-4 bg-[#fafafa]"
        style={{ columnGap: "1rem", willChange: "transform" }}
      >
        {images.map((img, idx) => (
          <ImageCard key={img.imageId} img={img} priority={idx < 8} />
        ))}
      </div>

      {fetchingAll && (
        <div className="flex justify-center py-4 opacity-50">
          <div className="scale-50 -my-16">
            <Loader />
          </div>
        </div>
      )}
    </>
  );
};

function ImageCard({ img, priority }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  return (
    <div className="relative mb-4 break-inside-avoid group rounded-2xl overflow-hidden bg-gray-100">
      {!loaded && (
        <div className="w-full h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-2xl" />
      )}

      <img
        ref={imgRef}
        src={img.imageUrl}
        alt={img.title || ""}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={`w-full rounded-2xl transition-all duration-500 ${
          loaded ? "opacity-100" : "opacity-0 absolute inset-0"
        }`}
        onLoad={(e) => {
          e.target.classList.remove("blur-sm");
          setLoaded(true);
        }}
      />

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
import React, { useEffect, useState, useRef, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import Loader from "../Components/Loader";

// ─── Module-level cache — lives for the entire browser session ────────────────
// Survives component unmounts so navigating away & back is instant
const galleryCache = {};
// shape: { [cacheKey]: { images: [], totalCount: number } }

// ─── Seeded shuffle (Fisher-Yates) ────────────────────────────────────────────
// Seed = today's date XOR image count → stable order within a day,
// reshuffles automatically whenever a new image is added
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

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard({ height }) {
  return (
    <div
      className="mb-4 break-inside-avoid rounded-2xl overflow-hidden bg-gray-200 animate-pulse"
      style={{ height }}
    />
  );
}

const SKELETON_HEIGHTS = [160, 200, 240, 180, 220, 260, 150, 210];

// ─── Main component ───────────────────────────────────────────────────────────
const ImageGallery = ({ searchTerm, categoryId }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const requestId   = useRef(0);   // cancels stale async chains
  const bgRunning   = useRef(false); // prevents duplicate background refreshes
  const initialized = useRef(false); // true once first data has been received

  const cacheKey = `${searchTerm || "all"}-${categoryId || "all"}`;

  // ── URL builder ──────────────────────────────────────────────────────────
  const buildUrl = useCallback((pageNum) => {
    if (searchTerm)
      return `https://localhost:7148/api/Image/search?category=${searchTerm.trim()}&page=${pageNum}&pageSize=20`;
    if (categoryId)
      return `https://localhost:7148/api/Image/gallery-by-category?categoryId=${categoryId}&page=${pageNum}&pageSize=20`;
    return `https://localhost:7148/api/Image?page=${pageNum}&pageSize=20`;
  }, [searchTerm, categoryId]);

  // ── Fetch all pages sequentially, call onFirstPage after page 1 ──────────
  const fetchAllPages = useCallback(async (reqId, onFirstPage = null) => {
    const seenIds = new Set();
    const all     = [];
    let pageNum   = 1;
    let total     = Infinity;

    while (seenIds.size < total) {
      if (reqId !== requestId.current) return null; // request was superseded

      let data;
      try {
        const res = await fetch(buildUrl(pageNum));
        data = await res.json();
      } catch {
        break;
      }

      const batch     = data.data ?? [];
      total           = data.totalCount ?? 0;

      if (batch.length === 0) break;

      const unique = batch.filter(img => {
        if (seenIds.has(img.imageId)) return false;
        seenIds.add(img.imageId);
        return true;
      });

      all.push(...unique);

      // Surface first page immediately for fast perceived load
      if (pageNum === 1 && onFirstPage) onFirstPage(unique);

      if (seenIds.size >= total) break;
      pageNum++;
    }

    if (reqId !== requestId.current) return null;
    return { images: all, totalCount: all.length };
  }, [buildUrl]);

  // ── Effect: runs when searchTerm or categoryId changes ──────────────────
  useEffect(() => {
    const cached = galleryCache[cacheKey];

    if (cached) {
      // ── CACHE HIT: show instantly ──────────────────────────────────────
      initialized.current = true;
      setImages(cached.images);
      setLoading(false);

      // Then do a silent background refresh to catch new additions
      if (bgRunning.current) return;
      bgRunning.current = true;

      const bgId = ++requestId.current;

      fetchAllPages(bgId).then(result => {
        bgRunning.current = false;
        if (!result) return;

        if (result.totalCount !== cached.totalCount) {
          // New images were added — reshuffle and update
          const shuffled = seededShuffle(result.images, getDailySeed(result.totalCount));
          galleryCache[cacheKey] = { images: shuffled, totalCount: result.totalCount };
          setImages(shuffled);
        }
      });

      return;
    }

    // ── CACHE MISS: fresh fetch ────────────────────────────────────────────
    const reqId = ++requestId.current;
    initialized.current = false;
    setLoading(true);
    setImages([]);

    fetchAllPages(reqId, (firstPage) => {
      // First 20 images appear immediately — no waiting for all pages
      initialized.current = true;
      setImages(firstPage);
      setLoading(false);
    }).then(result => {
      if (!result) return;

      const shuffled = seededShuffle(result.images, getDailySeed(result.totalCount));
      galleryCache[cacheKey] = { images: shuffled, totalCount: result.totalCount };
      setImages(shuffled);
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, categoryId]);

  // ── Render ────────────────────────────────────────────────────────────────
  if (!initialized.current && images.length === 0) {
    return (
      <div className="columns-2 md:columns-3 lg:columns-4 p-4 bg-[#fafafa]" style={{ columnGap: "1rem" }}>
        {Array.from({ length: 16 }).map((_, i) => (
          <SkeletonCard key={i} height={SKELETON_HEIGHTS[i % SKELETON_HEIGHTS.length]} />
        ))}
      </div>
    );
  }

  if (initialized.current && images.length === 0) {
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
    // hasMore is always false — we load everything upfront.
    // InfiniteScroll is kept for the loader UI only.
    <InfiniteScroll
      dataLength={images.length}
      next={() => {}}
      hasMore={false}
      loader={
        <div className="flex justify-center py-6">
          <div className="scale-50 -my-16"><Loader /></div>
        </div>
      }
    >
      <div
        className="columns-2 md:columns-3 lg:columns-4 p-4 bg-[#fafafa]"
        style={{ columnGap: "1rem", willChange: "transform" }}
      >
        {images.map((img, idx) => (
          <ImageCard key={img.imageId} img={img} priority={idx < 8} />
        ))}
      </div>
    </InfiniteScroll>
  );
};

// ─── ImageCard ────────────────────────────────────────────────────────────────
function ImageCard({ img, priority }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // Handle already-cached browser images (no onLoad fires for these)
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
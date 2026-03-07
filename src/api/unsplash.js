import axios from "axios";

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_KEY;

export const fetchImagesByCategory = async (category, page = 1, perPage = 20) => {
  try {
    const res = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query: category, page, per_page: perPage },
      headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
    });
    return res.data.results;
  } catch (error) {
    console.error(`Error fetching ${category}:`, error);
    return [];
  }
};

import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { AnimatePresence, motion } from "framer-motion";

const AnimeList = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("authToken");

  const fetchAnimeList = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`http://localhost:4000/api/v1/list/anime`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const list = res.data?.animeList || [];
      setAnimeList(list);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch anime list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimeList();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="pt-10 flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* ✅ Header */}
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex flex-grow relative">
        {/* ✅ Mobile Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-16 left-0 z-50 w-64 bg-gray-800/90 backdrop-blur border-r border-blue-500/30 min-h-screen md:hidden"
            >
              <Sidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ✅ Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* ✅ Desktop Sidebar */}
        <div className="hidden md:block w-64 bg-gray-800/90 backdrop-blur border-r border-blue-500/30">
          <Sidebar />
        </div>

        {/* ✅ Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <h1 className="text-4xl font-bold text-white mb-8">🎥 Your Anime List</h1>

          {loading && (
            <div className="flex justify-center my-12">
              <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}

          {error && !loading && (
            <p className="text-red-400 mb-6">{error}</p>
          )}

          {!loading && animeList.length === 0 && !error && (
            <p className="text-gray-300">You have no anime in your list yet.</p>
          )}

          {!loading && animeList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {animeList.map((anime) => (
                <div
                  key={anime.publicDbId}
                  className="bg-gray-800/50 border border-blue-500/20 rounded-xl shadow-lg overflow-hidden hover:scale-105 transition"
                >
                  <img
                    src={anime.imageUrl || "https://via.placeholder.com/300x200"}
                    alt={anime.title_english || anime.title_japanese}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-bold text-white mb-1">
                      {anime.title_english || anime.title_japanese || "Untitled"}
                    </h2>
                    <p className="text-blue-400 text-sm mb-1">
                      Episodes: {anime.episodes ?? "N/A"}
                    </p>
                    <p className="text-blue-400 text-sm mb-1">
                      Status: {anime.status ?? "N/A"}
                    </p>
                    <p className="text-yellow-400 text-sm mb-1">
                      ⭐ {anime.score ?? "N/A"}
                    </p>
                    <p className="text-gray-300 text-xs mb-2 line-clamp-3">
                      {anime.synopsis || "No synopsis available."}
                    </p>
                    <div className="text-blue-400 text-xs">
                      My Status: {anime.userStatus || "N/A"} | My Rating: {anime.userRating ?? "N/A"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AnimeList;

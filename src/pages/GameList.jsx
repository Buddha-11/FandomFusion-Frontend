import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { AnimatePresence, motion } from "framer-motion";

const GameList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Loader state
  const [error, setError] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("authToken");

  const fetchGameList = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`http://localhost:4000/api/v1/list/game`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const list = res.data?.data?.gameList || [];
      setGames(list);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch game list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameList();
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
          <h1 className="text-4xl font-bold text-white mb-8">🎮 Your Game List</h1>

          {loading && (
            <div className="flex justify-center my-12">
              <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}

          {error && !loading && (
            <p className="text-red-400 mb-6">{error}</p>
          )}

          {!loading && games.length === 0 && !error && (
            <p className="text-gray-300">You have no games in your list yet.</p>
          )}

          {!loading && games.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <div
                  key={game.publicDbId}
                  className="bg-gray-800/50 border border-blue-500/20 rounded-xl shadow-lg overflow-hidden hover:scale-105 transition"
                >
                  <img
                    src={game.imgUrl || "https://via.placeholder.com/300x200"}
                    alt={game.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-bold text-white mb-2">
                      {game.title}
                    </h2>
                    <p className="text-sm text-blue-200 mb-2">
                      Released: {game.releasedDate || "N/A"}
                    </p>
                    <p className="text-blue-400 text-xs mb-2">
                      Genres: {game.genre?.join(", ") || "N/A"}
                    </p>
                    <p className="text-blue-400 text-xs mb-2">
                      Platforms: {game.platform?.join(", ") || "N/A"}
                    </p>
                    <p className="text-sm text-gray-300 line-clamp-3">
                      {game.description || "No description available."}
                    </p>
                    <div className="mt-3 flex justify-between items-center text-sm text-blue-300">
                      <span>Status: {game.status || "N/A"}</span>
                      <span>Your Rating: {game.rating ?? "N/A"}</span>
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

export default GameList;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, Plus, X } from "lucide-react";
import SearchCard from "../components/SearchCard";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { AnimatePresence, motion } from "framer-motion";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("Anime");

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userStatus, setUserStatus] = useState("");
  const [userRating, setUserRating] = useState(0);

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const statusOptions = {
    Anime: ["Planning to Watch", "Watching", "Completed", "On Hold"],
    Movie: ["Planning to Watch", "Watching", "Completed", "On Hold"],
    Game: ["Planning to Play", "Playing", "Completed", "On Hold"],
  };

  const getAuthToken = () => localStorage.getItem("authToken");

  const openAddModal = (item) => {
    setSelectedItem(item);
    setUserStatus(statusOptions[activeSection][0]);
    setUserRating(0);
    setShowModal(true);
  };

  const handleAddToList = async () => {
    const AUTH_TOKEN = getAuthToken();
    if (!AUTH_TOKEN) {
      setError("Unauthorized: Please log in to continue.");
      return;
    }

    const type = activeSection.toLowerCase();
    const endpoint = `${import.meta.env.VITE_API_URL}/api/v1/list/${type}/add`;

    try {
      const payload = {
        publicDbId: selectedItem.publicDbId,
        status: userStatus,
        rating: Number(userRating),
      };

      await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      });

      alert(`✅ ${type.charAt(0).toUpperCase() + type.slice(1)} added successfully!`);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert(`❌ Failed to add ${type}.`);
    }
  };

  const handleCreatePost = (item) => {
    const params = new URLSearchParams({
      type: activeSection.toLowerCase(),
      publicDbId: item.publicDbId,
      imageUrl: activeSection.toLowerCase() === "anime" ? item.imageUrl : item.imgUrl,
    });
    navigate(`/create-post?${params.toString()}`);
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a valid search query.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResults([]);

    const AUTH_TOKEN = getAuthToken();
    if (!AUTH_TOKEN) {
      setError("Unauthorized: Please log in to continue.");
      return;
    }

    try {
      const baseEndpoint =
        activeSection.toLowerCase() === "anime"
          ? `${import.meta.env.VITE_API_URL}/api/v1/media/${activeSection.toLowerCase()}/search?q=${encodeURIComponent(query)}`
          : `${import.meta.env.VITE_API_URL}/api/v1/media/${activeSection.toLowerCase()}/search?search=${encodeURIComponent(query)}`;

      const response = await axios.get(baseEndpoint, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      });

      if (response.data?.data?.length > 0) {
        setResults(response.data.data);
      } else {
        setError("No results found.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const sections = ["Anime", "Movie", "Game"];

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

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* ✅ Sidebar for md+ */}
        <div className="hidden md:block w-64 bg-gray-800/90 backdrop-blur border-r border-blue-500/30">
          <Sidebar />
        </div>

        {/* ✅ Main Content */}
        <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Discover & Add</h1>
            <p className="text-blue-300">Search and manage your fandom lists</p>
          </div>

          {/* Section Toggle */}
          <div className="flex flex-wrap gap-4 mb-8">
            {sections.map((section) => (
              <button
                key={section}
                className={`px-5 py-3 rounded-lg font-medium transition-colors ${
                  activeSection === section
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700/50 text-gray-300 hover:bg-blue-500/20"
                }`}
                onClick={() => setActiveSection(section)}
              >
                {section}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <input
              type="text"
              placeholder={`Search for ${activeSection.toLowerCase()}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 p-4 rounded-lg border border-blue-500/30 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400/30"
            />
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <SearchIcon className="w-5 h-5" />
              Search
            </button>
          </div>

          {/* Loader */}
          {isLoading && (
            <div className="flex justify-center mt-6">
              <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <p className="text-red-400 text-center mt-6">{error}</p>
          )}

          {/* Results */}
          {!isLoading && results.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold text-white mb-4">
                {activeSection} results for:{" "}
                <span className="text-blue-400">{query}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {results.map((item) => (
                  <SearchCard
                    key={item.publicDbId}
                    image={
                      activeSection.toLowerCase() === "anime"
                        ? item.imageUrl || "https://via.placeholder.com/150"
                        : item.imgUrl || "https://via.placeholder.com/150"
                    }
                    title={
                      activeSection.toLowerCase() === "anime"
                        ? item.title_english || item.title
                        : item.title
                    }
                    rating={item.score || "N/A"}
                    onAddClick={() => openAddModal(item)}
                    onCreatePostClick={() => handleCreatePost(item)}
                  />
                ))}
              </div>
            </>
          )}

          {!isLoading && !error && results.length === 0 && query && (
            <p className="text-gray-400 text-center mt-6">No results found.</p>
          )}
        </main>
      </div>

      {/* ✅ Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-gray-800/90 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Add to {activeSection} List</h2>
            <label className="block text-sm text-blue-300 mb-2">Status:</label>
            <select
              value={userStatus}
              onChange={(e) => setUserStatus(e.target.value)}
              className="w-full p-3 rounded-lg border border-blue-500/30 bg-gray-700/50 text-white mb-4"
            >
              {statusOptions[activeSection].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>

            <label className="block text-sm text-blue-300 mb-2">Your Rating (0-10):</label>
            <input
              type="number"
              min="0"
              max="10"
              step="1"
              value={userRating}
              onChange={(e) => setUserRating(e.target.value)}
              className="w-full p-3 rounded-lg border border-blue-500/30 bg-gray-700/50 text-white mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleAddToList}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;

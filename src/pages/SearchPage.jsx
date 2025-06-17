import React, { useState } from "react";
import axios from "axios";
import SearchCard from "../components/SearchCard";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("Anime");

  // ✅ Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userStatus, setUserStatus] = useState("");
  const [userRating, setUserRating] = useState(0);

  // ✅ Allowed statuses from your Mongoose schema:
  const statusOptions = {
    Anime: ["Planning to Watch", "Watching", "Completed", "On Hold"],
    Movie: ["Planning to Watch", "Watching", "Completed", "On Hold"],
    Game: ["Planning to Play", "Playing", "Completed", "On Hold"],
  };

  const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };

  // ✅ Open modal with the right default status
  const openAddModal = (item) => {
    setSelectedItem(item);
    setUserStatus(statusOptions[activeSection][0]); // always valid
    setUserRating(0);
    setShowModal(true);
  };

  // ✅ Confirm add using modal data
  const handleAddToList = async () => {
    const AUTH_TOKEN = getAuthToken();
    if (!AUTH_TOKEN) {
      setError("Unauthorized: Please log in to continue.");
      return;
    }

    const type = activeSection.toLowerCase();
    let endpoint = "";

    if (type === "anime") {
      endpoint = "http://localhost:4000/api/v1/lists/anime/add";
    } else if (type === "game") {
      endpoint = "http://localhost:4000/api/v1/lists/game/add";
    } else if (type === "movie") {
      endpoint = "http://localhost:4000/api/v1/lists/movie/add";
    }

    try {
      const payload = {
        publicDbId: selectedItem.publicDbId,
        status: userStatus,
        rating: Number(userRating),
      };

      await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      alert(`✅ ${type.charAt(0).toUpperCase() + type.slice(1)} added successfully!`);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert(`❌ Failed to add ${type}.`);
    }
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
          ? `http://localhost:4000/api/v1/media/${activeSection.toLowerCase()}/search?q=${encodeURIComponent(query)}`
          : `http://localhost:4000/api/v1/media/${activeSection.toLowerCase()}/search?search=${encodeURIComponent(query)}`;

      const response = await axios.get(baseEndpoint, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      if (response.data && response.data.data && response.data.data.length > 0) {
        setResults(response.data.data);
      } else {
        setError("No results found.");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Unauthorized: Please check your credentials.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const sections = ["Anime", "Movie", "Game"];

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-7">
        <h1 className="text-2xl font-bold text-center mb-4">Search Your Fandom</h1>

        <div className="flex justify-center space-x-4 mb-6">
          {sections.map((section) => (
            <button
              key={section}
              className={`px-4 py-2 rounded-lg ${
                activeSection === section
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              } hover:bg-blue-500 hover:text-white transition duration-300`}
              onClick={() => setActiveSection(section)}
            >
              {section}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder={`Search for ${activeSection.toLowerCase()}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full p-4 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Search
          </button>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center mt-6">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        )}

        {error && !isLoading && (
          <p className="text-red-500 text-center mt-6">{error}</p>
        )}

        {!isLoading && results.length > 0 && (
          <h2 className="text-2xl font-semibold text-gray-800 mt-6">
            {activeSection} results for:{" "}
            <span className="text-blue-600">{query}</span>
          </h2>
        )}

        {!isLoading && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
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
              />
            ))}
          </div>
        )}

        {!isLoading && !error && results.length === 0 && query && (
          <p className="text-gray-600 text-center mt-6">No results found.</p>
        )}
      </div>

      {/* ✅ MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Add to List</h2>
            <label className="block mb-2">Status:</label>
            <select
              value={userStatus}
              onChange={(e) => setUserStatus(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
              {statusOptions[activeSection].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>

            <label className="block mb-2">Your Rating (0-10):</label>
            <input
              type="number"
              min="0"
              max="10"
              step="1"
              value={userRating}
              onChange={(e) => setUserRating(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToList}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
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

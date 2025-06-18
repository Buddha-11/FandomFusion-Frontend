import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaThumbsUp,
  FaComment,
  FaShare,
  FaFilm,
  FaGamepad,
  FaTv,
} from 'react-icons/fa';

const Feed = ({ type = "global" }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("authToken");

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`http://localhost:4000/api/v1/post/${type}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load feed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [type]);

  const mediaTypeIcons = {
    Movie: <FaFilm className="text-green-400" />,
    Anime: <FaTv className="text-green-400" />,
    Game: <FaGamepad className="text-green-400" />,
    Community: <FaComment className="text-green-400" />,
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-400 text-center mt-6">{error}</p>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="text-gray-400 text-center mt-6">No posts to display.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 max-w-6xl mx-auto">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-gray-800/50 backdrop-blur-md border border-blue-500/20 rounded-xl shadow-md p-4 transition-transform duration-300 hover:scale-[1.02]"
        >
          {/* Profile + Meta */}
          <div className="flex items-center mb-3">
            <img
              src={post.profileImg || "https://cdn-icons-png.freepik.com/512/4209/4209019.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="text-white font-semibold">{post.username}</p>
              <p className="text-xs text-gray-400">@{post.userId}</p>
            </div>
          </div>

          {/* Type */}
          <div className="flex items-center text-sm mb-3 text-green-400">
            {mediaTypeIcons[post.type.charAt(0).toUpperCase() + post.type.slice(1)]}
            <span className="ml-2">{post.type.charAt(0).toUpperCase() + post.type.slice(1)}</span>
          </div>

          {/* Image */}
          {post.imageUrl && (
            <div className="mb-3">
              <img
                src={post.imageUrl}
                alt="Post"
                className="w-full max-h-60 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Text */}
          <p className="text-gray-300 mb-4">{post.text}</p>

          {/* Actions */}
          <div className="flex items-center gap-6 text-gray-400 text-sm">
            <button className="flex items-center gap-1 hover:text-blue-400 transition">
              <FaThumbsUp />
              Like
            </button>
            <button className="flex items-center gap-1 hover:text-blue-400 transition">
              <FaComment />
              Comment
            </button>
            <button className="flex items-center gap-1 hover:text-blue-400 transition">
              <FaShare />
              Share
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;

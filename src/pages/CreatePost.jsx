import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const CreatePost = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [publicDbId, setPublicDbId] = useState("");
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("");

  const token = localStorage.getItem("authToken");

  // ✅ Extract query params from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setType(params.get("type") || "anime");
    setPublicDbId(params.get("publicDbId") || "");
    setImageUrl(params.get("imageUrl") || "");
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setStatus("❌ Please enter some text for your post.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/post/create`,
        { type, publicDbId, text, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data);
      setStatus("✅ Post created successfully!");
      // Optionally, navigate back or clear text only
      setText("");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error(err);
      setStatus("❌ Error creating post.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <h1 className="text-4xl font-bold text-white mb-8">📢 Create a Post</h1>
      {status && (
        <p
          className={`mb-4 ${
            status.startsWith("✅") ? "text-green-400" : "text-red-400"
          }`}
        >
          {status}
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800/50 p-6 rounded-lg shadow-lg border border-blue-500/20"
      >
        {/* ✅ Fixed Fields (disabled) */}
        <div className="mb-4">
          <label className="block text-white mb-2">Type:</label>
          <input
            value={type}
            disabled
            className="w-full p-2 rounded bg-gray-700 text-white cursor-not-allowed"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Public DB ID:</label>
          <input
            value={publicDbId}
            disabled
            className="w-full p-2 rounded bg-gray-700 text-white cursor-not-allowed"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Image:</label>
          <img
            src={imageUrl}
            alt="Selected"
            className="w-full max-h-60 object-cover rounded"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/300x200";
            }}
          />
        </div>

        {/* ✅ Editable Text */}
        <div className="mb-4">
          <label className="block text-white mb-2">Post Content:</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-bold"
        >
          🚀 Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;

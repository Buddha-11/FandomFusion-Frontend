import React from "react";
import { Plus, Pencil } from "lucide-react";

const SearchCard = ({ image, title, rating, onAddClick, onCreatePostClick }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl overflow-hidden shadow-lg flex flex-col transition-transform duration-300 hover:scale-105">
      <div className="w-full h-52 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/300x200";
          }}
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
        <p className="text-yellow-400 font-medium mb-4">⭐ {rating || "N/A"}</p>

        <button
          onClick={onAddClick}
          className="flex items-center justify-center gap-2 px-4 py-3 mb-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add to List
        </button>

        <button
          onClick={onCreatePostClick}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          <Pencil className="w-4 h-4" />
          Create Post
        </button>
      </div>
    </div>
  );
};

export default SearchCard;

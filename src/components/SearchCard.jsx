import React from "react";

const SearchCard = ({ image, title, rating, onAddClick }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 flex flex-col">
      <div className="w-full h-48 overflow-hidden">
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
        <h2 className="text-lg font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-yellow-500 font-medium mb-4">⭐ {rating || "N/A"}</p>
        <button
          onClick={onAddClick}
          className="mt-auto w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-300"
        >
          Add to List
        </button>
      </div>
    </div>
  );
};

export default SearchCard;

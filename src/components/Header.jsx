import { useState, useContext } from "react";
import {
  FaBars,
  FaUserCircle,
  FaUserAlt,
  FaSignOutAlt,
  FaSearch,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthContext } from "../context/authContext";

const Header = ({ toggleSidebar }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const handleSearchNavigate = () => {
    navigate("/search");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-900/80 backdrop-blur border-b border-blue-500/20 px-4 py-3 text-white flex items-center shadow-sm">
      {/* Sidebar Toggle for mobile */}
      <div className="md:hidden flex-none">
        <button
          aria-label="Toggle sidebar"
          onClick={toggleSidebar}
          className="hover:text-blue-400 transition"
        >
          <FaBars size={24} />
        </button>
      </div>

      {/* App Title */}
      <h1 className="text-2xl font-bold text-center flex-grow">
        Fandom Fusion
      </h1>

      {/* Search Button */}
      <button
        aria-label="Search"
        onClick={handleSearchNavigate}
        className="mr-8 hover:text-blue-400 transition"
      >
        <FaSearch size={22} />
      </button>

      {/* Profile Dropdown */}
      <div className="relative flex-none">
        <button
          onClick={toggleDropdown}
          aria-label="Open profile menu"
          className="flex items-center hover:text-blue-400 transition"
        >
          <FaUserCircle size={24} />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-3 w-48 bg-gray-800 border border-blue-500/20 rounded-lg shadow-xl z-50 overflow-hidden"
            >
              <ul className="divide-y divide-blue-500/10">
                <li className="flex items-center px-4 py-3 hover:bg-blue-600 hover:text-white cursor-pointer transition">
                  <FaUserAlt className="mr-3" size={16} />
                  {user ? user.username : "Profile"}
                </li>
                <li
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 hover:bg-blue-600 hover:text-white cursor-pointer transition"
                >
                  <FaSignOutAlt className="mr-3" size={16} />
                  Logout
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Users,
  UserPlus,
  Search,
  Edit,
  Check,
  X,
  Camera
} from "lucide-react";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const getAuthToken = () => localStorage.getItem("authToken");
  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.id;
  };

  // REAL API: fetch data
  const fetchProfile = async () => {
    try {
      const token = getAuthToken();
      const userId = getUserId();
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/user/getUser/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(res.data.user);
      setUsername(res.data.user.username);
      setEmail(res.data.user.email);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFriends = async () => {
    try {
      const token = getAuthToken();
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/user/friends`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFriends(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const token = getAuthToken();
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/user/friend-requests`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFriendRequests(res.data.friendRequests);
    } catch (err) {
      console.error(err);
    }
  };

  const updateProfile = async () => {
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      if (profileImg) formData.append("profileImg", profileImg);

      await axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/user/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully");
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  const handleSearch = async () => {
    try {
      const token = getAuthToken();
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/search?search=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` },
});

      setSearchResults(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendFriendRequest = async (username) => {
    try {
      const token = getAuthToken();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/friend-requests`,
        { recipientUserName: username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Friend request sent to ${username}`);
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    }
  };

  const respondFriendRequest = async (username, action) => {
    try {
      const token = getAuthToken();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/friend-requests/respond`,
        { username, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Request ${action}ed`);
      fetchFriendRequests();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchFriends();
    fetchFriendRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Profile Dashboard
          </h1>
          <p className="text-blue-300">Manage your profile and connections</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
                  Profile
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>

              {profile && (
                <div className="space-y-6">
                  {/* Profile Image */}
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src={
                          profile.profileImg ||
                          "https://via.placeholder.com/150"
                        }
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-500/30 shadow-lg"
                      />
                      {isEditing && (
                        <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2 rounded-full cursor-pointer transition-colors">
                          <Camera className="w-4 h-4 text-white" />
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) =>
                              setProfileImg(e.target.files[0])
                            }
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-300 mb-2">
                        Username
                      </label>
                      <input
                        className={`w-full p-3 rounded-lg border bg-gray-700/50 text-white placeholder-gray-400 ${
                          isEditing
                            ? "border-blue-500/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                            : "border-gray-600 cursor-not-allowed"
                        }`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-300 mb-2">
                        Email
                      </label>
                      <input
                        className={`w-full p-3 rounded-lg border bg-gray-700/50 text-white placeholder-gray-400 ${
                          isEditing
                            ? "border-blue-500/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                            : "border-gray-600 cursor-not-allowed"
                        }`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3">
                      <button
                        onClick={updateProfile}
                        className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Friends, Requests, Search */}
          <div className="lg:col-span-2 space-y-6">
            {/* Friends */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-blue-400" />
                Friends ({friends.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {friends.map((friend) => (
                  <div
                    key={friend._id}
                    className="bg-gray-700/30 p-3 rounded-lg border border-gray-600/30 hover:border-blue-500/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {friend.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-white font-medium">
                        {friend.username}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Friend Requests */}
            {friendRequests.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 shadow-2xl">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
                  <UserPlus className="w-5 h-5 text-blue-400" />
                  Friend Requests ({friendRequests.length})
                </h2>
                <div className="space-y-3">
                  {friendRequests.map((request) => (
                    <div
                      key={request._id}
                      className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/30 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {request.sender.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white font-medium">
                          {request.sender.username}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            respondFriendRequest(request.sender.username, "accept")
                          }
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            respondFriendRequest(request.sender.username, "reject")
                          }
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
                <Search className="w-5 h-5 text-blue-400" />
                Find Friends
              </h2>
              <div className="flex gap-3 mb-6">
                <input
                  className="flex-1 p-3 rounded-lg border border-blue-500/50 bg-gray-700/50 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by username..."
                />
                <button
                  onClick={handleSearch}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-3">
                  {searchResults.map((user) => (
                    <div
                      key={user._id}
                      className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/30 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white font-medium">
                          {user.username}
                        </span>
                      </div>
                      <button
                        onClick={() => sendFriendRequest(user.username)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Add Friend
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

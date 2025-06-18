import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { validateEmail, validatePassword, validateConfirmPassword } from '../utils/utils_signup';
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username,setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/register`, {
        email,
        username,
        password
      });

      if (response.data.status === "Ok") {
        toast.success("Signup successful! You can now log in.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl shadow-2xl max-w-md w-full p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Create Your Account</h2>
          <p className="text-blue-300">Join the fandom community today</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-blue-300">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-blue-500/30 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400/30"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm text-blue-300">Username</label>
            <input
              type="text"
              placeholder="yourusername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg border border-blue-500/30 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400/30"
            />
            {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm text-blue-300">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-blue-500/30 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400/30"
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm text-blue-300">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-blue-500/30 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400/30"
            />
            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Let&apos;s Go 🚀
        </button>

        <div className="text-sm text-center text-blue-300 mt-4">
          Already have an account?{" "}
          <Link to="/Auth" className="font-medium underline hover:text-blue-400">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;

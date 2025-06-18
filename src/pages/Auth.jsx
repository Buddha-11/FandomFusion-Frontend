import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { validatePassword } from '../utils/utils';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Auth = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, {
        username,
        password,
      });

      if (response.data.status === 'Ok') {
        const user = response.data.user;
        const token = user.token;
        login(user, token);
        toast.success("Login successful!");
        window.location.href = '/';
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
      console.error('Error logging in:', error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl shadow-2xl max-w-md w-full p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
          <p className="text-blue-300">Sign in to continue your journey</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-blue-300">Username</label>
            <input
              type="text"
              placeholder="your username"
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
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Let&apos;s Go 🚀
        </button>

        <div className="text-sm text-center text-blue-300 mt-4">
          Don't have an account?{" "}
          <Link to="/Signup" className="font-medium underline hover:text-blue-400">
            Sign Up
          </Link>
        </div>

        <div className="text-sm text-center text-blue-300 mt-2 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/ForgotPassword" className="font-medium underline hover:text-blue-400">
            Forgot Password
          </Link>
          <Link to="/ResetPassword" className="font-medium underline hover:text-blue-400">
            Reset Password
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Auth;

import React from "react";
import { Link } from "react-router-dom";
import img from "../assets/landing.jpg";

const Home = () => {
  const handleSmoothScroll = (event, id) => {
    event.preventDefault();
    const section = document.querySelector(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-gray-100 min-h-screen font-sans">
      {/* ✅ Fixed Glassy Header */}
      <header className="fixed w-full top-0 left-0 z-50 flex justify-between items-center px-8 py-4 bg-gray-900/70 backdrop-blur border-b border-blue-500/10 shadow-sm">
        <Link to="/" className="text-2xl font-bold text-white-400 hover:text-blue-400 transition">FandomFusion</Link>
        <nav className="flex space-x-6">
          <a
            href="#features"
            onClick={(e) => handleSmoothScroll(e, "#features")}
            className="hover:text-blue-400 transition"
          >
            Features
          </a>
          <a
            href="#about"
            onClick={(e) => handleSmoothScroll(e, "#about")}
            className="hover:text-blue-400 transition"
          >
            About Us
          </a>
          <a
            href="#contact"
            onClick={(e) => handleSmoothScroll(e, "#contact")}
            className="hover:text-blue-400 transition"
          >
            Contact Us
          </a>
        </nav>
      </header>

      {/* ✅ Hero Section */}
      <section className="pt-28 md:pt-36 px-4">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white">
              Unite Your Fandoms in One Place
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Discover, connect, and share your love for movies, anime, and games like never before.
            </p>
            <div className="flex justify-center lg:justify-start space-x-4">
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold transition"
              >
                Sign Up
              </Link>
              <Link
                to="/auth"
                className="border border-blue-500 text-blue-400 px-6 py-3 rounded-md font-semibold hover:bg-blue-600 hover:text-white transition"
              >
                Log In
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 mt-10 lg:mt-0">
            <img
              src={img}
              alt="Hero"
              className="rounded-xl shadow-lg border border-blue-500/20"
            />
          </div>
        </div>
      </section>

      {/* ✅ Features */}
      <section id="features" className="py-32 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
            Features You'll Love
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                title: "Track Your Favorites",
                desc: "Keep track of movies, anime, and games you love, all in one place."
              },
              {
                title: "Connect with Friends",
                desc: "Follow your friends and see what they’re watching or playing."
              },
              {
                title: "Discover New Titles",
                desc: "Explore recommendations and expand your collection of fandoms."
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-gray-800/60 backdrop-blur-sm border border-blue-500/20 p-6 rounded-xl text-center shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-2xl font-bold mb-4 text-blue-400">{feature.title}</h3>
                <p className="text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ About Us */}
      <section id="about" className="py-32 bg-blue-600 text-white px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">About Us</h2>
          <p className="text-lg text-center max-w-3xl mx-auto">
            FandomFusion is the ultimate platform to unite all your favorite fandoms. Whether it’s movies, anime, or games, we make it easy to explore, share, and connect with others who share your interests.
          </p>
        </div>
      </section>

      {/* ✅ Contact Us */}
      {/* <section id="contact" className="py-32 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white">Contact Us</h2>
          <form className="max-w-xl mx-auto space-y-6">
            {["Name", "Email"].map((label) => (
              <div key={label}>
                <label className="block mb-2 text-gray-200">{label}</label>
                <input
                  type={label === "Email" ? "email" : "text"}
                  placeholder={`Enter your ${label.toLowerCase()}`}
                  className="w-full px-4 py-3 rounded-md bg-gray-800/70 backdrop-blur-sm border border-blue-500/20 text-white focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            ))}
            <div>
              <label className="block mb-2 text-gray-200">Message</label>
              <textarea
                placeholder="Your message"
                rows={5}
                className="w-full px-4 py-3 rounded-md bg-gray-800/70 backdrop-blur-sm border border-blue-500/20 text-white focus:ring-2 focus:ring-blue-400 outline-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section> */}
    </div>
  );
};

export default Home;

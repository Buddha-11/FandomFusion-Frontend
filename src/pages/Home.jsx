import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { AnimatePresence, motion } from "framer-motion";

const Home = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* ✅ Header */}
      <Header toggleSidebar={toggleSidebar} />

      {/* ✅ Sidebar + Content Wrapper */}
      <div className="pt-10 flex flex-grow relative">
        {/* Mobile Sidebar with slide-in */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className=" fixed top-16 left-0 z-50 w-64 bg-gray-800/90 backdrop-blur border-r border-blue-500/30 min-h-screen md:hidden"
            >
              <Sidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dark overlay for sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Sidebar for md+ */}
        <div className="hidden md:block w-64 bg-gray-800/90 backdrop-blur border-r border-blue-500/30">
          <Sidebar />
        </div>

        {/* ✅ Main Content */}
        <main className="flex-1 p-4 md:p-8 space-y-12">
          {/* Friends Feed */}
          <section className="space-y-4">
            <h2 className="pt-10 text-3xl font-bold text-white border-b border-blue-500/30 pb-2">
              👥 Friends Feed
            </h2>
            <Feed type="friends" />
          </section>

          {/* Global Feed */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-white border-b border-blue-500/30 pb-2">
              🌐 Global Feed
            </h2>
            <Feed type="global" />
          </section>
        </main>
      </div>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
};

export default Home;

import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Home from './components/Home';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import Projects from './components/Projects';
import Contact from './components/Contact';
import FloatingLogo from './components/FloatingLogo';
import ThemeDropdown from './components/ThemeDropdown';

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Theme Dropdown */}
      <ThemeDropdown />

      {/* Floating Logo/Icon */}
      <FloatingLogo />

      <Routes>
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route
          path="/"
          element={
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Home />
              <Blog />
              <Projects />
              <Contact />
            </motion.main>
          }
        />
      </Routes>
    </div>
  );
};

// Wrap App with Router to use hooks
const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;

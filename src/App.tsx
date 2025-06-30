import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Home from './components/Home';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import Projects from './components/Projects';
import Contact from './components/Contact';
import FloatingLogo from './components/FloatingLogo';
import ThemeDropdown from './components/ThemeDropdown';
import NavigationButtons from './components/NavigationButtons';
import ParallaxBackground from './components/ParallaxBackground';

// Import background images
import heroLight from './assets/hero_light.png';
import heroDark from './assets/hero_dark.png';
import blogsLight from './assets/blogs_light.png';
import blogsDark from './assets/blogs_dark.png';
import projectsLight from './assets/projects_light.png';
import projectsDark from './assets/projects_dark.png';
import contactLight from './assets/contact_light.png';
import contactDark from './assets/contact_dark.png';

const App: React.FC = () => {

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Theme Dropdown */}
      <ThemeDropdown />

      {/* Navigation Buttons - Positioned globally to maintain interactivity */}
      <NavigationButtons />

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
              className="relative w-full"
            >
              {/* Hero Section with Parallax Background */}
              <ParallaxBackground
                lightImage={heroLight}
                darkImage={heroDark}
                parallaxSpeed={0.2}
                className="h-screen"
                sectionId="hero"
                backgroundSize="cover"
              >
                <Home />
              </ParallaxBackground>

              {/* Blog Section with Parallax Background */}
              <ParallaxBackground
                lightImage={blogsLight}
                darkImage={blogsDark}
                parallaxSpeed={0.15}
                className="h-screen"
                sectionId="blog"
                backgroundSize="cover"
              >
                <Blog />
              </ParallaxBackground>

              {/* Projects Section with Parallax Background */}
              <ParallaxBackground
                lightImage={projectsLight}
                darkImage={projectsDark}
                parallaxSpeed={0.1}
                className="h-screen"
                sectionId="projects"
                backgroundSize="cover"
              >
                <Projects />
              </ParallaxBackground>

              {/* Contact Section with Parallax Background */}
              <ParallaxBackground
                lightImage={contactLight}
                darkImage={contactDark}
                parallaxSpeed={0.05}
                className="h-screen"
                sectionId="contact"
                backgroundSize="cover"
              >
                <Contact />
              </ParallaxBackground>
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

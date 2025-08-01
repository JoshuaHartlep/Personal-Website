import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import Home from './components/Home';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import ProjectPost from './components/ProjectPost';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Photography from './components/Photography';
import PhotographyPortfolio from './components/PhotographyPortfolio';
import FloatingLogo from './components/FloatingLogo';
import ThemeDropdown from './components/ThemeDropdown';
import NavigationButtons from './components/NavigationButtons';
import ParallaxBackground from './components/ParallaxBackground';
import { initFadeUpAnimations } from './utils/scrollFadeUp';

// Import background images
import heroLight from './assets/hero_light.png';
import heroDark from './assets/hero_dark.png';
import blogsLight from './assets/blogs_light.png';
import blogsDark from './assets/blogs_dark.png';
import projectsLight from './assets/projects_light.png';
import projectsDark from './assets/projects_dark.png';
import contactLight from './assets/contact_light.png';
import contactDark from './assets/contact_dark.png';
import photographyLight from './assets/photography_light.png';
import photographyDark from './assets/photography_dark.png';

// Component to reinitialize fade-up animations when home page loads
interface HomePageWrapperProps {
  titleBoxRef: React.RefObject<HTMLDivElement>;
}

const HomePageWrapper: React.FC<HomePageWrapperProps> = ({ titleBoxRef }) => {
  useEffect(() => {
    // Reinitialize fade-up animations when home page loads
    const timer = setTimeout(() => {
      initFadeUpAnimations();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
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

      {/* Photography Portfolio Section with Parallax Background */}
      <ParallaxBackground
        lightImage={photographyLight}
        darkImage={photographyDark}
        parallaxSpeed={0.08}
        className="h-screen"
        sectionId="photography"
        backgroundSize="cover"
      >
        <PhotographyPortfolio />
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
  );
};

const App: React.FC = () => {
  const location = useLocation();
  const titleBoxRef = useRef<HTMLDivElement>(null);
  
  // Only show navigation buttons on the homepage
  const showNavigationButtons = location.pathname === '/';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Theme Dropdown */}
      <ThemeDropdown />

      {/* Navigation Buttons - Only shown on homepage */}
      {showNavigationButtons && <NavigationButtons titleBoxRef={titleBoxRef} />}

      {/* Floating Logo/Icon */}
      <FloatingLogo />

      <Routes>
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/projects/:slug" element={<ProjectPost />} />
        <Route path="/photography" element={<Photography />} />
        <Route path="/" element={<HomePageWrapper titleBoxRef={titleBoxRef} />} />
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

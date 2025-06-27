import { motion, useViewportScroll, useTransform } from 'framer-motion';
import logo from '../assets/logo.png'; // Make sure the PNG is named logo.png in assets

const FloatingLogo = () => {
  // Framer Motion scroll progress (0-1)
  const { scrollY } = useViewportScroll();
  // Rotate from 0deg to 360deg as you scroll down the page
  const rotate = useTransform(scrollY, [0, 1000], [0, 360]);

  // For accessibility: scroll to top on click
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.button
      onClick={handleClick}
      aria-label="Scroll to top"
      style={{ rotate }}
      className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-[70] p-0 m-0 bg-transparent border-none cursor-pointer outline-none"
      tabIndex={0}
    >
      <img
        src={logo}
        alt="Personal logo"
        className="w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg pointer-events-auto select-none"
        draggable={false}
      />
    </motion.button>
  );
};

export default FloatingLogo; 
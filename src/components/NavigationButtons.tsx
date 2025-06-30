import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const NavigationButtons = () => {
  const [isSticky, setIsSticky] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '-1px 0px 0px 0px'
      }
    );

    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const buttons = [
    {
      id: 'blog',
      title: 'Blogs',
      description: 'Writings & reflections'
    },
    {
      id: 'projects',
      title: 'Projects',
      description: 'Selected work and side projects'
    },
    {
      id: 'contact',
      title: 'Contact Me',
      description: 'Get in touch'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 2.5 // Delay after title animation
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <>
      {/* Spacer div for intersection observer - positioned at bottom of hero text */}
      <div 
        ref={containerRef} 
        className="absolute"
        style={{
          top: 'calc(40 + 4rem)', // Position after hero content
          left: 0,
          right: 0,
          height: '1px'
        }}
      />
      
      {/* Navigation Buttons */}
      <div
        className={`navigation-buttons transition-all duration-300 px-4 ${isSticky ? 'pt-4' : ''}`}
        style={{
          /* Position initially under hero subheader, then become sticky */
          position: isSticky ? 'fixed' : 'absolute',
          top: isSticky ? '0' : 'calc(30vh + 1rem)',
          left: 0,
          right: 0,
          /* Ensure no transform conflicts with animations */
          transform: 'none',
          /* Force highest z-index to stay above all content */
          zIndex: 999,
          /* Ensure pointer events always work */
          pointerEvents: 'auto',
          /* Smooth transition between positions */
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <motion.div
          className="flex flex-row justify-center space-x-3 flex-wrap md:flex-nowrap max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {buttons.map((button) => (
            <motion.button
              key={button.id}
              onClick={() => scrollToSection(button.id)}
              className="px-4 py-2.5 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-full text-center hover:bg-white dark:hover:bg-black transition-colors duration-200 shadow-sm border border-gray-200/50 dark:border-gray-700/50"
              variants={buttonVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                /* Ensure buttons are not affected by parent transforms */
                transform: 'none',
                /* Ensure buttons are always interactive */
                pointerEvents: 'auto',
                /* Prevent z-index issues */
                position: 'relative',
                zIndex: 2
              }}
            >
              <h2 className="text-base font-medium">{button.title}</h2>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default NavigationButtons; 
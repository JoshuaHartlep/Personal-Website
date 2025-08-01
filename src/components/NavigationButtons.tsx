import { motion } from 'framer-motion';
import { useEffect, useState, RefObject } from 'react';

interface NavigationButtonsProps {
  titleBoxRef: RefObject<HTMLDivElement>;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ titleBoxRef }) => {
  const [titleBoxBottom, setTitleBoxBottom] = useState<number>(0);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const updateTitleBoxPosition = () => {
      if (titleBoxRef.current) {
        const rect = titleBoxRef.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        setTitleBoxBottom(rect.bottom + scrollTop);
      }
    };

    // Update position initially and on resize
    updateTitleBoxPosition();
    window.addEventListener('resize', updateTitleBoxPosition);

    // Check if we should be sticky based on scroll position
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      // Become sticky when we've scrolled past the title box
      setIsSticky(scrollTop > titleBoxBottom - 100); // 100px buffer
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', updateTitleBoxPosition);

    return () => {
      window.removeEventListener('resize', updateTitleBoxPosition);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', updateTitleBoxPosition);
    };
  }, [titleBoxRef, titleBoxBottom]);

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
      id: 'photography',
      title: 'Photography',
      description: 'Visual portfolio'
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

  // Calculate position: start below title box, stick at top with margin
  const getPosition = () => {
    if (isSticky) {
      return {
        position: 'fixed' as const,
        top: '16px', // 16px from top when sticky
      };
    } else {
      return {
        position: 'absolute' as const,
        top: titleBoxBottom ? `${titleBoxBottom + 16}px` : 'calc(50vh + 2rem)', // Fallback position
      };
    }
  };

  const position = getPosition();

  return (
    <div
      className="navigation-buttons px-4"
      style={{
        ...position,
        left: 0,
        right: 0,
        zIndex: 999,
        pointerEvents: 'auto',
        transition: 'all 0.3s ease-in-out',
        width: '100%',
        background: 'transparent',
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
            className="px-4 py-2.5 backdrop-blur-sm rounded-full text-center transition-all duration-200 shadow-sm border bg-white/80 dark:bg-black/80 border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-black"
            variants={buttonVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              transform: 'none',
              pointerEvents: 'auto',
              position: 'relative',
              zIndex: 2
            }}
          >
            <h2 className="text-base font-medium">{button.title}</h2>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default NavigationButtons; 
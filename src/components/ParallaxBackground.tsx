import { useEffect, useRef, useState } from 'react';

interface ParallaxBackgroundProps {
  lightImage: string;
  darkImage: string;
  parallaxSpeed?: number;
  className?: string;
  children?: React.ReactNode;
  gradientOverlay?: {
    from: string;
    to: string;
    direction?: 'top' | 'bottom' | 'both';
  };
  backgroundSize?: 'cover' | 'contain' | '100% 100%';
  sectionId?: string;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  lightImage,
  darkImage,
  parallaxSpeed = 0.5,
  className = '',
  children,
  gradientOverlay,
  backgroundSize = '100% 100%',
  sectionId
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isDark, setIsDark] = useState(false);

  // Track theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    // Initial check
    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Handle parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Only calculate parallax when element is visible
      if (rect.bottom >= 0 && rect.top <= windowHeight) {
        const scrolled = window.scrollY;
        setScrollY(scrolled);
      }
    };

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate background position for parallax effect
  const getBackgroundPosition = () => {
    // Special handling for contact section - keep it centered
    if (sectionId === 'contact') {
      return 'center center';
    }
    
    // For projects section, start from top and apply minimal parallax
    if (sectionId === 'projects') {
      const backgroundY = scrollY * parallaxSpeed;
      return `center ${Math.max(-50, backgroundY)}px`;
    }
    
    // For other sections, apply parallax effect
    const backgroundY = scrollY * parallaxSpeed;
    return `center ${backgroundY}px`;
  };

  // Generate gradient overlay styles for seamless transitions
  const getGradientOverlay = () => {
    if (!gradientOverlay) return '';
    
    const { from, to, direction = 'both' } = gradientOverlay;
    
    // Enhanced gradients for better section blending
    switch (direction) {
      case 'top':
        return `linear-gradient(to bottom, ${from} 0%, rgba(0,0,0,0.1) 40%, transparent 70%)`;
      case 'bottom':
        return `linear-gradient(to top, ${to} 0%, rgba(0,0,0,0.1) 40%, transparent 70%)`;
      case 'both':
        return `linear-gradient(to bottom, ${from} 0%, transparent 25%, transparent 75%, ${to} 100%)`;
      default:
        return '';
    }
  };

  // Get section-specific transition gradient
  const getSectionTransitionGradient = () => {
    const baseGradient = isDark 
      ? 'rgba(31, 41, 55, 0.9)' // dark mode overlay
      : 'rgba(249, 250, 251, 0.9)'; // light mode overlay
    
    switch (sectionId) {
      case 'hero':
        return `linear-gradient(to bottom, transparent 0%, transparent 70%, ${baseGradient} 100%)`;
      case 'blog':
        return `linear-gradient(to bottom, ${baseGradient} 0%, transparent 15%, transparent 85%, ${baseGradient} 100%)`;
      case 'projects':
        return `linear-gradient(to bottom, ${baseGradient} 0%, transparent 15%, transparent 85%, ${baseGradient} 100%)`;
      case 'contact':
        return `linear-gradient(to bottom, ${baseGradient} 0%, transparent 30%, transparent 100%)`;
      default:
        return 'transparent';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`parallax-section bg-smooth-transition ${className}`}
      data-section={sectionId}
      style={{
        backgroundImage: `url(${isDark ? darkImage : lightImage})`,
        backgroundSize: backgroundSize,
        backgroundPosition: getBackgroundPosition(),
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
        backgroundColor: isDark ? '#1f2937' : '#f9fafb',
        willChange: 'background-position',
        height: '100vh',
        margin: 0,
        padding: 0,
      }}
    >
      {/* Section transition gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: getSectionTransitionGradient(),
          zIndex: 2,
        }}
      />

      {/* Custom gradient overlay */}
      {gradientOverlay && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: getGradientOverlay(),
            zIndex: 3,
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ParallaxBackground;
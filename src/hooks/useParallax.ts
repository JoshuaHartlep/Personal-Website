import { useEffect, useRef, useState, useCallback } from 'react';

interface UseParallaxOptions {
  speed?: number;
  threshold?: number;
  rootMargin?: string;
}

interface ParallaxState {
  isVisible: boolean;
  progress: number;
  transform: string;
}

const useParallax = (options: UseParallaxOptions = {}): [React.RefObject<HTMLDivElement>, ParallaxState] => {
  const {
    speed = 0.5,
    threshold = 0.1,
    rootMargin = '50px'
  } = options;

  const elementRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<ParallaxState>({
    isVisible: false,
    progress: 0,
    transform: 'translateY(0px)'
  });

  const updateParallax = useCallback(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate visibility and progress
    const isVisible = rect.bottom >= 0 && rect.top <= windowHeight;
    
    if (isVisible) {
      // Calculate progress (0 to 1) based on element position in viewport
      const elementCenter = rect.top + rect.height / 2;
      const windowCenter = windowHeight / 2;
      const progress = Math.max(0, Math.min(1, 1 - (elementCenter - windowCenter) / windowHeight));
      
      // Calculate parallax offset
      const scrolled = window.scrollY;
      const elementTop = element.offsetTop;
      const rate = scrolled - elementTop;
      const yPos = Math.round(rate * speed);
      
      setState({
        isVisible,
        progress,
        transform: `translateY(${yPos}px)`
      });
    } else {
      setState(prev => ({
        ...prev,
        isVisible
      }));
    }
  }, [speed]);

  useEffect(() => {
    // Throttled scroll handler for better performance
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial calculation
    updateParallax();

    // Set up intersection observer for visibility detection
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element is visible, start listening to scroll
            window.addEventListener('scroll', handleScroll, { passive: true });
            updateParallax();
          } else {
            // Element not visible, stop listening to scroll for performance
            window.removeEventListener('scroll', handleScroll);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [updateParallax, threshold, rootMargin]);

  return [elementRef, state];
};

export default useParallax;
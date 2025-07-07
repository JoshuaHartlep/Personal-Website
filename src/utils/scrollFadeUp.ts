const FADE_UP_SELECTOR = '[data-animate="fade-up"]:not(.sticky-nav-container):not(.sticky-nav-container *):not(.theme-dropdown):not(.theme-dropdown *)';

// Store the current observer to clean up on reinitialize
let currentObserver: IntersectionObserver | null = null;
// Track initialization state to prevent race conditions
let isInitializing = false;
// Store element states to prevent conflicts
const elementStates = new Map<Element, { isVisible: boolean, lastUpdate: number }>();

export function initFadeUpAnimations() {
  console.log('[fade-up] Initializing scroll-triggered animations...');
  
  // Prevent multiple simultaneous initializations
  if (isInitializing) {
    console.log('[fade-up] Already initializing, skipping...');
    return;
  }
  
  isInitializing = true;
  
  // Clean up existing observer if it exists
  if (currentObserver) {
    currentObserver.disconnect();
    currentObserver = null;
  }
  
  // Force immediate visibility for elements already in viewport as fallback
  const ensureVisibilityFallback = () => {
    setTimeout(() => {
      const elementsInViewport = document.querySelectorAll(FADE_UP_SELECTOR);
      elementsInViewport.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInViewport && !el.classList.contains('is-visible')) {
          console.warn('[fade-up] Fallback: Forcing visibility for element in viewport:', el);
          el.classList.add('is-visible');
          el.classList.remove('fade-up-init');
        }
      });
    }, 200);
  };
  
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    console.warn('[fade-up] IntersectionObserver not supported. Showing all elements.');
    document.querySelectorAll(FADE_UP_SELECTOR).forEach(el => {
      el.classList.remove('fade-up-init');
      el.classList.add('is-visible');
    });
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('[fade-up] Prefers reduced motion. Showing all elements.');
    document.querySelectorAll(FADE_UP_SELECTOR).forEach(el => {
      el.classList.remove('fade-up-init');
      el.classList.add('is-visible');
    });
    return;
  }

  const elements = document.querySelectorAll(FADE_UP_SELECTOR);
  console.log(`[fade-up] Found ${elements.length} elements to animate.`);
  
  // Initialize elements to hidden state
  elements.forEach(el => {
    el.classList.remove('is-visible');
    el.classList.add('fade-up-init');
  });

  currentObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const element = entry.target;
      const now = Date.now();
      const currentState = elementStates.get(element);
      
      // Debounce rapid state changes (prevent flickering)
      if (currentState && now - currentState.lastUpdate < 100) {
        return;
      }
      
      if (entry.isIntersecting) {
        // Element is entering viewport - animate in
        const newState = { isVisible: true, lastUpdate: now };
        elementStates.set(element, newState);
        
        // Use requestAnimationFrame for smooth transitions
        requestAnimationFrame(() => {
          element.classList.add('is-visible');
          element.classList.remove('fade-up-init');
          console.log('[fade-up] Animated in:', element);
        });
      } else {
        // Element is leaving viewport - animate out (reversible)
        const newState = { isVisible: false, lastUpdate: now };
        elementStates.set(element, newState);
        
        // Delay the hide animation slightly to prevent rapid flickering
        setTimeout(() => {
          // Double-check the element is still not intersecting
          const rect = element.getBoundingClientRect();
          const isStillOutOfView = rect.bottom < 0 || rect.top > window.innerHeight;
          
          if (isStillOutOfView) {
            requestAnimationFrame(() => {
              element.classList.remove('is-visible');
              element.classList.add('fade-up-init');
              console.log('[fade-up] Animated out:', element);
            });
          }
        }, 150);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -8% 0px'
  });

  elements.forEach(el => {
    // Initialize element state tracking
    const rect = el.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
    elementStates.set(el, { isVisible: isInViewport, lastUpdate: Date.now() });
    
    currentObserver!.observe(el);
  });

  console.log('[fade-up] IntersectionObserver set up for reversible animations.');
  
  // Reset initialization flag
  setTimeout(() => {
    isInitializing = false;
  }, 100);
  
  // Activate the fallback mechanism
  ensureVisibilityFallback();
} 
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initFadeUpAnimations } from './utils/scrollFadeUp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Initialize fade-up animations after React has rendered
if (typeof window !== 'undefined') {
  // Wait for both DOM content and React to be ready
  const initAnimations = () => {
    // Small delay to ensure React has finished rendering
    setTimeout(() => {
      initFadeUpAnimations({
        stagger: 80,
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
      });
    }, 100);
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }

  // Also initialize when React finishes rendering (useful for SPA navigation)
  window.addEventListener('load', initAnimations);
}

import React from 'react';

const AnimationTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 p-8">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 data-animate="fade-up" className="text-4xl font-bold text-gray-900 dark:text-white">
            Reversible Scroll Animation Test
          </h1>
          <p data-animate="fade-up-subtle" className="text-xl text-gray-600 dark:text-gray-300">
            Scroll up and down to see elements animate in and out repeatedly
          </p>
        </section>

        {/* Instructions */}
        <section className="space-y-4">
          <div data-animate="fade-up" className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              How to Test
            </h2>
            <ul className="text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Scroll down to see elements fade in</li>
              <li>• Scroll back up to see elements fade out</li>
              <li>• Scroll down again to see them fade in again</li>
              <li>• Repeat as many times as you want!</li>
            </ul>
          </div>
        </section>

        {/* Standard Animations */}
        <section className="space-y-8">
          <h2 data-animate="fade-up" className="text-2xl font-semibold text-gray-900 dark:text-white">
            Standard Fade-Up Animations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                data-animate="fade-up"
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Card {i}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  This card uses the standard fade-up animation. It will animate in and out every time you scroll past it.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Subtle Animations */}
        <section className="space-y-8">
          <h2 data-animate="fade-up" className="text-2xl font-semibold text-gray-900 dark:text-white">
            Subtle Fade-Up Animations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div 
                key={i}
                data-animate="fade-up-subtle"
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Subtle Card {i}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  This card uses the subtle fade-up animation with faster timing.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Slow Animations */}
        <section className="space-y-8">
          <h2 data-animate="fade-up" className="text-2xl font-semibold text-gray-900 dark:text-white">
            Slow Fade-Up Animations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div 
                key={i}
                data-animate="fade-up-slow"
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Slow Card {i}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  This card uses the slow fade-up animation with longer duration for dramatic effect.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Mixed Animations */}
        <section className="space-y-8">
          <h2 data-animate="fade-up" className="text-2xl font-semibold text-gray-900 dark:text-white">
            Mixed Animation Types
          </h2>
          
          <div className="space-y-6">
            <div 
              data-animate="fade-up"
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Standard Animation
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                This uses the standard fade-up animation.
              </p>
            </div>
            
            <div 
              data-animate="fade-up-subtle"
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Subtle Animation
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                This uses the subtle fade-up animation.
              </p>
            </div>
            
            <div 
              data-animate="fade-up-slow"
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Slow Animation
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                This uses the slow fade-up animation.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Spacer */}
        <div className="h-32"></div>
      </div>
    </div>
  );
};

export default AnimationTest; 
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PhotographyPortfolio: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/photography');
  };

  return (
    <div className="h-full flex flex-col justify-center">
      <section id="photography" className="py-24 flex flex-col items-center justify-center relative z-10">
        <div data-animate="fade-up" className="max-w-2xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 font-mono">Photography Portfolio</h2>
          
          <motion.div
            onClick={handleClick}
            className="cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div 
              className="bg-white/90 dark:bg-blue-700/90 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-700 p-8 text-center transition-all duration-200 group-hover:bg-white dark:group-hover:bg-blue-600/90"
              style={{
                boxShadow: '6px 6px 0px rgba(0,0,0,0.2)',
                imageRendering: 'pixelated'
              }}
            >
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-2xl font-bold mb-4 font-mono text-gray-800 dark:text-white">
                Click here to access my Photography Portfolio
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-mono">
                Explore my collection of sports photography and miscellaneous captures
              </p>
              <div className="mt-6 inline-flex items-center text-blue-600 dark:text-blue-400 font-mono font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-300">
                View Gallery 
                <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PhotographyPortfolio;
import { motion } from 'framer-motion';
import NavigationButtons from './NavigationButtons';

const Home = () => {
  const title = "Joshua Hartlep";

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-8 pt-24">
      <div data-animate="fade-up" className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            {title.split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                }}
                className="inline-block"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: title.length * 0.1 + 0.3, duration: 0.5 }}
            className="text-xl text-gray-600 dark:text-gray-300"
          >
            Electrical and Computer Engineering + Computer Science at Duke University
            <br />
            Explore my passion and journey with me
          </motion.p>
        </motion.div>
      </div>
      
      {/* Navigation buttons outside of animated container */}
      <NavigationButtons />
    </section>
  );
};

export default Home; 
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="space-y-16 text-center">
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-duke-blue">
          ECE/CS Student at Duke University
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          I'm passionate about building innovative software solutions and exploring the intersection of hardware and software engineering.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link to="/blog" className="card group bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-semibold mb-3 text-duke-blue group-hover:underline">
            Blog
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Read my thoughts on technology, programming, and more.
          </p>
        </Link>
        
        <Link to="/projects" className="card group bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-semibold mb-3 text-duke-blue group-hover:underline">
            Projects
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Explore my latest projects and technical work.
          </p>
        </Link>
        
        <Link to="/about" className="card group bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-semibold mb-3 text-duke-blue group-hover:underline">
            About
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Learn more about my background and experience.
          </p>
        </Link>
      </section>
    </div>
  );
};

export default Home; 
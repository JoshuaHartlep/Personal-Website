import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { BlogPost } from '../utils/blog';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <motion.div
      className="flex-none w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link to={`/blog/${post.slug}`} className="block h-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-full text-sm">
              {post.category}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {post.readTime} min read
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard; 
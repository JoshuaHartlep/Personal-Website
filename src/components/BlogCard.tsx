import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { BlogPost } from '../utils/blog';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const defaultThumbnail = post.category === 'writeups' ? '/default-writeup.png' : '/default-reflection.png';
  
  return (
    <div className="flex-none w-80 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 shadow-lg overflow-hidden group relative"
      style={{
        boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
        imageRendering: 'pixelated'
      }}
    >
      <Link to={`/blog/${post.slug}`} className="block h-full">
        <div className="relative">
          <img
            src={post.thumbnailUrl || defaultThumbnail}
            alt={post.title}
            className="w-full h-48 object-cover border-b-2 border-gray-300 dark:border-gray-700"
            style={{ imageRendering: 'pixelated' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE5MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2YjczODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5CTE9HPC90ZXh0Pjwvc3ZnPg==';
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center">
            <h3 className="text-white font-mono font-bold text-lg text-center px-4">{post.title}</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 border border-red-300 dark:border-red-700 text-sm font-mono">
              {post.category}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
              {post.readTime}min
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2 line-clamp-2 font-mono">{post.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 font-mono">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 text-xs font-mono"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 text-xs font-mono">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard; 
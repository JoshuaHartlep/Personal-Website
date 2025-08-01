import { Link } from 'react-router-dom';
import type { BlogPost } from '../utils/blog';

// Import all blog images
import ChinaBlogStarPose from '../assets/ChinaBlogStarPose.jpg';
import ChinaBlogPic from '../assets/ChinaBlogPic.jpg';
import InternshipBlogPic from '../assets/InternshipBlogPic.jpg';
import AppleStockBlogPic from '../assets/AppleStockBlogPic.png';
import NvidiaGTCParisBlogPic from '../assets/NvidiaGTCParisBlogPic.jpeg';
import AnsysSimulationWorldThumbnail from '../assets/AnsysSimulationWorldThumbnail.jpg';

interface BlogCardProps {
  post: BlogPost;
  searchTerm?: string;
}

// Helper function to highlight matching text
const highlightText = (text: string, searchTerm: string) => {
  if (!searchTerm.trim()) return text;
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <span key={index} className="bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 px-1 rounded">
        {part}
      </span>
    ) : part
  );
};

const BlogCard: React.FC<BlogCardProps> = ({ post, searchTerm = '' }) => {
  const defaultThumbnail = post.category === 'writeups' ? '/default-writeup.png' : '/default-reflection.png';
  
  // Image mapping object - add new images here
  const imageMap: Record<string, string> = {
    'ChinaBlogStarPose.jpg': ChinaBlogStarPose,
    'ChinaBlogPic.jpg': ChinaBlogPic, // Handle both cases
    'InternshipBlogPic.jpg': InternshipBlogPic,
    'AppleStockBlogPic.png': AppleStockBlogPic,
    'NvidiaGTCParisBlogPic.jpeg': NvidiaGTCParisBlogPic,
    'AnsysSimulationWorldThumbnail.jpg': AnsysSimulationWorldThumbnail,
  };
  
  // Custom positioning for specific images - add new positions here
  const positionMap: Record<string, string> = {
    'ChinaBlogPic.jpg': 'center 30%',
    'InternshipBlogPic.jpg': 'center 42%', // horizontal then vertical
  };
  
  // Map thumbnail names to imported images
  const getThumbnailUrl = (thumbnailName?: string) => {
    if (!thumbnailName) return defaultThumbnail;
    
    // Check if the image exists in our mapping
    const mappedImage = imageMap[thumbnailName];
    return mappedImage || defaultThumbnail;
  };
  
  // Get custom positioning for an image
  const getImagePosition = (thumbnailName?: string) => {
    if (!thumbnailName) return 'center center';
    return positionMap[thumbnailName] || 'center center';
  };
  
  return (
    <div className="w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 shadow-lg overflow-hidden group relative"
      style={{
        boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
        imageRendering: 'pixelated'
      }}
    >
      <Link to={`/blog/${post.slug}`} className="block h-full">
        <div className="relative">
          <img
            src={getThumbnailUrl(post.thumbnailUrl)}
            alt={post.title}
            className="w-full h-48 md:h-56 object-cover border-b-2 border-gray-300 dark:border-gray-700"
            style={{ 
              imageRendering: 'pixelated',
              objectPosition: getImagePosition(post.thumbnailUrl)
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE5MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2YjczODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5CTE9HPC90ZXh0Pjwvc3ZnPg==';
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
            <h3 className="text-white font-mono font-bold text-sm md:text-lg text-center px-4">{post.title}</h3>
          </div>
        </div>
        <div className="p-3 md:p-4">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 border border-red-300 dark:border-red-700 text-xs font-mono">
              {post.category}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {post.readTime}min
            </span>
          </div>
          <h3 className="text-base md:text-lg font-bold mb-2 line-clamp-2 font-mono">{highlightText(post.title, searchTerm)}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-xs mb-2 md:mb-3 font-mono">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 text-xs font-mono"
              >
                {highlightText(tag, searchTerm)}
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
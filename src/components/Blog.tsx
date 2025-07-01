import { useRef, useEffect, useState } from 'react';
import BlogCard from './BlogCard';
import { getBlogPosts } from '../utils/blog';
import type { BlogPost } from '../utils/blog';

const Blog: React.FC = () => {
  const writeupsRef = useRef<HTMLDivElement>(null);
  const reflectionsRef = useRef<HTMLDivElement>(null);
  const [writeups, setWriteups] = useState<BlogPost[]>([]);
  const [reflections, setReflections] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const [writeupsData, reflectionsData] = await Promise.all([
          getBlogPosts('writeups'),
          getBlogPosts('reflections')
        ]);
        setWriteups(writeupsData);
        setReflections(reflectionsData);
      } catch (error) {
        console.error('Error loading blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const renderScrollButton = (direction: 'left' | 'right', onClick: () => void) => (
    <button
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 ${
        direction === 'left' ? 'left-0' : 'right-0'
      } p-2 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-200 dark:hover:bg-gray-600 z-10 font-mono`}
      style={{ boxShadow: '3px 3px 0px rgba(0,0,0,0.2)' }}
      aria-label={`Scroll ${direction}`}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={3}
      >
        {direction === 'left' ? (
          <path strokeLinecap="square" strokeLinejoin="miter" d="M15 19l-7-7 7-7" />
        ) : (
          <path strokeLinecap="square" strokeLinejoin="miter" d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );

  const renderSection = (title: string, posts: BlogPost[], ref: React.RefObject<HTMLDivElement>) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 font-mono">{title}</h2>
      <div className="relative h-[40vh] bg-white/5 dark:bg-gray-900/20 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        {renderScrollButton('left', () => scroll(ref, 'left'))}
        <div
          ref={ref}
          className="flex space-x-6 overflow-x-auto h-full scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
        {renderScrollButton('right', () => scroll(ref, 'right'))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="h-full flex flex-col justify-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-start pt-8">
      <section id="blog" className="py-8 pb-20 relative z-10">
        <div data-animate="fade-up" className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12 font-mono">Blogs</h1>
          <div className="space-y-8">
            <div data-animate="fade-up">
              {renderSection('Tech Write-ups', writeups, writeupsRef)}
            </div>
            <div data-animate="fade-up">
              {renderSection('Personal Reflections', reflections, reflectionsRef)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog; 
import { motion } from 'framer-motion';
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
      } p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10`}
      aria-label={`Scroll ${direction}`}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {direction === 'left' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );

  const renderSection = (title: string, posts: BlogPost[], ref: React.RefObject<HTMLDivElement>) => (
    <div className="mb-16">
      <h2 className="text-3xl font-bold mb-8">{title}</h2>
      <div className="relative">
        {renderScrollButton('left', () => scroll(ref, 'left'))}
        <div
          ref={ref}
          className="flex space-x-6 overflow-x-auto pb-6 px-4 scrollbar-hide"
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section id="blog" className="min-h-screen py-24">
      <div data-animate="fade-up" className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-16">Blogs</h1>
        <div data-animate="fade-up">{renderSection('Tech Write-ups', writeups, writeupsRef)}</div>
        <div data-animate="fade-up">{renderSection('Personal Reflections', reflections, reflectionsRef)}</div>
      </div>
    </section>
  );
};

export default Blog; 
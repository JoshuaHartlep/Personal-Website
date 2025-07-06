import { useEffect, useState } from 'react';
import BlogCard from './BlogCard';
import { getBlogPosts } from '../utils/blog';
import type { BlogPost } from '../utils/blog';

const Blog: React.FC = () => {
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
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8 font-mono">Blogs</h1>
          
          {/* Single scrollable container like Projects */}
          <div className="h-[80vh] overflow-y-auto scrollbar-hide pb-12">
            
            {/* Mobile: Single column layout */}
            <div className="block md:hidden space-y-8">
              <div data-animate="fade-up">
                <h2 className="text-xl font-bold mb-4 font-mono text-center">Tech Write-ups</h2>
                <div className="space-y-4">
                  {writeups.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
              
              <div data-animate="fade-up">
                <h2 className="text-xl font-bold mb-4 font-mono text-center">Personal Reflections</h2>
                <div className="space-y-4">
                  {reflections.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop: Two column layout */}
            <div className="hidden md:grid md:grid-cols-2 gap-8">
              <div data-animate="fade-up">
                <h2 className="text-2xl font-bold mb-4 font-mono text-center sticky top-0 bg-white dark:bg-gray-900 z-10 py-2">Tech Write-ups</h2>
                <div className="space-y-4">
                  {writeups.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
              
              <div data-animate="fade-up">
                <h2 className="text-2xl font-bold mb-4 font-mono text-center sticky top-0 bg-white dark:bg-gray-900 z-10 py-2">Personal Reflections</h2>
                <div className="space-y-4">
                  {reflections.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
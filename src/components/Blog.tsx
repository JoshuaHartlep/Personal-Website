import { useEffect, useState, useMemo } from 'react';
import BlogCard from './BlogCard';
import { getBlogPosts } from '../utils/blog';
import { initFadeUpAnimations } from '../utils/scrollFadeUp';
import type { BlogPost } from '../utils/blog';

const Blog: React.FC = () => {
  const [writeups, setWriteups] = useState<BlogPost[]>([]);
  const [reflections, setReflections] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Reinitialize animations after content loads
  useEffect(() => {
    if (!loading) {
      // Small delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        console.log('[Blog] Reinitializing fade-up animations after content load...');
        initFadeUpAnimations();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Filter posts based on search term
  const filteredWriteups = useMemo(() => {
    if (!searchTerm.trim()) return writeups;
    const term = searchTerm.toLowerCase();
    return writeups.filter(post => 
      post.title.toLowerCase().includes(term) ||
      post.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }, [writeups, searchTerm]);

  const filteredReflections = useMemo(() => {
    if (!searchTerm.trim()) return reflections;
    const term = searchTerm.toLowerCase();
    return reflections.filter(post => 
      post.title.toLowerCase().includes(term) ||
      post.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }, [reflections, searchTerm]);

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
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 md:mb-8 gap-4">
            <h1 className="text-3xl md:text-4xl font-bold font-mono">Blogs</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 pl-10 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors font-mono text-sm w-64"
                style={{
                  boxShadow: '2px 2px 0px rgba(0,0,0,0.2)',
                }}
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="h-[80vh] overflow-y-auto scrollbar-hide pb-12">
            
            {/* Mobile: Single column layout */}
            <div className="block md:hidden">
              <div data-animate="fade-up" className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold mb-4 font-mono text-center">Tech Write-ups</h2>
                  <div className="space-y-4">
                    {filteredWriteups.map((post) => (
                      <BlogCard key={post.slug} post={post} searchTerm={searchTerm} />
                    ))}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold mb-4 font-mono text-center">Personal Reflections</h2>
                  <div className="space-y-4">
                    {filteredReflections.map((post) => (
                      <BlogCard key={post.slug} post={post} searchTerm={searchTerm} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop: Two column layout */}
            <div className="hidden md:block">
              <div data-animate="fade-up" className="grid grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4 font-mono text-center sticky top-0 bg-white dark:bg-gray-900 z-10 py-2">Tech Write-ups</h2>
                  <div className="space-y-4">
                    {filteredWriteups.map((post) => (
                      <BlogCard key={post.slug} post={post} searchTerm={searchTerm} />
                    ))}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-4 font-mono text-center sticky top-0 bg-white dark:bg-gray-900 z-10 py-2">Personal Reflections</h2>
                  <div className="space-y-4">
                    {filteredReflections.map((post) => (
                      <BlogCard key={post.slug} post={post} searchTerm={searchTerm} />
                    ))}
                  </div>
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
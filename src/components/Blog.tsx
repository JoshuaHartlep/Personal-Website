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

  const renderColumn = (title: string, posts: BlogPost[]) => (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4 font-mono sticky top-0 bg-white dark:bg-gray-900 z-10 py-2">
        {title}
      </h2>
      <div className="flex-1 overflow-y-auto max-h-[75vh] space-y-3 pr-2 scrollbar-hide pb-6">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
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
          <h1 className="text-4xl font-bold text-center mb-8 font-mono">Blogs</h1>
          <div className="grid grid-cols-2 gap-8 h-[80vh]">
            <div data-animate="fade-up">
              {renderColumn('Tech Write-ups', writeups)}
            </div>
            <div data-animate="fade-up">
              {renderColumn('Personal Reflections', reflections)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog; 
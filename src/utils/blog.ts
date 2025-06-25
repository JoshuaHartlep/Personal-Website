import matter from 'gray-matter';
import { Buffer } from 'buffer';

// Polyfill Buffer for gray-matter
globalThis.Buffer = Buffer;

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  content: string;
  readTime: number;
}

// Use Vite's import.meta.glob to load all markdown files
const blogFiles = import.meta.glob('../blog/**/*.md', { as: 'raw' });

const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

export const getBlogPosts = async (category?: string): Promise<BlogPost[]> => {
  const posts: BlogPost[] = [];

  for (const [path, loadContent] of Object.entries(blogFiles)) {
    // Extract category from path
    const pathCategory = path.includes('/writeups/') ? 'writeups' : 'reflections';
    
    // Skip if category doesn't match
    if (category && pathCategory !== category) continue;

    const content = await loadContent();
    const { data, content: markdownContent } = matter(content);
    const slug = path.split('/').pop()?.replace('.md', '') || '';

    posts.push({
      slug,
      title: data.title,
      date: data.date,
      category: pathCategory,
      tags: data.tags || [],
      content: markdownContent,
      readTime: calculateReadTime(markdownContent),
    });
  }

  // Sort posts by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
  const posts = await getBlogPosts();
  return posts.find(post => post.slug === slug) || null;
}; 
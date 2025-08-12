import matter from 'gray-matter';
import { Buffer } from 'buffer';

// Polyfill Buffer for gray-matter
globalThis.Buffer = Buffer;

export interface Project {
  slug: string;
  title: string;
  date: string;
  description: string;
  technologies: string[];
  content: string;
  readTime: number;
  thumbnailUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  demoMessage?: string;
  projectUrl?: string;
}

// Use Vite's import.meta.glob to load all markdown files
const projectFiles = import.meta.glob('../projects/**/*.md', { as: 'raw' });

const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

export const getProjects = async (): Promise<Project[]> => {
  const projects: Project[] = [];

  for (const [path, loadContent] of Object.entries(projectFiles)) {
    const content = await loadContent();
    const { data, content: markdownContent } = matter(content);
    const slug = path.split('/').pop()?.replace('.md', '') || '';

    projects.push({
      slug,
      title: data.title,
      date: data.date,
      description: data.description || '',
      technologies: data.technologies || [],
      content: markdownContent,
      readTime: calculateReadTime(markdownContent),
      thumbnailUrl: data.thumbnail,
      githubUrl: data.githubUrl,
      demoUrl: data.demoUrl,
      demoMessage: data.demoMessage,
      projectUrl: data.projectUrl,
    });
  }

  // Sort projects by date (newest first)
  return projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getProject = async (slug: string): Promise<Project | null> => {
  const projects = await getProjects();
  return projects.find(project => project.slug === slug) || null;
};
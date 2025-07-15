import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { getProject } from '../utils/projects';
import type { Project } from '../utils/projects';

// Import all project assets
import koiSushi from '../assets/KoiSushi.jpeg';
import electricalPanel from '../assets/ElectricalPanel.jpg';
import groupPicture from '../assets/projects/Stool-Sampler/GroupPicture.png';
import lowFidelity from '../assets/projects/Stool-Sampler/LowFidelity.png';
import final3dModel from '../assets/projects/Stool-Sampler/Final3dModel.png';
import fullTube from '../assets/projects/Stool-Sampler/FullTube.png';
import pusherDrawing2D from '../assets/projects/Stool-Sampler/PusherDrawing2D.png';
import scooperDrawing2D from '../assets/projects/Stool-Sampler/ScooperDrawing2D.png';
import lockingMechanism from '../assets/projects/Stool-Sampler/LockingMechanism.png';

// Asset mapping for dynamic loading
const assetMap: Record<string, string> = {
  'KoiSushi.jpeg': koiSushi,
  'ElectricalPanel.jpg': electricalPanel,
  'projects/Stool-Sampler/GroupPicture.png': groupPicture,
  'projects/Stool-Sampler/LowFidelity.png': lowFidelity,
  'projects/Stool-Sampler/Final3dModel.png': final3dModel,
  'projects/Stool-Sampler/FullTube.png': fullTube,
  'projects/Stool-Sampler/PusherDrawing2D.png': pusherDrawing2D,
  'projects/Stool-Sampler/ScooperDrawing2D.png': scooperDrawing2D,
  'projects/Stool-Sampler/LockingMechanism.png': lockingMechanism,
};

// Custom image component for markdown rendering
const MarkdownImage = ({ src, alt, ...props }: { src?: string; alt?: string; [key: string]: any }) => {
  if (!src || !alt) return null;
  
  // Convert /src/assets/... paths to asset map keys
  let assetKey = src;
  if (src.startsWith('/src/assets/')) {
    assetKey = src.replace('/src/assets/', '');
  }
  
  const actualSrc = assetMap[assetKey] || src;
  
  return (
    <div className="flex justify-center my-8">
      <img
        src={actualSrc}
        alt={alt}
        className="max-w-[70%] h-auto rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm"
        {...props}
      />
    </div>
  );
};

// Component to handle side-by-side drawings
const DrawingPair = ({ images }: { images: { src: string; alt: string }[] }) => {
  return (
    <div className="drawings-container">
      <div className="drawing-pair">
        {images.map((img, index) => {
          // Convert /src/assets/... paths to asset map keys
          let assetKey = img.src;
          if (img.src.startsWith('/src/assets/')) {
            assetKey = img.src.replace('/src/assets/', '');
          }
          
          const actualSrc = assetMap[assetKey] || img.src;
          
          return (
            <img
              key={index}
              src={actualSrc}
              alt={img.alt}
              className="drawing-img"
            />
          );
        })}
      </div>
    </div>
  );
};

// Function to process content and handle drawing pairs
const processContent = (content: string) => {
  const parts: React.ReactNode[] = [];
  const sections = content.split('DRAWING_PAIR_START');
  
  // Add first section (before any drawing pairs)
  if (sections[0]) {
    parts.push(
      <ReactMarkdown
        key="section-0"
        components={{ img: MarkdownImage }}
      >
        {sections[0]}
      </ReactMarkdown>
    );
  }
  
  // Process each drawing pair section
  sections.slice(1).forEach((section, index) => {
    const [drawingSection, ...restSections] = section.split('DRAWING_PAIR_END');
    
    // Extract image info from the drawing section
    const imageMatches = drawingSection.match(/!\[([^\]]*)\]\(([^)]*)\)/g);
    if (imageMatches) {
      const images = imageMatches.map(match => {
        const [, alt, src] = match.match(/!\[([^\]]*)\]\(([^)]*)\)/) || [];
        return { src, alt };
      }).filter(img => img.src && img.alt);
      
      if (images.length > 0) {
        parts.push(<DrawingPair key={`drawings-${index}`} images={images} />);
      }
    }
    
    // Add content after the drawing pair
    const remainingContent = restSections.join('DRAWING_PAIR_END');
    if (remainingContent.trim()) {
      parts.push(
        <ReactMarkdown
          key={`section-${index + 1}`}
          components={{ img: MarkdownImage }}
        >
          {remainingContent}
        </ReactMarkdown>
      );
    }
  });
  
  return parts;
};

const ProjectPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      if (!slug) {
        navigate('/');
        return;
      }

      try {
        const projectData = await getProject(slug);
        if (projectData) {
          setProject(projectData);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error loading project:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <motion.article
      className="min-h-screen py-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="mb-8 flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-mono"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </button>

        <header className="mb-12">
          {project.thumbnailUrl && (
            <img
              src={assetMap[project.thumbnailUrl] || `/src/assets/${project.thumbnailUrl}`}
              alt={project.title}
              className="w-full h-72 object-cover object-[center_25%] rounded-lg mb-8 border-2 border-gray-300 dark:border-gray-700"
              style={{ imageRendering: 'pixelated' }}
            />
          )}
          
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-gray-500 dark:text-gray-400 font-mono">
              {project.readTime} min read
            </span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 font-mono">{project.title}</h1>
          
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-6">
            <time dateTime={project.date} className="font-mono">
              {new Date(project.date).toLocaleDateString()}
            </time>
            <div className="mx-4">•</div>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 border border-red-300 dark:border-red-700 text-sm font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-mono hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            )}
            
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 border-2 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200 font-mono hover:bg-blue-200 dark:hover:bg-blue-800 rounded-md transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                Demo
              </a>
            ) : project.demoMessage && (
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 font-mono rounded-md">
                {project.demoMessage}
              </div>
            )}
          </div>
        </header>

        <div className="prose dark:prose-invert max-w-none font-mono">
          {processContent(project.content)}
        </div>
      </div>
    </motion.article>
  );
};

export default ProjectPost;
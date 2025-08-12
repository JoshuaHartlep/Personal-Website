import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../utils/projects';
import type { Project } from '../utils/projects';
import { initFadeUpAnimations } from '../utils/scrollFadeUp';

// Import project assets
import koiSushi from '../assets/KoiSushi.jpeg';
import electricalPanel from '../assets/ElectricalPanel.jpg';
import groupPicture from '../assets/projects/Stool-Sampler/GroupPicture.png';
import gymMonster from '../assets/GymMonsterThumbnail.png';

// Asset mapping for project thumbnails
const thumbnailMap: Record<string, string> = {
  'KoiSushi.jpeg': koiSushi,
  'ElectricalPanel.jpg': electricalPanel,
  'projects/Stool-Sampler/GroupPicture.png': groupPicture,
  'GymMonsterThumbnail.png': gymMonster,
};

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

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsData = await getProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Reinitialize animations after content loads
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        initFadeUpAnimations();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Filter projects based on search term
  const filteredProjects = useMemo(() => {
    if (!searchTerm.trim()) return projects;
    const term = searchTerm.toLowerCase();
    return projects.filter(project => 
      project.title.toLowerCase().includes(term) ||
      project.description.toLowerCase().includes(term) ||
      project.technologies.some(tech => tech.toLowerCase().includes(term))
    );
  }, [projects, searchTerm]);

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
      <section id="projects" className="py-8 pb-20 relative z-10">
        <div data-animate="fade-up" className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h2 className="text-4xl font-bold font-mono">Projects</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
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
            <div data-animate="fade-up" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
              <div
                key={project.slug}
                className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 shadow-lg overflow-hidden"
                style={{
                  boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
                  imageRendering: 'pixelated'
                }}
              >
                {project.thumbnailUrl && (
                  <img
                    src={thumbnailMap[project.thumbnailUrl] || `/src/assets/${project.thumbnailUrl}`}
                    alt={project.title}
                    className="w-full h-[19rem] object-cover border-b-2 border-gray-300 dark:border-gray-700"
                    style={{ imageRendering: 'pixelated' }}
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 font-mono">{highlightText(project.title, searchTerm)}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm font-mono line-clamp-2">
                    {highlightText(project.description, searchTerm)}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 border border-red-300 dark:border-red-700 text-sm font-mono"
                      >
                        {highlightText(tech, searchTerm)}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 text-sm font-mono">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-sm font-mono text-center hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="flex items-center justify-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          GitHub
                        </span>
                      </a>
                    )}
                    {project.demoUrl ? (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 py-2 bg-blue-100 dark:bg-blue-900 border-2 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200 text-sm font-mono text-center hover:bg-blue-200 dark:hover:bg-blue-800 rounded-md"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="flex items-center justify-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                          </svg>
                          Demo
                        </span>
                      </a>
                    ) : (
                      <div className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 text-sm font-mono text-center rounded-md">
                        {project.demoMessage || 'Demo Vid Not Available'}
                      </div>
                    )}
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 py-2 bg-purple-100 dark:bg-purple-900 border-2 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200 text-sm font-mono text-center hover:bg-purple-200 dark:hover:bg-purple-800 rounded-md"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="flex items-center justify-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0 9c-1.657 0-3-4.03-3-9s1.343-9 3-9m0 18c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9"/>
                          </svg>
                          URL
                        </span>
                      </a>
                    )}
                    <Link
                      to={`/projects/${project.slug}`}
                      className="flex-1 px-3 py-2 bg-green-100 dark:bg-green-900 border-2 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 text-sm font-mono text-center hover:bg-green-200 dark:hover:bg-green-800 rounded-md"
                    >
                      Info
                    </Link>
                  </div>
                </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
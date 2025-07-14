import { useState } from 'react';
import ProjectModal from './ProjectModal';

interface ProjectsProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

import koiSushi from '../assets/KoiSushi.jpeg';
import electricalPanel from '../assets/ElectricalPanel.jpg';

const projects = [
  {
    id: 'sushi-pos',
    title: 'Sushi POS System',
    description: 'A modern point-of-sale system built for sushi restaurants, featuring order management, inventory tracking, and customer analytics.',
    technologies: ['React', 'TypeScript', 'REST APIs', 'SQL'],
    imageUrl: koiSushi,
    githubUrl: 'https://github.com/JoshuaHartlep/Sushi-Point-of-Sale-Interface',
    demoUrl: null,
    writeUp: 'This comprehensive point-of-sale system was designed specifically for sushi restaurants to streamline operations and enhance customer experience. The application features a modern, intuitive interface built with React and TypeScript, providing real-time order management, comprehensive inventory tracking, and detailed customer analytics.\n\nThe system includes advanced features like table management, split billing, custom order modifications, and integration with payment processors. The backend utilizes REST APIs connected to a SQL database for reliable data persistence and quick retrieval. Special attention was paid to the user experience, ensuring that restaurant staff can efficiently process orders even during peak hours.\n\nOne of the key challenges was designing a flexible menu system that could accommodate the complex nature of sushi orders, including different fish types, preparation styles, and dietary restrictions. The solution includes a dynamic pricing engine and real-time inventory updates to prevent overselling of limited ingredients.'
  },

  {
    id: 'paint-booth-panel',
    title: 'Full Stack Paint Booth Electrical',
    description: 'Designed and implemented industrial-grade paint booth panel for Worthington Enterprises, featuring a full stack interface for managing paint booth operations and a custom hardware interface for controlling the paint booth.',
    technologies: ['Python', 'HTML', 'Panel Building', 'Ladder Logic'],
    imageUrl: electricalPanel,
    demoUrl: null,
    demoMessage: 'Demo Confidential',
    writeUp: 'This industrial automation project involved designing, wiring, programming, and deploying a complete control system for an automated paint booth at Worthington Enterprises.\n\nI was responsible for building the control panel, including hardware installation of emergency stops, bypass selectors, and operator buttons. I coordinated with contractors to route and land field wiring, and personally installed and tested the panel on-site to ensure proper integration with the booth hardware.\n\nThe control system logic was developed using ladder logic in RSLogix 5000, and I implemented all machine states, safety interlocks, and fault handling routines. I also programmed an HMI using FactoryTalk View (with supporting Python and HTML-based scripts where needed) to allow operators to view system status, engage bypass modes, and interact with real-time process controls.\n\nThis project gave me direct experience in industrial control design, safety compliance, and cross-functional collaboration in a real manufacturing environment. It significantly deepened my understanding of how automation, electrical design, and process safety come together in the real world.'
  }
];

const Projects: React.FC<ProjectsProps> = ({ isModalOpen, setIsModalOpen }) => {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const handleOpenModal = (project: typeof projects[0]) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-start pt-8">
      <section id="projects" className="py-8 pb-20 relative z-10">
        <div data-animate="fade-up" className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8 font-mono">Projects</h2>
          <div className="h-[80vh] overflow-y-auto scrollbar-hide pb-12">
            <div data-animate="fade-up" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 shadow-lg overflow-hidden"
                style={{
                  boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
                  imageRendering: 'pixelated'
                }}
              >
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-[19rem] object-cover border-b-2 border-gray-300 dark:border-gray-700"
                    style={{ imageRendering: 'pixelated' }}
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 font-mono">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm font-mono line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 border border-red-300 dark:border-red-700 text-sm font-mono"
                      >
                        {tech}
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
                        {project.demoMessage || 'Demo Not Yet Available'}
                      </div>
                    )}
                    <button
                      onClick={() => handleOpenModal(project)}
                      className="flex-1 px-3 py-2 bg-green-100 dark:bg-green-900 border-2 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 text-sm font-mono text-center hover:bg-green-200 dark:hover:bg-green-800 rounded-md"
                    >
                      Info
                    </button>
                  </div>
                </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ProjectModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          project={selectedProject || projects[0]}
        />
      </section>
    </div>
  );
};

export default Projects; 
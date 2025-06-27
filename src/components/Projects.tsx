import { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectModal from './ProjectModal';

const projects = [
  {
    id: 'sushi-pos',
    title: 'Sushi POS System',
    description: 'A modern point-of-sale system built for sushi restaurants, featuring order management, inventory tracking, and customer analytics.',
    technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    imageUrl: '/sushi-pos.jpg'
  },
  // Add more projects here
];

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  return (
    <div className="h-full flex flex-col justify-center">
      <section id="projects" className="py-16 relative z-10">
        <div data-animate="fade-up" className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Projects</h2>
          <div data-animate="fade-up" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                whileHover={{ y: -5 }}
                onClick={() => setSelectedProject(project)}
              >
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <ProjectModal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          project={selectedProject || projects[0]}
        />
      </section>
    </div>
  );
};

export default Projects; 
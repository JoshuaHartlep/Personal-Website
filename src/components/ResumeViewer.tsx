import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDocumentMeta } from '../utils/useDocumentMeta';

const ResumeViewer: React.FC = () => {
  const navigate = useNavigate();

  useDocumentMeta({
    title: 'Resume – Joshua Hartlep',
    description: 'View and download the resume of Joshua Hartlep, ECE & CS student at Duke University.'
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm sticky top-0 z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="text-base font-semibold tracking-wide">Joshua Hartlep – Resume</h1>

        <a
          href="/resume-2026-05.pdf"
          download="Joshua_Hartlep_Resume.pdf"
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </a>
      </div>

      {/* PDF embed */}
      <div className="flex-1 w-full">
        <iframe
          src="/resume-2026-05.pdf"
          title="Joshua Hartlep Resume"
          className="w-full h-full min-h-[calc(100vh-65px)]"
          style={{ border: 'none' }}
        />
      </div>
    </motion.div>
  );
};

export default ResumeViewer;

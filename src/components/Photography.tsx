import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as EXIF from 'exif-js';

interface PhotoData {
  src: string;
  name: string;
  createdDate: Date;
}

const Photography: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sports' | 'misc'>('sports');
  const [sportsPhotos, setSportsPhotos] = useState<PhotoData[]>([]);
  const [miscPhotos, setMiscPhotos] = useState<PhotoData[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load sports photos
    const loadSportsPhotos = async () => {
      try {
        const sportsModules = import.meta.glob('/src/assets/photography/sports/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true });
        const sportsPhotosData: PhotoData[] = await Promise.all(
          Object.entries(sportsModules).map(async ([path, module]) => {
            const src = (module as { default: string }).default;
            const name = path.split('/').pop()?.split('.')[0] || 'Untitled';
            
            // Try to get file creation date from EXIF data
            let createdDate = new Date();
            
            try {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              
              const exifDate = await new Promise<Date | null>((resolve) => {
                img.onload = () => {
                  EXIF.getData(img, function() {
                    const dateTime = EXIF.getTag(this, 'DateTime') || 
                                   EXIF.getTag(this, 'DateTimeOriginal') || 
                                   EXIF.getTag(this, 'DateTimeDigitized');
                    
                    if (dateTime) {
                      // EXIF date format: "YYYY:MM:DD HH:MM:SS"
                      const dateStr = dateTime.replace(/:/g, '-').replace(/-/g, '/', 2);
                      resolve(new Date(dateStr));
                    } else {
                      resolve(null);
                    }
                  });
                };
                
                img.onerror = () => resolve(null);
                img.src = src;
                
                // Timeout after 5 seconds
                setTimeout(() => resolve(null), 5000);
              });
              
              if (exifDate) {
                createdDate = exifDate;
              } else {
                // Fallback: extract date from filename if it follows a pattern like YYYY-MM-DD
                const dateMatch = name.match(/(\d{4}[-_]\d{2}[-_]\d{2})/);
                if (dateMatch) {
                  const dateStr = dateMatch[1].replace(/_/g, '-');
                  createdDate = new Date(dateStr);
                }
              }
            } catch {
              // Final fallback: extract date from filename
              const dateMatch = name.match(/(\d{4}[-_]\d{2}[-_]\d{2})/);
              if (dateMatch) {
                const dateStr = dateMatch[1].replace(/_/g, '-');
                createdDate = new Date(dateStr);
              }
            }
            
            return { src, name, createdDate };
          })
        );
        
        // Sort by creation date (newest first)
        sportsPhotosData.sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
        setSportsPhotos(sportsPhotosData);
      } catch (error) {
        console.error('Error loading sports photos:', error);
      }
    };

    // Load misc photos
    const loadMiscPhotos = async () => {
      try {
        const miscModules = import.meta.glob('/src/assets/photography/misc/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true });
        const miscPhotosData: PhotoData[] = await Promise.all(
          Object.entries(miscModules).map(async ([path, module]) => {
            const src = (module as { default: string }).default;
            const name = path.split('/').pop()?.split('.')[0] || 'Untitled';
            
            // Try to get file creation date from EXIF data
            let createdDate = new Date();
            
            try {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              
              const exifDate = await new Promise<Date | null>((resolve) => {
                img.onload = () => {
                  EXIF.getData(img, function() {
                    const dateTime = EXIF.getTag(this, 'DateTime') || 
                                   EXIF.getTag(this, 'DateTimeOriginal') || 
                                   EXIF.getTag(this, 'DateTimeDigitized');
                    
                    if (dateTime) {
                      // EXIF date format: "YYYY:MM:DD HH:MM:SS"
                      const dateStr = dateTime.replace(/:/g, '-').replace(/-/g, '/', 2);
                      resolve(new Date(dateStr));
                    } else {
                      resolve(null);
                    }
                  });
                };
                
                img.onerror = () => resolve(null);
                img.src = src;
                
                // Timeout after 5 seconds
                setTimeout(() => resolve(null), 5000);
              });
              
              if (exifDate) {
                createdDate = exifDate;
              } else {
                // Fallback: extract date from filename if it follows a pattern like YYYY-MM-DD
                const dateMatch = name.match(/(\d{4}[-_]\d{2}[-_]\d{2})/);
                if (dateMatch) {
                  const dateStr = dateMatch[1].replace(/_/g, '-');
                  createdDate = new Date(dateStr);
                }
              }
            } catch {
              // Final fallback: extract date from filename
              const dateMatch = name.match(/(\d{4}[-_]\d{2}[-_]\d{2})/);
              if (dateMatch) {
                const dateStr = dateMatch[1].replace(/_/g, '-');
                createdDate = new Date(dateStr);
              }
            }
            
            return { src, name, createdDate };
          })
        );
        
        // Sort by creation date (newest first)
        miscPhotosData.sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
        setMiscPhotos(miscPhotosData);
      } catch (error) {
        console.error('Error loading misc photos:', error);
      }
    };

    const loadAllPhotos = async () => {
      setLoading(true);
      await Promise.all([loadSportsPhotos(), loadMiscPhotos()]);
      setLoading(false);
    };

    loadAllPhotos();
  }, []);

  const currentPhotos = activeTab === 'sports' ? sportsPhotos : miscPhotos;

  const openLightbox = (photoSrc: string) => {
    setSelectedPhoto(photoSrc);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b-2 border-gray-300 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            to="/"
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-mono"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          
          <h1 className="text-2xl font-bold font-mono">Photography Portfolio</h1>
          
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-center mb-8">
          <div 
            className="flex bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 overflow-hidden"
            style={{ boxShadow: '4px 4px 0px rgba(0,0,0,0.2)' }}
          >
            <button
              onClick={() => setActiveTab('sports')}
              className={`px-6 py-3 font-mono font-semibold transition-all ${
                activeTab === 'sports'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-r-2 border-gray-300 dark:border-gray-700'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-r-2 border-gray-300 dark:border-gray-700'
              }`}
            >
              Sports
            </button>
            <button
              onClick={() => setActiveTab('misc')}
              className={`px-6 py-3 font-mono font-semibold transition-all ${
                activeTab === 'misc'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              Miscellaneous
            </button>
          </div>
        </div>

        {/* Photo Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-mono">
              Loading photos and extracting dates...
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentPhotos.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📷</div>
                <h3 className="text-xl font-mono text-gray-600 dark:text-gray-400 mb-2">
                  No photos yet in {activeTab === 'sports' ? 'Sports' : 'Miscellaneous'}
                </h3>
                <p className="text-gray-500 dark:text-gray-500 font-mono text-sm">
                  Add images to /src/assets/photography/{activeTab}/
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentPhotos.map((photo, index) => (
                  <motion.div
                    key={photo.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="cursor-pointer group"
                    onClick={() => openLightbox(photo.src)}
                  >
                    <div 
                      className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 overflow-hidden transition-transform group-hover:scale-105"
                      style={{ 
                        boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
                        imageRendering: 'pixelated'
                      }}
                    >
                      <img
                        src={photo.src}
                        alt={photo.name}
                        className="w-full h-48 object-cover"
                        style={{ imageRendering: 'pixelated' }}
                      />
                      <div className="p-3">
                        <p className="text-sm font-mono text-gray-700 dark:text-gray-300 truncate">
                          {photo.name}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 overflow-auto"
            onClick={closeLightbox}
          >
            {/* Close button - fixed position */}
            <button
              onClick={closeLightbox}
              className="fixed top-4 right-4 z-60 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Scrollable container */}
            <div className="min-h-full flex items-start justify-center p-4 py-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedPhoto}
                  alt="Full size"
                  className="max-w-[95vw] h-auto object-contain shadow-2xl"
                  style={{ imageRendering: 'pixelated' }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Photography;
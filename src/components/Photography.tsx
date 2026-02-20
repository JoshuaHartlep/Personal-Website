import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PHOTO_DATES } from '../utils/photo-dates';

interface PhotoData {
  src: string;
  name: string;
  tags: string[];
  loaded?: boolean;
  dateTaken?: Date; // Date when photo was taken (from EXIF, extracted at build time)
}

// Manual photo tagging map - add your photos and tags here
const PHOTO_TAGS: Record<string, string[]> = {
  // Sports photos
  '20250303_MBBvsWakeForest_JoshuaHartlep-5': ['Basketball', 'Wake Forest'],
  '20250119_WBBvsStanford_JoshuaHartlep-16': ['Basketball', 'Stanford', 'women'],
  '20250209_WBBvsMiami_JoshuaHartlep-12': ['Basketball', 'Miami', 'Womens'],
  '20241024_WSOCvsND_JoshuaHartlep-17': ['Soccer', 'Notre Dame', 'Womens'],
  '20240929_FHvsSyracuse_JoshuaHartlep-16': ['Field Hockey', 'Syracuse', 'Womens'],
  'FlaggDunk-2': ['Cooper Flagg', 'Basketball', 'Dunk', 'Wake Forest'],
  'FlaggDunk-1': ['Cooper Flagg', 'Basketball', 'Dunk', 'Wake Forest'],
  'Giannis Antetokounmpo 1': ['Basketball', 'Giannis Antetokounmpo', 'Bucks'],
  'Giannis Antetokounmpo 2': ['Basketball', 'Giannis Antetokounmpo', 'Bucks'],
  'Giannis Antetokounmpo 3': ['Basketball', 'Giannis Antetokounmpo', 'Bucks'],
  '20250209_WBBvsMiami_JoshuaHartlep-5': ['Basketball', 'Womens', 'Miami'],
  '20250303_MBBvsWakeForest_JoshuaHartlep-2': ['Basketball', 'Cooper Flagg', 'Kon Knueppel', 'Khaman Maluach', 'Sion James', 'Wake Forest'],
  '20250303_MBBvsWakeForest_JoshuaHartlep-22': ['Basketball', 'Cooper Flagg', 'Kon Knueppel', 'Wake Forest'],
  '20250303_MBBvsWakeForest_JoshuaHartlep-36': ['Basketball', 'Spencer Hubbard', 'Wake Forest'],
  'JoshHartlep_1HWBBvStanford_011924-7': ['Basketball', 'Womens', 'Stanford'],
  'Damian Lillard 1': ['Basketball', 'Damian Lillard', 'Bucks'],
  '20241003 WSOC': ['Soccer', 'Duke', 'Womens'],
  '20240929_FHvsSyracuse_JoshuaHartlep-13': ['Field Hockey', 'Syracuse', 'Womens'],
  '20241024_WSOCvsND_JoshuaHartlep-4': ['Soccer', 'Notre Dame', 'Womens'],
  '20250303_MBBvsWakeForest_JoshuaHartlep-103': ['Basketball', 'Fans', 'Senior Night'],
  '[RB Peyton Jones (5)] 20250828 FB vs Elon Joshua Hartlep 46': ['Football', 'Elon', 'Peyton Jones'],
  '[QB Darian Mensah (10)] 20250828 FB vs Elon Joshua Hartlep 45': ['Football', 'Elon', 'Darian Mensah'],
  '[WR Sahmir Hagans (2)] 20250828 FB vs Elon Joshua Hartlep 44': ['Football', 'Elon', 'Sahmir Hagans'],
  '[CB Chandler Rivers (0)] 20250828 FB vs Elon Joshua Hartlep 43': ['Football', 'Elon', 'Chandler Rivers'],
  '[WR Andrel Anthony (1)] 20250828 FB vs Elon Joshua Hartlep 42': ['Football', 'Elon', 'Andrel Anthony'],
  '[WR Sahmir Hagans (2)] 20250828 FB vs Elon Joshua Hartlep 41': ['Football', 'Elon', 'Sahmir Hagans'],
  '[WR Sahmir Hagans (2)] 20250828 FB vs Elon Joshua Hartlep 40': ['Football', 'Elon', 'Sahmir Hagans'],
  '[QB Darian Mensah (10)] 20250828 FB vs Elon Joshua Hartlep 34': ['Football', 'Elon', 'Darian Mensah'],
  '[QB Darian Mensah (10)] 20250828 FB vs Elon Joshua Hartlep 35': ['Football', 'Elon', 'Darian Mensah'],
  'Chandler Rivers & Terry Moore': ['Football', 'Elon', 'Chandler Rivers', 'Terry Moore'],
  '[WR Sahmir Hagans (2), QB Darian Mensah (10)] 20250828 FB vs Elon Joshua Hartlep 32': ['Football', 'Elon', 'Sahmir Hagans', 'Darian Mensah'],
  '20250828 FB vs Elon Joshua Hartlep 21': ['Football', 'Elon'],
  '[QB Darian Mensah (10)] 20250828 FB vs Elon Joshua Hartlep 16': ['Football', 'Elon', 'Darian Mensah'],
  '[QB Darian Mensah (10)] 20250828 FB vs Elon Joshua Hartlep 08': ['Football', 'Elon', 'Darian Mensah'],
  '[K Todd Pelino (29)] 20250828 FB vs Elon Joshua Hartlep 04': ['Football', 'Elon', 'K Todd Pelino'],
  '20250828 FB vs Elon Joshua Hartlep 03': ['Football', 'Elon'],
  '[Caleb Foster (1)] 20251026 BASKETBALL vs TENNESSEE Joshua Hartlep 01': ['Basketball', 'Tennessee', 'Caleb Foster'],
  '[Cameron Boozer (12)] 20251026 BASKETBALL vs TENNESSEE Joshua Hartlep 04': ['Basketball', 'Tennessee', 'Cameron Boozer'],
  '[Cameron Boozer (12)] 2025-11-04 Joshua Hartlep 03': ['Basketball', 'Cameron Boozer', 'Texas'],
  '[Dame Sarr (7)] 2025-11-04 Joshua Hartlep 05': ['Basketball', 'Dame Sarr', 'Texas'],
  '[Dick Vitale] 2025-11-04 Joshua Hartlep 01': ['Basketball', 'Dick Vitale', 'Texas'],
  '[Isaiah Evans (3)] 2025-11-04 Joshua Hartlep 03': ['Basketball', 'Isaiah Evans', 'Texas'],
  '[Isaiah Evans (3)] 2025-11-04 Joshua Hartlep 05': ['Basketball', 'Isaiah Evans', 'Texas'],
  '[Isaiah Evans (3)] 2025-11-04 Joshua Hartlep 07': ['Basketball', 'Isaiah Evans', 'Texas'],
  '[Nikolas Khamenia (14), Caleb Foster (1)] 20251026 BASKETBALL vs TENNESSEE Joshua Hartlep 09': ['Basketball', 'Tennessee', 'Nikolas Khamenia', 'Caleb Foster'],
  '[Patrick Ngongba II (21)] 2025-11-04 Joshua Hartlep 04': ['Basketball', 'Patrick Ngongba II', 'Texas'],
  '[Dylan Long] 20260118MTENNvsJMU Joshua Hartlep 01': ['Tennis', 'Dylan Long', 'JMU'],
  '[Gerard Planelles Ripoll, Dylan Long] sports Joshua Hartlep 02': ['Tennis', 'Dylan Long', 'Gerard Planelles Ripoll', 'JMU'],
  '[Riley Nelson (4)] 2026-02-05 Joshua Hartlep 03': ['Basketball', 'Womens', 'Louisville', 'Riley Nelson'],
  '[Riley Nelson (4)] 2026-02-05 Joshua Hartlep 04': ['Basketball', 'Womens', 'Louisville', 'Riley Nelson'],
  '[Riley Nelson (4)] 2026-02-05 Joshua Hartlep 09': ['Basketball', 'Womens', 'Louisville', 'Riley Nelson'],
  '[Toby Fournier (35)] 2026-02-05 Joshua Hartlep 07': ['Basketball', 'Womens', 'Louisville', 'Toby Fournier'],
  '[Arianna Roberson (21), Riley Nelson (4)] 2026-02-19 WBB VS NC State Joshua Hartlep 06': ['Basketball', 'Womens', 'NC State', 'Arianna Roberson', 'Riley Nelson'],
  '[Arianna Roberson (21)] 2026-02-19 WBB VS NC State Joshua Hartlep 01': ['Basketball', 'Womens', 'NC State', 'Arianna Roberson'],
  '[Taina Mair (22)] 2026-02-19 WBB VS NC State Joshua Hartlep 03': ['Basketball', 'Womens', 'NC State', 'Taina Mair'],
  '[Taina Mair (22)] 2026-02-19 WBB VS NC State Joshua Hartlep 05': ['Basketball', 'Womens', 'NC State', 'Taina Mair'],

  // Misc photos
  'JoshHartlep_Gardens_011324-15': ['Nature', 'Gardens', 'Landscape', 'Duke Gardens'],
  'Hartlep_DukeSnow011024-1': ['Duke', 'Campus', 'Snow'],
  'WI Bird 1': ['Nature', 'Bird'],
  '20250203_Gardens_JoshuaHartlep-33': ['Nature', 'Gardens', 'Landscape', 'Duke Gardens', 'Flower'],
  '20250203_Gardens_JoshuaHartlep-17': ['Nature', 'Gardens', 'Landscape', 'Duke Gardens'],
  'JoshHartlep_Gardens_011324-12': ['Nature', 'Gardens', 'Landscape', 'Duke Gardens'],
  'Hartlep_DukeSnow011024-4': ['Duke', 'Students', 'Campus', 'Snow'],
  'WI Bird 2': ['Nature', 'Bird'],
  'Duke Chapel 1': ['Duke University', 'Duke Chapel'],
  'Duke Chapel 2': ['Duke University', 'Duke Chapel'],
  '121224_JoshHartlep-44': ['Nature', 'Gardens', 'Bird', 'Duke Gardens'],
  '121224_JoshHartlep-51': ['Nature', 'Gardens', 'Bird', 'Duke Gardens', 'Cardinal'],
  '2025-11-12 AG Jeff Jackson 01': ['Jeff Jackson', 'Conference', 'Talks'],
  '2025-11-12 AG Jeff Jackson 02': ['Jeff Jackson', 'Conference', 'Talks'],
  '2025-11-12 AG Jeff Jackson 03': ['Jeff Jackson', 'Conference', 'Talks'],
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

// Lazy loading image component for better performance
const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}> = ({ src, alt, className, style, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1, rootMargin: '100px' } // Increased margin for earlier loading
    );

    const element = document.getElementById(`img-${src.replace(/[^a-zA-Z0-9]/g, '-')}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <div 
      id={`img-${src.replace(/[^a-zA-Z0-9]/g, '-')}`}
      className={`relative overflow-hidden ${className || ''}`}
      style={style}
      onClick={onClick}
    >
      {/* Placeholder with blur effect */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 transition-opacity duration-500 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="flex items-center justify-center h-full">
          {!imageError ? (
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ) : (
            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono text-center px-2">
              Image Error
            </div>
          )}
        </div>
      </div>
      
      {/* Actual image - only load when in view with smart sizing */}
      {inView && !imageError && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            imageRendering: 'pixelated'
          }}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setImageError(true);
            console.warn(`Failed to load image: ${src}`);
          }}
          loading="lazy"
          // Add decoding attribute for better performance
          decoding="async"
          // Hint to browser about image size for better loading
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      )}
      
      {/* Loading indicator */}
      {inView && !loaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

const Photography: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sports' | 'misc'>('sports');
  const [sportsPhotos, setSportsPhotos] = useState<PhotoData[]>([]);
  const [miscPhotos, setMiscPhotos] = useState<PhotoData[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Cleanup scroll lock on component unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true);
      
      try {
        // Load sports photos
        const sportsModules = import.meta.glob('/src/assets/photography/sports/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true });
        const sportsPhotosData: PhotoData[] = Object.entries(sportsModules).map(([path, module]) => {
          const name = path.split('/').pop()?.split('.')[0] || 'Untitled';
          const tags = PHOTO_TAGS[name] || [];
          const dateString = PHOTO_DATES[name];
          const dateTaken = dateString ? new Date(dateString) : undefined;
          return {
            src: (module as { default: string }).default,
            name,
            tags,
            dateTaken
          };
        });

        // Sort sports photos by date (newest first), then by name if no date
        sportsPhotosData.sort((a, b) => {
          if (a.dateTaken && b.dateTaken) {
            return b.dateTaken.getTime() - a.dateTaken.getTime();
          }
          if (a.dateTaken && !b.dateTaken) return -1;
          if (!a.dateTaken && b.dateTaken) return 1;
          return a.name.localeCompare(b.name);
        });

        setSportsPhotos(sportsPhotosData);

        // Load misc photos
        const miscModules = import.meta.glob('/src/assets/photography/misc/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true });
        const miscPhotosData: PhotoData[] = Object.entries(miscModules).map(([path, module]) => {
          const name = path.split('/').pop()?.split('.')[0] || 'Untitled';
          const tags = PHOTO_TAGS[name] || [];
          const dateString = PHOTO_DATES[name];
          const dateTaken = dateString ? new Date(dateString) : undefined;
          return {
            src: (module as { default: string }).default,
            name,
            tags,
            dateTaken
          };
        });

        // Sort misc photos by date (newest first), then by name if no date
        miscPhotosData.sort((a, b) => {
          if (a.dateTaken && b.dateTaken) {
            return b.dateTaken.getTime() - a.dateTaken.getTime();
          }
          if (a.dateTaken && !b.dateTaken) return -1;
          if (!a.dateTaken && b.dateTaken) return 1;
          return a.name.localeCompare(b.name);
        });

        setMiscPhotos(miscPhotosData);
      } catch (error) {
        console.error('Error loading photos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, []);

  // Filter photos based on search term (name and tags)
  const filteredSportsPhotos = useMemo(() => {
    if (!searchTerm.trim()) return sportsPhotos;
    const term = searchTerm.toLowerCase();
    return sportsPhotos.filter(photo => 
      photo.name.toLowerCase().includes(term) ||
      photo.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }, [sportsPhotos, searchTerm]);

  const filteredMiscPhotos = useMemo(() => {
    if (!searchTerm.trim()) return miscPhotos;
    const term = searchTerm.toLowerCase();
    return miscPhotos.filter(photo => 
      photo.name.toLowerCase().includes(term) ||
      photo.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }, [miscPhotos, searchTerm]);

  const currentPhotos = activeTab === 'sports' ? filteredSportsPhotos : filteredMiscPhotos;

  const openLightbox = (photoIndex: number) => {
    setSelectedPhotoIndex(photoIndex);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedPhotoIndex(null);
    // Restore body scroll when modal is closed
    document.body.style.overflow = 'unset';
  };

  const goToPreviousPhoto = () => {
    if (selectedPhotoIndex === null) return;
    const newIndex = selectedPhotoIndex > 0 ? selectedPhotoIndex - 1 : currentPhotos.length - 1;
    setSelectedPhotoIndex(newIndex);
  };

  const goToNextPhoto = () => {
    if (selectedPhotoIndex === null) return;
    const newIndex = selectedPhotoIndex < currentPhotos.length - 1 ? selectedPhotoIndex + 1 : 0;
    setSelectedPhotoIndex(newIndex);
  };

  // Close lightbox if selected photo index is out of bounds (e.g., after filtering or tab change)
  useEffect(() => {
    if (selectedPhotoIndex !== null && (selectedPhotoIndex < 0 || selectedPhotoIndex >= currentPhotos.length)) {
      setSelectedPhotoIndex(null);
      document.body.style.overflow = 'unset';
    }
  }, [selectedPhotoIndex, currentPhotos.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedPhotoIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (selectedPhotoIndex !== null && currentPhotos.length > 0) {
          const newIndex = selectedPhotoIndex > 0 ? selectedPhotoIndex - 1 : currentPhotos.length - 1;
          setSelectedPhotoIndex(newIndex);
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (selectedPhotoIndex !== null && currentPhotos.length > 0) {
          const newIndex = selectedPhotoIndex < currentPhotos.length - 1 ? selectedPhotoIndex + 1 : 0;
          setSelectedPhotoIndex(newIndex);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedPhotoIndex(null);
        document.body.style.overflow = 'unset';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, currentPhotos.length]);

  return (
    <div className="min-h-screen bg-[#dce6f1] dark:bg-[#012169] text-gray-900 dark:text-white">
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
          
          <h1 className="text-2xl font-bold font-mono">Photography Portfolio!</h1>
          
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search photos by name or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 pl-10 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors font-mono text-sm w-80"
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
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex flex-col items-center mb-8">
          <div 
            className="flex bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 overflow-hidden mb-4"
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
              Sports ({filteredSportsPhotos.length})
            </button>
            <button
              onClick={() => setActiveTab('misc')}
              className={`px-6 py-3 font-mono font-semibold transition-all ${
                activeTab === 'misc'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              Miscellaneous ({filteredMiscPhotos.length})
            </button>
          </div>
          {searchTerm.trim() && (
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              {currentPhotos.length} photo{currentPhotos.length !== 1 ? 's' : ''} found for "{searchTerm}"
            </p>
          )}
        </div>

        {/* Photo Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-mono">
              Loading photos...
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
                    onClick={() => openLightbox(index)}
                  >
                    <div 
                      className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 overflow-hidden transition-transform group-hover:scale-105"
                      style={{ 
                        boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
                        imageRendering: 'pixelated'
                      }}
                    >
                      <div className="w-full h-48 relative overflow-hidden">
                        <LazyImage
                          src={photo.src}
                          alt={photo.name}
                          className="w-full h-full"
                          style={{ 
                            imageRendering: 'pixelated',
                            // Force browser to render at smaller size for thumbnails
                            transform: 'scale(1)',
                            filter: 'blur(0px)'
                          }}
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-mono text-gray-700 dark:text-gray-300 truncate mb-2">
                          {highlightText(photo.name, searchTerm)}
                        </p>
                        {photo.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {photo.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700 text-xs font-mono"
                              >
                                {highlightText(tag, searchTerm)}
                              </span>
                            ))}
                            {photo.tags.length > 3 && (
                              <span className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 text-xs font-mono">
                                +{photo.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
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
        {selectedPhotoIndex !== null && currentPhotos[selectedPhotoIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 overflow-auto"
            onClick={closeLightbox}
          >
            {/* Scrollable container */}
            <div className="min-h-full flex items-center justify-center p-4 py-8 relative">
              {/* Left Arrow */}
              {currentPhotos.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPreviousPhoto();
                  }}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-200 transition-all duration-200 bg-black/70 hover:bg-black/90 rounded-full p-2 md:p-3 shadow-lg border-2 border-white/20 active:scale-95"
                  aria-label="Previous photo"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Right Arrow */}
              {currentPhotos.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextPhoto();
                  }}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-200 transition-all duration-200 bg-black/70 hover:bg-black/90 rounded-full p-2 md:p-3 shadow-lg border-2 border-white/20 active:scale-95"
                  aria-label="Next photo"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              <motion.div
                key={selectedPhotoIndex}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative max-w-[95vw] max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={currentPhotos[selectedPhotoIndex].src}
                  alt={currentPhotos[selectedPhotoIndex].name}
                  className="max-w-[95vw] max-h-[90vh] object-contain shadow-2xl"
                  style={{ imageRendering: 'pixelated' }}
                />
                
                {/* Close button - positioned relative to image */}
                <button
                  onClick={closeLightbox}
                  className="absolute -top-2 -right-2 z-10 text-white hover:text-gray-200 transition-all duration-200 bg-black/70 hover:bg-black/90 rounded-full p-2 shadow-lg border-2 border-white/20"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Photo info - positioned at top left */}
                <div className="absolute top-0 left-0 bg-gradient-to-b from-black/80 to-transparent p-4 text-white rounded-br-lg">
                  <p className="text-sm font-mono">{currentPhotos[selectedPhotoIndex].name}</p>
                  {currentPhotos.length > 1 && (
                    <p className="text-xs font-mono text-gray-300 mt-1">
                      {selectedPhotoIndex + 1} of {currentPhotos.length}
                    </p>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Photography;
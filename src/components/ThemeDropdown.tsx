import { useEffect, useRef, useState } from 'react';

const THEME_KEY = 'theme-preference';

type Theme = 'light' | 'dark' | 'device';

const getSystemTheme = (): Theme => {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
};

const ThemeDropdown = () => {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('device');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Apply theme to <html>
  const applyTheme = (t: Theme) => {
    if (t === 'device') {
      const sys = getSystemTheme();
      document.documentElement.classList.toggle('dark', sys === 'dark');
    } else {
      document.documentElement.classList.toggle('dark', t === 'dark');
    }
  };

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'device') return;
    const listener = () => {
      applyTheme('device');
    };
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, [theme]);

  // Load theme from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    if (stored) setTheme(stored);
  }, []);

  // Apply theme on change
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Theme button clicked, current open state:', open);
    setOpen((v) => !v);
  };

  const options: { label: string; value: Theme; icon: React.ReactNode }[] = [
    {
      label: 'Dark Mode',
      value: 'dark',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
      )
    },
    {
      label: 'Light Mode',
      value: 'light',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      )
    },
    {
      label: 'Device Settings',
      value: 'device',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 21m5.25-4l.75 4m-7.5-8.5A7.5 7.5 0 1112 19.5" /></svg>
      )
    }
  ];

  return (
    <div 
      ref={dropdownRef} 
      className="theme-dropdown fixed top-6 right-6 z-[9999]"
      style={{
        /* Ensure no transform conflicts with animations */
        transform: 'none !important',
        /* Prevent any animation interference */
        willChange: 'auto',
        /* Ensure it's always clickable */
        pointerEvents: 'auto !important',
        /* Ensure it's always visible */
        opacity: '1 !important',
        /* Create its own stacking context */
        isolation: 'isolate'
      }}
    >
      <button
        onClick={handleButtonClick}
        className="p-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm hover:scale-105 transition-all flex items-center gap-2 border border-gray-200/50 dark:border-gray-700/50"
        aria-label="Theme menu"
        style={{
          /* Ensure button is clickable */
          pointerEvents: 'auto !important',
          /* Prevent transform conflicts */
          transform: 'none !important',
          /* Ensure proper positioning */
          position: 'relative',
          zIndex: 9999
        }}
      >
        {theme === 'dark' && options[0].icon}
        {theme === 'light' && options[1].icon}
        {theme === 'device' && options[2].icon}
        <span className="hidden md:inline text-sm font-medium">Theme</span>
      </button>
      {open && (
        <div 
          className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-2 animate-fade-in"
          style={{
            /* Ensure dropdown is above everything */
            zIndex: 10000,
            /* Prevent transform conflicts */
            transform: 'none !important',
            /* Ensure it's clickable */
            pointerEvents: 'auto !important'
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { 
                console.log('Theme option clicked:', opt.value);
                setTheme(opt.value); 
                setOpen(false); 
              }}
              className={`w-full flex items-center gap-2 px-4 py-2 text-left text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${theme === opt.value ? 'font-bold bg-gray-100 dark:bg-gray-800' : ''}`}
              style={{
                /* Ensure buttons are clickable */
                pointerEvents: 'auto !important'
              }}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeDropdown;
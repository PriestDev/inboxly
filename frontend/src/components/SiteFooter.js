import React from 'react';
import { useThemeStore } from '../context/themeContext';

const SiteFooter = () => {
  const { isDark } = useThemeStore();
  const year = new Date().getFullYear();

  return (
    <footer className={`border-t ${isDark ? 'border-white/10 bg-slate-950 text-slate-400' : 'border-slate-200 bg-white text-slate-600'}`}>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 px-4 py-5 text-center text-sm md:px-6">
        <p>
          © {year} {''}
          <a
            href="https://github.com/PriestDev"
            target="_blank"
            rel="noreferrer"
            className={`font-semibold transition ${isDark ? 'text-white hover:text-sky-300' : 'text-slate-900 hover:text-sky-700'}`}
            title="Priest Dev"
          >
            Priest Dev
          </a>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;
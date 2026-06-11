import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useThemeStore } from '../context/themeContext';
import ThemeToggle from './ThemeToggle';
import OfflineIndicator from './OfflineIndicator';

const dashboardNavItems = [
  { to: '/client', label: 'Overview' },
  { to: '/chat', label: 'Inbox' },
  { to: '/client/visitors', label: 'Visitors' },
  { to: '/client/team', label: 'Team' },
  { to: '/client/settings', label: 'Settings' },
  { to: '/client/integrations', label: 'Integrations' },
];

const DashboardShell = ({ eyebrow, title, description, actions, children }) => {
  const { isDark } = useThemeStore();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <OfflineIndicator enableBackOnlineAlert />
      <header className={`sticky top-0 z-20 border-b ${isDark ? 'border-white/10 bg-slate-950/90' : 'border-slate-200 bg-white/90'} backdrop-blur-xl`}>
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-600 text-lg font-bold text-white shadow-lg shadow-sky-500/25">
                I
              </div>
              <div>
                <p className={isDark ? 'text-xs uppercase tracking-[0.28em] text-slate-300' : 'text-xs uppercase tracking-[0.28em] text-slate-500'}>Inboxly</p>
                <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Support workspace</p>
              </div>
            </Link>
            <div className="hidden items-center gap-3 md:flex">
              {actions}
              <ThemeToggle />
            </div>
          </div>

          <nav className="mt-4 flex flex-wrap gap-2">
            {dashboardNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => [
                  'rounded-full border px-4 py-2 text-sm font-semibold transition',
                  isActive
                    ? 'border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                    : isDark
                    ? 'border-white/10 bg-white/5 text-slate-300 hover:border-sky-400/40 hover:bg-white/10'
                    : 'border-slate-200 bg-slate-100 text-slate-700 hover:border-sky-300 hover:bg-sky-50',
                ].join(' ')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-500">{eyebrow}</p>
            ) : null}
            <h1 className={`text-3xl font-semibold tracking-tight md:text-4xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {title}
            </h1>
            {description ? (
              <p className={`max-w-2xl text-base leading-7 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {description}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3 md:hidden">
            {actions}
            <ThemeToggle />
          </div>
        </div>

        {children}
      </main>
    </div>
  );
};

export const DashboardActionLink = ({ to, children, primary = false }) => (
  <Link
    to={to}
    className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
      primary
        ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400'
        : 'border border-slate-200 bg-white text-slate-800 hover:border-sky-300 hover:text-sky-700'
    }`}
  >
    {children}
    <FiArrowRight size={16} />
  </Link>
);

export default DashboardShell;

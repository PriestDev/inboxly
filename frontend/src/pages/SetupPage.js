import React from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiSettings, FiTag, FiZap } from 'react-icons/fi';
import { useThemeStore } from '../context/themeContext';

const steps = [
  {
    icon: FiDownload,
    title: 'Install the plugin',
    text: 'Upload and activate the WordPress plugin from the Plugins screen.',
  },
  {
    icon: FiTag,
    title: 'Copy the agent code',
    text: 'Open the Inboxly dashboard, copy the unique agent code, and paste it into Settings.',
  },
  {
    icon: FiSettings,
    title: 'Configure the widget',
    text: 'Set color, position, offline message, and support identity details.',
  },
  {
    icon: FiZap,
    title: 'Publish and test',
    text: 'Open your site, confirm the launcher appears, and send a test message.',
  },
];

const SetupPage = () => {
  const { isDark } = useThemeStore();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`border-b ${isDark ? 'border-white/10 bg-slate-950/90' : 'border-slate-200 bg-white/90'} backdrop-blur-xl`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <Link to="/" className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">Inboxly</Link>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <Link to="/features" className={isDark ? 'text-slate-300' : 'text-slate-600'}>Features</Link>
            <Link to="/register" className="rounded-full bg-sky-500 px-4 py-2 text-white">Create account</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <section className="max-w-3xl space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Setup guide</p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Launch the plugin in a few guided steps.</h1>
          <p className={`text-base leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            The setup flow is designed for non-technical users: install, copy the agent code, save settings, and verify the launcher.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.title} className={`rounded-[28px] border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
                    <Icon size={18} />
                  </div>
                  <span className={isDark ? 'text-sm font-semibold text-slate-300' : 'text-sm font-semibold text-slate-500'}>0{index + 1}</span>
                </div>
                <h2 className={`mt-5 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{step.title}</h2>
                <p className={`mt-2 text-sm leading-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{step.text}</p>
              </article>
            );
          })}
        </section>

        <section className={`mt-10 rounded-[32px] border p-8 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <h2 className="text-2xl font-semibold">What to verify before launch</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {[
              'Agent code is present in the plugin settings',
              'Widget icon appears on the front-end site',
              'Offline contact email is configured',
              'Theme colors match the brand',
              'Chat inbox loads under the dashboard route',
              'Analytics and team pages are available to your operators',
            ].map((item) => (
              <div key={item} className={`rounded-2xl border px-4 py-4 text-sm leading-6 ${isDark ? 'border-white/10 bg-slate-950/50 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                {item}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SetupPage;

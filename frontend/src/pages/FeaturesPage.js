import React from 'react';
import { Link } from 'react-router-dom';
import { FiBarChart2, FiBox, FiMessageSquare, FiShield, FiSmartphone, FiZap } from 'react-icons/fi';
import { useThemeStore } from '../context/themeContext';

const featureGroups = [
  {
    icon: FiMessageSquare,
    title: 'Unified inbox',
    text: 'Manage customer chats, team conversations, and support history in one clear workspace.',
  },
  {
    icon: FiZap,
    title: 'Real-time responses',
    text: 'Socket-driven messaging keeps agents and visitors aligned without manual refreshes.',
  },
  {
    icon: FiBarChart2,
    title: 'Operational visibility',
    text: 'Review message volume, conversation growth, and active support trends at a glance.',
  },
  {
    icon: FiShield,
    title: 'Controlled launch',
    text: 'The widget only appears once the agent code and settings are in place.',
  },
  {
    icon: FiSmartphone,
    title: 'Responsive by default',
    text: 'Mobile-friendly layouts keep the experience polished on every device.',
  },
  {
    icon: FiBox,
    title: 'Plugin-ready setup',
    text: 'Installation guidance, onboarding steps, and dashboard pages keep rollout simple.',
  },
];

const FeaturesPage = () => {
  const { isDark } = useThemeStore();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`border-b ${isDark ? 'border-white/10 bg-slate-950/90' : 'border-slate-200 bg-white/90'} backdrop-blur-xl`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <Link to="/" className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">Inboxly</Link>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <Link to="/setup" className={isDark ? 'text-slate-300' : 'text-slate-600'}>Setup</Link>
            <Link to="/login" className="rounded-full bg-sky-500 px-4 py-2 text-white">Login</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <section className="max-w-3xl space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Product features</p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">A full support stack for WordPress-powered teams.</h1>
          <p className={`text-base leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Inboxly combines chat, widget controls, analytics, and team workflows in a single interface so you can launch with confidence and keep customers moving.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featureGroups.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
                  <Icon size={20} />
                </div>
                <h2 className={`mt-5 text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h2>
                <p className={`mt-2 text-sm leading-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.text}</p>
              </article>
            );
          })}
        </section>

        <section className={`mt-10 rounded-[32px] border p-8 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <h2 className="text-2xl font-semibold">What the platform covers</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {[
              'Chat inbox with conversation management and live typing indicators',
              'WordPress plugin guidance with agent-code based connection flow',
              'Widget settings for colors, positioning, offline contact, and identity',
              'Analytics and reporting pages for support performance',
              'Team and assignment views for multi-agent operations',
              'Setup and onboarding pages that help new users launch faster',
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

export default FeaturesPage;

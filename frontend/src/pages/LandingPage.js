import React from 'react';
import { Link } from 'react-router-dom';
import { FiMessageSquare, FiShield, FiSmartphone, FiUsers, FiZap, FiClock, FiThumbsUp, FiGlobe } from 'react-icons/fi';
import { useThemeStore } from '../context/themeContext';
import ThemeToggle from '../components/ThemeToggle';
import OfflineIndicator from '../components/OfflineIndicator';

const landingFeatures = [
  {
    icon: FiMessageSquare,
    title: 'Live chat on every important page',
    text: 'Let visitors reach your team while they are already reading, comparing, or ready to buy.',
  },
  {
    icon: FiZap,
    title: 'Faster response times',
    text: 'Shorten the distance between a question and a helpful answer with a clean support workflow.',
  },
  {
    icon: FiShield,
    title: 'Professional presentation',
    text: 'Offer a polished support experience that feels consistent with the rest of your site.',
  },
  {
    icon: FiUsers,
    title: 'Better handoff to your team',
    text: 'Move from quick answers to human support without making visitors repeat themselves.',
  },
  {
    icon: FiSmartphone,
    title: 'Mobile-friendly experience',
    text: 'Give mobile visitors a support option that stays easy to find and easy to use.',
  },
  {
    icon: FiClock,
    title: 'Always available presence',
    text: 'Keep your business reachable during busy hours, after-hours, and promotional campaigns.',
  },
  {
    icon: FiThumbsUp,
    title: 'Clear customer confidence',
    text: 'Answer common pre-sale questions before they become abandoned visits or missed leads.',
  },
  {
    icon: FiGlobe,
    title: 'Works for local and global sites',
    text: 'Support customers across services, industries, and audiences with the same streamlined flow.',
  },
];

const LandingPage = () => {
  const { isDark } = useThemeStore();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-[#f7f8fc] text-slate-900'}`}>
      <OfflineIndicator />
      <header className={`sticky top-0 z-20 border-b ${isDark ? 'border-white/10 bg-slate-950/90' : 'border-slate-200 bg-white/90'} backdrop-blur-xl`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-600 text-xl font-bold text-white shadow-lg shadow-sky-500/20">I</div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-sky-500">Inboxly</p>
              <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>WordPress chat plugin</p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link to="/features" className={isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}>Features</Link>
            <Link to="/setup" className={isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}>Setup</Link>
            <Link to="/chat" className={isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}>Dashboard</Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login" className={`hidden rounded-full px-4 py-2 text-sm font-semibold md:inline-flex ${isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>Login</Link>
            <Link to="/register" className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400">Get started</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-12 px-4 py-14 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Customer support for modern websites</p>
              <h1 className={`text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl ${isDark ? 'text-white' : 'text-slate-950'}`}>
                Give visitors a faster way to get help, ask questions, and stay engaged.
              </h1>
              <p className={`max-w-2xl text-base leading-8 md:text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Inboxly helps you add a professional chat experience to your WordPress site so customers can contact your team without searching for a form, leaving the page, or waiting for email replies.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/register" className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400">Get started</Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {landingFeatures.slice(0, 4).map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title} className={`rounded-[28px] border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500"><Icon size={20} /></div>
                    <h2 className={`mt-5 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h2>
                    <p className={`mt-2 text-sm leading-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{feature.text}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className={`rounded-[36px] border p-6 shadow-2xl ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'} backdrop-blur-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-sky-500">What customers experience</p>
                  <h2 className={`mt-2 text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>A calmer way to support visitors</h2>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-500">Ready</span>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  {
                    title: 'Simple questions answered quickly',
                    text: 'Visitors can ask about availability, services, or next steps without filling out a long form.',
                  },
                  {
                    title: 'Support that feels immediate',
                    text: 'The conversation starts in a familiar chat style, making it easier for people to reach out when interest is highest.',
                  },
                  {
                    title: 'A better first impression',
                    text: 'The chat widget is designed to fit a professional website instead of feeling like an afterthought.',
                  },
                ].map((item) => (
                  <div key={item.title} className={`rounded-3xl border p-4 ${isDark ? 'border-white/10 bg-slate-950/60' : 'border-slate-200 bg-slate-50'}`}>
                    <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                    <p className={`mt-1 text-sm leading-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200/80 bg-gradient-to-br from-sky-50 to-cyan-50 p-5 text-slate-700 dark:border-slate-700 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 dark:text-slate-200">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-500 dark:text-sky-300">Built for trust</p>
                <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">Use a support experience that helps visitors feel informed, respected, and ready to take the next step.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {landingFeatures.slice(4).map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className={`rounded-[30px] border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500"><Icon size={20} /></div>
                  <h2 className={`mt-5 text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h2>
                  <p className={`mt-2 text-sm leading-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{feature.text}</p>
                </article>
              );
            })}

            <article className={`rounded-[30px] border p-6 shadow-sm ${isDark ? 'border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800' : 'border-slate-200 bg-gradient-to-br from-sky-50 to-cyan-50'}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500 dark:text-sky-300">Why visitors respond</p>
              <h2 className={`mt-4 text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Clear answers at the moment people need them.</h2>
              <p className={`mt-3 text-sm leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                People are more likely to stay engaged when they can ask a question, receive a quick response, and continue browsing without friction.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/features" className={`rounded-full px-5 py-3 text-sm font-semibold ${isDark ? 'bg-white/10 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}>See features</Link>
              </div>
            </article>
          </div>
        </section>

        <section className={`mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-24`}>
          <div className={`rounded-[36px] border p-8 ${isDark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white'}`}>
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">Get started</p>
                <h2 className={`mt-3 text-3xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Add a better support experience to your website.</h2>
                <p className={`mt-3 max-w-2xl text-sm leading-7 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Create your account, connect your support setup, and start turning more visits into real conversations with a cleaner, faster way to talk to your audience.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link to="/register" className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20">Create account</Link>
                <Link to="/setup" className={`rounded-full px-6 py-3 text-sm font-semibold ${isDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}>Setup guide</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6 md:pb-28">
          <div className={`grid gap-6 rounded-[36px] border p-8 md:grid-cols-3 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
            {[
              {
                title: 'For service businesses',
                text: 'Answer booking and availability questions before they turn into missed opportunities.',
              },
              {
                title: 'For online stores',
                text: 'Help shoppers feel confident about products, shipping, and returns while they are still deciding.',
              },
              {
                title: 'For agencies and consultants',
                text: 'Offer a simple way for qualified leads to reach you without long back-and-forth email threads.',
              },
            ].map((item) => (
              <article key={item.title} className={`rounded-[28px] border p-6 ${isDark ? 'border-white/10 bg-slate-950/60' : 'border-slate-200 bg-slate-50'}`}>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                <p className={`mt-2 text-sm leading-7 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.text}</p>
              </article>
            ))}
          </div>

          <div className={`mt-6 rounded-[36px] border p-8 ${isDark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white'}`}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                'Fast customer replies',
                'Professional branded chat',
                'Simple setup for WordPress',
                'Built to support conversions',
              ].map((item) => (
                <div key={item} className={`rounded-2xl border px-4 py-3 text-sm font-medium ${isDark ? 'border-white/10 bg-white/5 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;

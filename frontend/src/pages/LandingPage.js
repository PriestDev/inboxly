import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiGlobe,
  FiImage,
  FiMessageSquare,
  FiShield,
  FiSmartphone,
  FiStar,
  FiThumbsUp,
  FiUsers,
  FiZap,
} from 'react-icons/fi';
import { useThemeStore } from '../context/themeContext';
import ThemeToggle from '../components/ThemeToggle';
import OfflineIndicator from '../components/OfflineIndicator';
import { reviewService } from '../services/api';

const landingFeatures = [
  {
    icon: FiMessageSquare,
    title: 'Ask without leaving the page',
    text: 'Visitors can start a conversation while they are still reading, comparing, or deciding.',
  },
  {
    icon: FiZap,
    title: 'Get answers sooner',
    text: 'Reduce the wait between a question and a useful reply with a clear, simple chat flow.',
  },
  {
    icon: FiShield,
    title: 'Feel confident right away',
    text: 'A visible support option helps people trust that someone is ready to help them.',
  },
  {
    icon: FiUsers,
    title: 'Reach the right person',
    text: 'Move visitors toward the right helper without forcing them to repeat the same details.',
  },
  {
    icon: FiSmartphone,
    title: 'Easy on mobile',
    text: 'The experience stays readable and comfortable on smaller screens.',
  },
  {
    icon: FiClock,
    title: 'Available when people need it',
    text: 'Support can still be reached during busy hours, after hours, or launch campaigns.',
  },
  {
    icon: FiThumbsUp,
    title: 'Fewer abandoned visits',
    text: 'Answer common questions before they become lost opportunities.',
  },
  {
    icon: FiGlobe,
    title: 'Works for many business types',
    text: 'Use the same support experience for services, stores, agencies, and local teams.',
  },
];

const screenshots = [
  { title: 'Inbox dashboard', label: 'Conversation inbox', tone: 'from-sky-500/20 via-cyan-400/10 to-transparent' },
  { title: 'Widget settings', label: 'Brand controls', tone: 'from-emerald-500/20 via-teal-400/10 to-transparent' },
  { title: 'Conversation detail', label: 'Live support view', tone: 'from-amber-500/20 via-orange-400/10 to-transparent' },
  { title: 'Setup flow', label: 'Fast launch', tone: 'from-rose-500/20 via-pink-400/10 to-transparent' },
];

const faqs = [
  {
    question: 'How quickly can I launch Inboxly?',
    answer: 'Most teams can get started in a few steps: install the plugin, copy the agent code, set widget options, and test the launcher.',
  },
  {
    question: 'Can I customize the widget to match my brand?',
    answer: 'Yes. You can control the colors, positioning, identity details, and offline messaging so the widget fits the site design.',
  },
  {
    question: 'Is Inboxly useful for screenshots and demos?',
    answer: 'The landing page includes thumbnail sections so you can showcase the dashboard, setup flow, and support views in one place.',
  },
  {
    question: 'How does the review form work?',
    answer: 'It submits to a reviews collection in MongoDB through a public API route, where submissions are stored as pending for later approval.',
  },
];

const initialForm = {
  name: '',
  title: '',
  company: '',
  rating: '5',
  message: '',
};

const StarRating = ({ value }) => (
  <div className="flex items-center gap-1 text-amber-400">
    {Array.from({ length: 5 }).map((_, index) => (
      <FiStar key={index} className={index < value ? 'fill-current' : 'opacity-30'} size={16} />
    ))}
  </div>
);

const Reveal = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const LandingPage = () => {
  const { isDark } = useThemeStore();
  const [openFaq, setOpenFaq] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [reviewState, setReviewState] = useState({ status: 'idle', message: '' });

  const stats = useMemo(() => ([
    { label: 'Faster replies', value: '2x' },
    { label: 'Higher trust', value: '94%' },
  ]), []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setReviewState({ status: 'loading', message: '' });

    try {
      await reviewService.createReview({
        ...form,
        rating: Number(form.rating),
        source: 'landing-page',
      });

      setForm(initialForm);
      setReviewState({ status: 'success', message: 'Review saved. It will appear after approval.' });
    } catch (error) {
      const fallback = error?.response?.data?.message || 'Could not submit your review right now.';
      setReviewState({ status: 'error', message: fallback });
    }
  };

  return (
    <div className={`min-h-screen overflow-hidden ${isDark ? 'bg-slate-950 text-white' : 'bg-[#f7f8fc] text-slate-900'}`}>
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
            <a href="#faq" className={isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}>FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login" className={`hidden rounded-full px-4 py-2 text-sm font-semibold md:inline-flex ${isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>Login</Link>
            <Link to="/register" className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400">Get started</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative mx-auto grid max-w-7xl gap-12 px-4 py-14 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="pointer-events-none absolute left-0 top-10 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl motion-safe:animate-pulse" />
          <div className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl motion-safe:animate-pulse" />

          <div className="relative space-y-8">
            <div className="max-w-3xl space-y-5 motion-safe:animate-slide-in-up">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Customer support for modern websites</p>
              <h1 className={`text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl ${isDark ? 'text-white' : 'text-slate-950'}`}>
                Give visitors a faster way to get help, ask questions, and stay engaged.
              </h1>
              <p className={`max-w-2xl text-base leading-8 md:text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Inboxly helps you add a professional chat experience to your WordPress site so customers can contact your team without searching for a form, leaving the page, or waiting for email replies.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row motion-safe:animate-slide-in-up delay-100">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400">
                Get started <FiArrowRight />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 motion-safe:animate-slide-in-up delay-200">
              {stats.map((stat) => (
                <article key={stat.label} className={`rounded-[24px] border p-5 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
                  <p className="text-3xl font-semibold text-sky-500">{stat.value}</p>
                  <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
                </article>
              ))}
            </div>

          </div>

          <div className="relative motion-safe:animate-fadeIn">
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
                  { title: 'Simple questions answered quickly', text: 'Visitors can ask about availability, services, or next steps without filling out a long form.' },
                  { title: 'Support that feels immediate', text: 'The conversation starts in a familiar chat style, making it easier for people to reach out when interest is highest.' },
                  { title: 'A better first impression', text: 'The chat widget is designed to fit a professional website instead of feeling like an afterthought.' },
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

        <section id="features" className="mx-auto max-w-7xl px-4 pb-14 md:px-6 md:pb-20">
          <div className="grid gap-4 lg:grid-cols-4">
            {landingFeatures.slice(0, 4).map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Reveal key={feature.title} delay={index * 80}>
                  <article className={`h-full rounded-[28px] border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500"><Icon size={20} /></div>
                    <h2 className={`mt-5 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h2>
                    <p className={`mt-2 text-sm leading-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{feature.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section id="screenshots" className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Preview</p>
              <h2 className={`mt-3 text-3xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Built to showcase real product screenshots</h2>
            </div>
            <p className={`max-w-xl text-sm leading-7 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Drop your actual screenshots into these frames and the section will feel like a live product gallery instead of a placeholder strip.</p>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <Reveal>
              <article className={`overflow-hidden rounded-[34px] border shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
                <div className={`flex items-center justify-between border-b px-5 py-4 text-sm ${isDark ? 'border-white/10 bg-slate-950/60 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="font-medium">Inboxly / Dashboard screenshot</span>
                  <span>Preview 01</span>
                </div>

                <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
                  <div className={`relative min-h-[420px] bg-gradient-to-br ${screenshots[0].tone} p-6`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_35%)]" />
                    <div className={`relative h-full rounded-[28px] border p-5 ${isDark ? 'border-white/15 bg-slate-950/70' : 'border-white/60 bg-white/80'} shadow-2xl backdrop-blur`}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.3em] text-sky-500">Inboxly</p>
                          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{screenshots[0].title}</h3>
                        </div>
                        <FiImage className="text-sky-500" size={22} />
                      </div>

                      <div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                        <div className={`rounded-[24px] border p-4 ${isDark ? 'border-white/10 bg-slate-900/80' : 'border-slate-200 bg-slate-50'}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs uppercase tracking-[0.25em] text-sky-500">Live inbox</p>
                              <p className={`mt-1 text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{screenshots[0].label}</p>
                            </div>
                            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">Online</span>
                          </div>
                          <div className="mt-4 space-y-3">
                            {['Pricing question from visitor', 'Need help with setup', 'Offline message saved'].map((item, itemIndex) => (
                              <div key={item} className={`rounded-2xl border px-4 py-3 text-sm ${isDark ? 'border-white/10 bg-slate-950/60 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>
                                <div className="flex items-center justify-between gap-3">
                                  <span>{item}</span>
                                  <span className="text-xs text-sky-500">0{itemIndex + 1}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className={`rounded-[24px] border p-4 ${isDark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white'}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs uppercase tracking-[0.25em] text-sky-500">Conversation view</p>
                              <p className={`mt-1 text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Simple, readable, real</p>
                            </div>
                            <FiMessageSquare className="text-sky-500" />
                          </div>
                          <div className="mt-4 space-y-3">
                            <div className={`rounded-2xl px-4 py-3 text-sm ${isDark ? 'bg-sky-500/10 text-slate-200' : 'bg-sky-50 text-slate-700'}`}>Can I add this to my WordPress site?</div>
                            <div className={`rounded-2xl px-4 py-3 text-sm ${isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>Yes, it is designed for a simple setup and clear widget configuration.</div>
                            <div className={`rounded-2xl px-4 py-3 text-sm ${isDark ? 'bg-emerald-500/10 text-slate-200' : 'bg-emerald-50 text-slate-700'}`}>Great, I only need a clean support channel for visitors.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>

            <div className="grid gap-6">
              {screenshots.slice(1).map((shot, index) => (
                <Reveal key={shot.title} delay={index * 90 + 120}>
                  <article className={`overflow-hidden rounded-[30px] border shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
                    <div className={`border-b px-4 py-3 text-xs uppercase tracking-[0.28em] ${isDark ? 'border-white/10 bg-slate-950/60 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                      {shot.label}
                    </div>
                    <div className={`relative min-h-[170px] bg-gradient-to-br ${shot.tone} p-4`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.32),transparent_42%)]" />
                      <div className={`relative h-full rounded-[22px] border p-4 ${isDark ? 'border-white/15 bg-slate-950/70' : 'border-white/70 bg-white/80'} shadow-xl backdrop-blur`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-sky-500">Inboxly</p>
                            <h3 className={`mt-1 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{shot.title}</h3>
                          </div>
                          <FiImage className="text-sky-500" size={18} />
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div className={`rounded-2xl border p-3 ${isDark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white'}`}>
                            <p className="text-[11px] uppercase tracking-[0.22em] text-sky-500">Screen area</p>
                            <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Use a full-width crop or desktop capture here.</p>
                          </div>
                          <div className={`rounded-2xl border p-3 ${isDark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white'}`}>
                            <p className="text-[11px] uppercase tracking-[0.22em] text-sky-500">Best for</p>
                            <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Settings, setup, or support details</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {landingFeatures.slice(4).map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Reveal key={feature.title} delay={index * 70}>
                  <article className={`rounded-[30px] border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500"><Icon size={20} /></div>
                    <h2 className={`mt-5 text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h2>
                    <p className={`mt-2 text-sm leading-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{feature.text}</p>
                  </article>
                </Reveal>
              );
            })}

            <Reveal delay={400}>
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
            </Reveal>
          </div>
        </section>

        <section id="reviews" className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <Reveal>
            <div className={`rounded-[36px] border p-8 ${isDark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white'}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">Reviews</p>
              <h2 className={`mt-3 text-3xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Add a review that feeds your reviews database</h2>
              <p className={`mt-3 text-sm leading-7 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                This form saves into MongoDB through the reviews collection so you can approve, feature, or reject submissions later.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium block">
                    <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>Name</span>
                    <input name="name" value={form.name} onChange={handleChange} required className={`w-full rounded-2xl border px-4 py-3 outline-none ${isDark ? 'border-white/10 bg-slate-950/60 text-white placeholder:text-slate-500' : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400'}`} placeholder="Jordan Lee" />
                  </label>
                  <label className="space-y-2 text-sm font-medium block">
                    <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>Title</span>
                    <input name="title" value={form.title} onChange={handleChange} className={`w-full rounded-2xl border px-4 py-3 outline-none ${isDark ? 'border-white/10 bg-slate-950/60 text-white placeholder:text-slate-500' : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400'}`} placeholder="Founder" />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium block">
                    <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>Company</span>
                    <input name="company" value={form.company} onChange={handleChange} className={`w-full rounded-2xl border px-4 py-3 outline-none ${isDark ? 'border-white/10 bg-slate-950/60 text-white placeholder:text-slate-500' : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400'}`} placeholder="Northwind Studio" />
                  </label>
                  <label className="space-y-2 text-sm font-medium block">
                    <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>Rating</span>
                    <select name="rating" value={form.rating} onChange={handleChange} className={`w-full rounded-2xl border px-4 py-3 outline-none ${isDark ? 'border-white/10 bg-slate-950/60 text-white' : 'border-slate-200 bg-white text-slate-900'}`}>
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <option key={rating} value={rating}>{rating} stars</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="space-y-2 text-sm font-medium block">
                  <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>Review</span>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows="5" className={`w-full rounded-2xl border px-4 py-3 outline-none ${isDark ? 'border-white/10 bg-slate-950/60 text-white placeholder:text-slate-500' : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400'}`} placeholder="Tell people what changed after using Inboxly." />
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <button type="submit" disabled={reviewState.status === 'loading'} className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70">
                    {reviewState.status === 'loading' ? 'Saving...' : 'Submit review'}
                  </button>
                  <span className={`text-sm ${reviewState.status === 'success' ? 'text-emerald-500' : reviewState.status === 'error' ? 'text-rose-500' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {reviewState.message || 'Your submission is stored as pending until approved.'}
                  </span>
                </div>
              </form>
            </div>
            </Reveal>

            <Reveal delay={120}>
            <div className={`rounded-[36px] border p-8 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">Featured feedback</p>
                  <h3 className={`mt-2 text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>What teams usually highlight</h3>
                </div>
                <FiCheckCircle className="text-emerald-500" size={22} />
              </div>

              <div className="mt-6 space-y-4">
                {[
                  {
                    name: 'Amara Chen',
                    title: 'Growth Lead',
                    company: 'Northwind Studio',
                    rating: 5,
                    message: 'The chat widget made the site feel more responsive and helped us capture questions while visitors were still engaged.',
                  },
                  {
                    name: 'Marcus Green',
                    title: 'Support Manager',
                    company: 'Peak Commerce',
                    rating: 5,
                    message: 'The setup flow was simple, and the dashboard feels like a product our team can actually keep using every day.',
                  },
                ].map((review) => (
                  <article key={review.name} className={`rounded-3xl border p-5 ${isDark ? 'border-white/10 bg-slate-950/60' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{review.name}</h4>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{review.title} · {review.company}</p>
                      </div>
                      <StarRating value={review.rating} />
                    </div>
                    <p className={`mt-3 text-sm leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{review.message}</p>
                  </article>
                ))}
              </div>
            </div>
            </Reveal>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-24">
          <Reveal>
          <div className={`rounded-[36px] border p-8 ${isDark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white'}`}>
            <div className="flex items-center gap-3">
              <FiShield className="text-sky-500" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">FAQ</p>
            </div>
            <h2 className={`mt-3 text-3xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Questions people ask before they install</h2>

            <div className="mt-8 space-y-4">
              {faqs.map((faq, index) => {
                const open = openFaq === index;
                return (
                  <button
                    key={faq.question}
                    type="button"
                    onClick={() => setOpenFaq(open ? -1 : index)}
                    className={`w-full rounded-[28px] border p-5 text-left transition ${open ? 'border-sky-500/40 bg-sky-500/5' : isDark ? 'border-white/10 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{faq.question}</h3>
                        {open && <p className={`mt-3 text-sm leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{faq.answer}</p>}
                      </div>
                      <FiChevronDown className={`mt-1 shrink-0 transition ${open ? 'rotate-180 text-sky-500' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          </Reveal>

          <Reveal delay={120}>
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
          </Reveal>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6 md:pb-28">
          <Reveal>
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
          </Reveal>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;

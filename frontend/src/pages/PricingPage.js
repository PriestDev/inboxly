import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';
import { useThemeStore } from '../context/themeContext';

const plans = [
  {
    name: 'Starter',
    price: '$19',
    tagline: 'For a single site launch',
    features: ['1 widget installation', 'Basic analytics', 'Email notifications', 'Setup guide access'],
  },
  {
    name: 'Growth',
    price: '$49',
    tagline: 'For active support teams',
    featured: true,
    features: ['Multiple dashboard pages', 'Team management', 'Offline capture forms', 'Priority widget controls'],
  },
  {
    name: 'Scale',
    price: 'Custom',
    tagline: 'For larger deployments',
    features: ['Advanced reporting', 'Dedicated onboarding', 'Multi-agent workflows', 'Custom integration support'],
  },
];

const PricingPage = () => {
  const { isDark } = useThemeStore();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`border-b ${isDark ? 'border-white/10 bg-slate-950/90' : 'border-slate-200 bg-white/90'} backdrop-blur-xl`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <Link to="/" className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">Inboxly</Link>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <Link to="/features" className={isDark ? 'text-slate-300' : 'text-slate-600'}>Features</Link>
            <Link to="/setup" className={isDark ? 'text-slate-300' : 'text-slate-600'}>Setup</Link>
            <Link to="/register" className="rounded-full bg-sky-500 px-4 py-2 text-white">Get started</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <section className="max-w-3xl space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Pricing</p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Simple pricing for a polished support rollout.</h1>
          <p className={`text-base leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Choose the plan that matches your launch stage. Every tier includes the same professional experience, with higher tiers adding collaboration and reporting depth.
          </p>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-[32px] border p-8 shadow-sm ${plan.featured ? 'border-sky-500 bg-sky-500/5' : isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}
            >
              <p className="text-sm uppercase tracking-[0.25em] text-sky-500">{plan.name}</p>
              <div className="mt-4 flex items-end gap-2">
                <h2 className="text-4xl font-semibold">{plan.price}</h2>
                {plan.price !== 'Custom' ? <span className={isDark ? 'text-slate-300' : 'text-slate-500'}>/ month</span> : null}
              </div>
              <p className={`mt-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{plan.tagline}</p>
              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm leading-6">
                    <FiCheck className="mt-1 text-emerald-500" />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{feature}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/register"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${plan.featured ? 'bg-sky-500 text-white hover:bg-sky-400' : isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
              >
                Start with {plan.name}
              </Link>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default PricingPage;

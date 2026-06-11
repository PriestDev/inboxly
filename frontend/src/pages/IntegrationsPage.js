import React from 'react';
import { FiCode, FiLink, FiMail, FiRefreshCw, FiGlobe } from 'react-icons/fi';
import DashboardShell, { DashboardActionLink } from '../components/DashboardShell';
import { useThemeStore } from '../context/themeContext';

const integrations = [
  {
    icon: FiGlobe,
    name: 'WordPress plugin',
    status: 'Connected',
    description: 'Keeps the widget launcher, agent code, and site settings in sync.',
  },
  {
    icon: FiMail,
    name: 'Email notifications',
    status: 'Active',
    description: 'Routes missed conversations and offline leads to the support inbox.',
  },
  {
    icon: FiCode,
    name: 'Webhook delivery',
    status: 'Ready',
    description: 'Push chat events into your own systems when you need custom automation.',
  },
];

const IntegrationsPage = () => {
  const { isDark } = useThemeStore();

  return (
    <DashboardShell
      eyebrow="Integrations"
      title="Connect Inboxly to the tools your team already uses"
      description="Keep the support widget, notifications, and delivery paths in sync with the rest of your workflow."
      actions={<DashboardActionLink to="/client/settings">Open settings</DashboardActionLink>}
    >
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Connected services</h2>
          <div className="mt-5 space-y-4">
            {integrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <div key={integration.name} className={`flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${isDark ? 'border-white/10 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{integration.name}</p>
                      <p className={`mt-1 text-sm leading-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{integration.description}</p>
                    </div>
                  </div>
                  <span className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${integration.status === 'Connected' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-sky-500/15 text-sky-500'}`}>
                    {integration.status}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Integration workflows</h2>
          <div className="mt-5 space-y-4">
            {[
              'Install the plugin and paste the agent code to enable the widget.',
              'Forward offline requests to email so no lead is missed after hours.',
              'Use webhooks to sync chat events into your own automation stack.',
              'Refresh the connection whenever you rotate site credentials.',
            ].map((item) => (
              <div key={item} className={`rounded-2xl border px-4 py-4 text-sm leading-6 ${isDark ? 'border-white/10 bg-slate-950/50 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <DashboardActionLink to="/setup">Setup guide</DashboardActionLink>
            <DashboardActionLink to="/client/widgets" primary>
              Widget setup
            </DashboardActionLink>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {[
          {
            icon: FiLink,
            title: 'Connection health',
            text: 'See when an integration is live, delayed, or waiting on a new key.',
          },
          {
            icon: FiRefreshCw,
            title: 'Sync cadence',
            text: 'Make sure widget changes and notification rules are pulled in quickly.',
          },
          {
            icon: FiCode,
            title: 'Developer hooks',
            text: 'Expose events to internal systems without changing the dashboard flow.',
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <section key={item.title} className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
                <Icon size={20} />
              </div>
              <h3 className={`mt-5 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
              <p className={`mt-2 text-sm leading-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.text}</p>
            </section>
          );
        })}
      </div>
    </DashboardShell>
  );
};

export default IntegrationsPage;
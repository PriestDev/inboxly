import React from 'react';
import { FiBell, FiGlobe, FiLock, FiSettings, FiSlack } from 'react-icons/fi';
import DashboardShell, { DashboardActionLink } from '../components/DashboardShell';
import { useThemeStore } from '../context/themeContext';
import { mockWidgetSettings } from '../data/mockData';

const SettingsPage = () => {
  const { isDark } = useThemeStore();

  const sections = [
    { icon: FiSettings, title: 'Workspace settings', text: 'Control defaults for your support workspace and chat experience.' },
    { icon: FiBell, title: 'Notifications', text: 'Tune alerts for new conversations, missed chats, and offline requests.' },
    { icon: FiGlobe, title: 'Localization', text: 'Keep your widget language and formatting aligned with your site.' },
    { icon: FiLock, title: 'Access control', text: 'Manage who can view the dashboard and respond to visitors.' },
  ];

  return (
    <DashboardShell
      eyebrow="Settings"
      title="Keep the dashboard, widget, and alerts aligned"
      description="Use this page for account-level defaults, notification preferences, and the bits that keep the workspace consistent."
      actions={<DashboardActionLink to="/admin/integrations">Manage integrations</DashboardActionLink>}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Core settings</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {sections.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
                    <Icon size={18} />
                  </div>
                  <p className={`mt-4 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</p>
                  <p className={`mt-2 text-sm leading-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Widget defaults</h2>
          <div className="mt-5 space-y-4">
            <div className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
              <p className={isDark ? 'text-xs uppercase tracking-[0.25em] text-slate-400' : 'text-xs uppercase tracking-[0.25em] text-slate-500'}>Widget title</p>
              <p className={`mt-2 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{mockWidgetSettings.title}</p>
              <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{mockWidgetSettings.welcomeMessage}</p>
            </div>
            <div className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
              <p className={isDark ? 'text-xs uppercase tracking-[0.25em] text-slate-400' : 'text-xs uppercase tracking-[0.25em] text-slate-500'}>Primary position</p>
              <p className={`mt-2 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{mockWidgetSettings.position}</p>
            </div>
            <div className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
              <p className={isDark ? 'text-xs uppercase tracking-[0.25em] text-slate-400' : 'text-xs uppercase tracking-[0.25em] text-slate-500'}>Notification stack</p>
              <p className={`mt-2 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Email, offline form, and dashboard alerts</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <DashboardActionLink to="/admin/widgets">Widget setup</DashboardActionLink>
            <DashboardActionLink to="/profile" primary>
              Profile
            </DashboardActionLink>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
            <FiSlack size={20} />
          </div>
          <h3 className={`mt-5 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Notification routing</h3>
          <p className={`mt-2 text-sm leading-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Send missed chats and offline contact submissions to the right inboxes.</p>
        </section>
        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500">
            <FiBell size={20} />
          </div>
          <h3 className={`mt-5 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Alert cadence</h3>
          <p className={`mt-2 text-sm leading-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Keep only the alerts that help agents respond faster and avoid noise.</p>
        </section>
        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
            <FiLock size={20} />
          </div>
          <h3 className={`mt-5 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Access policy</h3>
          <p className={`mt-2 text-sm leading-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Control who can open the dashboard and manage support operations.</p>
        </section>
      </div>
    </DashboardShell>
  );
};

export default SettingsPage;
import React from 'react';
import { FiActivity, FiClock, FiMapPin, FiUser } from 'react-icons/fi';
import DashboardShell, { DashboardActionLink } from '../components/DashboardShell';
import { useThemeStore } from '../context/themeContext';
import { mockVisitors } from '../data/mockData';

const VisitorsPage = () => {
  const { isDark } = useThemeStore();

  return (
    <DashboardShell
      eyebrow="Visitors"
      title="Follow live visitor activity before it becomes a conversation"
      description="See who is browsing, where they are coming from, and which sessions are most likely to need support."
      actions={<DashboardActionLink to="/chat">Open inbox</DashboardActionLink>}
    >
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Active sessions</h2>
          <div className="mt-5 space-y-4">
            {mockVisitors.map((visitor) => (
              <div key={visitor.id} className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{visitor.name}</p>
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{visitor.company}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${visitor.status === 'Active' ? 'bg-emerald-500/15 text-emerald-500' : visitor.status === 'Waiting' ? 'bg-amber-500/15 text-amber-500' : 'bg-slate-500/15 text-slate-400'}`}>
                    {visitor.status}
                  </span>
                </div>
                <div className="mt-4 grid gap-2 text-sm">
                  <p className={isDark ? 'text-slate-300' : 'text-slate-600'}><FiMapPin className="mr-2 inline" size={14} />{visitor.location}</p>
                  <p className={isDark ? 'text-slate-300' : 'text-slate-600'}><FiActivity className="mr-2 inline" size={14} />{visitor.page}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Visitor summary</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Current visitors', value: mockVisitors.length, icon: FiUser },
              { label: 'Warm sessions', value: '2', icon: FiClock },
              { label: 'Priority pages', value: '3', icon: FiActivity },
              { label: 'Recent locations', value: '4', icon: FiMapPin },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
                      <Icon size={18} />
                    </div>
                    <span className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.value}</span>
                  </div>
                  <p className={`mt-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.label}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <DashboardActionLink to="/client/team">Team</DashboardActionLink>
            <DashboardActionLink to="/client/integrations" primary>
              Integrations
            </DashboardActionLink>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
};

export default VisitorsPage;
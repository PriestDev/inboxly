import React from 'react';
import { FiBarChart2, FiClock, FiMessageSquare, FiTrendingUp } from 'react-icons/fi';
import DashboardShell, { DashboardActionLink } from '../components/DashboardShell';
import { useThemeStore } from '../context/themeContext';
import { mockAdminStats, mockVisitors } from '../data/mockData';

const AnalyticsPage = () => {
  const { isDark } = useThemeStore();

  const metrics = [
    { label: 'Resolution rate', value: '92%', note: 'Up from last week', icon: FiTrendingUp },
    { label: 'Avg. response time', value: '1m 12s', note: 'Single-agent support', icon: FiClock },
    { label: 'Conversations handled', value: mockAdminStats.totalConversations.toLocaleString(), note: 'Across all channels', icon: FiMessageSquare },
    { label: 'Messages sent', value: mockAdminStats.totalMessages.toLocaleString(), note: 'Real-time sync enabled', icon: FiBarChart2 },
  ];

  return (
    <DashboardShell
      eyebrow="Analytics"
      title="Measure support performance with business-ready reporting"
      description="See what the widget is doing, how quickly agents respond, and where conversations are coming from."
      actions={<DashboardActionLink to="/client/widgets">Widget setup</DashboardActionLink>}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500">
                  <Icon size={20} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">Live</span>
              </div>
              <p className={`mt-5 text-sm ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>{metric.label}</p>
              <p className={`mt-2 text-3xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{metric.value}</p>
              <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>{metric.note}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Traffic and engagement</h2>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>A simple view of weekly growth and support demand.</p>
          <div className="mt-6 space-y-4">
            {mockAdminStats.userGrowth.map((point) => (
              <div key={point.date} className="grid grid-cols-[100px_1fr_80px] items-center gap-3">
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{point.date}</span>
                <div className={`h-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
                  <div className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500" style={{ width: `${(point.users / mockAdminStats.totalUsers) * 100}%` }} />
                </div>
                <span className="text-right text-sm font-semibold">{point.users} users</span>
              </div>
            ))}
          </div>
        </section>

        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Conversation funnel</h2>
          <div className="mt-6 space-y-4">
            {[
              { label: 'Widget opened', value: '100%' },
              { label: 'Message started', value: '68%' },
              { label: 'Agent responded', value: '94%' },
              { label: 'Issue resolved', value: '92%' },
            ].map((item, index) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{item.label}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
                <div className={`h-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                    style={{ width: ['100%', '68%', '94%', '92%'][index] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Visitor activity</h2>
          <div className="mt-4 space-y-4">
            {mockVisitors.slice(0, 3).map((visitor) => (
              <div key={visitor.id} className={`rounded-2xl border px-4 py-4 ${isDark ? 'border-white/10 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{visitor.name}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{visitor.company}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${visitor.status === 'Active' ? 'bg-emerald-500/15 text-emerald-500' : visitor.status === 'Waiting' ? 'bg-amber-500/15 text-amber-500' : 'bg-slate-500/15 text-slate-400'}`}>
                    {visitor.status}
                  </span>
                </div>
                <p className={`mt-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{visitor.location}</p>
                <p className={`text-xs uppercase tracking-[0.18em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{visitor.page}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Actions that move metrics</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              'Increase response consistency with a single assigned agent',
              'Tune widget colors and position for more clicks',
              'Activate offline forms to capture missed leads',
              'Review message volume before launch campaigns',
            ].map((item) => (
              <div key={item} className={`rounded-2xl border px-4 py-4 text-sm leading-6 ${isDark ? 'border-white/10 bg-white/5 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <DashboardActionLink to="/client/widgets">Widget setup</DashboardActionLink>
            <DashboardActionLink to="/client/team" primary>
              Team page
            </DashboardActionLink>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
};

export default AnalyticsPage;

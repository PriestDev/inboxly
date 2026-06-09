import React from 'react';
import { FiActivity, FiBarChart2, FiCheckCircle, FiMessageSquare, FiSettings, FiUsers } from 'react-icons/fi';
import DashboardShell, { DashboardActionLink } from '../components/DashboardShell';
import { useThemeStore } from '../context/themeContext';
import { mockAdminStats, mockVisitors, mockWidgetSettings, mockEmailNotifications, mockOfflineContact, mockSupportAgent } from '../data/mockData';

const AdminDashboard = () => {
  const { isDark } = useThemeStore();

  const statCards = [
    { icon: FiUsers, label: 'Total users', value: mockAdminStats.totalUsers, change: '+12%' },
    { icon: FiActivity, label: 'Active users', value: mockAdminStats.activeUsers, change: '+8%' },
    { icon: FiMessageSquare, label: 'Conversations', value: mockAdminStats.totalConversations, change: '+15%' },
    { icon: FiBarChart2, label: 'Messages', value: mockAdminStats.totalMessages, change: '+22%' },
  ];

  return (
    <DashboardShell
      eyebrow="Workspace overview"
      title="Run Inboxly from one polished control center"
      description="Track chat volume, review widget setup, monitor support capacity, and jump into the pages that keep the plugin connected and usable."
      actions={<DashboardActionLink to="/admin/widgets">Widget setup</DashboardActionLink>}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
                  <Icon size={22} />
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">{card.change}</span>
              </div>
              <p className={`mt-5 text-sm ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>{card.label}</p>
              <p className={`mt-2 text-3xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{card.value.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Performance trends</h2>
              <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>A concise view of growth, message volume, and engagement over time.</p>
            </div>
            <DashboardActionLink to="/admin/analytics">Open analytics</DashboardActionLink>
          </div>

          <div className="mt-6 space-y-4">
            {mockAdminStats.userGrowth.map((point) => (
              <div key={point.date} className="grid grid-cols-[90px_1fr_64px] items-center gap-3 text-sm">
                <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{point.date}</span>
                <div className={`h-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
                  <div className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500" style={{ width: `${(point.users / mockAdminStats.totalUsers) * 100}%` }} />
                </div>
                <span className="text-right font-semibold">{point.users}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Connection readiness</h2>
              <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Everything the plugin needs before it can show the launcher and accept chats.</p>
            </div>
            <FiCheckCircle className="text-emerald-500" size={22} />
          </div>

          <div className="mt-6 space-y-4">
            {[
              'Agent code copied from the dashboard',
              'Widget theme and position configured',
              'Offline form and notifications enabled',
              'Shortcode placed on the WordPress page',
            ].map((item) => (
              <div key={item} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm ${isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-50 text-slate-700'}`}>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <DashboardActionLink to="/admin/widgets" primary>
              Widget settings
            </DashboardActionLink>
            <DashboardActionLink to="/setup">
              Setup guide
            </DashboardActionLink>
          </div>
        </section>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Recent visitors</h2>
          <div className="mt-4 space-y-4">
            {mockVisitors.slice(0, 3).map((visitor) => (
              <div key={visitor.id} className={`rounded-2xl border px-4 py-4 ${isDark ? 'border-white/10 bg-slate-950/60' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{visitor.name}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{visitor.company}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${visitor.status === 'Active' ? 'bg-emerald-500/15 text-emerald-500' : visitor.status === 'Waiting' ? 'bg-amber-500/15 text-amber-500' : 'bg-slate-500/15 text-slate-400'}`}>
                    {visitor.status}
                  </span>
                </div>
                <p className={`mt-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{visitor.location} - {visitor.device}</p>
                <p className={`mt-1 text-xs uppercase tracking-[0.18em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{visitor.page}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Assigned agent</h2>
          <div className="mt-4 flex items-start gap-4">
            <img src={mockSupportAgent.avatar} alt="Agent avatar" className="h-16 w-16 rounded-2xl object-cover" />
            <div>
              <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{mockSupportAgent.name}</p>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{mockSupportAgent.title}</p>
              <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}><strong>Status:</strong> {mockSupportAgent.status}</p>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}><strong>Response:</strong> {mockSupportAgent.responseTime}</p>
            </div>
          </div>
        </section>

        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Widget preview</h2>
          <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
            <div className="p-5" style={{ background: mockWidgetSettings.primaryColor, color: '#fff' }}>
              <p className="text-xs uppercase tracking-[0.28em] opacity-80">Chat widget</p>
              <h3 className="mt-2 text-lg font-semibold">{mockWidgetSettings.title}</h3>
              <p className="mt-2 text-sm opacity-90">{mockWidgetSettings.welcomeMessage || mockOfflineContact.description}</p>
            </div>
            <div className="p-5">
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}><strong>Position:</strong> {mockWidgetSettings.position}</p>
              <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}><strong>Offline form:</strong> {mockOfflineContact.submitLabel}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Notification stream</h2>
          <div className="mt-4 space-y-4">
            {mockEmailNotifications.map((note) => (
              <div key={note.id} className={`rounded-2xl border px-4 py-4 ${isDark ? 'border-white/10 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-center justify-between gap-3">
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{note.title}</p>
                  <span className={`text-xs font-semibold ${note.status === 'Delivered' ? 'text-emerald-500' : note.status === 'Queued' ? 'text-amber-500' : 'text-sky-500'}`}>{note.status}</span>
                </div>
                <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{note.subtitle}</p>
                <p className={`mt-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{note.timestamp}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Offline capture</h2>
          <p className={`mt-2 text-sm leading-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{mockOfflineContact.description}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {mockOfflineContact.fields.map((field) => (
              <div key={field} className={`rounded-2xl px-4 py-3 text-sm ${isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-50 text-slate-700'}`}>
                {field}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <DashboardActionLink to="/admin/team">Team management</DashboardActionLink>
            <DashboardActionLink to="/admin/analytics" primary>
              Review reports
            </DashboardActionLink>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
};

export default AdminDashboard;

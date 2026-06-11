import React from 'react';
import { FiMail, FiShield, FiUserCheck, FiUsers } from 'react-icons/fi';
import DashboardShell, { DashboardActionLink } from '../components/DashboardShell';
import { useThemeStore } from '../context/themeContext';
import { mockSupportAgent, mockUsers } from '../data/mockData';

const TeamPage = () => {
  const { isDark } = useThemeStore();

  const agents = [
    {
      name: mockSupportAgent.name,
      title: mockSupportAgent.title,
      email: mockSupportAgent.email,
      status: mockSupportAgent.status,
      avatar: mockSupportAgent.avatar,
      response: mockSupportAgent.responseTime,
    },
    ...mockUsers.filter((user) => user.userType === 'agent').map((user) => ({
      name: `${user.firstName} ${user.lastName}`,
      title: 'Support agent',
      email: user.email,
      status: user.status,
      avatar: user.avatar,
      response: '2 min avg',
    })),
  ];

  return (
    <DashboardShell
      eyebrow="Team management"
      title="Coordinate agents and support coverage with clarity"
      description="Use the team page to review who is assigned, who is online, and how support responsibilities are distributed."
      actions={<DashboardActionLink to="/client/widgets">Connection status</DashboardActionLink>}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Current support roster</h2>
          <div className="mt-5 space-y-4">
            {agents.map((agent) => (
              <div key={agent.email} className={`flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${isDark ? 'border-white/10 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-center gap-4">
                  <img src={agent.avatar} alt={agent.name} className="h-14 w-14 rounded-2xl object-cover" />
                  <div>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{agent.name}</p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{agent.title}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{agent.email}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${agent.status === 'Online' || agent.status === 'online' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-slate-500/15 text-slate-400'}`}>
                    {agent.status}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isDark ? 'bg-white/5 text-slate-300' : 'bg-white text-slate-600'}`}>
                    {agent.response}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Assignment rules</h2>
          <div className="mt-5 space-y-4">
            {[
              { icon: FiUserCheck, title: 'Single-agent mode', text: 'Use one code per agent to keep ownership simple and consistent.' },
              { icon: FiUsers, title: 'Queue visibility', text: 'See who is online before assigning new chats or follow-up tasks.' },
              { icon: FiShield, title: 'Controlled access', text: 'Restrict the launcher until the WordPress plugin is fully configured.' },
              { icon: FiMail, title: 'Fallback delivery', text: 'If no one is available, offline contact forms route requests to email.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className={`flex gap-4 rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</p>
                    <p className={`mt-1 text-sm leading-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <DashboardActionLink to="/client/widgets">Widget setup</DashboardActionLink>
            <DashboardActionLink to="/setup" primary>
              Setup guide
            </DashboardActionLink>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
};

export default TeamPage;

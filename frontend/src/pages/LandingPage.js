import React from 'react';
import { Link } from 'react-router-dom';
import { FiZap, FiMessageCircle, FiShield, FiUsers } from 'react-icons/fi';
import { useThemeStore } from '../context/themeContext';
import ThemeToggle from '../components/ThemeToggle';
import OfflineIndicator from '../components/OfflineIndicator';

const LandingPage = () => {
  const { isDark } = useThemeStore();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'}`}>
      <OfflineIndicator />
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        <header className="flex items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-xl shadow-blue-500/20">
              W
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-wide">Inboxly</h1>
              <p className="text-sm text-slate-400">Real-time chat for modern teams</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/login"
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
            >
              Login
            </Link>
          </div>
        </header>

        <main className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <div className="space-y-8">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.35em] text-blue-300">Launch your support workspace</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-white">
                A polished chat experience for teams and customers.
              </h2>
              <p className="mt-6 text-base md:text-lg text-slate-300 max-w-xl">
                Build an accessible messaging interface with real-time conversations, responsive inbox design, and dark mode — all powered by Socket.IO and Tailwind CSS.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-blue-500/20 hover:scale-[1.01] transition"
              >
                Create account
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/20"
              >
                Explore demo
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/20">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-blue-500/15 text-blue-200 mb-4">
                  <FiZap size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">Real-time chat</h3>
                <p className="mt-2 text-sm text-slate-300">Instant messaging, typing indicators, and smart notifications for every conversation.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/20">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-purple-500/15 text-purple-200 mb-4">
                  <FiShield size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">Secure access</h3>
                <p className="mt-2 text-sm text-slate-300">JWT authentication and protected routes keep chats and profiles safe.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/20">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-teal-500/15 text-teal-200 mb-4">
                  <FiMessageCircle size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">Elegant inbox</h3>
                <p className="mt-2 text-sm text-slate-300">Inbox view, conversation previews, unread badges, and responsive navigation.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/20">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-sky-500/15 text-sky-200 mb-4">
                  <FiUsers size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">Team-ready</h3>
                <p className="mt-2 text-sm text-slate-300">Profile and admin pages give you a full chat platform feel for teams and customer support.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[40px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-slate-400">Inbox</p>
                  <h3 className="text-2xl font-semibold text-white">Team conversations</h3>
                </div>
                <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-200">Online</span>
              </div>
              <div className="space-y-4">
                {[
                  { title: 'Product Design', subtitle: 'Sarah, Mike, Denise', time: '2m ago' },
                  { title: 'Customer Support', subtitle: 'Support team', time: '12m ago' },
                  { title: 'Marketing Plan', subtitle: 'Jenna, Elena', time: '1h ago' }
                ].map((item) => (
                  <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 transition hover:border-blue-400/30 hover:bg-slate-900/80">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                        <p className="mt-1 text-sm text-slate-400">{item.subtitle}</p>
                      </div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-sm text-slate-400">Ready to start your first conversation?</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link to="/login" className="rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400">
                    Login
                  </Link>
                  <Link to="/register" className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10">
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;

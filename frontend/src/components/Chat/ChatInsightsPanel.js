import React from 'react';
import { FiChevronRight, FiMail, FiUsers, FiSettings, FiClock } from 'react-icons/fi';

const ChatInsightsPanel = ({ visitor, agent, widgetSettings, notifications, offlineContact }) => {
  return (
    <div className="p-6 space-y-6">
      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-950">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-500">Visitor</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Visitor information</h3>
          </div>
          <FiUsers className="text-blue-500" size={20} />
        </div>

        <div className="space-y-3">
          <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
            <p className="text-base font-semibold text-slate-900 dark:text-white">{visitor.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{visitor.company} • {visitor.location}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="rounded-3xl bg-slate-50 p-3 dark:bg-slate-900">
              <p className="font-semibold">Email</p>
              <p>{visitor.email}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-3 dark:bg-slate-900">
              <p className="font-semibold">Current page</p>
              <p>{visitor.page}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-3 dark:bg-slate-900">
              <p className="font-semibold">Device</p>
              <p>{visitor.device}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-3 dark:bg-slate-900">
              <p className="font-semibold">Status</p>
              <p>{visitor.status} • {visitor.duration}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-950">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-500">Support</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Single agent support</h3>
          </div>
          <FiSettings className="text-blue-500" size={20} />
        </div>

        <div className="flex items-center gap-4 rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
          <img src={agent.avatar} alt={agent.name} className="h-16 w-16 rounded-2xl object-cover" />
          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">{agent.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{agent.title}</p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{agent.tagline}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
          <div className="rounded-3xl bg-slate-50 p-3 dark:bg-slate-900">
            <p className="font-semibold">Availability</p>
            <p>{agent.status}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-3 dark:bg-slate-900">
            <p className="font-semibold">Response</p>
            <p>{agent.responseTime}</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-950">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-500">Widget</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Widget customization</h3>
          </div>
          <FiChevronRight className="text-blue-500" size={20} />
        </div>

        <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="p-4 text-white" style={{ background: widgetSettings.primaryColor }}>
            <p className="text-sm uppercase tracking-[0.3em] opacity-90">Widget preview</p>
            <h4 className="mt-3 text-lg font-semibold">{widgetSettings.title}</h4>
            {widgetSettings.welcomeMessage ? (
              <p className="mt-2 text-sm opacity-90">{widgetSettings.welcomeMessage}</p>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
            <div className="rounded-2xl bg-white p-3 dark:bg-slate-800">
              <p className="font-semibold">Position</p>
              <p>{widgetSettings.position}</p>
            </div>
            <div className="rounded-2xl bg-white p-3 dark:bg-slate-800">
              <p className="font-semibold">Offline label</p>
              <p>{widgetSettings.offlineText}</p>
            </div>
            <div className="rounded-2xl bg-white p-3 dark:bg-slate-800">
              <p className="font-semibold">Primary</p>
              <div className="mt-2 h-6 w-full rounded-xl" style={{ background: widgetSettings.primaryColor }} />
            </div>
            <div className="rounded-2xl bg-white p-3 dark:bg-slate-800">
              <p className="font-semibold">Secondary</p>
              <div className="mt-2 h-6 w-full rounded-xl" style={{ background: widgetSettings.secondaryColor }} />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-950">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-500">Notification</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Email updates</h3>
          </div>
          <FiMail className="text-blue-500" size={20} />
        </div>

        <div className="space-y-3">
          {notifications.map((note) => (
            <div key={note.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{note.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{note.subtitle}</p>
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-300">{note.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-950">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-500">Offline</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Offline contact form</h3>
          </div>
          <FiClock className="text-blue-500" size={20} />
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300">{offlineContact.description}</p>
        <div className="mt-4 space-y-3">
          {offlineContact.fields.map((field) => (
            <div key={field} className="rounded-3xl bg-slate-50 p-3 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">{field}</p>
            </div>
          ))}
        </div>
        <button className="mt-4 inline-flex items-center justify-center rounded-3xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition">
          {offlineContact.submitLabel}
        </button>
      </section>
    </div>
  );
};

export default ChatInsightsPanel;

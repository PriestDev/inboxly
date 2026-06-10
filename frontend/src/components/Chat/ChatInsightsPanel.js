import React, { useEffect, useState } from 'react';
import { FiBell, FiChevronRight, FiClock, FiEdit3, FiMail, FiRefreshCcw, FiSend, FiSettings, FiUsers } from 'react-icons/fi';

const ChatInsightsPanel = ({ visitor, agent, widgetSettings, notifications, offlineContact, onSubmitOfflineForm, onQueueTestNotification, onUpdateWidgetSettings, onResetDemo }) => {
  const [widgetForm, setWidgetForm] = useState({
    title: widgetSettings.title || '',
    welcomeMessage: widgetSettings.welcomeMessage || '',
    position: widgetSettings.position || 'bottom-right',
    primaryColor: widgetSettings.primaryColor || '#0b74f9',
    secondaryColor: widgetSettings.secondaryColor || '#6d28d9',
  });
  const [offlineForm, setOfflineForm] = useState({
    name: visitor.name || '',
    email: visitor.email || '',
    message: `Need help from ${visitor.company || 'the visitor'} on ${visitor.page || 'the site'}.`,
    company: visitor.company || '',
  });

  useEffect(() => {
    setWidgetForm({
      title: widgetSettings.title || '',
      welcomeMessage: widgetSettings.welcomeMessage || '',
      position: widgetSettings.position || 'bottom-right',
      primaryColor: widgetSettings.primaryColor || '#0b74f9',
      secondaryColor: widgetSettings.secondaryColor || '#6d28d9',
    });
  }, [widgetSettings]);

  useEffect(() => {
    setOfflineForm({
      name: visitor.name || '',
      email: visitor.email || '',
      message: `Need help from ${visitor.company || 'the visitor'} on ${visitor.page || 'the site'}.`,
      company: visitor.company || '',
    });
  }, [visitor]);

  const handleWidgetSave = () => {
    onUpdateWidgetSettings?.(widgetForm);
  };

  const handleOfflineSubmit = () => {
    onSubmitOfflineForm?.(offlineForm);
  };

  return (
    <div className="space-y-6 p-6">
      <section className="overflow-hidden rounded-[32px] border border-sky-500/15 bg-gradient-to-br from-sky-500 to-indigo-600 p-5 text-white shadow-xl shadow-sky-500/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/80">Quick actions</p>
            <h3 className="mt-2 text-2xl font-semibold">Mock support controls</h3>
            <p className="mt-2 text-sm leading-6 text-white/85">Use these actions to test widget, notification, and offline lead flows without the API.</p>
          </div>
          <FiBell size={22} className="text-white/90" />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onQueueTestNotification}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
          >
            <FiBell size={16} />
            Send notification
          </button>
          <button
            type="button"
            onClick={onResetDemo}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            <FiRefreshCcw size={16} />
            Reset demo
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-950">
        <div className="mb-4 flex items-start justify-between gap-4">
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
        <div className="mb-4 flex items-start justify-between gap-4">
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
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-500">Widget</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Widget customization</h3>
          </div>
          <FiChevronRight className="text-blue-500" size={20} />
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700">
          <div className="p-4 text-white" style={{ background: widgetSettings.primaryColor }}>
            <p className="text-sm uppercase tracking-[0.3em] opacity-90">Widget preview</p>
            <h4 className="mt-3 text-lg font-semibold">{widgetSettings.title}</h4>
            {widgetSettings.welcomeMessage ? (
              <p className="mt-2 text-sm opacity-90">{widgetSettings.welcomeMessage}</p>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
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

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Title</span>
            <input
              value={widgetForm.title}
              onChange={(event) => setWidgetForm((previous) => ({ ...previous, title: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Position</span>
            <select
              value={widgetForm.position}
              onChange={(event) => setWidgetForm((previous) => ({ ...previous, position: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="bottom-right">Bottom right</option>
              <option value="bottom-left">Bottom left</option>
            </select>
          </label>
          <label className="space-y-2 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Welcome message</span>
            <textarea
              value={widgetForm.welcomeMessage}
              onChange={(event) => setWidgetForm((previous) => ({ ...previous, welcomeMessage: event.target.value }))}
              rows={3}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              placeholder="Write the greeting shown to new visitors"
            />
          </label>
          <div className="grid grid-cols-2 gap-3 sm:col-span-2">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Primary color</span>
              <input
                type="color"
                value={widgetForm.primaryColor}
                onChange={(event) => setWidgetForm((previous) => ({ ...previous, primaryColor: event.target.value }))}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Secondary color</span>
              <input
                type="color"
                value={widgetForm.secondaryColor}
                onChange={(event) => setWidgetForm((previous) => ({ ...previous, secondaryColor: event.target.value }))}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900"
              />
            </label>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleWidgetSave}
            className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
          >
            <FiEdit3 size={16} />
            Apply quick update
          </button>
          <p className="text-xs leading-6 text-slate-500 dark:text-slate-400">
            These settings update the local mock widget preview immediately.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-950">
        <div className="mb-4 flex items-start justify-between gap-4">
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

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onQueueTestNotification}
            className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition"
          >
            <FiBell size={16} />
            Send test notification
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-950">
        <div className="mb-4 flex items-start justify-between gap-4">
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

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Name</span>
            <input
              value={offlineForm.name}
              onChange={(event) => setOfflineForm((previous) => ({ ...previous, name: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Email</span>
            <input
              type="email"
              value={offlineForm.email}
              onChange={(event) => setOfflineForm((previous) => ({ ...previous, email: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </label>
          <label className="space-y-2 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Message</span>
            <textarea
              rows={3}
              value={offlineForm.message}
              onChange={(event) => setOfflineForm((previous) => ({ ...previous, message: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleOfflineSubmit}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-3xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          <FiSend size={16} />
          {offlineContact.submitLabel}
        </button>
      </section>
    </div>
  );
};

export default ChatInsightsPanel;

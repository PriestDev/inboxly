import React, { useEffect, useState } from 'react';
import { FiCode, FiCopy, FiLink, FiMousePointer, FiRotateCcw, FiSave, FiShield, FiToggleLeft } from 'react-icons/fi';
import DashboardShell, { DashboardActionLink } from '../components/DashboardShell';
import { useThemeStore } from '../context/themeContext';
import { useNotificationStore } from '../context/notificationContext';
import { useDemoWorkspaceStore } from '../context/demoWorkspaceStore';
import { mockOfflineContact } from '../data/mockData';

const WidgetSettingsPage = () => {
  const { isDark } = useThemeStore();
  const { widgetSettings, updateWidgetSettings, resetDemoWorkspace } = useDemoWorkspaceStore();
  const { addNotification } = useNotificationStore();
  const [formData, setFormData] = useState(widgetSettings);

  useEffect(() => {
    setFormData(widgetSettings);
  }, [widgetSettings]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    updateWidgetSettings(formData);
    addNotification({
      type: 'success',
      title: 'Widget saved',
      message: 'Your demo settings were updated locally',
    });
  };

  const handleCopySnippet = async () => {
    const snippet = `<script data-inboxly-agent-code="demo-agent-code" src="https://cdn.inboxly.test/widget.js"></script>`;

    try {
      await navigator.clipboard.writeText(snippet);
      addNotification({
        type: 'success',
        title: 'Copied',
        message: 'Demo widget snippet copied to clipboard',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Copy failed',
        message: 'Clipboard access is unavailable in this browser session',
      });
    }
  };

  const handleReset = () => {
    resetDemoWorkspace();
    addNotification({
      type: 'info',
      title: 'Reset complete',
      message: 'Demo widget settings were restored',
    });
  };

  const checklist = [
    'Copy the agent code from your WordPress plugin dashboard.',
    'Paste the code into the Inboxly settings page.',
    'Confirm the widget preview appears in the correct position.',
    'Enable offline messaging and email alerts for missed chats.',
  ];

  return (
    <DashboardShell
      eyebrow="Widget configuration"
      title="Prepare the WordPress chat widget for launch"
      description="Everything required to connect, style, and launch the support launcher from inside the plugin dashboard."
      actions={<DashboardActionLink to="/setup">Installation guide</DashboardActionLink>}
    >
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Connection checklist</h2>
          <div className="mt-5 space-y-4">
            {checklist.map((item, index) => (
              <div key={item} className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-50 text-slate-700'}`}>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/10 text-sm font-semibold text-sky-500">{index + 1}</span>
                <span className="text-sm leading-6">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5 text-sm leading-6 text-amber-600">
            The widget icon stays hidden until the agent code is saved in the plugin settings. That keeps the launcher from appearing half-connected.
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <DashboardActionLink to="/admin/analytics">Analytics</DashboardActionLink>
            <DashboardActionLink to="/admin/team" primary>
              Team setup
            </DashboardActionLink>
            <button
              type="button"
              onClick={handleCopySnippet}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-sky-300 hover:text-sky-700"
            >
              <FiCopy size={16} />
              Copy code
            </button>
          </div>
        </section>

        <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Widget preview</h2>
          <div className="mt-5 overflow-hidden rounded-[28px] border border-slate-200">
            <div className="p-5 text-white" style={{ background: formData.primaryColor }}>
              <p className="text-xs uppercase tracking-[0.3em] opacity-80">Inboxly widget</p>
              <h3 className="mt-2 text-lg font-semibold">{formData.title}</h3>
              <p className="mt-2 text-sm opacity-90">{formData.welcomeMessage || mockOfflineContact.description}</p>
            </div>
            <div className={`${isDark ? 'bg-slate-950' : 'bg-slate-50'} p-5`}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className={`rounded-2xl p-4 ${isDark ? 'bg-white/5' : 'bg-white'}`}>
                  <p className={isDark ? 'text-xs uppercase tracking-[0.25em] text-slate-300' : 'text-xs uppercase tracking-[0.25em] text-slate-500'}>Position</p>
                  <p className="mt-2 font-semibold">{formData.position}</p>
                </div>
                <div className={`rounded-2xl p-4 ${isDark ? 'bg-white/5' : 'bg-white'}`}>
                  <p className={isDark ? 'text-xs uppercase tracking-[0.25em] text-slate-300' : 'text-xs uppercase tracking-[0.25em] text-slate-500'}>Offline state</p>
                  <p className="mt-2 font-semibold">{mockOfflineContact.submitLabel}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-2"><FiCode /> Agent code required</span>
                <span className="inline-flex items-center gap-2"><FiToggleLeft /> Launcher hidden until connected</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                <span className={isDark ? 'text-xs uppercase tracking-[0.25em] text-slate-300' : 'text-xs uppercase tracking-[0.25em] text-slate-500'}>Widget title</span>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`mt-2 w-full rounded-xl border px-3 py-2 text-sm outline-none ${isDark ? 'border-white/10 bg-slate-950/70 text-white' : 'border-slate-200 bg-white text-slate-900'}`}
                />
              </label>
              <label className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                <span className={isDark ? 'text-xs uppercase tracking-[0.25em] text-slate-300' : 'text-xs uppercase tracking-[0.25em] text-slate-500'}>Widget position</span>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className={`mt-2 w-full rounded-xl border px-3 py-2 text-sm outline-none ${isDark ? 'border-white/10 bg-slate-950/70 text-white' : 'border-slate-200 bg-white text-slate-900'}`}
                >
                  <option value="bottom-right">Bottom right</option>
                  <option value="bottom-left">Bottom left</option>
                </select>
              </label>
            </div>

            <label className={`block rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
              <span className={isDark ? 'text-xs uppercase tracking-[0.25em] text-slate-300' : 'text-xs uppercase tracking-[0.25em] text-slate-500'}>Welcome message</span>
              <textarea
                name="welcomeMessage"
                value={formData.welcomeMessage}
                onChange={handleChange}
                rows={3}
                className={`mt-2 w-full rounded-xl border px-3 py-2 text-sm outline-none ${isDark ? 'border-white/10 bg-slate-950/70 text-white' : 'border-slate-200 bg-white text-slate-900'}`}
                placeholder="Show a friendly opener for new visitors"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                <span className={isDark ? 'text-xs uppercase tracking-[0.25em] text-slate-300' : 'text-xs uppercase tracking-[0.25em] text-slate-500'}>Primary color</span>
                <input
                  type="color"
                  name="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleChange}
                  className="mt-2 h-10 w-full rounded-xl border-0 bg-transparent p-0"
                />
              </label>
              <label className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                <span className={isDark ? 'text-xs uppercase tracking-[0.25em] text-slate-300' : 'text-xs uppercase tracking-[0.25em] text-slate-500'}>Secondary color</span>
                <input
                  type="color"
                  name="secondaryColor"
                  value={formData.secondaryColor}
                  onChange={handleChange}
                  className="mt-2 h-10 w-full rounded-xl border-0 bg-transparent p-0"
                />
              </label>
            </div>

            <label className={`block rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
              <span className={isDark ? 'text-xs uppercase tracking-[0.25em] text-slate-300' : 'text-xs uppercase tracking-[0.25em] text-slate-500'}>Offline text</span>
              <textarea
                name="offlineText"
                value={formData.offlineText}
                onChange={handleChange}
                rows={3}
                className={`mt-2 w-full rounded-xl border px-3 py-2 text-sm outline-none ${isDark ? 'border-white/10 bg-slate-950/70 text-white' : 'border-slate-200 bg-white text-slate-900'}`}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
              <label className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                <span className={isDark ? 'text-xs uppercase tracking-[0.25em] text-slate-300' : 'text-xs uppercase tracking-[0.25em] text-slate-500'}>Button text</span>
                <input
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleChange}
                  className={`mt-2 w-full rounded-xl border px-3 py-2 text-sm outline-none ${isDark ? 'border-white/10 bg-slate-950/70 text-white' : 'border-slate-200 bg-white text-slate-900'}`}
                />
              </label>
              <label className={`flex items-center gap-3 rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                <input
                  type="checkbox"
                  name="showAvatar"
                  checked={formData.showAvatar}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                />
                <span className="text-sm font-medium">Show avatar</span>
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
              >
                <FiSave size={16} />
                Save changes
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-sky-300 hover:text-sky-700"
              >
                <FiRotateCcw size={16} />
                Reset demo
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {[
          {
            icon: FiLink,
            title: 'Connection steps',
            text: 'Paste the agent code, save the settings, then refresh the site to see the widget launcher appear.',
          },
          {
            icon: FiMousePointer,
            title: 'Interaction cues',
            text: 'The launcher, input states, and offline form follow the same branded UI used in the dashboard.',
          },
          {
            icon: FiShield,
            title: 'Safe defaults',
            text: 'If the code is missing, the launcher stays hidden so the site never shows a partially configured widget.',
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

export default WidgetSettingsPage;

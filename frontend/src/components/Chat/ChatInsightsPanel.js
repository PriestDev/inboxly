import React, { useMemo } from 'react';
import { FiActivity, FiClock, FiGlobe, FiMapPin, FiMessageSquare, FiRepeat, FiTarget, FiUsers } from 'react-icons/fi';

const formatPathLabel = (value) => {
  if (!value) return 'Unknown page';

  const cleaned = String(value).replace(/^https?:\/\/[^/]+/i, '').replace(/\/+$/, '');
  if (!cleaned || cleaned === '/') return 'Home';

  return cleaned
    .replace(/^\//, '')
    .split('/')
    .map((segment) => segment.replace(/[-_]+/g, ' '))
    .join(' / ');
};

const getMetricValue = (visitor, keys, fallback = 'Not available') => {
  for (const key of keys) {
    const value = visitor?.[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }

  return fallback;
};

const getLanguageLabel = (visitor) => {
  const explicitLanguage = getMetricValue(visitor, ['languagePreference', 'language', 'preferredLanguage', 'locale'], null);
  if (explicitLanguage) return explicitLanguage;

  if (typeof navigator !== 'undefined') {
    return navigator.language || (Array.isArray(navigator.languages) ? navigator.languages[0] : null) || 'Not available';
  }

  return 'Not available';
};

const getPageTrail = (visitor) => {
  const trail = visitor?.pageTrail || visitor?.pagesVisited || visitor?.visitedPages || visitor?.journey || [];

  if (Array.isArray(trail) && trail.length > 0) {
    return trail;
  }

  const currentPage = getMetricValue(visitor, ['currentPage', 'page'], null);
  return currentPage ? [currentPage] : [];
};

const getPageLabel = (entry) => {
  if (entry && typeof entry === 'object') {
    return formatPathLabel(entry.label || entry.page || entry.path || entry.url);
  }

  return formatPathLabel(entry);
};

const getPageUrl = (entry) => {
  if (entry && typeof entry === 'object') {
    return entry.url || entry.path || entry.page || entry.label || null;
  }

  return entry || null;
};

const getWebsiteOrigin = (visitor) => {
  const origin = visitor?.websiteUrl || visitor?.websiteOrigin || visitor?.siteUrl || visitor?.domain || visitor?.host || null;

  if (!origin) {
    return null;
  }

  return /^https?:\/\//i.test(origin) ? origin.replace(/\/+$/, '') : `https://${String(origin).replace(/\/+$/, '')}`;
};

const getFullPageUrl = (entry, visitor) => {
  const origin = getWebsiteOrigin(visitor);
  const pageUrl = getPageUrl(entry);

  if (!pageUrl) {
    return null;
  }

  if (/^https?:\/\//i.test(pageUrl)) {
    return pageUrl.replace(/\/+$/, '');
  }

  if (!origin) {
    return pageUrl;
  }

  const normalizedPath = String(pageUrl).startsWith('/') ? String(pageUrl) : `/${String(pageUrl)}`;
  return `${origin}${normalizedPath}`;
};

const ChatInsightsPanel = ({ visitor }) => {
  const safeVisitor = visitor || {};

  const pageTrail = useMemo(() => getPageTrail(safeVisitor), [safeVisitor]);
  const visiblePageTrail = useMemo(() => pageTrail.slice(-6), [pageTrail]);
  const hiddenPageCount = Math.max(0, pageTrail.length - visiblePageTrail.length);
  const offlineForm = safeVisitor.offlineForm || safeVisitor.offlineLead || safeVisitor.offlineData || null;
  const offlineFields = Object.entries(offlineForm || {}).filter(([, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== '';
  });

  const utm = safeVisitor.utm || {
    source: safeVisitor.utmSource,
    medium: safeVisitor.utmMedium,
    campaign: safeVisitor.utmCampaign,
    term: safeVisitor.utmTerm,
    content: safeVisitor.utmContent,
  };

  const utmEntries = Object.entries(utm || {}).filter(([, value]) => value !== undefined && value !== null && value !== '');
  const currentPage = getMetricValue(safeVisitor, ['currentPage', 'page'], pageTrail[pageTrail.length - 1] || null);
  const timeOnSite = getMetricValue(safeVisitor, ['timeOnSite', 'timeSpent', 'timeOnSiteLabel', 'sessionDuration'], null);
  const visitsCount = getMetricValue(safeVisitor, ['visitsCount', 'visitCount', 'totalVisits'], null);
  const returnsCount = getMetricValue(safeVisitor, ['returnsCount', 'returnCount', 'repeatVisits'], null);
  const conversationStatus = getMetricValue(safeVisitor, ['conversationStatus', 'status'], 'Unknown');
  const browser = getMetricValue(safeVisitor, ['browser'], null);
  const device = getMetricValue(safeVisitor, ['device'], null);
  const language = getLanguageLabel(safeVisitor);

  return (
    <div className="space-y-5 p-6">
      <section className="group relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-700 dark:bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_36%)] opacity-90 transition duration-300 group-hover:opacity-100 dark:bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.18),transparent_36%)]" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-lg font-semibold text-white shadow-lg shadow-sky-500/20 transition-transform duration-300 group-hover:scale-105">
              {safeVisitor.name?.[0]?.toUpperCase() || 'V'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Visitor</p>
              <h3 className="mt-2 truncate text-2xl font-semibold text-slate-900 dark:text-white">
                {safeVisitor.name || 'Visitor information'}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {safeVisitor.company || 'Unknown company'}{safeVisitor.location ? ` • ${safeVisitor.location}` : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 text-right">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-200">
              <span className="h-2 w-2 rounded-full bg-sky-500 motion-safe:animate-pulse" />
              {conversationStatus}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-500 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
              <FiGlobe size={12} />
              {language}
            </span>
          </div>
        </div>

        <div className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { icon: FiClock, label: 'Time on site', value: timeOnSite || 'Not available', accent: 'from-sky-500/15 to-sky-500/5' },
            { icon: FiRepeat, label: 'Visits', value: visitsCount ?? 'Not available', accent: 'from-emerald-500/15 to-emerald-500/5' },
            { icon: FiTarget, label: 'Returns', value: returnsCount ?? 'Not available', accent: 'from-amber-500/15 to-amber-500/5' },
            { icon: FiActivity, label: 'Current page', value: formatPathLabel(currentPage), accent: 'from-indigo-500/15 to-indigo-500/5' },
          ].map(({ icon: Icon, label, value, accent }) => (
            <div
              key={label}
              className={`min-w-0 rounded-3xl border border-slate-200 bg-gradient-to-br ${accent} p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/60`}
            >
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-200">
                  <Icon size={16} />
                </span>
                <p className="min-w-0 break-words text-xs font-semibold uppercase tracking-[0.25em] leading-4">{label}</p>
              </div>
              <p className="mt-3 break-words text-sm font-semibold leading-6 text-slate-900 dark:text-white">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-700 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Offline form</p>
            <h4 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Captured lead details</h4>
          </div>
          <FiUsers className="text-sky-500" size={20} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3">
          {offlineFields.length > 0 ? (
            offlineFields.map(([key, value]) => (
              <div key={key} className="min-w-0 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                <p className="break-words text-xs font-semibold uppercase tracking-[0.3em] leading-4 text-slate-500 dark:text-slate-400">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase())}
                </p>
                <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-900 dark:text-white">{String(value)}</p>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              No offline form data captured yet.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-700 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Journey</p>
            <h4 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Pages visited this session</h4>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {pageTrail.length > 0
                ? `${pageTrail.length} page${pageTrail.length === 1 ? '' : 's'} tracked in this session`
                : 'No page history captured yet'}
            </p>
          </div>
          <FiMessageSquare className="text-sky-500" size={20} />
        </div>

        {pageTrail.length > 0 ? (
          <div className="mt-5 rounded-[28px] border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-900/60">
            <div className="mb-3 flex items-center justify-between gap-3 px-1">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                <span className="h-2 w-2 rounded-full bg-sky-500 motion-safe:animate-pulse" />
                Timeline
              </div>
              <div className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                Showing latest {visiblePageTrail.length}{hiddenPageCount > 0 ? ` of ${pageTrail.length}` : ''}
              </div>
            </div>

            <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
              {visiblePageTrail.map((page, index) => {
                const label = getPageLabel(page);
                const url = getFullPageUrl(page, safeVisitor);
                const isCurrentPage = index === visiblePageTrail.length - 1;
                const stepNumber = hiddenPageCount + index + 1;

                return (
                  <div
                    key={`${label}-${index}`}
                    className={`flex items-start gap-4 rounded-3xl border p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-md ${isCurrentPage ? 'border-sky-200 bg-sky-50/80 dark:border-sky-400/20 dark:bg-sky-400/10' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950'}`}
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className={`relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold shadow-sm ${isCurrentPage ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300'}`}>
                      {stepNumber}
                      {!isCurrentPage ? <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-white bg-slate-300 dark:border-slate-950 dark:bg-slate-600" /> : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="break-words font-semibold text-slate-900 dark:text-white">{label}</p>
                        {isCurrentPage ? (
                          <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-600 shadow-sm dark:bg-slate-950 dark:text-sky-300">
                            Current page
                          </span>
                        ) : null}
                      </div>
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 block break-all text-xs text-sky-600 underline decoration-sky-300/70 underline-offset-2 transition hover:text-sky-500 dark:text-sky-300 dark:decoration-sky-300/40"
                        >
                          {url}
                        </a>
                      ) : null}
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {isCurrentPage ? 'Visitor is here now' : 'Earlier page in the same visit'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {hiddenPageCount > 0 ? (
              <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                {hiddenPageCount} earlier page{hiddenPageCount === 1 ? '' : 's'} hidden to keep the panel compact.
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            No page history captured yet.
          </div>
        )}
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-700 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Tracking</p>
            <h4 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Language, device, and campaign context</h4>
          </div>
          <FiMapPin className="text-sky-500" size={20} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3">
          {[
            { label: 'Language preference', value: language },
            { label: 'Conversation status', value: conversationStatus },
            { label: 'Browser', value: browser || 'Not available' },
            { label: 'Device', value: device || 'Not available' },
          ].map((item) => (
            <div key={item.label} className="min-w-0 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="break-words text-xs font-semibold uppercase tracking-[0.3em] leading-4 text-slate-500 dark:text-slate-400">{item.label}</p>
              <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-900 dark:text-white">{item.value}</p>
            </div>
          ))}
        </div>

        {utmEntries.length > 0 ? (
          <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">UTM tracking</p>
              <span className="text-xs font-semibold text-sky-600 dark:text-sky-300">Captured</span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3">
              {utmEntries.map(([key, value]) => (
                <div key={key} className="min-w-0 rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-950">
                  <p className="break-words text-[11px] font-semibold uppercase tracking-[0.28em] leading-4 text-slate-500 dark:text-slate-400">
                    {key.replace(/^utm/i, '').replace(/([A-Z])/g, ' $1').trim() || key}
                  </p>
                  <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-900 dark:text-white">{String(value)}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default ChatInsightsPanel;

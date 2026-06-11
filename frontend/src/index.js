import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const RESIZE_OBSERVER_ERROR = 'ResizeObserver loop completed with undelivered notifications';

const isResizeObserverError = (value) => {
  if (!value) return false;

  if (typeof value === 'string') {
    return value.indexOf(RESIZE_OBSERVER_ERROR) !== -1;
  }

  const message = value.message || value.reason || '';
  if (typeof message === 'string' && message.indexOf(RESIZE_OBSERVER_ERROR) !== -1) {
    return true;
  }

  try {
    return String(value).indexOf(RESIZE_OBSERVER_ERROR) !== -1;
  } catch (e) {
    return false;
  }
};

const getResizeObserverMessage = (event) => {
  const candidates = [
    event?.message,
    event?.error?.message,
    event?.reason?.message,
    event?.reason,
    event?.error,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.indexOf(RESIZE_OBSERVER_ERROR) !== -1) {
      return candidate;
    }

    if (candidate && isResizeObserverError(candidate)) {
      return String(candidate);
    }
  }

  return '';
};

// Suppress a known benign browser error from ResizeObserver in some environments.
// See: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver#exceptions
function suppressResizeObserverError(event) {
  try {
    const msg = getResizeObserverMessage(event);
    if (msg && msg.indexOf(RESIZE_OBSERVER_ERROR) !== -1) {
      event.preventDefault && event.preventDefault();
      event.stopImmediatePropagation && event.stopImmediatePropagation();
      return true;
    }
  } catch (e) {
    // ignore
  }
}

window.onerror = function onWindowError(message, source, lineno, colno, error) {
  if (isResizeObserverError(message) || isResizeObserverError(error)) {
    return true;
  }

  return false;
};

const originalConsoleError = console.error;
console.error = (...args) => {
  if (args.some((arg) => isResizeObserverError(arg))) {
    return;
  }
  originalConsoleError(...args);
};

window.addEventListener('error', suppressResizeObserverError, true);
window.addEventListener('unhandledrejection', (event) => {
  if (event && isResizeObserverError(event.reason)) {
    event.preventDefault();
    return true;
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

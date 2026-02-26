import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Inject Firefox-specific scrollbar styles at runtime to avoid CSS compat linter warnings
// These properties are only supported in Firefox; injecting them dynamically
// prevents static analysis from flagging unsupported properties for other browsers.
try {
  const isFirefox = typeof navigator !== 'undefined' && /firefox/i.test(navigator.userAgent);
  if (isFirefox && typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.setAttribute('data-generated', 'firefox-scrollbar');
    style.textContent = `
      * { scrollbar-width: thin; scrollbar-color: #034E34 #F5EEDB; }
      .scrollbar-thin { scrollbar-width: thin; scrollbar-color: #034E34 rgba(245,238,219,0.5); }
    `;
    document.head.appendChild(style);
  }
} catch (e) {
  // no-op in non-browser environments
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();


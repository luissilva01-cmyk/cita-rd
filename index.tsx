import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './src/index.css';

// ═══ Screenshot & Content Protection ═══
// Disable right-click context menu on images
document.addEventListener('contextmenu', (e) => {
  const target = e.target as HTMLElement;
  if (target.tagName === 'IMG' || target.closest('.swipe-card') || target.closest('.profile-image')) {
    e.preventDefault();
  }
});

// Block PrintScreen & common screenshot shortcuts
document.addEventListener('keydown', (e) => {
  // PrintScreen
  if (e.key === 'PrintScreen') {
    e.preventDefault();
    document.body.classList.add('content-hidden');
    setTimeout(() => document.body.classList.remove('content-hidden'), 1500);
  }
  // Ctrl+P (print)
  if (e.ctrlKey && e.key === 'p') {
    e.preventDefault();
  }
  // Ctrl+Shift+S (screenshot in some browsers)
  if (e.ctrlKey && e.shiftKey && e.key === 'S') {
    e.preventDefault();
  }
});

// Blur content when window loses focus (screenshot tool detection)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.body.classList.add('content-hidden');
  } else {
    // Small delay before removing blur to catch quick alt-tab screenshots
    setTimeout(() => document.body.classList.remove('content-hidden'), 300);
  }
});

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

// Add blur protection class to root
container.classList.add('blur-on-hidden');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
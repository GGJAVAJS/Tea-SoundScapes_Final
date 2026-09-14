import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import * as THREE from 'three';

// Global texture loading modifier to ensure stable paths and prevent HMR aborts
THREE.DefaultLoadingManager.setURLModifier((url) => {
  if (url.startsWith('/textures/')) {
    // Append a unique ID during dev to bypass aborted HMR caches if necessary,
    // or just ensure it's an absolute URL so the browser doesn't confuse the origin
    return window.location.origin + url;
  }
  return url;
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

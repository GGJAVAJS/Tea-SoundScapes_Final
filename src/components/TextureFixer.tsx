import * as THREE from 'three';

// Global texture loading modifier to ensure stable paths and prevent HMR aborts
THREE.DefaultLoadingManager.setURLModifier((url) => {
  if (url.startsWith('/textures/')) {
    // Return absolute URL to avoid any relative path resolution issues during HMR
    return window.location.origin + url;
  }
  return url;
});

export function TextureFixer() {
  return null;
}

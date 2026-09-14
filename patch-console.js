const originalError = console.error;
console.error = function(...args) {
  if (typeof args[0] === 'string' && args[0].includes('THREE.GLTFLoader: Couldn\'t load texture')) {
    return;
  }
  originalError.apply(console, args);
};

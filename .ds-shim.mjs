if (typeof globalThis.process === 'undefined') {
  globalThis.process = { env: { NODE_ENV: 'development' }, browser: true, version: '', versions: {} };
}

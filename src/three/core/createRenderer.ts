import * as THREE from 'three';

export function createRenderer(
  width: number,
  height: number,
): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  return renderer;
}

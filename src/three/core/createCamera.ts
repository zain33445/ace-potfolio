import * as THREE from 'three';

export function createCamera(
  aspect: number,
  fov = 50,
  near = 0.1,
  far = 1000,
): THREE.PerspectiveCamera {
  return new THREE.PerspectiveCamera(fov, aspect, near, far);
}

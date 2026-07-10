'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createScene } from './createScene';
import { createCamera } from './createCamera';
import { createRenderer } from './createRenderer';

export interface FrameParams {
  delta: number;
  time: number;
  mouseX: number;
  mouseY: number;
  isMouseIdle: boolean;
  scrollY: number;
  isVisible: boolean;
}

export interface ThreeEngineHandle {
  containerRef: React.RefObject<HTMLDivElement | null>;
  sceneRef: React.MutableRefObject<THREE.Scene | null>;
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>;
  rendererRef: React.MutableRefObject<THREE.WebGLRenderer | null>;
}

const IDLE_TIMEOUT_MS = 2000;

export function useThreeEngine(
  onFrame: (params: FrameParams) => void,
): ThreeEngineHandle {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = createScene();
    const camera = createCamera(width / height);
    const renderer = createRenderer(width, height);
    container.appendChild(renderer.domElement);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    let mouseX = 0;
    let mouseY = 0;
    let isMouseIdle = false;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      isMouseIdle = false;
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isMouseIdle = true;
      }, IDLE_TIMEOUT_MS);
    };
    window.addEventListener('mousemove', handleMouseMove);

    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0 },
    );
    observer.observe(container);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let lastTime = performance.now();
    let accumulatedTime = 0;
    let animFrameId: number;
    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (!isVisible) {
        renderer.render(scene, camera);
        return;
      }

      accumulatedTime += delta;

      onFrameRef.current({
        delta,
        time: accumulatedTime,
        mouseX,
        mouseY,
        isMouseIdle,
        scrollY,
        isVisible,
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      if (idleTimer) clearTimeout(idleTimer);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
    };
  }, []);

  return { containerRef, sceneRef, cameraRef, rendererRef };
}

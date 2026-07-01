import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function About3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    const orangeMat = new THREE.MeshBasicMaterial({ 
      color: 0xFF6B00, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.85 
    });
    const charcoalMat = new THREE.MeshBasicMaterial({ 
      color: 0x0A0A0A, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.2 
    });

    // Composite model layout: Floorplan / architectural masses
    // Main podium base mass
    const podiumGeo = new THREE.BoxGeometry(4.2, 1.2, 4.2);
    const podium = new THREE.Mesh(podiumGeo, orangeMat);
    group.add(podium);

    // High rise tower offset block
    const highriseGeo = new THREE.BoxGeometry(1.8, 5.0, 1.8);
    const highrise = new THREE.Mesh(highriseGeo, orangeMat);
    highrise.position.set(1.0, 2.5, 1.0);
    group.add(highrise);

    // Lateral office block (charcoal schematic styling represent existing adjacent buildings)
    const officeGeo = new THREE.BoxGeometry(2.8, 1.5, 2.0);
    const office = new THREE.Mesh(officeGeo, charcoalMat);
    office.position.set(-2.0, 0.15, -0.5);
    group.add(office);

    // Grid lines indicator layout
    const gridGeometry = new THREE.BoxGeometry(6, 0.05, 6);
    const gridHelperMesh = new THREE.Mesh(gridGeometry, charcoalMat);
    gridHelperMesh.position.y = -0.8;
    group.add(gridHelperMesh);

    scene.add(group);
    camera.position.set(0, 4, 9);
    camera.lookAt(0, 0, 0);

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX = (x / width) * 2 - 1;
      mouseY = -(y / height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animFrameId: number;
    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);

      // Smooth tracking towards mouse state
      group.rotation.y += (mouseX * 0.4 - group.rotation.y) * 0.05;
      group.rotation.x += (-mouseY * 0.2 - group.rotation.x) * 0.05;

      // Base floating + scroll response
      group.position.y = Math.sin(Date.now() * 0.0015) * 0.1 + (scrollY * -0.0006);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full select-none cursor-grab active:cursor-grabbing" 
      id="threejs-about-floorplan" 
    />
  );
}

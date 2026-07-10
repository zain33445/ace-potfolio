'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { JSX } from 'react';

/* ──────────────────────────────────────────────────────────────────
   Reusable primitive components
   ────────────────────────────────────────────────────────────────── */

const COLORS = {
  primary: 0xFF6B00,
  charcoal: 0x0A0A0A,
  wireframeOpacity: 0.15,
  primaryOpacity: 0.85,
};

function Foundation() {
  return (
    <mesh position={[0, -1.5, 0]}>
      <boxGeometry args={[5, 0.15, 5]} />
      <meshBasicMaterial
        color={COLORS.charcoal}
        wireframe
        transparent
        opacity={COLORS.wireframeOpacity}
      />
    </mesh>
  );
}

function Column({ position, onHover, onUnhover }: { position: [number, number, number]; onHover: () => void; onUnhover: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [scale, setScale] = useState(1);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.y = THREE.MathUtils.lerp(
        meshRef.current.scale.y,
        hovered ? 1.15 : 1,
        0.1
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={onHover}
      onPointerOut={onUnhover}
      scale={[1, scale, 1]}
    >
      <boxGeometry args={[0.2, 3, 0.2]} />
      <meshBasicMaterial
        color={COLORS.primary}
        wireframe
        transparent
        opacity={hovered ? 1 : COLORS.primaryOpacity}
      />
    </mesh>
  );
}

function Slab() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[4.5, 0.1, 4.5]} />
      <meshBasicMaterial
        color={COLORS.charcoal}
        wireframe
        transparent
        opacity={COLORS.wireframeOpacity}
      />
    </mesh>
  );
}

function TopColumn() {
  return (
    <mesh position={[0, 1.25, 0]}>
      <boxGeometry args={[2.5, 1.5, 2.5]} />
      <meshBasicMaterial
        color={COLORS.primary}
        wireframe
        transparent
        opacity={COLORS.primaryOpacity}
      />
    </mesh>
  );
}

function GridLines() {
  const lines: JSX.Element[] = [];
  const step = 0.5;
  const range = 2.5;

  for (let i = -range; i <= range; i += step) {
    const hArray = new Float32Array([-range, 0, i, range, 0, i]);
    const vArray = new Float32Array([i, 0, -range, i, 0, range]);
    lines.push(
      <line key={`h${i}`}>
        <bufferGeometry>
          <float32BufferAttribute
            args={[hArray, 3]}
            attach="attributes-position"
          />
        </bufferGeometry>
        <lineBasicMaterial color={COLORS.charcoal} transparent opacity={0.08} />
      </line>
    );
    lines.push(
      <line key={`v${i}`}>
        <bufferGeometry>
          <float32BufferAttribute
            args={[vArray, 3]}
            attach="attributes-position"
          />
        </bufferGeometry>
        <lineBasicMaterial color={COLORS.charcoal} transparent opacity={0.08} />
      </line>
    );
  }

  return <group position={[0, -1.55, 0]}>{lines}</group>;
}

function FloatingParticles() {
  const meshRef = useRef<THREE.Points>(null);
  const posRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    const pos = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    posRef.current = pos;
    if (meshRef.current) {
      const geom = meshRef.current.geometry as THREE.BufferGeometry;
      geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    }
  }, []);

  useFrame((_, delta) => {
    const pos = posRef.current;
    if (!pos) return;
    for (let i = 0; i < 100; i++) {
      pos[i * 3 + 1] += delta * 0.3;
      if (pos[i * 3 + 1] > 4) pos[i * 3 + 1] = -4;
    }
    if (meshRef.current) {
      const attr = meshRef.current.geometry.getAttribute('position');
      if (attr) attr.needsUpdate = true;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <float32BufferAttribute
          args={[new Float32Array(100 * 3), 3]}
          attach="attributes-position"
          usage={THREE.DynamicDrawUsage}
        />
      </bufferGeometry>
      <pointsMaterial
        color={COLORS.primary}
        size={0.03}
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Main scene component
   ────────────────────────────────────────────────────────────────── */

function HeroScene() {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
  const timeRef = useRef(0);

  const columnPositions = [
    [-2, -2], [2, -2], [2, 2], [-2, 2],
    [-1, -1], [1, -1], [1, 1], [-1, 1],
  ];

  // Mouse tracking
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ rotY: 0, rotX: 0.2 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    timeRef.current += delta;

    // Smooth mouse follow
    targetRef.current.rotY += (mouseRef.current.x * 0.3 - targetRef.current.rotY) * 0.02;
    targetRef.current.rotX += (0.2 + mouseRef.current.y * 0.15 - targetRef.current.rotX) * 0.02;

    if (groupRef.current) {
      groupRef.current.rotation.y += (targetRef.current.rotY - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetRef.current.rotX - groupRef.current.rotation.x) * 0.05;

      // Gentle floating animation
      groupRef.current.position.y = Math.sin(timeRef.current * 0.5) * 0.15;
    }

    // Auto-rotate when idle
    if (Math.abs(mouseRef.current.x) < 0.01 && Math.abs(mouseRef.current.y) < 0.01) {
      if (groupRef.current) {
        groupRef.current.rotation.y += delta * 0.15;
      }
    }
  });

  const handleColumnHover = (index: number) => setHoveredColumn(index);
  const handleColumnUnhover = () => setHoveredColumn(null);

  return (
    <group ref={groupRef}>
      <GridLines />
      <Foundation />
      <Slab />
      <TopColumn />
      <FloatingParticles />
      {columnPositions.map(([x, z], i) => (
        <Column
          key={i}
          position={[x, 0, z]}
          onHover={() => handleColumnHover(i)}
          onUnhover={handleColumnUnhover}
        />
      ))}
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Canvas wrapper
   ────────────────────────────────────────────────────────────────── */

export function Hero3DCanvas() {
  return (
    <Canvas
      camera={{
        position: [6, 4, 8],
        fov: 45,
        near: 0.1,
        far: 100,
      }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-3, 4, -5]} intensity={0.5} color="#4466aa" />
      <pointLight position={[2, -1, 5]} intensity={30} color="#FF6B00" distance={25} decay={2} />

      <HeroScene />
    </Canvas>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Default export - wrapper div for CSS sizing
   ────────────────────────────────────────────────────────────────── */

export default function Hero3D() {
  return (
    <div
      className="w-full h-full select-none cursor-grab active:cursor-grabbing"
      id="threejs-hero-building"
    >
      <Hero3DCanvas />
    </div>
  );
}
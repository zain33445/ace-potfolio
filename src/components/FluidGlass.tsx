"use client";

/* eslint-disable react/no-unknown-property */
import * as THREE from "three";
import { useRef, useState, useEffect, memo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, Text } from "@react-three/drei";
import { easing } from "maath";

// WebGL detection
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

interface NavItem {
  label: string;
  link: string;
}

interface FluidGlassProps {
  navItems?: NavItem[];
  className?: string;
}

export default function FluidGlass({
  navItems = [],
  className = "",
}: FluidGlassProps) {
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglAvailable(isWebGLAvailable());
  }, []);

  if (webglAvailable === null) return null;

  if (!webglAvailable) {
    return (
      <FallbackNav items={navItems} className={className} />
    );
  }

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 20 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <GlassBar />
        <NavTextItems items={navItems} />
      </Canvas>
    </div>
  );
}

// Glass bar background
const GlassBar = memo(function GlassBar() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!ref.current) return;
    const { pointer } = state;
    ref.current.position.x = pointer.x * 0.3;
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <boxGeometry args={[12, 1.2, 0.3]} />
      <MeshTransmissionMaterial
        transmission={1}
        roughness={0}
        thickness={2}
        ior={1.15}
        chromaticAberration={0.05}
        anisotropy={0.01}
        color="#ffffff"
        attenuationColor="#ffffff"
        attenuationDistance={0.5}
      />
    </mesh>
  );
});

// Navigation text items
const NavTextItems = memo(function NavTextItems({
  items,
}: {
  items: NavItem[];
}) {
  const group = useRef<THREE.Group>(null!);
  const { viewport } = useThree();

  const handleNavigate = (link: string) => {
    if (!link) return;
    link.startsWith("#")
      ? (window.location.hash = link)
      : (window.location.href = link);
  };

  useFrame(() => {
    if (!group.current) return;
    // Keep text in front of the glass bar
    group.current.position.z = 0.2;
  });

  return (
    <group ref={group}>
      {items.map(({ label, link }, i) => {
        const totalWidth = items.length * 1.5;
        const startX = -totalWidth / 2 + 0.75;
        return (
          <Text
            key={label}
            position={[startX + i * 1.5, 0, 0.2]}
            fontSize={0.28}
            color="white"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.1}
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate(link);
            }}
            onPointerOver={() => {
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            {label}
          </Text>
        );
      })}
    </group>
  );
});

// Fallback when WebGL is unavailable
function FallbackNav({
  items,
  className,
}: {
  items: NavItem[];
  className: string;
}) {
  const handleNavigate = (link: string) => {
    if (!link) return;
    link.startsWith("#")
      ? (window.location.hash = link)
      : (window.location.href = link);
  };

  return (
    <nav
      className={`flex items-center gap-6 px-6 ${className}`}
      style={{
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      {items.map(({ label, link }) => (
        <button
          key={label}
          onClick={() => handleNavigate(link)}
          className="text-white text-xs font-bold tracking-widest hover:text-white/70 transition-colors py-2"
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

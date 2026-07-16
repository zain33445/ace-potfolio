'use client';

import { forwardRef } from 'react';
import { Canvas } from '@react-three/fiber';
import SceneContent from './SceneContent';

const ThreeScene = forwardRef(function ThreeScene(_, ref) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{
          position: [0, 7, 8],
          fov: 60,
          near: 0.1,
          far: 100,
        }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#0A0A0A' }}
        dpr={[1, 1.5]}
      >
        {/* Ambient – enough to see shapes */}
        <ambientLight intensity={0.6} color="#ffffff" />

        {/* Orange point light from below-front for dramatic upward glow */}
        <pointLight
          position={[2, -1, 5]}
          intensity={60}
          color="#FF6B00"
          distance={25}
          decay={2}
        />

        {/* Fill light from above */}
        <pointLight
          position={[-3, 8, -2]}
          intensity={20}
          color="#ffffff"
          distance={25}
          decay={2}
        />

        {/* Front key light */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          color="#ffffff"
        />

        {/* Back rim light for depth */}
        <directionalLight
          position={[-3, 4, -5]}
          intensity={0.6}
          color="#4466aa"
        />

  <group position={[0, -2, 0]}>
        <SceneContent ref={ref} />
  </group>

      </Canvas>
    </div>
  );
});

export default ThreeScene;

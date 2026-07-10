'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ══════════════════════════════════════════════════
   SHARED HELPERS
   ══════════════════════════════════════════════════ */

export function makeTextCanvas(text, w = 512, h = 128, color = '#FF6B00', fontSize = 48, bgAlpha = 0) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  if (bgAlpha > 0) {
    ctx.fillStyle = `rgba(10,10,10,${bgAlpha})`;
    ctx.roundRect(4, 4, w - 8, h - 8, 8);
    ctx.fill();
  }
  ctx.font = `bold ${fontSize}px "JetBrains Mono", "Courier New", monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = color;
  ctx.shadowBlur = 15;
  ctx.fillText(text, w / 2, h / 2);
  ctx.shadowBlur = 0;
  return new THREE.CanvasTexture(c);
}

export function TextSprite({ text, position, color = '#FF6B00', scale = [3.5, 0.9, 1], opacity = 1, fontSize = 48 }) {
  const tex = useMemo(() => makeTextCanvas(text, 512, 128, color, fontSize), [text, color, fontSize]);
  const mat = useMemo(
    () => new THREE.SpriteMaterial({ map: tex, transparent: true, opacity, depthTest: false }),
    [tex, opacity],
  );
  return <sprite material={mat} position={position} scale={scale} />;
}

export function FloatingParticles({ count = 120 }) {
  const ref = useRef();
  const { positions, speeds } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = Math.random() * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20;
      s[i] = 0.2 + Math.random() * 0.8;
    }
    return { positions: p, speeds: s };
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] += delta * speeds[i] * 0.4;
      if (pos.array[i * 3 + 1] > 10) pos.array[i * 3 + 1] = 0;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#FF6B00" size={0.05} transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

/* ══════════════════════════════════════════════════
   STEP 1: Data Stream, Blueprint Grid, Scan Beam
   ══════════════════════════════════════════════════ */

export function DataStream({ active }) {
  const ref = useRef();
  const count = 40;
  
  const meshData = useMemo(() => {
    const data = [];
    for(let i=0; i<count; i++) {
      data.push({
        x: (Math.random() - 0.5) * 6,
        y: 4 + Math.random() * 6,
        z: (Math.random() - 0.5) * 4,
        speed: 4 + Math.random() * 4,
        scale: 0.05 + Math.random() * 0.1
      });
    }
    return data;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current || !active) return;
    ref.current.children.forEach((child, i) => {
      child.position.y -= delta * meshData[i].speed;
      if (child.position.y < 0) child.position.y = 8 + Math.random() * 2;
      child.rotation.x += delta * 2;
      child.rotation.y += delta * 2;
    });
  });

  if (!active) return null;

  return (
    <group ref={ref}>
      {meshData.map((d, i) => (
        <mesh key={i} position={[d.x, d.y, d.z]} scale={[d.scale, d.scale, d.scale]}>
          <boxGeometry />
          <meshBasicMaterial color="#FF6B00" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export function BlueprintGrid() {
  const gridTex = useMemo(() => {
    const size = 1024;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#050a12';
    ctx.fillRect(0, 0, size, size);
    
    // Hexagonal / Tech pattern underlay
    ctx.strokeStyle = '#0a1524';
    ctx.lineWidth = 1;
    for(let i=0; i<size; i+=40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i+20, size); ctx.stroke();
      ctx.moveTo(i, 0); ctx.lineTo(i-20, size); ctx.stroke();
    }

    ctx.strokeStyle = '#12304a';
    ctx.lineWidth = 2;
    const majorStep = size / 12;
    for (let i = 0; i <= 12; i++) {
      ctx.beginPath(); ctx.moveTo(i * majorStep, 0); ctx.lineTo(i * majorStep, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * majorStep); ctx.lineTo(size, i * majorStep); ctx.stroke();
    }
    ctx.strokeStyle = '#0c1f33';
    ctx.lineWidth = 0.8;
    const minorStep = size / 48;
    for (let i = 0; i <= 48; i++) {
      ctx.beginPath(); ctx.moveTo(i * minorStep, 0); ctx.lineTo(i * minorStep, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * minorStep); ctx.lineTo(size, i * minorStep); ctx.stroke();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial map={gridTex} transparent opacity={0.95} roughness={0.7} metalness={0.4} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[16, 0.4, 16]} />
        <meshStandardMaterial color="#03060a" roughness={0.9} />
      </mesh>
      {[
        [0, 0.01, 8, 16, 0.02, 0.06],
        [0, 0.01, -8, 16, 0.02, 0.06],
        [8, 0.01, 0, 0.06, 0.02, 16],
        [-8, 0.01, 0, 0.06, 0.02, 16],
      ].map(([x, y, z, sx, sy, sz], i) => (
        <mesh key={`edge${i}`} position={[x, y, z]}>
          <boxGeometry args={[sx, sy, sz]} />
          <meshBasicMaterial color="#FF6B00" transparent opacity={0.25} />
        </mesh>
      ))}
    </group>
  );
}

export function ScanBeam({ active }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (!ref.current || !active) return;
    ref.current.position.z += delta * 4;
    if (ref.current.position.z > 4) ref.current.position.z = -4;
  });

  if (!active) return null;
  return (
    <group ref={ref} position={[0, 0.1, -4]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 0.1]} />
        <meshBasicMaterial color="#FF6B00" transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, -0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 0.6]} />
        <meshBasicMaterial color="#FF6B00" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function BlueprintOutline({ visible, opacity = 0.5 }) {
  if (!visible) return null;
  const shapes = useMemo(() => [
    { points: [[-2.5, -1.8], [1.5, -1.8], [1.5, 1.2], [-0.5, 1.2], [-0.5, 2.0], [-2.5, 2.0]] },
    { points: [[1.8, -1.2], [3.0, -1.2], [3.0, 0.5], [1.8, 0.5]] },
    { points: [[-3.2, -0.5], [-2.8, -0.5], [-2.8, 0.8], [-3.2, 0.8]] },
  ], []);

  return (
    <group position={[0, 0.06, 0]}>
      {shapes.map((shape, si) => {
        const pts = shape.points.map(([x, z]) => new THREE.Vector3(x, 0, z));
        pts.push(pts[0].clone());
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        return (
          <line key={si} geometry={geo}>
            <lineBasicMaterial color="#FF6B00" transparent opacity={opacity} />
          </line>
        );
      })}
    </group>
  );
}

export function Checkmark({ position, visible }) {
  if (!visible) return null;
  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-0.2, 0, 0), new THREE.Vector3(-0.04, -0.2, 0), new THREE.Vector3(0.25, 0.2, 0),
  ]), []);
  return (
    <group position={position}>
      <line geometry={geo}><lineBasicMaterial color="#FF6B00" linewidth={2} /></line>
      <mesh><sphereGeometry args={[0.06, 8, 8]} /><meshBasicMaterial color="#FF6B00" transparent opacity={0.5} /></mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════
   STEP 2: Columns, Rings, Brackets
   ══════════════════════════════════════════════════ */

export function ComputationRings({ position, active }) {
  const ref1 = useRef();
  const ref2 = useRef();

  useFrame((_, delta) => {
    if (!active) return;
    if (ref1.current) { ref1.current.rotation.x += delta * 1.5; ref1.current.rotation.y += delta * 2; }
    if (ref2.current) { ref2.current.rotation.x -= delta * 1.2; ref2.current.rotation.z -= delta * 1.8; }
  });

  if (!active) return null;

  return (
    <group position={position}>
      <mesh ref={ref1}>
        <torusGeometry args={[0.6, 0.02, 4, 32]} />
        <meshBasicMaterial color="#FF6B00" transparent opacity={0.8} />
      </mesh>
      <mesh ref={ref2}>
        <torusGeometry args={[0.4, 0.015, 4, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

export function DataColumn({ position, height = 1, color = '#FF6B00', scaleY = 1 }) {
  const [pulse, setPulse] = useState(0);
  useFrame((_, delta) => setPulse(p => p + delta * 3));
  const emissiveI = 0.4 + Math.sin(pulse) * 0.2;

  return (
    <group position={position}>
      <mesh position={[0, (height * scaleY) / 2, 0]} scale={[1, Math.max(scaleY, 0.001), 1]}>
        <boxGeometry args={[0.2, height, 0.2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={emissiveI} />
      </mesh>
      <mesh position={[0, (height * scaleY) / 2, 0]} scale={[1, Math.max(scaleY, 0.001), 1]}>
        <boxGeometry args={[0.45, height * 0.98, 0.45]} />
        <meshStandardMaterial color={color} transparent opacity={0.2} roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[0, (height * scaleY) / 2, 0]} scale={[1, Math.max(scaleY, 0.001), 1]}>
        <boxGeometry args={[0.48, height, 0.48]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

export function Bracket({ start, end, visible }) {
  if (!visible) return null;
  const geo = useMemo(() => {
    const s = new THREE.Vector3(...start); const e = new THREE.Vector3(...end);
    const tickLen = 0.15; const isHorizontal = Math.abs(e.x - s.x) > Math.abs(e.z - s.z);
    const pts = isHorizontal 
      ? [new THREE.Vector3(s.x, s.y, s.z - tickLen), s, e, new THREE.Vector3(e.x, e.y, e.z - tickLen)]
      : [new THREE.Vector3(s.x - tickLen, s.y, s.z), s, e, new THREE.Vector3(e.x - tickLen, e.y, e.z)];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [start, end]);

  return <line geometry={geo}><lineBasicMaterial color="#FF6B00" linewidth={1} transparent opacity={0.7} /></line>;
}

/* ══════════════════════════════════════════════════
   STEP 3: Auditor Drones, Humans, Stamp
   ══════════════════════════════════════════════════ */

export function HumanSilhouette({ position, rotation = [0,0,0], color = '#bbbbbb' }) {
  return (
    <group position={position} rotation={rotation} scale={[1.2, 1.2, 1.2]}>
      <mesh position={[0, 2.0, 0]}><sphereGeometry args={[0.25, 6, 5]} /><meshStandardMaterial color={color} flatShading roughness={0.6} /></mesh>
      <mesh position={[0, 1.7, 0]}><cylinderGeometry args={[0.08, 0.1, 0.15, 5]} /><meshStandardMaterial color={color} flatShading /></mesh>
      <mesh position={[0, 1.2, 0]}><boxGeometry args={[0.55, 0.9, 0.3]} /><meshStandardMaterial color={color} flatShading roughness={0.6} /></mesh>
      <mesh position={[-0.4, 1.25, 0]}><boxGeometry args={[0.16, 0.8, 0.16]} /><meshStandardMaterial color={color} flatShading /></mesh>
      <mesh position={[0.4, 1.25, 0]}><boxGeometry args={[0.16, 0.8, 0.16]} /><meshStandardMaterial color={color} flatShading /></mesh>
      <mesh position={[-0.15, 0.35, 0]}><boxGeometry args={[0.2, 0.7, 0.2]} /><meshStandardMaterial color={color} flatShading /></mesh>
      <mesh position={[0.15, 0.35, 0]}><boxGeometry args={[0.2, 0.7, 0.2]} /><meshStandardMaterial color={color} flatShading /></mesh>
    </group>
  );
}


export function AuditorDrone({ position, rotation = [0,0,0], active, color="#ffffff" }) {
  const ref = useRef();
  
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(Date.now() * 0.003) * 0.2;
    ref.current.children[1].rotation.z += delta;
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#111" emissive={color} emissiveIntensity={0.8} />
      </mesh>
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.5, 0.04, 8, 24]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>
      {active && (
        <mesh position={[0, -2, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.05, 1.2, 4, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

export function Stamp({ position, visible }) {
  if (!visible) return null;
  const tex = useMemo(() => makeTextCanvas('VERIFIED', 512, 128, '#22cc66', 44), []);
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.1, 8, 32]} />
        <meshStandardMaterial color="#1a1a1a" emissive="#22cc66" emissiveIntensity={0.4} />
      </mesh>
      <sprite position={[0, 0.2, 0]} scale={[2.0, 0.5, 1]}>
        <spriteMaterial map={tex} transparent opacity={1} depthTest={false} />
      </sprite>
    </group>
  );
}

/* ══════════════════════════════════════════════════
   STEP 4: Data Core, Docs
   ══════════════════════════════════════════════════ */

export function DataCore({ position, visible, scale = 1 }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta;
      ref.current.rotation.x += delta * 0.5;
    }
  });

  if (!visible) return null;
  return (
    <group position={position} scale={[scale, scale, scale]} ref={ref}>
      <mesh>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color="#0a1928" emissive="#FF6B00" emissiveIntensity={0.4} wireframe />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.9} />
      </mesh>
    </group>
  );
}

export function DocIcon({ position, color, label, visible }) {
  if (!visible) return null;
  const tex = useMemo(() => makeTextCanvas(label, 256, 128, '#ffffff', 44), [label]);
  const [t, setT] = useState(0);
  useFrame((_, delta) => setT(p => p + delta * 2));

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.8, 1.1, 0.06]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} transparent opacity={0.9} roughness={0.2} metalness={0.5} />
      </mesh>
      <sprite position={[0, 0, 0.06]} scale={[0.7, 0.35, 1]}>
        <spriteMaterial map={tex} transparent depthTest={false} />
      </sprite>
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[1.2, 1.6]} />
        <meshBasicMaterial color={color} transparent opacity={0.1 + Math.sin(t) * 0.05} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

'use client';

import { useRef, useState, useCallback, useImperativeHandle, forwardRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import {
  BlueprintGrid, TextSprite, Checkmark, ScanBeam,
  DataColumn, Bracket, AuditorDrone, HumanSilhouette, Stamp,
  DataCore, DocIcon, FloatingParticles, BlueprintOutline,
  DataStream, ComputationRings
} from './ScenePrimitives';

/* ═══════════════════════════════════════════════════
   SCENE CONTENT — orchestrates all 4 step animations
   ═══════════════════════════════════════════════════ */

const COLUMN_DATA = [
  { pos: [-2.5, 0.05, -1.5], h: 2.8 },
  { pos: [-1.2, 0.05, -0.8], h: 3.8 },
  { pos: [0.3,  0.05, 0.0],  h: 2.0 },
  { pos: [1.5,  0.05, 0.8],  h: 3.2 },
  { pos: [0.0,  0.05, 1.8],  h: 1.6 },
  { pos: [2.5,  0.05, -0.5], h: 2.4 },
  { pos: [-0.8, 0.05, 1.5],  h: 1.2 },
];

const BRACKET_PAIRS = [
  { s: [-3.5, 0.08, -2.2], e: [-3.5, 0.08, -0.2] },
  { s: [-1.5, 0.08, -2.5], e: [1.5,  0.08, -2.5] },
  { s: [3.0,  0.08, -1.5], e: [3.0,  0.08, 1.5] },
  { s: [-2.0, 0.08, 2.5],  e: [2.0,  0.08, 2.5] },
];

const ZONE_POSITIONS = [
  [-1.8, 0.05, -1.4],
  [1.5,  0.05, -1.2],
  [-1.2, 0.05, 1.2],
  [1.5,  0.05, 1.2],
];

const READOUT_LABELS = ['2,450 SF', '18 LF', '3,200 CY', '640 SF'];

const DEFAULT_COLORS = () => Array(7).fill('#FF6B00');

const INITIAL = {
  dataStreamActive: false,
  bpVisible: false, bpScaleX: 0, bpY: 8, gridDraw: 0,
  scanActive: false, checks: [false, false, false],
  scanLabel: false, outlineVisible: false,
  zones: false, brackets: false, readouts: false,
  columns: false, ringsActive: false, takeoffLabel: false,
  drones: false, droneLX: -9, droneRX: 9, droneLaser: false,
  warningCol: -1,
  colColors: DEFAULT_COLORS(),
  stampVisible: false, stampY: 6,
  colScaleY: 1, bpFold: 0,
  coreVisible: false, coreScale: 0, coreY: 0,
  docsVisible: false,
  deliveredLabel: false, idleActive: false,
};

const SceneContent = forwardRef(function SceneContent(_, ref) {
  const [s, setS] = useState({ ...INITIAL });
  const sRef = useRef(s);
  sRef.current = s;
  const groupRef = useRef();
  const idlePhase = useRef(0);
  const tlRef = useRef(null);
  const mountedRef = useRef(true);

  const set = useCallback((patch) => {
    if (!mountedRef.current) return;
    setS(prev => ({ ...prev, ...patch }));
  }, []);

  useFrame((_, delta) => {
    if (sRef.current.idleActive) {
      idlePhase.current += delta * 1.5;
    } else {
      idlePhase.current = 0;
    }
  });

  /* ── Camera shake ──────────────────── */
  const shake = useCallback((dur = 0.25) => {
    if (!groupRef.current) return;
    const pos = groupRef.current.position;
    const origX = pos.x;
    const origY = pos.y;
    gsap.to(pos, {
      x: origX, y: origY, duration: dur,
      onUpdate: () => {
        if (!groupRef.current || !mountedRef.current) { gsap.killTweensOf(pos); return; }
        pos.x += (Math.random() - 0.5) * 0.12;
        pos.y += (Math.random() - 0.5) * 0.1;
      },
      overwrite: 'auto',
    });
  }, []);

  /* ═══ STEP 1 ═══════════════════════════ */
  const playStep1 = useCallback((speed = 1) => {
    return new Promise(resolve => {
      const d = (v) => v / speed;
      const tl = gsap.timeline({ onComplete: resolve });
      tlRef.current = tl;

      set({ ...INITIAL, dataStreamActive: true, bpVisible: true });

      // Data stream falls
      tl.to({}, { duration: d(1.0) });
      
      // Blueprint drops from above
      tl.to({ val: 8 }, {
        val: 0.05, duration: d(0.7), ease: 'bounce.out',
        onUpdate: function () { set({ bpY: this.targets()[0].val }); },
      });
      tl.call(() => set({ dataStreamActive: false }));

      // Unroll
      tl.to({ val: 0 }, {
        val: 1, duration: d(0.8), ease: 'back.out(1.2)',
        onUpdate: function () { set({ bpScaleX: this.targets()[0].val }); },
      });
      
      // Outline
      tl.call(() => set({ outlineVisible: true }));
      tl.to({}, { duration: d(0.2) });
      
      // Grid
      tl.to({ val: 0 }, {
        val: 1, duration: d(0.7), ease: 'power1.inOut',
        onUpdate: function () { set({ gridDraw: this.targets()[0].val }); },
      });
      
      // Scan
      tl.call(() => set({ scanActive: true }));
      tl.to({}, { duration: d(2.0) });
      tl.call(() => set({ scanActive: false }));
      
      // Checks
      tl.call(() => set({ checks: [true, false, false] }));
      tl.to({}, { duration: d(0.2) });
      tl.call(() => set({ checks: [true, true, false] }));
      tl.to({}, { duration: d(0.2) });
      tl.call(() => set({ checks: [true, true, true] }));
      tl.to({}, { duration: d(0.25) });
      
      // Label
      tl.call(() => set({ scanLabel: true }));
    });
  }, [set]);

  /* ═══ STEP 2 ═══════════════════════════ */
  const playStep2 = useCallback((speed = 1) => {
    return new Promise(resolve => {
      const d = (v) => v / speed;
      const tl = gsap.timeline({ onComplete: resolve });
      tlRef.current = tl;

      set({ zones: false, brackets: false, readouts: false,
            columns: false, ringsActive: false, takeoffLabel: false, colScaleY: 1,
            colColors: DEFAULT_COLORS() });

      tl.call(() => set({ zones: true }));
      tl.to({}, { duration: d(0.5) });
      
      tl.call(() => set({ brackets: true }));
      tl.to({}, { duration: d(0.4) });
      
      tl.call(() => set({ readouts: true }));
      tl.to({}, { duration: d(0.6) });
      
      tl.call(() => set({ columns: true, ringsActive: true, colScaleY: 0 }));
      tl.to({ val: 0 }, {
        val: 1, duration: d(0.8), ease: 'elastic.out(1, 0.6)',
        onUpdate: function () { set({ colScaleY: this.targets()[0].val }); },
      });
      tl.to({}, { duration: d(0.3) });
      
      tl.call(() => set({ takeoffLabel: true }));
    });
  }, [set]);

  /* ═══ STEP 3 ═══════════════════════════ */
  const playStep3 = useCallback((speed = 1) => {
    return new Promise(resolve => {
      const d = (v) => v / speed;
      const tl = gsap.timeline({ onComplete: resolve });
      tlRef.current = tl;

      set({ drones: true, droneLX: -9, droneRX: 9, droneLaser: false,
            warningCol: -1, stampVisible: false, stampY: 6 });

      // Drones fly in
      tl.to({ val: -9 }, {
        val: -2.5, duration: d(0.8), ease: 'power3.out',
        onUpdate: function () { set({ droneLX: this.targets()[0].val }); },
      });
      tl.to({ val: 9 }, {
        val: 2.5, duration: d(0.8), ease: 'power3.out',
        onUpdate: function () { set({ droneRX: this.targets()[0].val }); },
      }, '<');

      // Red column variance
      tl.call(() => {
        const c = DEFAULT_COLORS();
        c[1] = '#ff2222';
        set({ warningCol: 1, colColors: c });
      });
      tl.to({}, { duration: d(0.6) });

      // Drones activate scanning lasers
      tl.call(() => set({ droneLaser: true }));
      tl.to({}, { duration: d(0.8) });

      // Variance resolved
      tl.call(() => {
        const c = DEFAULT_COLORS();
        c[1] = '#FF6B00';
        set({ colColors: c, warningCol: -1, droneLaser: false });
      });
      tl.to({}, { duration: d(0.3) });

      // Cascade green
      const greens = DEFAULT_COLORS();
      for (let i = 0; i < 7; i++) {
        tl.call(() => {
          greens[i] = '#22cc66';
          set({ colColors: [...greens] });
        });
        tl.to({}, { duration: d(0.08) });
      }
      tl.to({}, { duration: d(0.2) });

      // Stamp
      tl.call(() => set({ stampVisible: true }));
      tl.to({ val: 6 }, {
        val: 0.12, duration: d(0.35), ease: 'bounce.out',
        onUpdate: function () { set({ stampY: this.targets()[0].val }); },
      });
      tl.call(() => shake(0.25 / speed));
      tl.to({}, { duration: d(0.4) });

      // Drones leave
      tl.to({ val: -2.5 }, {
        val: -9, duration: d(0.6), ease: 'power2.in',
        onUpdate: function () { set({ droneLX: this.targets()[0].val }); },
      });
      tl.to({ val: 2.5 }, {
        val: 9, duration: d(0.6), ease: 'power2.in',
        onUpdate: function () { set({ droneRX: this.targets()[0].val }); },
      }, '<');
      tl.call(() => set({ drones: false }));
    });
  }, [set, shake]);

  /* ═══ STEP 4 ═══════════════════════════ */
  const playStep4 = useCallback((speed = 1) => {
    return new Promise(resolve => {
      const d = (v) => v / speed;
      const tl = gsap.timeline({ onComplete: resolve });
      tlRef.current = tl;

      set({ coreVisible: false, coreScale: 0, coreY: 0,
            docsVisible: false,
            deliveredLabel: false, idleActive: false });

      // Columns fold down
      tl.to({ val: 1 }, {
        val: 0, duration: d(0.6), ease: 'power3.in',
        onUpdate: function () { set({ colScaleY: this.targets()[0].val }); },
      });
      tl.to({}, { duration: d(0.15) });

      // Blueprint folds
      tl.to({ val: 0 }, {
        val: 1, duration: d(0.6), ease: 'power2.inOut',
        onUpdate: function () { set({ bpFold: this.targets()[0].val }); },
      });
      tl.to({}, { duration: d(0.2) });

      // Core appears and expands
      tl.call(() => set({ coreVisible: true }));
      tl.to({ s: 0, y: 0 }, {
        s: 1, y: 3, duration: d(1.2), ease: 'elastic.out(1, 0.7)',
        onUpdate: function () { 
          set({ coreScale: this.targets()[0].s, coreY: this.targets()[0].y }); 
        },
      });
      tl.to({}, { duration: d(0.4) });

      // Docs revealed from core
      tl.call(() => set({ docsVisible: true }));
      tl.to({}, { duration: d(0.4) });

      // Label
      tl.call(() => set({ deliveredLabel: true }));
      tl.to({}, { duration: d(1.5) });
      tl.call(() => set({ idleActive: true }));
    });
  }, [set]);

  /* ── Expose to parent ──────────────── */
  useImperativeHandle(ref, () => ({
    playStep1, playStep2, playStep3, playStep4,
    reset: () => {
      if (tlRef.current) { tlRef.current.kill(); tlRef.current = null; }
      set({ ...INITIAL });
    },
  }), [playStep1, playStep2, playStep3, playStep4, set]);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  const idleY = s.idleActive ? Math.sin(idlePhase.current) * 0.2 : 0;

  /* ── RENDER ────────────────────────── */
  return (
    <group ref={groupRef}>
      <FloatingParticles count={120} />
      <BlueprintGrid />

      <DataStream active={s.dataStreamActive} />

      {/* ═══ STEP 1: Blueprint ═══════════ */}
      {s.bpVisible && (
        <group position={[0, s.bpY, 0]}>
          <mesh
            position={[0, 0.04, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[s.bpScaleX * (1 - s.bpFold * 0.85), 1, 1]}
          >
            <planeGeometry args={[8, 6]} />
            <meshStandardMaterial
              color="#081624" emissive="#0D2137" emissiveIntensity={0.4}
              transparent opacity={0.92} side={THREE.DoubleSide} roughness={0.7}
            />
          </mesh>

          {s.bpScaleX > 0.5 && (
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[s.bpScaleX, 1, 1]}>
              <planeGeometry args={[8.1, 6.1]} />
              <meshBasicMaterial color="#FF6B00" transparent opacity={0.04} side={THREE.DoubleSide} />
            </mesh>
          )}

          <BlueprintOutline visible={s.outlineVisible} opacity={0.45} />

          {s.gridDraw > 0 && (
            <group position={[0, 0.06, 0]}>
              {Array.from({ length: 8 }).map((_, i) => {
                if (s.gridDraw <= i / 8) return null;
                const z = -2.5 + i * 0.72;
                return (
                  <line key={`h${i}`} geometry={new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3.6, 0, z), new THREE.Vector3(3.6, 0, z)])}>
                    <lineBasicMaterial color="#FF6B00" transparent opacity={0.3} />
                  </line>
                );
              })}
              {Array.from({ length: 8 }).map((_, i) => {
                if (s.gridDraw <= i / 8) return null;
                const x = -3.2 + i * 0.92;
                return (
                  <line key={`v${i}`} geometry={new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, 0, -2.8), new THREE.Vector3(x, 0, 2.8)])}>
                    <lineBasicMaterial color="#FF6B00" transparent opacity={0.3} />
                  </line>
                );
              })}
            </group>
          )}

          <ScanBeam active={s.scanActive} />

          <Checkmark position={[-3.2, 0.15, -2.5]} visible={s.checks[0]} />
          <Checkmark position={[3.2, 0.15, -2.5]} visible={s.checks[1]} />
          <Checkmark position={[-3.2, 0.15, 2.5]} visible={s.checks[2]} />

          {s.scanLabel && <TextSprite text="SCAN COMPLETE" position={[0, 2.5, 0]} scale={[3.5, 0.9, 1]} />}
        </group>
      )}

      {/* ═══ STEP 2: Zones, Brackets, Columns ═══ */}
      {s.zones && ZONE_POSITIONS.map((pos, i) => (
        <mesh key={`zone${i}`} position={pos} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.2, 1.8]} />
          <meshBasicMaterial color="#FF6B00" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {s.brackets && BRACKET_PAIRS.map((b, i) => <Bracket key={`br${i}`} start={b.s} end={b.e} visible />)}

      {s.readouts && READOUT_LABELS.map((label, i) => (
        <TextSprite key={`rd${i}`} text={label} position={[BRACKET_PAIRS[i].s[0], 0.8, BRACKET_PAIRS[i].s[2]]} color="#ffffff" scale={[1.6, 0.45, 1]} fontSize={36} />
      ))}

      {s.columns && COLUMN_DATA.map((col, i) => (
        <group key={`colgrp${i}`}>
          <DataColumn position={col.pos} height={col.h} color={s.colColors[i]} scaleY={s.colScaleY} />
          <ComputationRings position={[col.pos[0], col.h * s.colScaleY + 0.3, col.pos[2]]} active={s.ringsActive && s.colScaleY > 0.8} />
        </group>
      ))}

      {s.takeoffLabel && <TextSprite text="TAKEOFF: 100%" position={[0, 6, 0]} scale={[4, 1, 1]} />}

      {/* ═══ STEP 3: Drones, Humans, Warning, Stamp ═══ */}
      {s.drones && (
        <>
          {/* Drones hovering */}
          <AuditorDrone position={[s.droneLX, 4, 0]} rotation={[0, -Math.PI/6, 0]} active={s.droneLaser} color="#ff2222" />
          <AuditorDrone position={[s.droneRX, 4, 0]} rotation={[0, Math.PI/6, 0]} active={s.droneLaser} color="#22cc66" />
          {/* Humans standing below */}
          <HumanSilhouette position={[s.droneLX - 0.5, 0, 1.5]} rotation={[0, Math.PI/3, 0]} color="#aaaaaa" />
          <HumanSilhouette position={[s.droneRX + 0.5, 0, 1.5]} rotation={[0, -Math.PI/3, 0]} color="#888888" />
        </>
      )}

      {s.warningCol >= 0 && (
        <TextSprite text="[!]" position={[COLUMN_DATA[s.warningCol].pos[0], COLUMN_DATA[s.warningCol].h * s.colScaleY + 1.2, COLUMN_DATA[s.warningCol].pos[2]]} color="#ff2222" scale={[0.8, 0.4, 1]} />
      )}

      <Stamp position={[0, s.stampY, 0]} visible={s.stampVisible} />

      {/* ═══ STEP 4: Core & Docs ═══ */}
      <DataCore position={[0, s.coreY + idleY, 0]} visible={s.coreVisible} scale={s.coreScale} />

      {s.docsVisible && (
        <group position={[0, s.coreY + 2 + idleY * 1.5, 0]}>
          <DocIcon position={[-1.2, 0, 0]} color="#22aa44" label="XLS" visible />
          <DocIcon position={[1.2, 0, 0]} color="#cc2222" label="PDF" visible />
        </group>
      )}

      {s.deliveredLabel && <TextSprite text="DELIVERED" position={[0, s.coreY + 4 + idleY * 0.5, 0]} scale={[4, 1, 1]} />}
    </group>
  );
});

export default SceneContent;

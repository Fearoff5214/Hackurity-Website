"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Torus } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import * as THREE from "three";

// Vector offset for Chromatic Aberration
const CA_OFFSET = new THREE.Vector2(0.002, 0.002);

// Glowing Node component (Tan colored nodes casting light onto the titanium rings)
function GlowingNode({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (lightRef.current) {
      // Pulsate the point light intensity dynamically
      lightRef.current.intensity = 2.0 + Math.sin(state.clock.getElapsedTime() * 4) * 0.6;
    }
  });

  return (
    <mesh position={position}>
      <sphereGeometry args={[0.13, 16, 16]} />
      <meshStandardMaterial
        color="#d2b48c"
        emissive="#d2b48c"
        emissiveIntensity={4.5}
        roughness={0.1}
        metalness={0.9}
      />
      <pointLight 
        ref={lightRef}
        color="#d2b48c" 
        intensity={2.0} 
        distance={2.5} 
        decay={2.0} 
      />
    </mesh>
  );
}

// Single orbital ring with brushed titanium finish and wireframe overlay
interface OrbitRingProps {
  radius: number;
  tube: number;
  rotationSpeed: { x: number; y: number; z: number };
  nodeCount: number;
}

function OrbitRing({ radius, tube, rotationSpeed, nodeCount }: OrbitRingProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.x = elapsed * rotationSpeed.x;
      groupRef.current.rotation.y = elapsed * rotationSpeed.y;
      groupRef.current.rotation.z = elapsed * rotationSpeed.z;
    }
  });

  const nodes = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      arr.push([x, y, 0]);
    }
    return arr;
  }, [radius, nodeCount]);

  return (
    <group ref={groupRef}>
      {/* 1. Main Brushed Titanium Ring */}
      <Torus ref={meshRef} args={[radius, tube, 16, 100]}>
        <meshPhysicalMaterial
          color="#12121b" // Dark brushed titanium base
          metalness={0.9}
          roughness={0.3}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
          reflectivity={0.8}
        />
      </Torus>

      {/* 2. Overlaid wireframe ring for defense shield visual */}
      <Torus args={[radius + 0.02, tube + 0.005, 8, 48]}>
        <meshStandardMaterial
          color="#6366f1"
          wireframe
          transparent
          opacity={0.15}
        />
      </Torus>

      {/* Symmetrical glowing tan nodes */}
      {nodes.map((pos, idx) => (
        <GlowingNode key={idx} position={pos} />
      ))}
    </group>
  );
}

// Inner glowing cores (Navy Indigo / Cyber Blue energy core)
function InnerLiquidCores() {
  const coresRef = useRef<THREE.Group>(null);
  const core1Ref = useRef<THREE.Mesh>(null);
  const core2Ref = useRef<THREE.Mesh>(null);
  const core3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    
    // Core group rotation
    if (coresRef.current) {
      coresRef.current.rotation.y = -elapsed * 0.15;
    }

    // Pulse core scales like a beating heart
    if (core1Ref.current) {
      const s = 0.44 + Math.sin(elapsed * 3.5) * 0.06;
      core1Ref.current.scale.set(s, s, s);
      core1Ref.current.position.y = Math.sin(elapsed * 2) * 0.15;
    }
    
    if (core2Ref.current) {
      const s = 0.34 + Math.cos(elapsed * 4) * 0.05;
      core2Ref.current.scale.set(s, s, s);
      core2Ref.current.position.x = Math.sin(elapsed * 1.5) * 0.35;
      core2Ref.current.position.z = Math.cos(elapsed * 1.5) * 0.35;
    }

    if (core3Ref.current) {
      const s = 0.28 + Math.sin(elapsed * 2.8) * 0.04;
      core3Ref.current.scale.set(s, s, s);
      core3Ref.current.position.x = Math.sin(elapsed * 1.8 + Math.PI) * 0.3;
      core3Ref.current.position.y = Math.cos(elapsed * 1.8 + Math.PI) * 0.3;
    }
  });

  return (
    <group ref={coresRef}>
      {/* Central main core (Glowing Cyber Blue) */}
      <mesh ref={core1Ref}>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={5.0}
          roughness={0.15}
          metalness={0.8}
        />
        {/* Point light centered inside core */}
        <pointLight color="#6366f1" intensity={3.0} distance={5.0} decay={1.5} />
      </mesh>

      {/* Orbiting core 1 */}
      <mesh ref={core2Ref} position={[0.4, 0.4, 0]}>
        <sphereGeometry args={[1.0, 24, 24]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={4.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Orbiting core 2 */}
      <mesh ref={core3Ref} position={[-0.4, -0.4, 0.2]}>
        <sphereGeometry args={[1.0, 24, 24]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={4.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}

// Particle shell representing orbiting electrons
function ParticleElectrons() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 180;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 2.3 + Math.random() * 0.7; // shell radius
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.12;
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.15;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#6366f1"
        size={0.04}
        sizeAttenuation={true}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Kinetic sculpture scene wrapper
function SculptureScene() {
  return (
    <>
      {/* 3D Environment preset for realistic titanium reflections */}
      <Environment preset="city" />

      {/* Near zero ambient light to let glows dominate */}
      <ambientLight intensity={0.02} />

      {/* Harsh light catching titanium edges */}
      <directionalLight position={[10, 10, 5]} intensity={2.0} color="#ffffff" />
      <directionalLight position={[-15, -10, -5]} intensity={0.8} color="#6366f1" />
      
      {/* Intersecting Orbit Rings */}
      <OrbitRing 
        radius={2.1} 
        tube={0.045} 
        rotationSpeed={{ x: 0.1, y: 0.25, z: 0.05 }} 
        nodeCount={4} 
      />
      <OrbitRing 
        radius={2.2} 
        tube={0.04} 
        rotationSpeed={{ x: 0.2, y: -0.15, z: 0.1 }} 
        nodeCount={3} 
      />
      <OrbitRing 
        radius={2.3} 
        tube={0.035} 
        rotationSpeed={{ x: -0.15, y: 0.1, z: 0.25 }} 
        nodeCount={3} 
      />

      {/* Inner pulsing liquid cores */}
      <InnerLiquidCores />

      {/* Electron particle cloud */}
      <ParticleElectrons />

      {/* Postprocessing effects (Strong Bloom + Chromatic aberration) */}
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.15} 
          luminanceSmoothing={0.9} 
          intensity={2.2}
          mipmapBlur
        />
        <ChromaticAberration 
          offset={CA_OFFSET} 
        />
      </EffectComposer>
    </>
  );
}

// Main Sculpture Canvas Container
export default function KineticSculpture() {
  const [mounted, setMounted] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-cyber-dark/40 border border-cyber-blue/10">
        <span className="text-xs text-cyber-blue/50 tracking-widest animate-pulse font-mono">// BOOTING WebGL ENGINE...</span>
      </div>
    );
  }

  if (hasError) {
    return <SculptureFallback />;
  }

  return (
    <div className="w-full h-full min-h-[350px] relative">
      {/* Technical corner indicators in Tan */}
      <span className="absolute top-2 left-2 text-[10px] text-cyber-tan/45 select-none pointer-events-none font-mono">+</span>
      <span className="absolute top-2 right-2 text-[10px] text-cyber-tan/45 select-none pointer-events-none font-mono">+</span>
      <span className="absolute bottom-2 left-2 text-[10px] text-cyber-tan/45 select-none pointer-events-none font-mono">+</span>
      <span className="absolute bottom-2 right-2 text-[10px] text-cyber-tan/45 select-none pointer-events-none font-mono">+</span>
      
      {/* Telemetry info HUD overlay */}
      <div className="absolute top-4 left-4 z-10 font-mono text-[9px] text-cyber-blue/60 tracking-wider">
        <div>SYS.ENCRYPTION: SHIELD_ENVELOPE</div>
        <div>NODE_STATE: SHIFTING_LOCKS</div>
      </div>

      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 45 }}
        onError={() => setHasError(true)}
      >
        <SculptureScene />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
}

// Fallback HTML/CSS animation if WebGL is unsupported
function SculptureFallback() {
  return (
    <div className="w-full h-full min-h-[350px] flex items-center justify-center bg-cyber-dark/60 border border-cyber-blue/20 relative overflow-hidden group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)]" />
      <div className="absolute inset-0 cyber-grid opacity-25" />
      
      {/* Decorative corners */}
      <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyber-tan/30" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyber-tan/30" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyber-tan/30" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyber-tan/30" />

      {/* Double ring CSS simulation (Blue/Tan) */}
      <div className="relative w-64 h-64 border border-cyber-blue/30 rounded-full flex items-center justify-center animate-[spin_12s_linear_infinite] shadow-neon">
        <div className="absolute w-56 h-56 border border-cyber-tan/30 border-dashed rounded-full animate-[spin_8s_linear_infinite_reverse]" />
        <div className="absolute w-44 h-44 border border-white/10 rounded-full animate-[spin_16s_linear_infinite]" />
        <div className="absolute w-24 h-24 bg-cyber-blue/10 border-2 border-cyber-blue rounded-full flex items-center justify-center animate-pulse">
          <div className="w-12 h-12 bg-cyber-blue rounded-full shadow-neon-strong" />
        </div>
      </div>

      <div className="absolute bottom-4 left-4 font-mono text-[9px] text-cyber-blue/60 tracking-wider">
        <div>SYS.RENDER_MODE: CSS_FALLBACK</div>
        <div>STATUS: COMPAT_ACTIVE</div>
      </div>
    </div>
  );
}

"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, shaderMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

// 1. Define custom shader material for binary stream particles
const BinaryPointMaterial = shaderMaterial(
  {
    u_time: 0.0,
    u_texture: null,
    u_colorBlue: new THREE.Color("#6366f1"),
    u_colorTan: new THREE.Color("#d2b48c"),
  },
  // Vertex Shader
  `
  uniform float u_time;
  attribute float a_char;
  attribute float a_offset;
  
  varying float vChar;
  varying float vOffset;
  
  void main() {
    vChar = a_char;
    vOffset = a_offset;
    
    vec3 pos = position;
    
    // Subtle physical jitter in space
    pos.x += sin(u_time * 2.0 + a_offset) * 0.008;
    pos.z += cos(u_time * 2.0 + a_offset) * 0.008;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Attenuated point size for maximum sharpness
    float pulse = 1.0 + sin(u_time * 4.0 + a_offset * 12.0) * 0.25;
    gl_PointSize = (24.0 / -mvPosition.z) * pulse;
  }
  `,
  // Fragment Shader
  `
  uniform sampler2D u_texture;
  uniform vec3 u_colorBlue;
  uniform vec3 u_colorTan;
  uniform float u_time;
  
  varying float vChar;
  varying float vOffset;
  
  void main() {
    vec2 uv = gl_PointCoord;
    if (vChar < 0.5) {
      uv.x = uv.x * 0.5;
    } else {
      uv.x = uv.x * 0.5 + 0.5;
    }
    
    vec4 texColor = texture2D(u_texture, uv);
    if (texColor.a < 0.15) discard;
    
    // Color blend between primary color and tan
    float colorMix = sin(u_time * 1.5 + vOffset) * 0.5 + 0.5;
    vec3 finalColor = mix(u_colorBlue, u_colorTan, colorMix);
    
    gl_FragColor = vec4(finalColor, texColor.a);
  }
  `
);

// Inner flowing binary digits stream inside a cylinder
interface FlowingStreamProps {
  count: number;
  color: string;
  speed: number;
  texture: THREE.Texture;
}

function FlowingStream({ count, color, speed, texture }: FlowingStreamProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const material = useMemo(() => new (BinaryPointMaterial as any)(), []);

  useEffect(() => {
    material.u_colorBlue = new THREE.Color(color);
    material.u_texture = texture;
  }, [color, texture, material]);

  // Generate coordinates local to the cylinder (radius 0.28, length 10)
  const { positions, chars, offsets } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const chr = new Float32Array(count);
    const off = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.28; 
      
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10.0; // Y coordinate along the cylinder length
      pos[i * 3 + 2] = Math.sin(theta) * r;

      chr[i] = Math.random() < 0.5 ? 0.0 : 1.0;
      off[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, chars: chr, offsets: off };
  }, [count]);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    material.u_time = elapsed;

    if (pointsRef.current) {
      const arr = pointsRef.current.geometry.attributes.position.array as Float32Array;
      
      // Animate flowing Y position along local axis
      for (let i = 0; i < count; i++) {
        arr[i * 3 + 1] += speed * 6.0 * delta;
        // Wrap around at cylinder boundary limit
        if (arr[i * 3 + 1] > 5.0) {
          arr[i * 3 + 1] = -5.0;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
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
        <bufferAttribute
          attach="attributes-a_char"
          args={[chars, 1]}
          count={chars.length}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-a_offset"
          args={[offsets, 1]}
          count={offsets.length}
          itemSize={1}
        />
      </bufferGeometry>
      <primitive 
        object={material} 
        attach="material" 
        transparent 
        depthWrite={false} 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Single transparent glass cylinder containing a flowing stream of numbers
interface FiberCableProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  speed: number;
  texture: THREE.Texture;
}

function FiberCable({ position, rotation, scale, color, speed, texture }: FiberCableProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 1. Outer Glass Cylinder */}
      <mesh>
        <cylinderGeometry args={[0.4, 0.4, 10, 32, 1, true]} />
        <meshPhysicalMaterial
          color={color}
          transmission={0.9} // highly transmissive clear glass
          roughness={0.1}
          metalness={0.1}
          transparent
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Inner Flowing Binary stream */}
      <FlowingStream count={150} color={color} speed={speed} texture={texture} />
    </group>
  );
}

// Bundle of cables
function CableBundle({ texture }: { texture: THREE.Texture }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Cable (Cyber Blue) */}
      <FiberCable 
        position={[0, 0, 0]} 
        rotation={[0, 0, 0]} 
        color="#6366f1" 
        speed={0.45} 
        texture={texture}
        scale={[1.0, 1.0, 1.0]} 
      />
      {/* Orbiting Cable 1 (Tan) */}
      <FiberCable 
        position={[-0.8, 0, 0.3]} 
        rotation={[0.1, 0, 0.1]} 
        color="#d2b48c" 
        speed={0.35} 
        texture={texture}
        scale={[0.7, 0.95, 0.7]} 
      />
      {/* Orbiting Cable 2 (Deep Indigo) */}
      <FiberCable 
        position={[0.8, 0.1, -0.4]} 
        rotation={[-0.15, 0.1, -0.1]} 
        color="#4f46e5" 
        speed={0.55} 
        texture={texture}
        scale={[0.6, 1.05, 0.6]} 
      />
      {/* Diagonal feeder Cable 3 (Deep Tan) */}
      <FiberCable 
        position={[-0.2, 0.2, -0.8]} 
        rotation={[0.0, 0.15, 0.15]} 
        color="#c5a880" 
        speed={0.4} 
        texture={texture}
        scale={[0.55, 0.9, 0.55]} 
      />
    </group>
  );
}

// Scene setup with preset studio reflections
function ConduitScene({ texture }: { texture: THREE.Texture }) {
  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={2.5} color="#6366f1" />
      
      <CableBundle texture={texture} />
    </>
  );
}

// Main component container
export default function CyberBreachConduit() {
  const [mounted, setMounted] = useState(false);
  const [binaryTexture, setBinaryTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    setMounted(true);

    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "rgba(0, 0, 0, 0)";
      ctx.fillRect(0, 0, 128, 64);
      
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 52px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      ctx.fillText("0", 32, 32);
      ctx.fillText("1", 96, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);
    setBinaryTexture(texture);
  }, []);

  if (!mounted || !binaryTexture) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-cyber-dark/40 border border-cyber-blue/10">
        <span className="text-xs text-cyber-blue/50 tracking-widest animate-pulse font-mono">// BOOTING SHADER CONDUIT...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[350px] relative border border-cyber-blue/10 bg-cyber-dark/20 flex flex-col items-stretch bracket-container">
      <span className="absolute top-2 left-2 text-[10px] text-cyber-tan/45 select-none pointer-events-none font-mono">+</span>
      <span className="absolute top-2 right-2 text-[10px] text-cyber-tan/45 select-none pointer-events-none font-mono">+</span>
      <span className="absolute bottom-2 left-2 text-[10px] text-cyber-tan/45 select-none pointer-events-none font-mono">+</span>
      <span className="absolute bottom-2 right-2 text-[10px] text-cyber-tan/45 select-none pointer-events-none font-mono">+</span>
      
      <div className="absolute top-4 left-4 z-10 font-mono text-[9px] text-cyber-blue/60 tracking-wider">
        <div>SYS.STREAM_MODE: FIBER_NUMBERS_FLOW</div>
        <div>CONDUITS: ACTIVE [4_NODES]</div>
      </div>

      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
      >
        <ConduitScene texture={binaryTexture} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}

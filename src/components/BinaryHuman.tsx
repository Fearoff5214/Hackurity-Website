"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, shaderMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// 1. Define custom shader material for binary points
const BinaryPointMaterial = shaderMaterial(
  {
    u_time: 0.0,
    u_texture: null,
    u_colorBlue: new THREE.Color("#6366f1"),
    u_colorTan: new THREE.Color("#d2b48c"),
    u_mousePos: new THREE.Vector2(0, 0),
  },
  // Vertex Shader
  `
  uniform float u_time;
  uniform vec2 u_mousePos;
  attribute float a_char;
  attribute float a_offset;
  
  varying float vChar;
  varying float vDist;
  varying float vOffset;
  
  void main() {
    vChar = a_char;
    vOffset = a_offset;
    
    vec3 pos = position;
    
    // Bending factor based on height (head/shoulders sway more than feet)
    // pos.y ranges from -1.8 to 1.6
    float bendFactor = (pos.y + 1.8) / 3.4;
    bendFactor = clamp(bendFactor, 0.0, 1.0);
    
    // Ripple effect based on time and height
    float ripple = sin(pos.y * 4.0 - u_time * 3.5 + a_offset) * 0.04 * (1.0 - bendFactor);
    
    // Smooth curl/bend towards mouse pos
    pos.x += u_mousePos.x * bendFactor * 1.5 + ripple;
    pos.y += u_mousePos.y * bendFactor * 0.5;
    pos.z += (u_mousePos.x * u_mousePos.y) * bendFactor * 0.8;
    
    // Dynamic breathing/noise translation
    pos.x += sin(u_time * 1.8 + a_offset) * 0.015;
    pos.z += cos(u_time * 1.8 + a_offset) * 0.015;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation based on distance to camera + pulse
    float pulse = 1.0 + sin(u_time * 4.0 + a_offset * 12.0) * 0.35;
    gl_PointSize = (48.0 / -mvPosition.z) * pulse;
    
    // Calculate distance to mouse cursor point
    vDist = length(pos - vec3(u_mousePos.x * 2.0, u_mousePos.y * 2.0, 0.0));
  }
  `,
  // Fragment Shader
  `
  uniform sampler2D u_texture;
  uniform vec3 u_colorBlue;
  uniform vec3 u_colorTan;
  uniform float u_time;
  
  varying float vChar;
  varying float vDist;
  varying float vOffset;
  
  void main() {
    // Select left half ('0') or right half ('1') of the canvas texture atlas
    vec2 uv = gl_PointCoord;
    if (vChar < 0.5) {
      uv.x = uv.x * 0.5;
    } else {
      uv.x = uv.x * 0.5 + 0.5;
    }
    
    vec4 texColor = texture2D(u_texture, uv);
    if (texColor.a < 0.15) discard;
    
    // Dynamically morph color between Blue and Tan based on cursor distance
    float colorMix = sin(vDist * 1.8 - u_time * 2.2 + vOffset) * 0.5 + 0.5;
    vec3 finalColor = mix(u_colorBlue, u_colorTan, colorMix);
    
    // Apply extra glow intensity
    gl_FragColor = vec4(finalColor * 2.2, texColor.a);
  }
  `
);

// Humanoid binary points renderer
function HumanParticles({ texture }: { texture: THREE.Texture }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Custom GLSL shader material instance
  const material = useMemo(() => new (BinaryPointMaterial as any)(), []);

  useEffect(() => {
    material.u_texture = texture;
  }, [texture, material]);

  // Symmetrical human point distribution generator
  const { positions, chars, offsets } = useMemo(() => {
    const posArr: number[] = [];
    const charArr: number[] = [];
    const offsetArr: number[] = [];

    const addPoint = (x: number, y: number, z: number) => {
      posArr.push(x, y, z);
      charArr.push(Math.random() < 0.5 ? 0.0 : 1.0);
      offsetArr.push(Math.random() * Math.PI * 2);
    };

    // 1. Head (Sphere, ~250 points)
    for (let i = 0; i < 250; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 0.25 + Math.random() * 0.04;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = 1.15 + r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      addPoint(x, y, z);
    }

    // 2. Torso (Cylinder with waist taper, ~500 points)
    for (let i = 0; i < 500; i++) {
      const y = -0.5 + Math.random() * 1.45; // y from -0.5 to 0.95
      const taper = 0.35 * (1.0 - 0.28 * Math.pow(y - 0.1, 2));
      const r = Math.random() * taper;
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      addPoint(x, y, z);
    }

    // 3. Left Arm (~120 points)
    for (let i = 0; i < 120; i++) {
      const t = Math.random(); // along arm length
      const start = { x: -0.34, y: 0.72, z: 0 };
      const end = { x: -0.85, y: 0.05, z: 0 };
      const x = start.x + (end.x - start.x) * t + (Math.random() - 0.5) * 0.07;
      const y = start.y + (end.y - start.y) * t + (Math.random() - 0.5) * 0.07;
      const z = start.z + (end.z - start.z) * t + (Math.random() - 0.5) * 0.07;
      addPoint(x, y, z);
    }

    // 4. Right Arm (~120 points)
    for (let i = 0; i < 120; i++) {
      const t = Math.random();
      const start = { x: 0.34, y: 0.72, z: 0 };
      const end = { x: 0.85, y: 0.05, z: 0 };
      const x = start.x + (end.x - start.x) * t + (Math.random() - 0.5) * 0.07;
      const y = start.y + (end.y - start.y) * t + (Math.random() - 0.5) * 0.07;
      const z = start.z + (end.z - start.z) * t + (Math.random() - 0.5) * 0.07;
      addPoint(x, y, z);
    }

    // 5. Left Leg (~120 points)
    for (let i = 0; i < 120; i++) {
      const t = Math.random();
      const start = { x: -0.18, y: -0.5, z: 0 };
      const end = { x: -0.2, y: -1.6, z: 0 };
      const x = start.x + (end.x - start.x) * t + (Math.random() - 0.5) * 0.07;
      const y = start.y + (end.y - start.y) * t + (Math.random() - 0.5) * 0.07;
      const z = start.z + (end.z - start.z) * t + (Math.random() - 0.5) * 0.07;
      addPoint(x, y, z);
    }

    // 6. Right Leg (~120 points)
    for (let i = 0; i < 120; i++) {
      const t = Math.random();
      const start = { x: 0.18, y: -0.5, z: 0 };
      const end = { x: 0.2, y: -1.6, z: 0 };
      const x = start.x + (end.x - start.x) * t + (Math.random() - 0.5) * 0.07;
      const y = start.y + (end.y - start.y) * t + (Math.random() - 0.5) * 0.07;
      const z = start.z + (end.z - start.z) * t + (Math.random() - 0.5) * 0.07;
      addPoint(x, y, z);
    }

    return {
      positions: new Float32Array(posArr),
      chars: new Float32Array(charArr),
      offsets: new Float32Array(offsetArr)
    };
  }, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    material.u_time = elapsed;
    
    // Feed normalized mouse coordinates (-1 to 1) into shader uniforms
    material.u_mousePos.copy(state.pointer);

    // Slowly rotate the body cloud
    if (pointsRef.current) {
      pointsRef.current.rotation.y = elapsed * 0.08;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
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

// Scene wrapper with Bloom
function HumanScene({ texture }: { texture: THREE.Texture }) {
  return (
    <>
      <ambientLight intensity={0.02} />
      <pointLight position={[0, 0, 3]} intensity={1.5} color="#6366f1" />
      
      <HumanParticles texture={texture} />

      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.1} 
          luminanceSmoothing={0.9} 
          intensity={2.5}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

// Main component container
export default function BinaryHuman() {
  const [mounted, setMounted] = useState(false);
  const [binaryTexture, setBinaryTexture] = useState<THREE.Texture | null>(null);

  // Generate the '0'/'1' texture atlas on client mount
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
      <div className="w-full h-full min-h-[350px] flex items-center justify-center bg-cyber-dark/40 border border-cyber-blue/10">
        <span className="text-xs text-cyber-blue/50 tracking-widest animate-pulse font-mono">// INITIALIZING SYMMETRICAL CORE...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[350px] relative">
      {/* Corner indicators in Tan */}
      <span className="absolute top-2 left-2 text-[11px] text-cyber-tan/45 select-none pointer-events-none font-mono">+</span>
      <span className="absolute top-2 right-2 text-[11px] text-cyber-tan/45 select-none pointer-events-none font-mono">+</span>
      <span className="absolute bottom-2 left-2 text-[11px] text-cyber-tan/45 select-none pointer-events-none font-mono">+</span>
      <span className="absolute bottom-2 right-2 text-[11px] text-cyber-tan/45 select-none pointer-events-none font-mono">+</span>
      
      <div className="absolute top-4 left-4 z-10 font-mono text-[10px] text-cyber-blue/60 tracking-wider">
        <div>SYS.MODEL: BINARY_HUMANOID_CLOUD</div>
        <div>STATUS: REACTIVE_CURVATURE_ACTIVE</div>
      </div>

      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 45 }}
      >
        <HumanScene texture={binaryTexture} />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
}

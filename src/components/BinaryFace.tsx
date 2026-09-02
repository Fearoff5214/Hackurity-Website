"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

// 1. Define custom shader material for binary face points
const BinaryFaceMaterial = shaderMaterial(
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
  attribute float a_eyeType; // 0 = face, 1 = left eye, 2 = right eye
  
  varying float vChar;
  varying float vDist;
  varying float vOffset;
  
  void main() {
    vChar = a_char;
    vOffset = a_offset;
    
    vec3 pos = position;
    
    // If it is an eye pupil particle (type 1 or 2), offset it to look at cursor
    if (a_eyeType > 0.5) {
      pos.x += u_mousePos.x * 0.055;
      pos.y += u_mousePos.y * 0.045;
    }
    
    // Faint breathing movement
    pos.x += sin(u_time * 1.5 + a_offset) * 0.006;
    pos.y += cos(u_time * 1.5 + a_offset) * 0.006;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Attenuate point size - made smaller for maximum sharpness and readability
    float pulse = 1.0 + sin(u_time * 3.5 + a_offset * 12.0) * 0.25;
    gl_PointSize = (26.0 / -mvPosition.z) * pulse;
    
    vDist = length(pos - vec3(u_mousePos.x, u_mousePos.y, 0.2));
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
    vec2 uv = gl_PointCoord;
    if (vChar < 0.5) {
      uv.x = uv.x * 0.5;
    } else {
      uv.x = uv.x * 0.5 + 0.5;
    }
    
    vec4 texColor = texture2D(u_texture, uv);
    if (texColor.a < 0.15) discard;
    
    // Color morphing based on cursor distance
    float colorMix = sin(vDist * 2.0 - u_time * 1.8 + vOffset) * 0.5 + 0.5;
    vec3 finalColor = mix(u_colorBlue, u_colorTan, colorMix);
    
    gl_FragColor = vec4(finalColor, texColor.a);
  }
  `
);

// Human Face particle cloud
interface FaceParticlesProps {
  texture: THREE.Texture;
  globalMouse: React.RefObject<THREE.Vector2>;
}

function FaceParticles({ texture, globalMouse }: FaceParticlesProps) {
  const groupRef = useRef<THREE.Group>(null);
  const material = useMemo(() => new (BinaryFaceMaterial as any)(), []);

  useEffect(() => {
    material.u_texture = texture;
  }, [texture, material]);

  // Symmetrical Face coordinates generator
  const { positions, chars, offsets, eyeType } = useMemo(() => {
    const posArr: number[] = [];
    const charArr: number[] = [];
    const offsetArr: number[] = [];
    const eyeTypeArr: number[] = [];

    const addPoint = (x: number, y: number, z: number, eye: number) => {
      posArr.push(x, y, z);
      charArr.push(Math.random() < 0.5 ? 0.0 : 1.0);
      offsetArr.push(Math.random() * Math.PI * 2);
      eyeTypeArr.push(eye);
    };

    // 1. Face Mask (Hollowed dome, ~900 points)
    for (let i = 0; i < 900; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random());
      const x = Math.cos(theta) * r * 0.8;
      const y = Math.sin(theta) * r * 1.1;

      const ellipseDist = (x/0.8)*(x/0.8) + (y/1.1)*(y/1.1);
      if (ellipseDist <= 1.0) {
        let z = Math.sqrt(1.0 - ellipseDist) * 0.55;

        const distToLeftEye = Math.sqrt(Math.pow(x + 0.25, 2) + Math.pow(y - 0.25, 2));
        const distToRightEye = Math.sqrt(Math.pow(x - 0.25, 2) + Math.pow(y - 0.25, 2));

        if (distToLeftEye < 0.12 || distToRightEye < 0.12) {
          z -= 0.18;
        }

        if (Math.abs(x) < 0.08 && y > -0.25 && y < 0.15) {
          z += 0.15 * (1.0 - Math.abs(x)/0.08);
        }

        if (y > -0.55 && y < -0.42 && Math.abs(x) < 0.24) {
          z += 0.05 * Math.sin((x + 0.24) / 0.48 * Math.PI);
        }

        addPoint(x, y, z, 0.0);
      }
    }

    // 2. Left Eye Pupil Disc (~100 points)
    for (let i = 0; i < 100; i++) {
      const r = Math.random() * 0.055;
      const angle = Math.random() * Math.PI * 2;
      const x = -0.25 + Math.cos(angle) * r;
      const y = 0.25 + Math.sin(angle) * r;
      const z = 0.42 + (Math.random() - 0.5) * 0.02;
      addPoint(x, y, z, 1.0);
    }

    // 3. Right Eye Pupil Disc (~100 points)
    for (let i = 0; i < 100; i++) {
      const r = Math.random() * 0.055;
      const angle = Math.random() * Math.PI * 2;
      const x = 0.25 + Math.cos(angle) * r;
      const y = 0.25 + Math.sin(angle) * r;
      const z = 0.42 + (Math.random() - 0.5) * 0.02;
      addPoint(x, y, z, 2.0);
    }

    return {
      positions: new Float32Array(posArr),
      chars: new Float32Array(charArr),
      offsets: new Float32Array(offsetArr),
      eyeType: new Float32Array(eyeTypeArr),
    };
  }, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    material.u_time = elapsed;
    
    // Copy the global mouse position into the shader uniform
    if (globalMouse.current) {
      material.u_mousePos.copy(globalMouse.current);
    }

    // Rotational sway based on global mouse position
    if (groupRef.current && globalMouse.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, globalMouse.current.x * 0.35, 0.08);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -globalMouse.current.y * 0.25, 0.08);
    }
  });

  return (
    <group ref={groupRef}>
      <points>
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
          <bufferAttribute
            attach="attributes-a_eyeType"
            args={[eyeType, 1]}
            count={eyeType.length}
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
    </group>
  );
}

// Scene wrapper
function FaceScene({ texture, globalMouse }: { texture: THREE.Texture; globalMouse: React.RefObject<THREE.Vector2> }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 3]} intensity={2.0} color="#6366f1" />
      <FaceParticles texture={texture} globalMouse={globalMouse} />
    </>
  );
}

// Main component container
export default function BinaryFace() {
  const [mounted, setMounted] = useState(false);
  const [binaryTexture, setBinaryTexture] = useState<THREE.Texture | null>(null);
  // Bumped to force a full Canvas remount if the GPU drops the WebGL context
  // (otherwise the canvas is left painted solid white with no way to recover).
  const [canvasKey, setCanvasKey] = useState(0);

  // Ref to hold mouse position normalized from -1 to 1 globally
  const globalMouse = useRef(new THREE.Vector2(0, 0));

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

    // Global document mouse move listener
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      globalMouse.current.set(x, y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (!mounted || !binaryTexture) {
    return (
      <div className="w-full h-full min-h-[350px] flex items-center justify-center bg-cyber-dark/40 border border-cyber-blue/10">
        <span className="text-xs text-cyber-blue/50 tracking-widest animate-pulse font-mono">// INITIALIZING COGNITIVE CORE...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[350px] relative">
      <span className="absolute top-2 left-2 text-[13px] text-cyber-tan/45 select-none pointer-events-none font-mono">+</span>
      <span className="absolute top-2 right-2 text-[13px] text-cyber-tan/45 select-none pointer-events-none font-mono">+</span>
      <span className="absolute bottom-2 left-2 text-[13px] text-cyber-tan/45 select-none pointer-events-none font-mono">+</span>
      <span className="absolute bottom-2 right-2 text-[13px] text-cyber-tan/45 select-none pointer-events-none font-mono">+</span>
      
      <div className="absolute top-4 left-4 z-10 font-mono text-[12px] text-cyber-blue/60 tracking-wider">
        <div>SYS.MODEL: COGNITIVE_EYE_TRACKING_3D</div>
        <div>STATUS: GLOBAL_LOOK_ACTIVE</div>
      </div>

      <Canvas
        key={canvasKey}
        camera={{ position: [0, 0, 2.2], fov: 45 }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            setCanvasKey((key) => key + 1);
          });
        }}
      >
        <FaceScene texture={binaryTexture} globalMouse={globalMouse} />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
}

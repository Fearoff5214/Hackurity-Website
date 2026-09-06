"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { HackerRoomLights, HackerRoomMesh } from "@/components/HackerRoomModel";

// Full-bleed background diorama — reacts to the cursor instead of needing a
// click-drag: move the mouse anywhere on the page and the room tilts toward
// it (same global-mousemove-plus-lerp mechanic as BinaryFace's eye-tracking
// face). Purely atmospheric, so the canvas stays pointer-events-none; the
// mouse position is read from `window`, not from hovering the canvas itself.
export default function HackerRoomBackground() {
  const [mounted, setMounted] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);
  const globalMouse = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (event: MouseEvent) => {
      globalMouse.current.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!mounted) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 opacity-[0.45]">
      <Canvas
        key={canvasKey}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 2], fov: 38 }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            setCanvasKey((key) => key + 1);
          });
        }}
      >
        <HackerRoomLights />
        <React.Suspense fallback={null}>
          <HackerRoomMesh globalMouse={globalMouse} baseYaw={Math.PI / 2} xOffset={0.4} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}

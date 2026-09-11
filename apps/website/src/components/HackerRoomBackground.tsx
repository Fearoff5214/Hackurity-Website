"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import {
  HACKER_ROOM_MODEL_PATH,
  HackerRoomLights,
  HackerRoomMesh,
} from "@/components/HackerRoomModel";

// Kept as stable module-level constants rather than inline object literals.
// `Home` (the page component that mounts this) re-renders continuously —
// a couple of typing-placeholder animations elsewhere on the page tick a
// setInterval every 75-110ms for the component's entire lifetime — and a
// fresh `{...}` literal on every one of those re-renders reads to R3F's
// <Canvas> as new `gl`/`camera` config, making it reset the renderer/camera
// dozens of times a second. That's what made the room flicker in and out
// rather than settling: the WebGL context was being fought over faster than
// it could ever finish a stable frame.
const GL_CONFIG = { antialias: false, alpha: true, powerPreference: "high-performance" as const };
const CAMERA_CONFIG = { position: [0, 0, 2] as [number, number, number], fov: 38 };
const DPR_RANGE: [number, number] = [1, 1.5];

// Full-bleed background diorama — reacts to the cursor instead of needing a
// click-drag: move the mouse anywhere on the page and the room tilts toward
// it (same global-mousemove-plus-lerp mechanic as BinaryFace's eye-tracking
// face). Purely atmospheric, so the canvas stays pointer-events-none; the
// mouse position is read from `window`, not from hovering the canvas itself.
//
// Memoized because it takes no props — there's nothing about it that should
// ever need to change when an unrelated ancestor's state (like that typing
// placeholder) re-renders. Without this, every one of those ticks re-runs
// this component's whole body for no reason.
function HackerRoomBackground() {
  const [mounted, setMounted] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);
  const globalMouse = useRef(new THREE.Vector2(0, 0));
  const createdRef = useRef(false);

  // Watchdog: WebGL context creation for this canvas has been observed to
  // silently never complete — no `onCreated`, no `webglcontextlost`, no
  // console output, just a canvas stuck at the browser's un-sized 300x150
  // default forever. Remounting the <Canvas> (a fresh `key`) reliably
  // recovers when this happens, so if `onCreated` hasn't fired shortly
  // after mount, force that remount rather than leaving a permanently dead
  // background.
  useEffect(() => {
    if (!mounted) return;
    createdRef.current = false;
    const timer = window.setTimeout(() => {
      if (createdRef.current) return;
      // drei caches the GLTFLoader per URL at module scope, shared across
      // every mount — if a load ever gets stuck, a bare Canvas remount
      // would just suspend on that same cached (stuck) loader again.
      // Clearing it first forces a genuinely fresh GLTFLoader on retry.
      useGLTF.clear(HACKER_ROOM_MODEL_PATH);
      setCanvasKey((key) => key + 1);
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [mounted, canvasKey]);

  useEffect(() => {
    // `md:block` alone would only hide the canvas visually — the WebGL
    // context, GLB fetch and render loop would still run underneath on
    // phones. Gating the mount itself on a real media query is what
    // actually skips the cost there, matching every other 3D piece on the
    // page (all `hidden md:block` / `hidden lg:block` at the JSX level, but
    // none of them are otherwise this expensive to just leave mounted).
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setMounted(query.matches);
    update();
    query.addEventListener("change", update);

    const handleMouseMove = (event: MouseEvent) => {
      globalMouse.current.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      query.removeEventListener("change", update);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 opacity-[0.45]">
      <Canvas
        key={canvasKey}
        dpr={DPR_RANGE}
        gl={GL_CONFIG}
        camera={CAMERA_CONFIG}
        onCreated={({ gl, camera }) => {
          createdRef.current = true;
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            setCanvasKey((key) => key + 1);
          });
          // Belt-and-suspenders against R3F's ResizeObserver-based auto-sizing
          // getting stuck at the canvas's 300x150 HTML default: it measures
          // the *container* div, and on this fixed-position, full-viewport
          // background that observer has been seen to fire once with a stale
          // zero-ish rect and then never again (nothing about the container's
          // own box ever changes size again to trigger a second callback).
          // Since this canvas is always exactly the viewport by construction
          // (`fixed inset-0`), sizing it directly off `window.innerWidth/
          // innerHeight` sidesteps that observer entirely.
          const resize = () => {
            gl.setSize(window.innerWidth, window.innerHeight);
            const cam = camera as THREE.PerspectiveCamera;
            if (cam.isPerspectiveCamera) {
              cam.aspect = window.innerWidth / window.innerHeight;
              cam.updateProjectionMatrix();
            }
          };
          resize();
          window.addEventListener("resize", resize);
        }}
      >
        <HackerRoomLights />
        <React.Suspense fallback={null}>
          <HackerRoomMesh globalMouse={globalMouse} baseYaw={-Math.PI / 4} xOffset={0} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}

export default React.memo(HackerRoomBackground);

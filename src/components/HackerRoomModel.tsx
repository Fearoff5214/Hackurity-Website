"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export const HACKER_ROOM_MODEL_PATH = "/models/hacker-room.glb";

// Target size (world units) the model's longest dimension is normalized to.
const TARGET_SIZE = 1.35;
// Extra horizontal stretch — scales local X/Z (the room's footprint) without
// touching Y, so it reads as "wider" from any yaw rather than just "bigger"
// in every direction (which just moving TARGET_SIZE up would do).
const WIDTH_SCALE = 1.3;

useGLTF.preload(HACKER_ROOM_MODEL_PATH);

// Original download was a 6.6 MB Sketchfab "low poly hacker room" export —
// 26 mostly-1024px JPEGs plus a legacy KHR_materials_pbrSpecularGlossiness
// workflow that three.js's current GLTFLoader doesn't understand (it's not
// a core-supported extension anymore — the loader would've silently
// dropped every texture using it). Converted to standard metal/rough via
// `gltf-transform metalrough`, then weld + simplify + WebP, down to 1.13 MB.
// Deliberately *not* Draco-compressed: Draco geometry decode runs on a
// dedicated Web Worker, and that worker was observed to occasionally never
// resolve — no error, no timeout, just a permanently blank canvas with the
// model's Suspense boundary stuck pending forever. The geometry here is
// tiny (~15k vertices) — a few hundred KB uncompressed — so decode-worker
// reliability wasn't worth trading for the size savings.
//
// The geometry itself is already small (~15k vertices) and roughly
// centered near the origin, but not exactly — nested groups below center
// it on its own bounding-box center so rotation pivots correctly regardless.
export function HackerRoomMesh({
  globalMouse,
  autoSpin = false,
  spinSpeed = 0.15,
  baseYaw = 0,
  xOffset = 0,
}: {
  /** Normalized (-1..1) mouse position, updated by a global `mousemove`
   * listener elsewhere — same mechanic as BinaryFace's cursor tracking, so
   * the room subtly tilts toward wherever the cursor is on the page instead
   * of needing a click-drag to orbit. */
  globalMouse?: React.RefObject<THREE.Vector2>;
  autoSpin?: boolean;
  spinSpeed?: number;
  /** Resting yaw (radians) shown before the mouse moves — lets the "front"
   * of the room face the camera on load instead of whatever angle it
   * happened to be authored at. */
  baseYaw?: number;
  /** Shifts the room sideways in world space (pure translation) — moving
   * the *camera* off-axis instead would also change the viewing angle,
   * which is what made the room look skewed rather than shifted. */
  xOffset?: number;
}) {
  const { scene } = useGLTF(HACKER_ROOM_MODEL_PATH);
  // useGLTF caches and shares this scene object across every consumer of the
  // same URL. Rendering it directly via <primitive> means React's dev-mode
  // double-render (Strict Mode) can reparent the *shared* object away from
  // this instance mid-mount, leaving it with no children — an intermittent
  // blank canvas that isn't a real WebGL/context problem. Cloning it per
  // mount gives this instance its own object to own.
  //
  // The fit (scale/centering) is measured here too, on the clone *before*
  // it's ever parented under the rotating `outerRef` group below. Measuring
  // later via an effect + Box3.setFromObject on the live scene graph walks
  // up to that ancestor's current world matrix — and since useFrame's rAF
  // loop can tick (and start lerping outerRef's rotation) before a passive
  // effect fires, the measured box was sometimes taken mid-rotation. That
  // produced a different, often-wrong scale/offset on every load — anywhere
  // from a merely oversized crop to a fit so off the room sat entirely
  // outside the camera frustum (an "invisible" background). Measuring the
  // detached clone sidesteps the race entirely.
  const { clonedScene, fitScale, fitOffset } = useMemo(() => {
    const clone = scene.clone();
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = maxDim > 0 ? TARGET_SIZE / maxDim : 1;
    return {
      clonedScene: clone,
      fitScale: new THREE.Vector3(scale * WIDTH_SCALE, scale, scale * WIDTH_SCALE),
      fitOffset: new THREE.Vector3(-center.x * scale, -center.y * scale, -center.z * scale),
    };
  }, [scene]);
  const outerRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const group = outerRef.current;
    if (!group) return;
    group.position.x = xOffset;
    if (autoSpin) group.rotation.y += delta * spinSpeed;
    if (globalMouse?.current) {
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, baseYaw + globalMouse.current.x * 1.1, 0.1);
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -globalMouse.current.y * 0.6, 0.1);
    }
  });

  return (
    <group ref={outerRef}>
      <group scale={fitScale} position={fitOffset}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

// Plain three-point lighting — the room's materials are diffuse/lambert
// with baked-looking textures, not a highly metallic surface that would
// need a reflective environment map to read correctly.
export function HackerRoomLights() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 4]} intensity={1.3} color="#f2ddba" />
      <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#6366f1" />
    </>
  );
}

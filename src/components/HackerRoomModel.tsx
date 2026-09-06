"use client";

import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export const HACKER_ROOM_DRACO_PATH = "/draco/";
export const HACKER_ROOM_MODEL_PATH = "/models/hacker-room.glb";

useGLTF.preload(HACKER_ROOM_MODEL_PATH, HACKER_ROOM_DRACO_PATH);

// Original download was a 6.6 MB Sketchfab "low poly hacker room" export —
// 26 mostly-1024px JPEGs plus a legacy KHR_materials_pbrSpecularGlossiness
// workflow that three.js's current GLTFLoader doesn't understand (it's not
// a core-supported extension anymore — the loader would've silently
// dropped every texture using it). Converted to standard metal/rough via
// `gltf-transform metalrough`, then the usual weld + simplify + Draco +
// WebP pass, down to 1.06 MB.
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
  const { scene } = useGLTF(HACKER_ROOM_MODEL_PATH, HACKER_ROOM_DRACO_PATH);
  const outerRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = maxDim > 0 ? 2.4 / maxDim : 1;
    const inner = innerRef.current;
    if (inner) {
      inner.scale.setScalar(scale);
      inner.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    }
  }, [scene]);

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
      <group ref={innerRef}>
        <primitive object={scene} />
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

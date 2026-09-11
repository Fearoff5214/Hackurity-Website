"use client";
/**
 * ThreatGlobeField
 * ----------------------------------------------------------------------------
 * A single fixed-position canvas that renders:
 *   1. a 3D wireframe "threat globe" (lat/long grid + threat nodes + attack
 *      arcs) that parallaxes with the cursor,
 *   2. the falling binary rain, laid out around the globe so the globe owns its
 *      space and the binary fills whatever is left,
 *   3. per-glyph disturbance: binary digits that travel across the globe disc
 *      randomly tilt, rotate, speed up and flicker, then settle again.
 *
 * Drop-in replacement for BinaryFlowField (no extra dependencies).
 */
import { useEffect, useRef } from "react";

type Glyph = {
  x: number;
  y: number;
  speed: number;
  baseSpeed: number;
  char: string;
  alpha: number;
  size: number;
  rot: number;
  spin: number;
  tilt: number;
  flicker: number;
  disturbed: boolean;
};

type Node = { lat: number; lon: number; pulse: number; threat: boolean };
type Arc = { from: Node; to: Node; t: number; speed: number };

const TAU = Math.PI * 2;
const rand = (a: number, b: number) => a + Math.random() * (b - a);

export default function ThreatGlobeField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;

    // globe geometry (screen space)
    let cx = 0;
    let cy = 0;
    let radius = 0;

    // cursor parallax
    const pointer = { x: 0.5, y: 0.5 };
    const eased = { x: 0.5, y: 0.5 };

    let glyphs: Glyph[] = [];
    const nodes: Node[] = [];
    const arcs: Arc[] = [];

    for (let i = 0; i < 70; i += 1) {
      nodes.push({
        lat: Math.acos(rand(-1, 1)) - Math.PI / 2,
        lon: rand(0, TAU),
        pulse: Math.random() * TAU,
        threat: Math.random() < 0.35,
      });
    }
    for (let i = 0; i < 10; i += 1) {
      const from = nodes[Math.floor(Math.random() * nodes.length)]!;
      const to = nodes[Math.floor(Math.random() * nodes.length)]!;
      arcs.push({ from, to, t: Math.random(), speed: rand(0.0025, 0.006) });
    }

    const buildGlyphs = () => {
      const columnWidth = 22;
      const columns = Math.max(12, Math.floor(w / columnWidth));
      glyphs = [];

      for (let c = 0; c < columns; c += 1) {
        const x = c * columnWidth + columnWidth / 2;
        // the globe owns its disc: thin out the columns that cross it so the
        // binary reads as flowing *around* and *through* it, not over it.
        const crossesGlobe = Math.abs(x - cx) < radius * 1.05;
        const perColumn = crossesGlobe ? 3 : 7;

        for (let i = 0; i < perColumn; i += 1) {
          const baseSpeed = rand(0.35, 1.15);
          glyphs.push({
            x: x + rand(-5, 5),
            y: rand(-h, h),
            speed: baseSpeed,
            baseSpeed,
            char: Math.random() < 0.5 ? "0" : "1",
            alpha: rand(0.12, crossesGlobe ? 0.35 : 0.5),
            size: rand(10, 15),
            rot: 0,
            spin: 0,
            tilt: 0,
            flicker: 1,
            disturbed: false,
          });
        }
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      radius = Math.min(w, h) * (w < 768 ? 0.3 : 0.26);
      cx = w < 768 ? w * 0.5 : w * 0.68;
      cy = h * 0.5;
      buildGlyphs();
    };

    const onPointer = (event: PointerEvent) => {
      pointer.x = event.clientX / window.innerWidth;
      pointer.y = event.clientY / window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    let time = 0;

    const project = (lat: number, lon: number, yaw: number, pitch: number) => {
      // unit sphere -> yaw (y axis) -> pitch (x axis) -> orthographic
      const cosLat = Math.cos(lat);
      let x = cosLat * Math.cos(lon + yaw);
      let y = Math.sin(lat);
      let z = cosLat * Math.sin(lon + yaw);

      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const y2 = y * cp - z * sp;
      const z2 = y * sp + z * cp;
      y = y2;
      z = z2;

      const depth = (z + 1) / 2; // 0 = back, 1 = front
      return { sx: cx + x * radius, sy: cy + y * radius, depth };
    };

    const drawGlobe = (yaw: number, pitch: number) => {
      // faint halo
      const halo = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.5);
      halo.addColorStop(0, "rgba(120, 200, 255, 0.07)");
      halo.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.5, 0, TAU);
      ctx.fill();

      ctx.lineWidth = 1;

      // parallels
      for (let i = 1; i < 9; i += 1) {
        const lat = -Math.PI / 2 + (i * Math.PI) / 9;
        ctx.beginPath();
        for (let s = 0; s <= 72; s += 1) {
          const { sx, sy } = project(lat, (s / 72) * TAU, yaw, pitch);
          if (s === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = "rgba(120, 200, 255, 0.11)";
        ctx.stroke();
      }

      // meridians
      for (let i = 0; i < 12; i += 1) {
        const lon = (i / 12) * TAU;
        ctx.beginPath();
        for (let s = 0; s <= 48; s += 1) {
          const lat = -Math.PI / 2 + (s / 48) * Math.PI;
          const { sx, sy } = project(lat, lon, yaw, pitch);
          if (s === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = "rgba(120, 200, 255, 0.09)";
        ctx.stroke();
      }

      // rim
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, TAU);
      ctx.strokeStyle = "rgba(214, 188, 138, 0.22)";
      ctx.stroke();

      // threat nodes
      for (const node of nodes) {
        const { sx, sy, depth } = project(node.lat, node.lon, yaw, pitch);
        if (depth < 0.5) continue;
        const pulse = 0.5 + 0.5 * Math.sin(time * 0.05 + node.pulse);
        const r = (node.threat ? 2.1 : 1.3) + pulse * 1.4;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, TAU);
        ctx.fillStyle = node.threat
          ? `rgba(255, 120, 90, ${0.25 + depth * 0.5 * pulse})`
          : `rgba(140, 210, 255, ${0.2 + depth * 0.4})`;
        ctx.fill();
      }

      // attack arcs
      for (const arc of arcs) {
        arc.t += arc.speed;
        if (arc.t > 1) {
          arc.t = 0;
          arc.from = nodes[Math.floor(Math.random() * nodes.length)]!;
          arc.to = nodes[Math.floor(Math.random() * nodes.length)]!;
        }
        const a = project(arc.from.lat, arc.from.lon, yaw, pitch);
        const b = project(arc.to.lat, arc.to.lon, yaw, pitch);
        if (a.depth < 0.45 && b.depth < 0.45) continue;

        const mx = (a.sx + b.sx) / 2 + (cx - (a.sx + b.sx) / 2) * -0.25;
        const my = (a.sy + b.sy) / 2 + (cy - (a.sy + b.sy) / 2) * -0.25;

        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.quadraticCurveTo(mx, my, b.sx, b.sy);
        ctx.strokeStyle = "rgba(255, 130, 95, 0.14)";
        ctx.stroke();

        // travelling packet
        const t = arc.t;
        const px = (1 - t) * (1 - t) * a.sx + 2 * (1 - t) * t * mx + t * t * b.sx;
        const py = (1 - t) * (1 - t) * a.sy + 2 * (1 - t) * t * my + t * t * b.sy;
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, TAU);
        ctx.fillStyle = "rgba(255, 190, 140, 0.75)";
        ctx.fill();
      }
    };

    const drawBinary = () => {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (const g of glyphs) {
        const dx = g.x - cx;
        const dy = g.y - cy;
        const inside = dx * dx + dy * dy < radius * radius;

        if (inside) {
          if (!g.disturbed) {
            // entering the globe: kick it
            g.disturbed = true;
            g.spin = rand(-0.12, 0.12);
            g.tilt = rand(-0.5, 0.5);
            g.speed = g.baseSpeed * rand(1.8, 3.6);
          }
          g.rot += g.spin;
          g.flicker = Math.random() < 0.22 ? rand(0.1, 0.4) : rand(0.8, 1.4);
        } else if (g.disturbed) {
          // leaving the globe: settle back down
          g.disturbed = false;
          g.spin = 0;
          g.speed = g.baseSpeed;
          g.flicker = 1;
          g.rot *= 0.2;
          g.tilt = 0;
        }

        g.y += g.speed;
        if (g.y - 20 > h) {
          g.y = -20;
          g.x += rand(-2, 2);
          g.char = Math.random() < 0.5 ? "0" : "1";
        }

        const alpha = Math.min(1, g.alpha * g.flicker);
        ctx.save();
        ctx.translate(g.x, g.y);
        if (g.rot || g.tilt) {
          ctx.rotate(g.rot);
          ctx.transform(1, 0, g.tilt, 1, 0, 0); // shear = tilt
        }
        ctx.font = `${g.size}px ui-monospace, monospace`;
        ctx.fillStyle = g.disturbed
          ? `rgba(214, 188, 138, ${alpha})`
          : `rgba(120, 200, 255, ${alpha})`;
        ctx.fillText(g.char, 0, 0);
        ctx.restore();
      }
    };

    const frame = () => {
      time += 1;

      // eased cursor parallax
      eased.x += (pointer.x - eased.x) * 0.06;
      eased.y += (pointer.y - eased.y) * 0.06;

      const yaw = time * (reduced ? 0 : 0.0016) + (eased.x - 0.5) * 1.1;
      const pitch = (eased.y - 0.5) * -0.7;

      ctx.clearRect(0, 0, w, h);
      drawGlobe(yaw, pitch);
      drawBinary();

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}

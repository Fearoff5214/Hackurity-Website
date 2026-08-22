"use client";

import React, { useRef, useEffect, useState } from "react";

interface Particle {
  x: number;
  y: number;
  speed: number;
  progress: number;
  pathIndex: number;
}

export default function ReactorCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [feedMode, setFeedMode] = useState<"SIMULATION" | "CAMERA_FEED">("SIMULATION");

  // Handle responsive resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight || 450,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (feedMode !== "SIMULATION") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const paths = [
      [
        { x: 0.1, y: 0.2 },
        { x: 0.35, y: 0.2 },
        { x: 0.42, y: 0.4 },
      ],
      [
        { x: 0.1, y: 0.8 },
        { x: 0.35, y: 0.8 },
        { x: 0.42, y: 0.6 },
      ],
      [
        { x: 0.9, y: 0.2 },
        { x: 0.65, y: 0.2 },
        { x: 0.58, y: 0.4 },
      ],
      [
        { x: 0.9, y: 0.8 },
        { x: 0.65, y: 0.8 },
        { x: 0.58, y: 0.6 },
      ],
      [
        { x: 0.5, y: 1.0 },
        { x: 0.5, y: 0.75 },
      ]
    ];

    const particles: Particle[] = [];
    const maxParticles = 40;
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: 0,
        y: 0,
        speed: 0.003 + Math.random() * 0.005,
        progress: Math.random(),
        pathIndex: Math.floor(Math.random() * paths.length),
      });
    }

    const render = () => {
      const { width, height } = canvas;
      
      // Clear canvas
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Floor grid lines (Faint Blue Grid)
      ctx.strokeStyle = "rgba(99, 102, 241, 0.04)";
      ctx.lineWidth = 1;
      const centerY = height / 2;
      const centerX = width / 2;

      ctx.beginPath();
      for (let angle = 0; angle <= Math.PI; angle += Math.PI / 12) {
        const xFloor = centerX + Math.cos(angle) * width * 1.5;
        const yFloor = height;
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(xFloor, yFloor);

        const yCeil = 0;
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(xFloor, yCeil);
      }
      ctx.stroke();

      ctx.beginPath();
      for (let i = 1; i <= 6; i++) {
        const factor = (i / 6) * (i / 6);
        const y = centerY + factor * centerY;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);

        const yTop = centerY - factor * centerY;
        ctx.moveTo(0, yTop);
        ctx.lineTo(width, yTop);
      }
      ctx.stroke();

      ctx.strokeStyle = "rgba(99, 102, 241, 0.1)";
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.arc(centerX, centerY, height * 0.45, 0, Math.PI * 2);
      ctx.stroke();

      // Symmetrical tubes - Removed shadowBlur to maintain crisp sharp lines
      paths.forEach((path) => {
        ctx.beginPath();
        path.forEach((pt, idx) => {
          const x = pt.x * width;
          const y = pt.y * height;
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        
        ctx.strokeStyle = "rgba(99, 102, 241, 0.25)";
        ctx.lineWidth = 6;
        ctx.stroke();
        
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      const coreW = width * 0.12;
      const coreH = height * 0.52;
      const coreX = centerX - coreW / 2;
      const coreY = centerY - coreH / 2;

      ctx.fillStyle = "rgba(99, 102, 241, 0.05)";
      ctx.fillRect(coreX, coreY, coreW, coreH);
      
      ctx.strokeStyle = "rgba(210, 180, 140, 0.5)";
      ctx.lineWidth = 2;
      ctx.strokeRect(coreX - 2, coreY - 2, coreW + 4, coreH + 4);

      const pulseH = coreH * (0.4 + Math.sin(time * 0.08) * 0.1);
      const gradient = ctx.createLinearGradient(0, coreY + coreH, 0, coreY + coreH - pulseH);
      gradient.addColorStop(0, "rgba(99, 102, 241, 0.6)");
      gradient.addColorStop(0.5, "rgba(99, 102, 241, 0.4)");
      gradient.addColorStop(1, "rgba(99, 102, 241, 0.05)");
      
      ctx.fillStyle = gradient;
      ctx.fillRect(coreX + 4, coreY + coreH - pulseH, coreW - 8, pulseH);

      ctx.strokeStyle = "rgba(99, 102, 241, 0.3)";
      ctx.lineWidth = 1;
      for (let sy = coreY + 20; sy < coreY + coreH; sy += 25) {
        ctx.beginPath();
        ctx.moveTo(coreX, sy);
        ctx.lineTo(coreX + coreW, sy);
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(210, 180, 140, 0.7)";
      ctx.lineWidth = 3;
      
      ctx.beginPath();
      ctx.moveTo(coreX - 15, coreY + 10);
      ctx.lineTo(coreX - 35, coreY + 25);
      ctx.lineTo(coreX - 35, coreY + coreH - 25);
      ctx.lineTo(coreX - 15, coreY + coreH - 10);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(coreX + coreW + 15, coreY + 10);
      ctx.lineTo(coreX + coreW + 35, coreY + 25);
      ctx.lineTo(coreX + coreW + 35, coreY + coreH - 25);
      ctx.lineTo(coreX + coreW + 15, coreY + coreH - 10);
      ctx.stroke();

      // Flowing Particles - Removed shadowBlur to prevent fuzziness
      particles.forEach((p) => {
        const path = paths[p.pathIndex];
        
        const segmentCount = path.length - 1;
        const rawProgress = p.progress * segmentCount;
        const segmentIndex = Math.floor(rawProgress);
        const segmentProgress = rawProgress - segmentIndex;

        if (segmentIndex < segmentCount) {
          const startPt = path[segmentIndex];
          const endPt = path[segmentIndex + 1];
          
          p.x = startPt.x * width + (endPt.x * width - startPt.x * width) * segmentProgress;
          p.y = startPt.y * height + (endPt.y * height - startPt.y * height) * segmentProgress;
        }

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#6366f1";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        p.progress += p.speed;
        if (p.progress >= 1.0) {
          p.progress = 0;
          p.pathIndex = Math.floor(Math.random() * paths.length);
        }
      });

      ctx.fillStyle = "rgba(210, 180, 140, 0.65)";
      ctx.font = "8.5px monospace";
      ctx.fillText("SHIELD FREQUENCY: 44.82Hz", coreX - 85, coreY + 50);
      ctx.fillText("DECRYPT_IDX: AES-256", coreX - 85, coreY + 65);
      ctx.fillText("CORE_LOAD: ACTIVE_88%", coreX - 85, coreY + 80);

      ctx.fillText("THREAT_MATRIX: ONLINE", coreX + coreW + 45, coreY + 50);
      ctx.fillText("SHIELD_ALIGN: 99.88%", coreX + coreW + 45, coreY + 65);
      ctx.fillText("COOLANT_LINE: NOMINAL", coreX + coreW + 45, coreY + 80);

      const rX = width * 0.22;
      const rY = centerY;
      ctx.strokeStyle = "rgba(99, 102, 241, 0.2)";
      ctx.beginPath();
      ctx.arc(rX, rY, 35, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "#6366f1";
      ctx.beginPath();
      ctx.arc(rX, rY, 35, time * 0.02, time * 0.02 + Math.PI * 0.6);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(rX, rY, 35, time * 0.02 + Math.PI, time * 0.02 + Math.PI * 1.5);
      ctx.stroke();

      const rrX = width * 0.78;
      const rrY = centerY;
      ctx.strokeStyle = "rgba(99, 102, 241, 0.2)";
      ctx.beginPath();
      ctx.arc(rrX, rrY, 35, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "#6366f1";
      ctx.beginPath();
      ctx.arc(rrX, rrY, 35, -time * 0.03, -time * 0.03 + Math.PI * 0.8);
      ctx.stroke();

      ctx.strokeStyle = "rgba(99, 102, 241, 0.6)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let lx = coreX; lx <= coreX + coreW; lx++) {
        const ly = coreY + coreH + 15 + Math.sin(lx * 0.2 + time * 0.1) * 3;
        if (lx === coreX) ctx.moveTo(lx, ly);
        else ctx.lineTo(lx, ly);
      }
      ctx.stroke();

      time += 0.5;
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions, feedMode]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] relative bg-black select-none">
      {/* Outer framing brackets (Tan brackets) */}
      <div className="absolute inset-0 border border-cyber-blue/25 pointer-events-none">
        <span className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-tan" />
        <span className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-tan" />
        <span className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-tan" />
        <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-tan" />
      </div>

      {/* Top Left: System Status HUD overlay */}
      <div className="absolute top-6 left-6 z-30 font-mono text-[10px] text-cyber-tan tracking-wider bg-black p-3 border border-cyber-tan/25">
        <div className="font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-cyber-tan rounded-full animate-pulse" />
          <span>REACTOR // STATE: CORE_PRESSURIZED</span>
        </div>
        <div className="mt-1 text-cyber-gray">SHIELD_ALIGN: 99.88%</div>
        <div className="text-cyber-gray">DECRYPTION: AES-256</div>
        <div className="text-cyber-gray font-bold">MODE: {feedMode}</div>
        
        {/* Feed toggles */}
        <div className="mt-3 flex gap-2">
          <button 
            onClick={() => setFeedMode("SIMULATION")}
            className={`px-2 py-0.5 border text-[9px] cursor-pointer tracking-wider transition-all duration-200 ${
              feedMode === "SIMULATION" 
                ? "border-cyber-tan bg-cyber-tan/10 text-cyber-tan" 
                : "border-cyber-tan/20 text-cyber-tan/50 hover:text-cyber-tan"
            }`}
          >
            SIMULATE
          </button>
          <button 
            onClick={() => setFeedMode("CAMERA_FEED")}
            className={`px-2 py-0.5 border text-[9px] cursor-pointer tracking-wider transition-all duration-200 ${
              feedMode === "CAMERA_FEED" 
                ? "border-cyber-tan bg-cyber-tan/10 text-cyber-tan" 
                : "border-cyber-tan/20 text-cyber-tan/50 hover:text-cyber-tan"
            }`}
          >
            CCTV_FEED
          </button>
        </div>
      </div>

      {/* Top Right: Active Terminal Number Overlay */}
      <div className="absolute top-6 right-6 z-30 font-heading text-lg md:text-xl text-cyber-tan flex flex-col items-end">
        <span className="tracking-widest font-bold font-heading">NO-45</span>
        <span className="font-mono text-[9px] text-cyber-gray tracking-wider mt-1 select-none">ACTIVE TERMINAL UNIT</span>
      </div>

      {/* Center Canvas or Camera feed */}
      {feedMode === "SIMULATION" ? (
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-full"
        />
      ) : (
        <div 
          className="w-full h-full absolute inset-0 bg-cover bg-center transition-all duration-700 relative z-10"
          style={{ 
            backgroundImage: "url('/images/quantum_server_room.png')",
            filter: "hue-rotate(130deg) saturate(1.8) contrast(1.05)"
          }}
        >
          {/* CCTV Camera - Clean without blurry scanlines */}
          <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-black px-3 py-1.5 border border-red-500/30 text-red-400 font-mono text-[10px] tracking-wider z-20">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <span>CAM_01 [REC]</span>
          </div>
        </div>
      )}

      {/* Bottom overlay loading indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-2/3 max-w-sm bg-black p-2 border border-cyber-blue/20 text-center font-mono text-[9px] text-cyber-blue tracking-widest uppercase z-30">
        <div className="mb-1 flex justify-between px-1">
          <span>PRESSURIZATION SEQUENCER</span>
          <span className="animate-pulse">LOADING</span>
        </div>
        <div className="w-full h-1 bg-cyber-blue-dim relative overflow-hidden">
          <div className="absolute top-0 bottom-0 left-0 bg-cyber-blue" style={{ width: "94%" }} />
        </div>
      </div>
    </div>
  );
}

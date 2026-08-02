"use client";

import React, { useRef, useEffect, useState } from "react";

interface Node {
  x: number;
  y: number;
  id: number;
  isCenter: boolean;
}

interface Waypoint {
  x: number;
  y: number;
}

interface Packet {
  x: number;
  y: number;
  path: Waypoint[];
  currentSegment: number;
  segmentProgress: number; // 0 to 1
  speed: number;
  color: string;
  isDdos: boolean;
}

export default function ThreatMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDdos, setIsDdos] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  // Handle responsive resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight || 400,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    const width = dimensions.width;
    const height = dimensions.height;

    // Generate static nodes (faint network nodes)
    const nodes: Node[] = [];
    const nodeCount = 90;
    
    // Define a central node as target for DDoS
    const centerNode: Node = {
      x: width / 2,
      y: height / 2,
      id: 0,
      isCenter: true,
    };
    nodes.push(centerNode);

    // Generate other distributed nodes
    for (let i = 1; i < nodeCount; i++) {
      nodes.push({
        x: 40 + Math.random() * (width - 80),
        y: 40 + Math.random() * (height - 80),
        id: i,
        isCenter: false,
      });
    }

    // Helper: calculate 0, 45, or 90-degree geometric paths
    const calculateGeometricPath = (n1: Node, n2: Node): Waypoint[] => {
      const path: Waypoint[] = [{ x: n1.x, y: n1.y }];
      const dx = n2.x - n1.x;
      const dy = n2.y - n1.y;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (absDx > absDy) {
        // Step 1: Go diagonally at 45 degrees
        const diagX = n1.x + Math.sign(dx) * absDy;
        const diagY = n1.y + Math.sign(dy) * absDy;
        path.push({ x: diagX, y: diagY });
        // Step 2: Go horizontally (0 degrees) to target
        path.push({ x: n2.x, y: n2.y });
      } else {
        // Step 1: Go diagonally at 45 degrees
        const diagX = n1.x + Math.sign(dx) * absDx;
        const diagY = n1.y + Math.sign(dy) * absDx;
        path.push({ x: diagX, y: diagY });
        // Step 2: Go vertically (90 degrees) to target
        path.push({ x: n2.x, y: n2.y });
      }
      return path;
    };

    // Initialize regular network packets
    let packets: Packet[] = [];
    const maxNormalPackets = 55;

    const createPacket = (isDdosMode = false): Packet => {
      const startIdx = Math.floor(Math.random() * nodes.length);
      const startNode = nodes[startIdx];
      
      let endNode = startNode;
      if (isDdosMode) {
        endNode = centerNode; // converge on center
      } else {
        while (endNode.id === startNode.id) {
          const endIdx = Math.floor(Math.random() * nodes.length);
          endNode = nodes[endIdx];
        }
      }

      const path = calculateGeometricPath(startNode, endNode);
      return {
        x: startNode.x,
        y: startNode.y,
        path,
        currentSegment: 0,
        segmentProgress: 0,
        speed: 0.012 + Math.random() * 0.018,
        color: isDdosMode ? "#6366f1" : "rgba(99, 102, 241, 0.7)",
        isDdos: isDdosMode,
      };
    };

    // Pre-populate normal packets
    for (let i = 0; i < maxNormalPackets; i++) {
      packets.push(createPacket(false));
    }

    let animationId: number;
    let ddosPackets: Packet[] = [];

    const render = () => {
      // Clear canvas
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Draw grid coordinates in background (Faint Blue Grid)
      ctx.strokeStyle = "rgba(99, 102, 241, 0.02)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 30) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += 30) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Draw faint background link mesh
      ctx.strokeStyle = "rgba(99, 102, 241, 0.03)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let i = 0; i < nodes.length; i += 3) {
        const nextNode = nodes[(i + 1) % nodes.length];
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nextNode.x, nextNode.y);
      }
      ctx.stroke();

      // Draw static network nodes (faint grey dots, center glows Tan)
      nodes.forEach((node) => {
        ctx.beginPath();
        if (node.isCenter) {
          ctx.arc(node.x, node.y, isDdos ? 4.5 : 3.5, 0, Math.PI * 2);
          ctx.fillStyle = isDdos ? "#d2b48c" : "rgba(210, 180, 140, 0.5)";
        } else {
          ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(100, 100, 120, 0.3)";
        }
        ctx.fill();
      });

      // Handle DDoS attack spawning (150+ rapid converging packets)
      if (isDdos) {
        if (ddosPackets.length < 250) {
          for (let k = 0; k < 6; k++) {
            ddosPackets.push(createPacket(true));
          }
        }
      } else {
        if (ddosPackets.length > 0) {
          ddosPackets = ddosPackets.filter((p) => p.segmentProgress < 1.0);
        }
      }

      const allPackets = [...packets, ...ddosPackets];

      // Update and draw packets & laser links
      allPackets.forEach((p) => {
        const segIdx = p.currentSegment;
        if (segIdx < p.path.length - 1) {
          const start = p.path[segIdx];
          const end = p.path[segIdx + 1];

          p.x = start.x + (end.x - start.x) * p.segmentProgress;
          p.y = start.y + (end.y - start.y) * p.segmentProgress;

          // Draw the active laser link segment (glowing Blue)
          ctx.strokeStyle = p.isDdos ? "rgba(99, 102, 241, 0.18)" : "rgba(99, 102, 241, 0.08)";
          ctx.lineWidth = p.isDdos ? 1.2 : 0.8;
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();

          p.segmentProgress += p.speed;
          if (p.segmentProgress >= 1.0) {
            p.segmentProgress = 0;
            p.currentSegment++;
          }
        }
      });

      // Draw packet heads with glowing shadow effects (Blue glow)
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#6366f1";
      ctx.fillStyle = "#6366f1";

      allPackets.forEach((p) => {
        if (p.currentSegment < p.path.length - 1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.isDdos ? 2.5 : 2.0, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.shadowBlur = 0;

      // Recycle finished normal packets
      packets.forEach((p, idx) => {
        if (p.currentSegment >= p.path.length - 1) {
          packets[idx] = createPacket(false);
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [dimensions, isDdos]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[400px] relative bg-black select-none border border-cyber-blue/10 flex flex-col items-stretch bracket-container"
      onMouseEnter={() => setIsDdos(true)}
      onMouseLeave={() => setIsDdos(false)}
    >
      {/* Corner crosshairs in Tan */}
      <span className="absolute top-2 left-2 text-[10px] text-cyber-tan/45 select-none pointer-events-none font-mono">+</span>
      <span className="absolute top-2 right-2 text-[10px] text-cyber-tan/45 select-none pointer-events-none font-mono">+</span>
      <span className="absolute bottom-2 left-2 text-[10px] text-cyber-tan/45 select-none pointer-events-none font-mono">+</span>
      <span className="absolute bottom-2 right-2 text-[10px] text-cyber-tan/45 select-none pointer-events-none font-mono">+</span>

      {/* HUD status label overlay */}
      <div className="absolute top-4 left-4 z-10 font-mono text-[9px] text-cyber-tan/60 tracking-wider">
        <div>SYS.NODE_GRID: GLOBAL_THREAT_MAP</div>
        <div>ACTIVE_CONNECTIONS: {isDdos ? "320+ ATTACK_NODES" : "90_PEER_LINKS"}</div>
      </div>

      {/* Top right CCTV/Telemetry display */}
      <div className="absolute top-4 right-4 z-10 font-mono text-[9px] text-right text-cyber-tan/60 tracking-wider flex flex-col items-end">
        <div className={`font-bold flex items-center gap-1 ${isDdos ? "text-red-400" : "text-cyber-blue"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isDdos ? "bg-red-500 animate-ping" : "bg-cyber-blue animate-pulse"}`} />
          <span>{isDdos ? "VECTOR_ALERT: DDOS_DETECTED" : "PORT_STATUS: LISTENING"}</span>
        </div>
        <div className="text-cyber-gray mt-0.5 text-[8px] uppercase select-none">
          {isDdos ? "HOVER TRIGGER: ACTIVE" : "HOVER OVER MAP TO ATTACK"}
        </div>
      </div>

      {/* Actual HTML5 Drawing Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full bg-black cursor-crosshair"
      />

      {/* Bottom status alert box */}
      {isDdos && (
        <div className="absolute bottom-4 left-4 right-4 bg-red-950/20 border border-red-500/30 p-2 text-center text-red-400 text-[10px] font-mono tracking-widest animate-pulse z-10">
          WARNING: CONCENTRATED FLOOD SEQUENCE DETECTED // TARGETING NODE_ID_000
        </div>
      )}
    </div>
  );
}

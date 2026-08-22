"use client";
 
import React from "react";

export default function BranchingTubes() {
  return (
    <div className="w-full h-full min-h-[350px] relative border border-cyber-green/10 bg-cyber-dark/40 flex flex-col items-center justify-center p-6 bracket-container select-none">
      {/* Corner decoration brackets */}
      <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyber-green/30" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyber-green/30" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyber-green/30" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyber-green/30" />

      {/* SVG Canvas */}
      <svg viewBox="0 0 300 300" className="w-full h-full max-h-[300px] filter drop-shadow-[0_0_6px_rgba(0,255,65,0.4)]">
        {/* Background tech grids inside SVG */}
        <path d="M 30,50 L 270,50 M 30,150 L 270,150 M 30,250 L 270,250" stroke="rgba(0,255,65,0.03)" strokeWidth="1" />
        <path d="M 50,30 L 50,270 M 150,30 L 150,270 M 250,30 L 250,270" stroke="rgba(0,255,65,0.03)" strokeWidth="1" />

        {/* Outer Conduits (Black/Grey support tubes) */}
        <path d="M 50,250 L 50,130 L 130,130" fill="none" stroke="#1c1c1c" strokeWidth="12" strokeLinecap="round" />
        <path d="M 130,130 L 190,70 L 260,70" fill="none" stroke="#1c1c1c" strokeWidth="12" strokeLinecap="round" />
        <path d="M 130,130 L 190,190 L 260,190" fill="none" stroke="#1c1c1c" strokeWidth="12" strokeLinecap="round" />

        {/* Middle Glowing Fluid Core (Semi-transparent thick green) */}
        <path d="M 50,250 L 50,130 L 130,130" fill="none" stroke="rgba(0, 255, 65, 0.35)" strokeWidth="8" strokeLinecap="round" />
        <path d="M 130,130 L 190,70 L 260,70" fill="none" stroke="rgba(0, 255, 65, 0.35)" strokeWidth="8" strokeLinecap="round" />
        <path d="M 130,130 L 190,190 L 260,190" fill="none" stroke="rgba(0, 255, 65, 0.35)" strokeWidth="8" strokeLinecap="round" />

        {/* Inner Glowing Fluid Core (Liquid Green) */}
        <path d="M 50,250 L 50,130 L 130,130" fill="none" stroke="#00ff41" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 130,130 L 190,70 L 260,70" fill="none" stroke="#00ff41" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 130,130 L 190,190 L 260,190" fill="none" stroke="#00ff41" strokeWidth="3.5" strokeLinecap="round" />

        {/* Flowing liquid nodes (animated dashed overlay) */}
        <path d="M 50,250 L 50,130 L 130,130" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeDasharray="15, 30">
          <animate attributeName="stroke-dashoffset" values="90;0" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M 130,130 L 190,70 L 260,70" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeDasharray="15, 30">
          <animate attributeName="stroke-dashoffset" values="90;0" dur="2.5s" repeatCount="indefinite" />
        </path>
        <path d="M 130,130 L 190,190 L 260,190" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeDasharray="15, 30">
          <animate attributeName="stroke-dashoffset" values="90;0" dur="2.2s" repeatCount="indefinite" />
        </path>

        {/* Structural connectors/hubs with blinking status */}
        <circle cx="50" cy="130" r="10" fill="#000" stroke="#00ff41" strokeWidth="2.5" />
        <circle cx="50" cy="130" r="3" fill="#ffffff" />
        
        <circle cx="130" cy="130" r="11" fill="#000" stroke="#00ff41" strokeWidth="2.5" />
        <circle cx="130" cy="130" r="4" fill="#00ff41">
          <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
        </circle>

        <circle cx="190" cy="70" r="8" fill="#000" stroke="#00ff41" strokeWidth="2" />
        <circle cx="190" cy="70" r="2" fill="#ffffff" />

        <circle cx="190" cy="190" r="8" fill="#000" stroke="#00ff41" strokeWidth="2" />
        <circle cx="190" cy="190" r="2" fill="#ffffff" />
      </svg>
      
      {/* HUD diagnostic details */}
      <div className="absolute bottom-3 left-4 font-mono text-[9px] text-cyber-green/50 tracking-wider">
        <div>SYS.FLOW_VALVE: V_ACTIVE</div>
        <div>VALVE_FLUX: 38.8 L/S</div>
      </div>
    </div>
  );
}

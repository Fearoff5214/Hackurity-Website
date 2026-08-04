"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { 
  CornerCrosshairs, 
  BracketFrame, 
  StatusDot, 
  SineWaveLoader, 
  SimulatedLoadingBar, 
  TechTable 
} from "@/components/TechElements";

// Dynamically import WebGL elements to prevent SSR issues
const BinaryFace = dynamic(() => import("@/components/BinaryFace"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[350px] flex items-center justify-center bg-cyber-dark/40 border border-cyber-blue/10">
      <span className="text-xs text-cyber-blue/50 tracking-widest animate-pulse font-mono">// BOOTING WebGL ENGINE...</span>
    </div>
  )
});

const CyberBreachConduit = dynamic(() => import("@/components/CyberBreachConduit"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[350px] flex items-center justify-center bg-cyber-dark/40 border border-cyber-blue/10">
      <span className="text-xs text-cyber-blue/50 tracking-widest animate-pulse font-mono">// BOOTING SHADER CONDUIT...</span>
    </div>
  )
});

const ReactorCore = dynamic(() => import("@/components/ReactorCore"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-cyber-dark/40 border border-cyber-blue/10">
      <span className="text-xs text-cyber-blue/50 tracking-widest animate-pulse font-mono">// CALIBRATING REACTOR SCANNERS...</span>
    </div>
  )
});

export default function Home() {
  const [currentSection, setCurrentSection] = useState("MISSION_BRIEF");
  const [chamberStatus, setChamberStatus] = useState("STABLE");

  // Registration states
  const [teamName, setTeamName] = useState("");
  const [captainEmail, setCaptainEmail] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("Domain 1");
  const [registrationStatus, setRegistrationStatus] = useState<"IDLE" | "INJECTING" | "SUCCESS">("IDLE");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  
  // Navigation Links
  const navLinks = [
    { name: "MISSION_BRIEF", href: "#mission_brief" },
    { name: "CTF_CHALLENGES", href: "#ctf_challenges" },
    { name: "EVENT_FLOW", href: "#event_flow" },
    { name: "LEADERBOARD", href: "#leaderboard" },
    { name: "JOIN_NODE", href: "#join_node" }
  ];

  const eventTimeline = [
    {
      marker: "T-30",
      phase: "NODE REGISTRATION",
      title: "OPEN THE ACCESS CHANNEL",
      detail: "Assemble your unit, select an operational domain, and transmit the first encrypted registration packet.",
      status: "REGISTRY: ONLINE",
    },
    {
      marker: "T-07",
      phase: "MISSION BRIEFING",
      title: "SYNC WITH THE COMMAND GRID",
      detail: "Verified teams receive the protocol, system constraints, and the final pre-infiltration intelligence drop.",
      status: "UPLINK: LOCKED",
    },
    {
      marker: "T+00",
      phase: "PROBLEM DROP",
      title: "BREACH SEQUENCE INITIATED",
      detail: "The challenge vault unlocks. Deploy your build, defend your attack surface, and keep the data stream moving.",
      status: "VAULT: UNSEALED",
    },
    {
      marker: "T+48",
      phase: "FINAL EXTRACTION",
      title: "SUBMIT // VERIFY // ASCEND",
      detail: "Transmit your final payload for validation. The highest-scoring nodes advance to the terminal leaderboard.",
      status: "CORE: AWAITING INPUT",
    },
  ];

  // Registration console injection handler
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !captainEmail) {
      alert("SYS.ERR: Insufficient parameters. Set teamName and captainEmail.");
      return;
    }

    setRegistrationStatus("INJECTING");
    setTerminalHistory([
      `guest@hackurity:~$ inject --team "${teamName}" --captain "${captainEmail}" --domain "${selectedDomain.toLowerCase().replace(/\s/g, "_")}"`
    ]);

    const logs = [
      "[INFO] PACKET CONDUITS COMMENCING TRANSMISSION...",
      "[INFO] SCANNING NODE PATHS FOR EXPLOIT VECTOR...",
      `[INFO] TARGETING NODE: STATION_ID_NO_45`,
      "[SUCCESS] ACCESS GRANTED. EXPLOIT PAYLOAD INJECTED.",
      `[SUCCESS] REGISTRATION CONFIRMED. SECURITY TOKEN: 0x${Math.floor(Math.random() * 0xffffff).toString(16).toUpperCase()}`
    ];

    logs.forEach((log, idx) => {
      setTimeout(() => {
        setTerminalHistory((prev) => [...prev, log]);
        if (idx === logs.length - 1) {
          setRegistrationStatus("SUCCESS");
        }
      }, (idx + 1) * 800);
    });
  };

  const resetForm = () => {
    setTeamName("");
    setCaptainEmail("");
    setSelectedDomain("Domain 1");
    setRegistrationStatus("IDLE");
    setTerminalHistory([]);
  };

  return (
    <div className="min-h-screen bg-cyber-black text-white relative font-mono overflow-x-hidden cyber-grid">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.06)_0%,transparent_60%)] pointer-events-none" />

      {/* 1. NAVIGATION BAR */}
      <header className="sticky top-0 z-40 w-full bg-cyber-black/85 backdrop-blur-md border-b border-cyber-blue/10 px-4 md:px-8 py-3 flex items-center justify-between gap-3 select-none">
        {/* Left: Stylized Geometric Logo */}
        <div className="flex shrink-0 items-center gap-3">
          <svg viewBox="0 0 100 100" className="w-8 h-8 filter drop-shadow-[0_0_4px_rgba(99,102,241,0.8)] fill-none stroke-cyber-tan stroke-[6] cursor-pointer">
            <polygon points="50,15 85,80 15,80" />
            <polygon points="50,40 70,80 30,80" className="opacity-60 stroke-[4]" />
            <line x1="50" y1="15" x2="50" y2="80" className="opacity-40 stroke-[2] stroke-white" />
          </svg>
          <span className="font-heading text-xs tracking-[0.25em] font-bold text-white hidden sm:inline select-none">
            HACKURITY <span className="text-cyber-tan">//</span> SEC
          </span>
        </div>

        {/* Center: Monospace Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="flex min-w-0 flex-1 items-center gap-4 overflow-x-auto whitespace-nowrap scroll-smooth overscroll-x-contain touch-pan-x px-1 md:justify-center md:gap-8 md:overflow-visible"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setCurrentSection(link.name)}
              className={`shrink-0 text-[9px] md:text-[10px] tracking-widest transition-all duration-300 font-mono relative py-1 hover:text-cyber-tan ${
                currentSection === link.name ? "text-cyber-tan font-bold text-glow-tan" : "text-cyber-gray"
              }`}
            >
              {`[${link.name}]`}
              {currentSection === link.name && (
                <motion.span
                  layoutId="activeNavLine"
                  className="absolute bottom-0 left-0 w-full h-[1.5px] bg-cyber-tan shadow-tan"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </nav>

        {/* Right: Status Indicator */}
        <div className="flex shrink-0 items-center gap-2">
          <StatusDot statusText="NETWORK SECURE" active={chamberStatus === "STABLE"} />
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-16 md:gap-24 relative z-10">
        
        {/* Decorative corner markers */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-cyber-blue/20 pointer-events-none" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-cyber-blue/20 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-cyber-blue/20 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-cyber-blue/20 pointer-events-none" />

        {/* 2. HERO SECTION: "HACKURITY" */}
        <section id="mission_brief" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center crosshair-corner border border-cyber-blue/10 p-6 bg-cyber-dark/20 relative">
          <CornerCrosshairs />

          {/* Left Column: Title & stats */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-[9px] tracking-[0.3em] text-cyber-tan font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-cyber-tan rounded-full animate-ping" />
                <span>CTF_NODE_CONNECTED</span>
              </span>
              <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl tracking-tight leading-none text-white uppercase text-glow-tan">
                OPERATION <span className="text-cyber-tan">//</span> HACKURITY
              </h1>
              <p className="font-mono text-[10px] tracking-wider text-cyber-tan font-bold uppercase">
                REVA CYBERSECURITY CLUB <span className="text-white">//</span> SCHOOL OF CSE
              </p>
              <p className="font-mono text-xs leading-relaxed text-cyber-gray mt-2">
                Infiltrate the secure mainframe. Modulate electromagnetic loops and breach data streams using high-speed volumetric code injections to capture hidden flags. The terminal eye tracks your movement.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <TechTable 
                title="HACKURITY MAIN NETWORK TELEMETRY"
                headers={["Threat Matrix", "Status Value", "Status"]}
                rows={[
                  ["ACTIVE THREATS", "1,024 SOURCES", "HIGH_LOAD"],
                  ["ENCRYPTION LEVEL", "AES-256", "NOMINAL"],
                  ["SYSTEM STATUS", "COMPROMISED", "WARNING"]
                ]}
              />

              <div className="grid grid-cols-2 gap-3 mt-1">
                <a 
                  href="#join_node"
                  className="px-4 py-2.5 border border-cyber-tan/45 bg-cyber-tan/5 text-cyber-tan font-mono text-[10px] tracking-widest text-center uppercase cursor-pointer hover:bg-cyber-tan/10 hover:shadow-tan transition-all"
                >
                  [ ACCESS_NODE ]
                </a>
                <button 
                  onClick={() => {
                    setChamberStatus(chamberStatus === "STABLE" ? "WARN" : "STABLE");
                  }}
                  className={`px-4 py-2.5 border font-mono text-[10px] tracking-widest text-center uppercase cursor-pointer transition-all duration-300 ${
                    chamberStatus === "STABLE" 
                      ? "border-white/20 bg-white/5 text-white hover:bg-white/10" 
                      : "border-red-500/50 bg-red-950/20 text-red-400 hover:bg-red-900/10 shadow-[0_0_8px_rgba(239,68,68,0.3)]"
                  }`}
                >
                  {chamberStatus === "STABLE" ? "[ SHIELD_WARN ]" : "[ STABILIZE ]"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Binary Face Centerpiece */}
          <div className="lg:col-span-7 flex flex-col justify-center items-center relative overflow-hidden bg-transparent p-4 h-[420px]">
            <div className="w-full h-full relative">
              <BinaryFace />
            </div>

            <div className="w-full flex items-center justify-between mt-2 px-2 text-[9px] text-cyber-gray font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-pulse" />
                <span>COGNITIVE FOCUS: CURSOR</span>
              </div>
              <span className="text-cyber-tan font-bold">EYE_TRACK: LOOKING</span>
            </div>
          </div>
        </section>

        {/* 3. SECTION TWO: "02. HACKATHON DOMAINS" */}
        <section id="ctf_challenges" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch crosshair-corner border border-cyber-blue/10 p-6 bg-cyber-dark/10 relative">
          <CornerCrosshairs />

          {/* Left Column: Category explanations */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-cyber-tan/10 border border-cyber-tan/30 text-cyber-tan px-1.5 py-0.5 font-bold">DOMAINS</span>
                <span className="text-[10px] text-cyber-gray tracking-widest font-bold">RELEASE: 2 PROBLEMS / DOMAIN</span>
              </div>
              <h2 className="font-heading text-xl md:text-2xl tracking-tight leading-none text-white uppercase">
                // 02. HACKATHON DOMAINS // RULES
              </h2>
              <p className="font-mono text-xs leading-relaxed text-cyber-gray">
                Hackurity features four dedicated operational domains. Each domain releases exactly **two problem statements** at launch. Choose your alignment wisely:
              </p>
              
              <ul className="list-none flex flex-col gap-3 font-mono text-[11px] text-cyber-gray pl-1 mt-2">
                <li><span className="text-cyber-tan font-bold mr-2">▶ DOMAIN 1:</span> [ TBD_DOMAIN_01 ] — Exploit analysis and defensive mainframes.</li>
                <li><span className="text-cyber-tan font-bold mr-2">▶ DOMAIN 2:</span> [ TBD_DOMAIN_02 ] — Binary engineering and firmware security.</li>
                <li><span className="text-cyber-tan font-bold mr-2">▶ DOMAIN 3:</span> [ TBD_DOMAIN_03 ] — Cryptographic networks and ledger routing.</li>
                <li><span className="text-cyber-tan font-bold mr-2">▶ DOMAIN 4:</span> [ TBD_DOMAIN_04 ] — System vulnerability and threat intelligence.</li>
              </ul>
            </div>

            {/* Simulated progress diagnostics */}
            <div className="flex flex-col gap-3 mt-6">
              <SimulatedLoadingBar value={92} label="INFILTRATION DECRYPTION MATRIX" />
              <div className="flex items-center justify-between text-[9px] text-cyber-blue/80 font-mono">
                <span>SECTOR: DOMAIN_FLOW_MATRIX</span>
                <span>STATUS: STREAMS ONLINE</span>
              </div>
            </div>
          </div>

          {/* Right Column: WebGL Raymarched Conduits */}
          <div className="lg:col-span-7 flex flex-col justify-center items-center relative py-4 bg-cyber-black/45 border border-cyber-blue/5">
            <div className="absolute top-2 left-2 text-[8px] text-cyber-gray font-mono z-10">
              SYS.MODEL: CYBER_BREACH_CONDUIT_3D
            </div>
            
            <div className="w-full h-[320px] relative">
              <CyberBreachConduit />
            </div>

            <div className="w-full flex items-center justify-between mt-2 px-2 text-[9px] text-cyber-gray">
              <span>FLOW_VECTOR_MODULATION: DYNAMIC</span>
              <span className="text-cyber-blue font-bold text-glow-dim">GLSL PACKETS: ONLINE</span>
            </div>
          </div>
        </section>

        {/* 4. SECTION THREE: "03. EVENT EXECUTION TIMELINE" */}
        <section id="event_flow" className="flex flex-col gap-8 crosshair-corner border border-cyber-blue/10 p-6 bg-cyber-dark/20 relative overflow-hidden">
          <CornerCrosshairs />

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-cyber-blue/15 pb-4">
            <div className="flex flex-col gap-2 max-w-2xl">
              <span className="text-[9px] tracking-widest text-cyber-tan font-bold uppercase">
                // SYSTEM_SEQUENCE_NODE_03
              </span>
              <h2 className="font-heading text-xl md:text-2xl tracking-tight text-white uppercase">
                03. EVENT EXECUTION TIMELINE
              </h2>
              <p className="font-mono text-xs leading-relaxed text-cyber-gray">
                Track the operation from initial signal to final extraction. Every phase is a live handoff in the Hackurity mission chain.
              </p>
            </div>
            <div className="font-mono text-[9px] tracking-widest text-cyber-tan/70 border border-cyber-tan/15 bg-cyber-tan/5 px-3 py-2">
              FLOW_STATUS: CONTINUOUS
            </div>
          </div>

          <div className="relative py-2">
            {/* The fixed conduit and travelling packets create the live-flow behaviour used by the reference timeline. */}
            <div className="absolute left-[19px] md:left-1/2 top-4 bottom-4 w-px -translate-x-1/2 bg-cyber-blue/25" />
            <motion.div
              aria-hidden="true"
              className="absolute left-[19px] md:left-1/2 top-4 w-px -translate-x-1/2 bg-cyber-tan shadow-[0_0_10px_rgba(210,180,140,0.75)]"
              animate={{ height: ["0%", "100%", "0%"] }}
              transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
            />

            <div className="flex flex-col gap-6 md:gap-3">
              {eventTimeline.map((event, index) => {
                const isRight = index % 2 === 1;

                return (
                  <motion.article
                    key={event.phase}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    className="relative grid grid-cols-[40px_1fr] md:grid-cols-[1fr_72px_1fr] items-center gap-4 md:gap-0"
                  >
                    <div className={`hidden md:block ${isRight ? "col-start-1" : "col-start-3"}`}>
                      <div className="border border-cyber-blue/20 bg-cyber-black/45 p-4 transition-all duration-300 hover:border-cyber-tan/45 hover:bg-cyber-tan/5">
                        <div className="flex items-center justify-between gap-4 mb-3 text-[9px] font-mono tracking-widest">
                          <span className="text-cyber-tan font-bold">{event.marker}</span>
                          <span className="text-cyber-gray">{event.status}</span>
                        </div>
                        <div className="text-[10px] text-cyber-blue font-bold tracking-widest mb-1">// {event.phase}</div>
                        <h3 className="font-heading text-sm text-white tracking-tight">{event.title}</h3>
                        <p className="mt-2 font-mono text-[11px] leading-relaxed text-cyber-gray">{event.detail}</p>
                      </div>
                    </div>

                    <div className="relative z-10 col-start-1 md:col-start-2 flex justify-center self-stretch">
                      <div className="relative mt-4 md:mt-0 flex h-10 w-10 items-center justify-center border border-cyber-tan/60 bg-cyber-black shadow-[0_0_12px_rgba(210,180,140,0.18)]">
                        <span className="h-2 w-2 bg-cyber-tan animate-pulse" />
                        <span className="absolute h-full w-full border border-cyber-tan/30 animate-ping" style={{ animationDelay: `${index * 0.45}s` }} />
                      </div>
                    </div>

                    <div className="md:hidden col-start-2 border border-cyber-blue/20 bg-cyber-black/45 p-4 transition-all duration-300 hover:border-cyber-tan/45 hover:bg-cyber-tan/5">
                      <div className="flex items-center justify-between gap-3 mb-3 text-[9px] font-mono tracking-widest">
                        <span className="text-cyber-tan font-bold">{event.marker}</span>
                        <span className="text-cyber-gray text-right">{event.status}</span>
                      </div>
                      <div className="text-[10px] text-cyber-blue font-bold tracking-widest mb-1">// {event.phase}</div>
                      <h3 className="font-heading text-sm text-white tracking-tight">{event.title}</h3>
                      <p className="mt-2 font-mono text-[11px] leading-relaxed text-cyber-gray">{event.detail}</p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. SECTION FOUR: "04. INFILTRATION LEADERBOARD" */}
        <section id="leaderboard" className="flex flex-col gap-6 items-stretch crosshair-corner border border-cyber-blue/10 p-6 bg-cyber-dark/20 relative">
          <CornerCrosshairs />

          {/* Symmetrical Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-cyber-blue/15 pb-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] tracking-widest text-cyber-tan font-bold uppercase">
                // SYSTEM_SEQUENCE_NODE_04
              </span>
              <h2 className="font-heading text-xl md:text-2xl tracking-tight text-white uppercase">
                04. INFILTRATION LEADERBOARD
              </h2>
            </div>
            <div className="font-mono text-[10px] text-cyber-tan/60 flex items-center gap-4 bg-cyber-tan/5 border border-cyber-tan/10 px-3 py-1.5">
              <div>MONITOR_GRID: LEADERBOARD</div>
              <div>STATION_ID: NO_45</div>
            </div>
          </div>

          {/* Mobile devices can swipe across the wider scanner field; desktop retains the full-width display. */}
          <div
            aria-label="Reactor scanner field. Swipe horizontally on mobile to inspect the full display."
            className="w-full overflow-x-auto overscroll-x-contain touch-pan-x border border-cyber-blue/10 relative"
          >
            <div className="h-[380px] min-w-[560px] md:min-w-0 relative">
              <ReactorCore />
            </div>
          </div>

          {/* Leaderboard Table below it */}
          <div
            tabIndex={0}
            aria-label="Leaderboard table. Swipe horizontally on mobile to view all columns."
            className="w-full mt-4 overflow-x-auto overscroll-x-contain touch-pan-x pb-2"
          >
            <div className="min-w-[640px]">
              <TechTable 
                title="TOP ATTACKING NODES LEADERBOARD"
                headers={["Rank", "Team Name", "Access Vector", "CTF Score"]}
                rows={[
                  ["1ST PLACE", "TEAM_NULL_SECTOR", "SSH_BYPASS_INJECT", "1,250 PTS"],
                  ["2ND PLACE", "TEAM_VOID_RUNNERS", "SQLX_BUFFER_EXPLOIT", "1,100 PTS"],
                  ["3RD PLACE", "TEAM_PHANTOM_BYPASS", "OAUTH_FILTER_LEAK", "950 PTS"],
                  ["4TH PLACE", "TEAM_STATIC_SHIELDS", "RSA_LATTICE_CRACK", "800 PTS"]
                ]}
              />
            </div>
          </div>
        </section>

        {/* 6. SECTION FIVE: "05. JOIN NODE // REGISTRATION CONSOLE" */}
        <section id="join_node" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch crosshair-corner border border-cyber-blue/10 p-6 bg-cyber-dark/20 relative">
          <CornerCrosshairs />

          {/* Left Column: Form Inputs */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-4">
              <span className="text-[9px] tracking-widest text-cyber-tan font-bold font-mono">// 05. JOIN NODE // INFILTRATION FORM</span>
              <h2 className="font-heading text-xl tracking-tight leading-none text-white uppercase">
                INJECT TEAM PAYLOAD
              </h2>
              <p className="font-mono text-xs text-cyber-gray leading-relaxed">
                Fill out the team parameters to compile and inject your registration payload. Select one of the four domains (problem statements will be released soon).
              </p>

              <form onSubmit={handleRegister} className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-cyber-tan uppercase font-bold">--team-name</label>
                  <input 
                    type="text" 
                    placeholder="Enter team alias..." 
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    disabled={registrationStatus !== "IDLE"}
                    className="bg-cyber-dark border border-cyber-tan/30 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyber-tan focus:shadow-tan transition-all placeholder:text-cyber-gray/40 rounded-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-cyber-tan uppercase font-bold">--captain-email</label>
                  <input 
                    type="email" 
                    placeholder="captain@reva.edu.in" 
                    value={captainEmail}
                    onChange={(e) => setCaptainEmail(e.target.value)}
                    disabled={registrationStatus !== "IDLE"}
                    className="bg-cyber-dark border border-cyber-tan/30 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyber-tan focus:shadow-tan transition-all placeholder:text-cyber-gray/40 rounded-none"
                  />
                </div>

                {/* Choose Domain Option (1, 2, 3, 4) */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-cyber-tan uppercase font-bold">--domain-select</label>
                  <select 
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    disabled={registrationStatus !== "IDLE"}
                    className="bg-cyber-dark border border-cyber-tan/30 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyber-tan focus:shadow-tan cursor-pointer transition-all rounded-none"
                  >
                    <option>Domain 1</option>
                    <option>Domain 2</option>
                    <option>Domain 3</option>
                    <option>Domain 4</option>
                  </select>
                </div>

                {registrationStatus === "IDLE" ? (
                  <button 
                    type="submit"
                    className="w-full mt-2 px-4 py-2 border border-cyber-tan/45 bg-cyber-tan/5 text-cyber-tan font-mono text-[11px] tracking-widest text-center uppercase cursor-pointer hover:bg-cyber-tan/10 hover:shadow-tan transition-all"
                  >
                    [ INJECT_REGISTRY_PAYLOAD ]
                  </button>
                ) : registrationStatus === "INJECTING" ? (
                  <div className="w-full mt-2 px-4 py-2 border border-cyber-tan/20 bg-cyber-dark text-cyber-tan/50 font-mono text-[11px] tracking-widest text-center uppercase animate-pulse">
                    [ INJECTING PAYLOAD DATA... ]
                  </div>
                ) : (
                  <button 
                    type="button"
                    onClick={resetForm}
                    className="w-full mt-2 px-4 py-2 border border-white/30 bg-white/5 text-white font-mono text-[11px] tracking-widest text-center uppercase cursor-pointer hover:bg-white/10 transition-all"
                  >
                    [ REGISTER_ANOTHER_NODE ]
                  </button>
                )}
              </form>
            </div>
            
            <div className="text-[9px] text-cyber-tan/40 mt-4 leading-normal select-none">
              SECURE REGISTRY: ALL DATA IS SIGNED AND ENCRYPTED IN TRANSIT.
            </div>
          </div>

          {/* Right Column: Hacking Terminal Registration Console */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6 pl-0 lg:pl-6">
            <div className="flex flex-col gap-3 h-full">
              <span className="text-[10px] tracking-widest text-cyber-tan font-bold font-mono">// PAYLOAD_COMPILER_OUTPUT</span>
              
              {/* Terminal Screen Console */}
              <div className="w-full h-full min-h-[300px] bg-cyber-dark/80 border border-cyber-blue/15 p-4 font-mono text-[11px] leading-relaxed text-cyber-blue/90 overflow-hidden flex flex-col justify-between select-text relative">
                <div className="absolute inset-0 bg-transparent pointer-events-none select-none border-b border-cyber-blue/5" />

                <div className="flex flex-col gap-1 overflow-y-auto max-h-full font-mono text-glow-dim">
                  <div>HACKURITY OS v4.8.8-hackurity</div>
                  <div>(c) 2026 REVA Cybersecurity Club. Infiltration console ready.</div>
                  <div className="mt-2 text-cyber-gray">
                    guest@hackurity:~$ inject --team "{teamName || '...'}" --captain "{captainEmail || '...'}" --domain "{selectedDomain.toLowerCase().replace(/\s/g, "_")}"
                  </div>

                  {terminalHistory.map((line, idx) => (
                    <div key={idx} className="mt-1">
                      {line}
                    </div>
                  ))}

                  {registrationStatus === "INJECTING" && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-3 bg-cyber-blue animate-[terminal-cursor_1s_step-end_infinite]" />
                      <span className="text-cyber-gray font-bold animate-pulse">COMPILING PAYLOAD STRUCTS...</span>
                    </div>
                  )}
                </div>

                {/* Success Registration Panel */}
                {registrationStatus === "SUCCESS" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-cyber-tan bg-cyber-tan/10 p-3 mt-4 text-[10px] text-cyber-tan font-mono tracking-widest"
                  >
                    <div className="font-bold flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 bg-cyber-tan rounded-full" />
                      <span>INJECTION SUCCESSFUL // CORE REGISTERED</span>
                    </div>
                    <div className="text-white">TEAM: {teamName.toUpperCase()}</div>
                    <div className="text-white font-bold">DOMAIN ALIGNMENT: {selectedDomain.toUpperCase()}</div>
                    <div className="text-white">ACCESS KEY: SHA256_0x{Math.floor(Math.random() * 0xffffffff).toString(16).toUpperCase()}</div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 6. SPECIFICATIONS & TECH STATS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Left panel */}
          <BracketFrame>
            <div className="flex flex-col gap-4 relative">
              <div className="flex justify-between items-center text-[10px] text-cyber-tan border-b border-cyber-blue/10 pb-2">
                <span>STATION: HACKURITY_CONDUIT_GRID</span>
                <span>SEC_VAL: SCHOOL_OF_CSE_ACCESS</span>
              </div>
              <h3 className="font-heading text-base text-white uppercase tracking-tight">
                // MAIN_FRAME_MONITOR
              </h3>
              <p className="font-mono text-xs text-cyber-gray leading-relaxed">
                This central dashboard represents a real-time monitor of the Hackurity infiltration grids. Live WebGL shaders and canvas simulations serve as the telemetry control center for all operational teams.
              </p>
              
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between font-mono text-[10px] text-white">
                  <span>CONDUIT FLUX RATE</span>
                  <span className="text-cyber-tan font-bold">94% COMPLIANT</span>
                </div>
                <div className="h-1 bg-cyber-blue-dim relative">
                  <div className="absolute top-0 bottom-0 left-0 bg-cyber-blue animate-pulse" style={{ width: "94%" }} />
                </div>
              </div>

              <div className="text-[9px] text-cyber-tan/50 mt-4 leading-normal select-none">
                ATTENTION: DO NOT INJECT UNVERIFIED CODE PAYLOADS OUTSIDE SANDBOXED CONTAINMENT CORE CHANNELS.
              </div>
            </div>
          </BracketFrame>

          {/* Right panel */}
          <BracketFrame>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-[10px] text-cyber-tan border-b border-cyber-blue/10 pb-2">
                <span>MODULE: STACK_SPECIFICATIONS</span>
                <span>API_NODE: ESTABLISHED</span>
              </div>
              <h3 className="font-heading text-base text-white uppercase tracking-tight">
                // SYSTEM_SPECIFICATIONS
              </h3>
              
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <div className="text-cyber-tan font-bold">FRAMEWORK</div>
                  <div className="text-white">Next.js 16 (React 19)</div>
                </div>
                <div>
                  <div className="text-cyber-tan font-bold">STYLING ENGINE</div>
                  <div className="text-white">Tailwind CSS v4</div>
                </div>
                <div>
                  <div className="text-cyber-tan font-bold">3D GRAPHICS</div>
                  <div className="text-white">React Three Fiber</div>
                </div>
                <div>
                  <div className="text-cyber-tan font-bold">SHADERS / COMPOSERS</div>
                  <div className="text-white">GLSL Raymarch + Bloom</div>
                </div>
              </div>

              <div className="border-t border-cyber-blue/10 pt-4 mt-2">
                <SineWaveLoader width={280} height={20} />
              </div>
            </div>
          </BracketFrame>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="w-full bg-cyber-dark/40 border-t border-cyber-blue/10 py-10 px-4 md:px-8 mt-16 select-none relative z-10 text-xs text-cyber-gray">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="font-heading text-xs tracking-[0.2em] font-bold text-white text-glow-tan">
              HACKURITY <span className="text-cyber-tan">//</span> HACKATHON
            </span>
            <span className="text-[10px] text-cyber-tan/40">© 2026 REVA Cybersecurity Club. CSE Dept.</span>
          </div>

          {/* Quick diagnostic outputs */}
          <div className="flex items-center gap-6 font-mono text-[9px] text-cyber-blue/60">
            <div>PING: 14MS</div>
            <div>FPS: 60.0</div>
            <div>MEM: 44.82MB</div>
            <div>STATION: NODE_HACKURITY_045</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

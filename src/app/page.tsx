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
import EventPathway from "@/components/EventPathway";

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
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState("1");
  const [university, setUniversity] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [members, setMembers] = useState([{ name: "", email: "", role: "", portfolio: "" }]);
  const [projectIdea, setProjectIdea] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedConduct, setAcceptedConduct] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [universityPlaceholder, setUniversityPlaceholder] = useState("");
  const [portfolioPlaceholder, setPortfolioPlaceholder] = useState("");
  
  // Navigation Links
  const navLinks = [
    { name: "MISSION_BRIEF", href: "#mission_brief" },
    { name: "CTF_CHALLENGES", href: "#ctf_challenges" },
    { name: "EVENT_FLOW", href: "#event_flow" },
    { name: "LEADERBOARD", href: "#leaderboard" },
    { name: "JOIN_NODE", href: "#join_node" }
  ];

  const DOMAINS = [
    { id: "TRK-01", name: "AI Security", brief: "Harden machine-learning pipelines against poisoning, prompt injection, and model theft." },
    { id: "TRK-02", name: "Cloud Security", brief: "Seal misconfigured buckets, IAM drift, and container escapes across live cloud estates." },
    { id: "TRK-03", name: "Cryptography", brief: "Break weak ciphers, audit key handling, and engineer post-quantum ready primitives." },
    { id: "TRK-04", name: "Reverse Engineering", brief: "Disassemble binaries and firmware to expose hidden logic and undocumented payloads." },
    { id: "TRK-05", name: "Digital Forensics", brief: "Reconstruct an intrusion from disk, memory, and log artefacts and trace the operator." },
    { id: "TRK-06", name: "Network Defense", brief: "Detect lateral movement, tune sensors, and hold the perimeter under sustained probing." },
    { id: "TRK-07", name: "Secure Software", brief: "Build applications that survive code review, dependency audits, and abuse testing." },
    { id: "TRK-08", name: "Open Innovation", brief: "Any original security build that does not fit the standard operational tracks." }
  ];
  const roleOptions = ["Developer", "Presentator", "Researcher", "Designer", "Here for food 😂"];
  // Replace these with the final public URLs (for example, /documents/terms.pdf) when the PDFs are ready.
  const termsAndConditionsUrl = "http://127.0.0.1:5500/legacy-hackurity/index.html#";
  const codeOfConductUrl = "http://127.0.0.1:5500/legacy-hackurity/index.html#";

  useEffect(() => {
    const startTypingLoop = (samples: string[], setText: React.Dispatch<React.SetStateAction<string>>, speed: number) => {
      let sampleIndex = 0;
      let characterIndex = 0;
      let isDeleting = false;
      let holdTicks = 0;

      return window.setInterval(() => {
        const sample = samples[sampleIndex];
        if (holdTicks > 0) {
          holdTicks -= 1;
          return;
        }
        characterIndex += isDeleting ? -1 : 1;
        setText(sample.slice(0, characterIndex));
        if (!isDeleting && characterIndex === sample.length) {
          holdTicks = 8;
          isDeleting = true;
        } else if (isDeleting && characterIndex === 0) {
          isDeleting = false;
          sampleIndex = (sampleIndex + 1) % samples.length;
        }
      }, speed);
    };

    const universityLoop = startTypingLoop([
      "REVA University", "Christ University", "Dayananda Sagar University", "Presidency University", "R.V. College of Engineering", "PES University", "Ramaiah Institute of Technology"
    ], setUniversityPlaceholder, 75);
    const portfolioLoop = startTypingLoop(["GitHub", "LinkedIn", "Personal Website", "Other"], setPortfolioPlaceholder, 110);

    return () => {
      window.clearInterval(universityLoop);
      window.clearInterval(portfolioLoop);
    };
  }, []);

  const updateTeamSize = (value: string) => {
    const size = Number(value);
    setTeamSize(value);
    setMembers((currentMembers) => Array.from(
      { length: size },
      (_, index) => currentMembers[index] ?? { name: "", email: "", role: "", portfolio: "" }
    ));
  };

  const updateMember = (index: number, field: "name" | "email" | "role" | "portfolio", value: string) => {
    setMembers((currentMembers) => currentMembers.map((member, memberIndex) => (
      memberIndex === index ? { ...member, [field]: value } : member
    )));
  };

  const membersAreComplete = members.every((member) => (
    member.name.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email) &&
    member.role
  ));

  const resetRegistration = () => {
    setRegistrationStep(1);
    setTeamName("");
    setTeamSize("1");
    setUniversity("");
    setSelectedDomain("");
    setExperienceLevel("");
    setMembers([{ name: "", email: "", role: "", portfolio: "" }]);
    setProjectIdea("");
    setAcceptedTerms(false);
    setAcceptedConduct(false);
    setRegistrationComplete(false);
  };

  const inputClass = "w-full bg-cyber-dark border border-cyber-tan/30 px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyber-tan focus:shadow-tan transition-all placeholder:text-cyber-gray/40 rounded-none";
  const stepOneReady = Boolean(teamName.trim() && university.trim() && selectedDomain && experienceLevel);
  const stepThreeReady = Boolean(projectIdea.trim() && acceptedTerms && acceptedConduct);

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
                <span className="text-[10px] text-cyber-gray tracking-widest font-bold">08 DOMAINS // 2 PROBLEMS EACH</span>
              </div>
              <h2 className="font-heading text-xl md:text-2xl tracking-tight leading-none text-white uppercase">
                // 02. HACKATHON DOMAINS // RULES
              </h2>
              <p className="font-mono text-xs leading-relaxed text-cyber-gray">
                Hackurity runs eight operational domains. Each domain unseals exactly two problem statements at launch. Lock your alignment before the breach window opens.
              </p>

              <ul className="list-none grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-[11px] text-cyber-gray pl-1 mt-2">
                {DOMAINS.map((domain) => (
                  <li key={domain.id} className="border border-cyber-blue/10 bg-cyber-black/30 p-2.5 hover:border-cyber-tan/40 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-cyber-tan font-bold uppercase tracking-widest">◆ {domain.name}</span>
                      <span className="text-[9px] text-cyber-blue/70">{domain.id}</span>
                    </div>
                    <span className="leading-relaxed">{domain.brief}</span>
                  </li>
                ))}
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
            <EventPathway />
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
          <div className="lg:col-span-5 flex flex-col justify-center gap-5">
            <span className="text-[9px] tracking-widest text-cyber-tan font-bold font-mono">// 05. JOIN NODE // SECURE REGISTRY</span>
            <h2 className="font-heading text-xl md:text-2xl tracking-tight leading-none text-white uppercase">INJECT TEAM PAYLOAD</h2>
            <p className="font-mono text-xs text-cyber-gray leading-relaxed">
              Open the registration console to assemble your unit profile, validate each operator, and queue the final mission payload.
            </p>
            <motion.button
              type="button"
              onClick={() => { resetRegistration(); setIsRegistrationOpen(true); }}
              animate={{ boxShadow: ["0 0 0px rgba(99,102,241,0)", "0 0 18px rgba(99,102,241,0.5)", "0 0 14px rgba(210,180,140,0.45)", "0 0 0px rgba(99,102,241,0)"] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="relative overflow-hidden w-full md:w-fit px-5 py-3 border border-cyber-tan/55 bg-cyber-tan/5 text-cyber-tan font-mono text-[11px] tracking-widest text-center uppercase cursor-pointer hover:bg-cyber-tan/10 transition-colors"
            >
              <motion.span aria-hidden="true" className="absolute inset-y-0 w-1/2 bg-cyber-blue/20 blur-md" animate={{ x: ["-180%", "260%"] }} transition={{ duration: 2.3, repeat: Infinity, ease: "linear" }} />
              <span className="relative">[ INJECT_REGISTRY_PAYLOAD ]</span>
            </motion.button>
            <div className="text-[9px] text-cyber-tan/40 leading-normal select-none">SECURE REGISTRY: ALL DATA IS SIGNED AND ENCRYPTED IN TRANSIT.</div>
          </div>

          <div className="lg:col-span-7 min-h-[220px] border border-cyber-blue/15 bg-cyber-black/45 p-5 font-mono text-[11px] text-cyber-blue/80 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 cyber-grid opacity-60 pointer-events-none" />
            <div className="relative flex items-center justify-between border-b border-cyber-blue/15 pb-3">
              <span>// REGISTRY_UPLINK</span><span className="text-cyber-tan animate-pulse">READY</span>
            </div>
            <div className="relative space-y-2 text-cyber-gray">
              <div>guest@hackurity:~$ registry --await-team-payload</div>
              <div className="text-white">&gt; SIGNAL DETECTED: AWAITING OPERATOR INPUT</div>
              <div>&gt; ENCRYPTION: AES-256 // CHANNEL: SECURE</div>
            </div>
            <div className="relative h-px bg-cyber-blue/25"><motion.div className="absolute inset-y-0 left-0 bg-cyber-tan" animate={{ width: ["8%", "90%", "8%"] }} transition={{ duration: 3.5, repeat: Infinity }} /></div>
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

      {isRegistrationOpen && (
        <motion.div
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={() => setIsRegistrationOpen(false)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm md:items-center md:p-6"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-console-title"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 270, damping: 28 }}
            onMouseDown={(event) => event.stopPropagation()}
            className="relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden border border-cyber-tan/35 bg-cyber-black shadow-[0_0_35px_rgba(99,102,241,0.22)] md:max-h-[88vh]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-cyber-blue/15 bg-cyber-dark/80 px-5 py-4">
              <div>
                <div className="text-[9px] font-mono font-bold tracking-widest text-cyber-tan">// HACKURITY // SECURE REGISTRY</div>
                <h2 id="registration-console-title" className="mt-1 font-heading text-base tracking-tight text-white">INJECT TEAM PAYLOAD</h2>
              </div>
              <button type="button" onClick={() => setIsRegistrationOpen(false)} className="border border-cyber-blue/25 px-2 py-1 font-mono text-xs text-cyber-gray transition-colors hover:border-cyber-tan hover:text-cyber-tan" aria-label="Close registration console">[ X ]</button>
            </div>

            {!registrationComplete && (
              <div className="grid grid-cols-3 border-b border-cyber-blue/15 bg-cyber-black text-[9px] font-mono tracking-widest">
                {["01 TEAM", "02 OPERATORS", "03 VERIFY"].map((step, index) => (
                  <div key={step} className={`flex items-center gap-2 px-4 py-3 ${registrationStep === index + 1 ? "bg-cyber-tan/10 text-cyber-tan" : registrationStep > index + 1 ? "text-cyber-blue" : "text-cyber-gray/50"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${registrationStep >= index + 1 ? "bg-cyber-tan animate-pulse" : "bg-cyber-gray/30"}`} />{step}
                  </div>
                ))}
              </div>
            )}

            <div className="overflow-y-auto p-5 md:p-7">
              {registrationComplete ? (
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="border border-cyber-tan/45 bg-cyber-tan/5 p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-cyber-tan text-cyber-tan shadow-[0_0_18px_rgba(210,180,140,0.25)]">✓</div>
                  <h3 className="font-heading text-base text-white">PAYLOAD VERIFIED</h3>
                  <p className="mt-3 font-mono text-xs leading-relaxed text-cyber-gray">Your registration interface is complete. Connect this form to your registration backend before accepting live applications.</p>
                  <button type="button" onClick={() => { setIsRegistrationOpen(false); resetRegistration(); }} className="mt-6 border border-cyber-tan/45 bg-cyber-tan/5 px-4 py-2 font-mono text-[10px] tracking-widest text-cyber-tan transition-colors hover:bg-cyber-tan/10">[ CLOSE_CONSOLE ]</button>
                </motion.div>
              ) : registrationStep === 1 ? (
                <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                  <div><span className="text-[9px] font-bold tracking-widest text-cyber-tan">// TEAM PROFILE</span><p className="mt-2 font-mono text-xs leading-relaxed text-cyber-gray">Compile the identity packet for your Hackurity unit.</p></div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-1.5"><span className="text-[10px] font-mono font-bold text-cyber-tan">--team-name</span><input value={teamName} onChange={(event) => setTeamName(event.target.value)} placeholder="Enter team alias..." className={inputClass} /></label>
                    <label className="space-y-1.5"><span className="text-[10px] font-mono font-bold text-cyber-tan">--team-size</span><select value={teamSize} onChange={(event) => updateTeamSize(event.target.value)} className={`${inputClass} cursor-pointer`}><option value="1">1 (SOLO)</option><option value="2">2 (DUO)</option><option value="3">3 (TRIO)</option><option value="4">4 (SQUAD)</option></select></label>
                    <label className="space-y-1.5 sm:col-span-2"><span className="text-[10px] font-mono font-bold text-cyber-tan">--university</span><input value={university} onChange={(event) => setUniversity(event.target.value)} placeholder={`${universityPlaceholder || "University node"} |`} className={`${inputClass} placeholder:text-cyber-blue/55`} /></label>
                    <label className="space-y-1.5 sm:col-span-2"><span className="text-[10px] font-mono font-bold text-cyber-tan">--choose-track</span><select value={selectedDomain} onChange={(event) => setSelectedDomain(event.target.value)} className={`${inputClass} cursor-pointer`}><option value="" disabled>SELECT A DOMAIN...</option>{DOMAINS.map((domain) => <option key={domain.id} value={domain.name}>{`${domain.id} // ${domain.name.toUpperCase()}`}</option>)}</select></label>
                  </div>
                  <div><div className="mb-2 text-[10px] font-mono font-bold text-cyber-tan">--experience-level</div><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"].map((level, index) => <motion.button key={level} type="button" onClick={() => setExperienceLevel(level)} whileTap={{ scale: 0.97 }} animate={experienceLevel === level ? { boxShadow: ["0 0 4px rgba(99,102,241,0.2)", "0 0 16px rgba(210,180,140,0.45)", "0 0 4px rgba(99,102,241,0.2)"] } : {}} transition={{ duration: 1.8, repeat: Infinity }} className={`relative overflow-hidden border px-2 py-3 font-mono text-[9px] tracking-wider transition-colors ${experienceLevel === level ? "border-cyber-tan bg-cyber-tan/10 text-cyber-tan" : "border-cyber-blue/20 bg-cyber-dark text-cyber-gray hover:border-cyber-blue/50"}`}><span className="relative">{level}</span><span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-cyber-blue" style={{ width: `${35 + index * 18}%` }} /></motion.button>)}</div></div>
                </motion.div>
              ) : registrationStep === 2 ? (
                <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div><span className="text-[9px] font-bold tracking-widest text-cyber-tan">// MEMBER DETAILS</span><p className="mt-2 font-mono text-xs leading-relaxed text-cyber-gray">Populate a record for each of the {teamSize} assigned operator{teamSize === "1" ? "" : "s"}.</p></div>
                  {members.map((member, index) => <div key={index} className="border border-cyber-blue/15 bg-cyber-dark/45 p-4"><div className="mb-4 flex items-center gap-2 text-[10px] font-mono font-bold text-cyber-tan"><span className="h-1.5 w-1.5 bg-cyber-tan animate-pulse" />{index === 0 ? "TEAM LEADER (YOU)" : `TEAM MEMBER ${index + 1}`}</div><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5"><span className="text-[10px] font-mono text-cyber-gray">--name</span><input value={member.name} onChange={(event) => updateMember(index, "name", event.target.value)} className={inputClass} placeholder="Operator name..." /></label><label className="space-y-1.5"><span className="text-[10px] font-mono text-cyber-gray">--email</span><input type="email" value={member.email} onChange={(event) => updateMember(index, "email", event.target.value)} className={inputClass} placeholder="operator@gmail.com" /></label><label className="space-y-1.5"><span className="text-[10px] font-mono text-cyber-gray">--role</span><select value={member.role} onChange={(event) => updateMember(index, "role", event.target.value)} className={`${inputClass} cursor-pointer`}><option value="" disabled>SELECT ROLE...</option>{roleOptions.map((role) => <option key={role} value={role}>{role.toUpperCase()}</option>)}</select></label><label className="space-y-1.5"><span className="text-[10px] font-mono text-cyber-gray">--portfolio</span><input value={member.portfolio} onChange={(event) => updateMember(index, "portfolio", event.target.value)} className={`${inputClass} placeholder:text-cyber-blue/55`} placeholder={`${portfolioPlaceholder || "Portfolio"} |`} /></label></div></div>)}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                  <div><span className="text-[9px] font-bold tracking-widest text-cyber-tan">// FINAL VERIFICATION</span><p className="mt-2 font-mono text-xs leading-relaxed text-cyber-gray">Attach a concise project objective, then confirm your operating protocols.</p></div>
                  <label className="block space-y-1.5"><span className="text-[10px] font-mono font-bold text-cyber-tan">--project-idea // BRIEF SUMMARY</span><textarea value={projectIdea} onChange={(event) => setProjectIdea(event.target.value)} rows={4} placeholder="Describe the problem your team will investigate..." className={`${inputClass} resize-y`} /></label>
                  <div className="grid gap-3 border border-cyber-blue/15 bg-cyber-dark/45 p-4 text-xs font-mono"><div className="text-[9px] tracking-widest text-cyber-blue">PAYLOAD SUMMARY</div><div className="grid gap-2 sm:grid-cols-2 text-cyber-gray"><span>TEAM: <strong className="text-white">{teamName || "UNSET"}</strong></span><span>SIZE: <strong className="text-white">{teamSize} OPERATOR{teamSize === "1" ? "" : "S"}</strong></span><span>TRACK: <strong className="text-white">{selectedDomain || "UNSET"}</strong></span><span>LEVEL: <strong className="text-white">{experienceLevel || "UNSET"}</strong></span></div></div>
                  <div className="space-y-3"><label className="flex items-start gap-3 border border-cyber-blue/15 p-3 text-xs font-mono text-cyber-gray"><input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-0.5 accent-cyber-tan" /><span>I agree to the <a href={termsAndConditionsUrl} target="_blank" rel="noreferrer" className="text-cyber-tan underline underline-offset-2 hover:text-white">Terms &amp; Conditions</a> of Hackurity 2026.</span></label><label className="flex items-start gap-3 border border-cyber-blue/15 p-3 text-xs font-mono text-cyber-gray"><input type="checkbox" checked={acceptedConduct} onChange={(event) => setAcceptedConduct(event.target.checked)} className="mt-0.5 accent-cyber-tan" /><span>I agree to uphold the <a href={codeOfConductUrl} target="_blank" rel="noreferrer" className="text-cyber-tan underline underline-offset-2 hover:text-white">Code of Conduct</a> throughout the event.</span></label></div>
                </motion.div>
              )}
            </div>

            {!registrationComplete && <div className="flex items-center justify-between gap-3 border-t border-cyber-blue/15 bg-cyber-dark/70 px-5 py-4"><button type="button" onClick={() => setRegistrationStep((step) => Math.max(1, step - 1))} disabled={registrationStep === 1} className="border border-cyber-blue/20 px-3 py-2 font-mono text-[10px] tracking-widest text-cyber-gray transition-colors hover:border-cyber-blue disabled:cursor-not-allowed disabled:opacity-30">[ BACK ]</button>{registrationStep < 3 ? <button type="button" onClick={() => setRegistrationStep((step) => step + 1)} disabled={registrationStep === 1 ? !stepOneReady : !membersAreComplete} className="border border-cyber-tan/45 bg-cyber-tan/5 px-3 py-2 font-mono text-[10px] tracking-widest text-cyber-tan transition-colors hover:bg-cyber-tan/10 disabled:cursor-not-allowed disabled:opacity-30">[ CONTINUE ]</button> : <button type="button" onClick={() => setRegistrationComplete(true)} disabled={!stepThreeReady} className="border border-cyber-tan/45 bg-cyber-tan/5 px-3 py-2 font-mono text-[10px] tracking-widest text-cyber-tan transition-colors hover:bg-cyber-tan/10 disabled:cursor-not-allowed disabled:opacity-30">[ REGISTER_PAYLOAD ]</button>}</div>}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

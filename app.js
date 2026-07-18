const { useState, useEffect, useRef, Fragment } = React;

/* ══════════════════════════════════════════════════════════
   INLINE MOTION SHIM
   CSS-transitions-based drop-in for Framer Motion.
   Supports: initial, animate, exit, transition, whileHover, whileTap.
 ══════════════════════════════════════════════════════════ */
function _toStyle(state) {
  if (!state) return {};
  const s = {};
  if (state.opacity !== undefined) s.opacity = state.opacity;
  if (state.scale !== undefined) s.transform = `scale(${state.scale})`;
  if (state.y !== undefined) s.transform = `translateY(${state.y}px)`;
  if (state.x !== undefined) s.transform = `translateX(${state.x}px)`;
  if (state.height !== undefined) s.height = typeof state.height === 'number' ? `${state.height}px` : state.height;
  return s;
}

function _makeMotionEl(tag) {
  return React.forwardRef(function MotionEl(
    { initial, animate, exit, transition, whileHover, whileTap, style = {}, className = '', children, ...rest },
    ref
  ) {
    const [on, setOn] = useState(false);
    const [hov, setHov] = useState(false);
    const [tap, setTap] = useState(false);

    useEffect(() => { const id = requestAnimationFrame(() => setOn(true)); return () => cancelAnimationFrame(id); }, []);

    const dur = transition?.duration ?? 0.5;
    const delay = transition?.delay ?? 0;
    const ease = transition?.ease ?? 'ease';
    const tr = `all ${dur}s ${ease}${delay ? ` ${delay}s` : ''}`;

    let computed = {};
    if (!on) computed = { ...computed, ..._toStyle(initial), transition: 'none' };
    else if (animate) computed = { ...computed, ..._toStyle(animate), transition: tr };
    if (on && hov && whileHover) { Object.assign(computed, _toStyle(whileHover)); computed.transition = 'all .15s ease'; }
    if (on && tap && whileTap) { Object.assign(computed, _toStyle(whileTap)); computed.transition = 'all .1s ease'; }

    const handlers = {};
    if (whileHover) { handlers.onMouseEnter = () => setHov(true); handlers.onMouseLeave = () => { setHov(false); setTap(false); }; }
    if (whileTap) { handlers.onMouseDown = () => setTap(true); handlers.onMouseUp = () => setTap(false); }

    return React.createElement(tag, { ref, style: { ...style, ...computed }, className, ...handlers, ...rest }, children);
  });
}

const _TAGS = ['div', 'span', 'button', 'a', 'p', 'section', 'header', 'main', 'nav', 'h1', 'h2', 'h3', 'form'];
const motion = Object.fromEntries(_TAGS.map(t => [t, _makeMotionEl(t)]));

/* AnimatePresence — simplified: handles opacity swaps + height:auto via CSS */
function AnimatePresence({ children, mode }) {
  return children;
}

/* ══════════════════════════════════════════════════════════
   HOOKS
 ══════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════
   HOOKS
 ══════════════════════════════════════════════════════════ */
function useTypewriter(text, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState(text);
  const [done, setDone] = useState(true);
  return { displayed, done };
}

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, vis];
}

function useTilt(angle) { return useRef(null); }
function useMagnetic(force) { return useRef(null); }



/* ══════════════════════════════════════════════════════════
   INLINE SVG ICONS
 ══════════════════════════════════════════════════════════ */
const Ico = ({ size = 20, sw = 2, children, className = '', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    {children}
  </svg>
);
const ICheck = ({ s = 14 }) => <Ico size={s} sw={2.5}><polyline points="20 6 9 17 4 12" /></Ico>;
const IArrow = ({ s = 18 }) => <Ico size={s} sw={2.5}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></Ico>;
const ICalendar = ({ s = 14 }) => <Ico size={s}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></Ico>;
const IPin = ({ s = 14 }) => <Ico size={s}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></Ico>;
const IUsers = ({ s = 14 }) => <Ico size={s}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Ico>;
const IClock = ({ s = 14 }) => <Ico size={s}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Ico>;
const ITrophy = ({ s = 22 }) => <Ico size={s}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></Ico>;
const IGlobe = ({ s = 22 }) => <Ico size={s}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></Ico>;
const IShield = ({ s = 20 }) => <Ico size={s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Ico>;
const IZap = ({ s = 20 }) => <Ico size={s}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Ico>;
const ILock = ({ s = 20 }) => <Ico size={s}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></Ico>;
const ICode = ({ s = 20 }) => <Ico size={s}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></Ico>;
const IDatabase = ({ s = 20 }) => <Ico size={s}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></Ico>;
const ISend = ({ s = 15 }) => <Ico size={s} sw={2.5}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></Ico>;

const IEye = ({ s = 20 }) => <Ico size={s}><circle cx="12" cy="12" r="3" /><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /></Ico>;
const ISkull = ({ s = 20 }) => <Ico size={s}><path d="M12 2a8 8 0 0 0-8 8v1a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-1a8 8 0 0 0-8-8z" /><path d="M16 14v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4" /><path d="M8 9a1 1 0 1 0 2 0 1 1 0 1 0-2 0z" /><path d="M14 9a1 1 0 1 0 2 0 1 1 0 1 0-2 0z" /><path d="M12 12a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1z" /></Ico>;
const IBrain = ({ s = 20 }) => <Ico size={s}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-4.12 2.5 2.5 0 0 1 0-4.88A2.5 2.5 0 0 1 9.5 2z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-4.12 2.5 2.5 0 0 0 0-4.88A2.5 2.5 0 0 0 14.5 2z" /></Ico>;
const IShieldCheck = ({ s = 20 }) => <Ico size={s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 11 11 13 15 9" /></Ico>;
const IFingerprint = ({ s = 20 }) => <Ico size={s}><path d="M12 22v-4M9 18v-2M15 18v-2M12 8a4 4 0 0 0-4 4v3M16 12a4 4 0 0 0-8 0v3M12 4a8 8 0 0 0-8 8v3M20 12a8 8 0 0 0-16 0v3" /></Ico>;
const IBug = ({ s = 20 }) => <Ico size={s}><rect width="8" height="14" x="8" y="5" rx="4" /><path d="M18 8h-2M6 8h2M18 12h-2M6 12h2M18 16h-2M6 16h2M12 2v3M8 3a4 4 0 0 1 8 0" /></Ico>;

function getTrackEmoji(t) {
  if (!t) return '';
  if (t.includes('Red Team') || t.includes('Offensive')) return '💥';
  if (t.includes('Adversarial') || t.includes('AI Safety')) return '🤖';
  if (t.includes('Crypto') || t.includes('Cryptography')) return '🔐';
  if (t.includes('Network') || t.includes('Zero-Trust')) return '🛡️';
  if (t.includes('Smart Contract') || t.includes('Web3')) return '⛓️';
  return '💡';
}

/* ══════════════════════════════════════════════════════════
   BACKGROUND VIDEO
 ══════════════════════════════════════════════════════════ */
function BackgroundVideo() {
  const containerRef = useRef(null);
  const vidRef = useRef(null);
  const prevX = useRef(null);
  const tgt = useRef(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0, active: false });

  /* Desktop scrubbing & mouse tracking */
  useEffect(() => {
    const v = vidRef.current; if (!v) return;
    const container = containerRef.current;
    const onSeeked = () => { };
    const onMove = e => {
      if (window.innerWidth < 1024) return;

      // Track coordinates relative to container
      if (container) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMouse({ x, y, active: true });
      }

      // Scrubbing logic
      const cx = e.clientX;
      if (prevX.current === null) { prevX.current = cx; return; }
      const delta = cx - prevX.current; prevX.current = cx;
      if (!v.duration) return;
      tgt.current += (delta / window.innerWidth) * 0.8 * v.duration;
      tgt.current = Math.max(0, Math.min(v.duration, tgt.current));
      v.currentTime = tgt.current;
    };
    const onLeave = () => setMouse(p => ({ ...p, active: false }));
    v.addEventListener('seeked', onSeeked);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      v.removeEventListener('seeked', onSeeked);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  /* Mobile autoplay */
  useEffect(() => {
    const v = vidRef.current; if (!v) return;
    const check = () => { if (window.innerWidth < 1024) { v.autoplay = true; v.loop = true; v.play().catch(() => { }); } };
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div ref={containerRef} className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-[#040E1A] lg:bg-transparent">
      <video ref={vidRef} muted playsInline preload="auto"
        className="w-full h-full object-cover object-right lg:object-right-bottom">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4" type="video/mp4" />
      </video>
      {/* Desktop fade overlay */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to right,rgba(8,12,10,.95) 36%,rgba(8,12,10,.4) 65%,transparent 100%)' }} />

      {/* Surreal Scanner Lens follow effect */}
      {mouse.active && (
        <div
          className="hidden lg:block absolute rounded-full pointer-events-none mix-blend-screen transition-all duration-75 ease-out"
          style={{
            width: '320px',
            height: '320px',
            left: `${mouse.x - 160}px`,
            top: `${mouse.y - 160}px`,
            background: 'radial-gradient(circle, rgba(196,30,58,0.22) 0%, rgba(139,0,0,0.06) 45%, transparent 70%)',
            backdropFilter: 'blur(3px) saturate(220%) contrast(110%)',
            border: '1px solid rgba(196,30,58,0.15)',
            boxShadow: 'inset 0 0 20px rgba(196,30,58,0.1), 0 0 30px rgba(196,30,58,0.05)',
          }}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   NAVBAR
 ══════════════════════════════════════════════════════════ */
function Navbar() {
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { l: 'Tracks', h: '#tracks-section' },
    { l: 'Timeline', h: '#timeline-section' },
    { l: 'Judges', h: '#judges-section' },
    { l: 'Sponsors', h: '#sponsors-section' },
  ];

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 px-5 sm:px-8 py-3.5 sm:py-4 flex flex-row justify-between items-center transition-all duration-300 ${scrolled
        ? 'bg-[#040E1A]/75 backdrop-blur-xl border-b border-[#C41E3A]/20 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7)]'
        : 'bg-[#040E1A]/25 backdrop-blur-md border-b border-transparent'
        }`}>
        {/* Logo */}
        <div className="flex flex-row items-end gap-3">
          <span className="text-[21px] sm:text-[26px] tracking-tight text-[#F0E8D8] font-medium select-none">REVA Hackurity</span>
          <span className="text-[25px] sm:text-[30px] text-[#F0E8D8] select-none tracking-[-0.02em] font-medium leading-none mb-1">&#10033;</span>
        </div>

        {/* Desktop nav with glassy slider */}
        <div ref={containerRef} className="hidden md:flex flex-row items-center gap-6 relative">

          {/* Glassy Liquid background pill */}
          <div
            className="absolute rounded-lg bg-[#C41E3A]/10 border border-[#C41E3A]/30 shadow-[0_0_12px_rgba(196,30,58,0.15)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none"
            style={{
              left: hovered ? `${hovered.left}px` : '0px',
              width: hovered ? `${hovered.width}px` : '0px',
              height: hovered ? `${hovered.height}px` : '0px',
              top: hovered ? `${hovered.top}px` : '0px',
              opacity: hovered ? 1 : 0,
            }}
          />

          <nav className="flex flex-row items-center text-base text-[#F0E8D8] gap-1 relative">
            {links.map((l, i) => (
              <Fragment key={l.l}>
                <a
                  href={l.h}
                  onMouseEnter={e => {
                    const el = e.currentTarget;
                    const parent = containerRef.current;
                    if (!parent) return;
                    const rect = el.getBoundingClientRect();
                    const pRect = parent.getBoundingClientRect();
                    setHovered({
                      left: rect.left - pRect.left,
                      width: rect.width,
                      height: rect.height,
                      top: rect.top - pRect.top,
                    });
                  }}
                  onMouseLeave={() => setHovered(null)}
                  className="px-3.5 py-1.5 hover:text-[#EF4444] transition-colors relative z-10 font-medium"
                >
                  {l.l}
                </a>
                {i < links.length - 1 && <span className="opacity-30 select-none px-1">/</span>}
              </Fragment>
            ))}
          </nav>

          <span>
            <a
              href="#cta-section"
              onMouseEnter={e => {
                const el = e.currentTarget;
                const parent = containerRef.current;
                if (!parent) return;
                const rect = el.getBoundingClientRect();
                const pRect = parent.getBoundingClientRect();
                setHovered({
                  left: rect.left - pRect.left,
                  width: rect.width,
                  height: rect.height,
                  top: rect.top - pRect.top,
                });
              }}
              onMouseLeave={() => setHovered(null)}
              className="px-3.5 py-1.5 text-base text-[#F0E8D8] underline underline-offset-4 hover:text-[#EF4444] transition-colors relative z-10 font-medium"
            >
              Contact
            </a>
          </span>
        </div>

        {/* Hamburger */}
        <button onClick={() => setOpen(o => !o)} id="mobile-menu-btn" aria-label="Toggle menu"
          className="md:hidden flex flex-col gap-[5px] justify-center items-center w-8 h-8">
          <span className={`block w-6 h-[2px] bg-[#F0E8D8] transition-all duration-300${open ? ' rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-6 h-[2px] bg-[#F0E8D8] transition-all duration-300${open ? ' opacity-0' : ''}`} />
          <span className={`block w-6 h-[2px] bg-[#F0E8D8] transition-all duration-300${open ? ' -rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </header>

      {/* Mobile overlay */}
      <div className={`fixed inset-0 z-40 bg-[#040E1A]/95 backdrop-blur-sm flex flex-col justify-center items-center gap-8 md:hidden transition-opacity duration-300${open ? ' opacity-100 pointer-events-auto' : ' opacity-0 pointer-events-none'}`}>
        {links.map(l => (
          <a key={l.l} href={l.h} onClick={() => setOpen(false)}
            className="text-2xl font-medium text-[#F0E8D8] hover:text-[#EF4444] transition-colors">{l.l}</a>
        ))}
        <a href="#cta-section" onClick={() => setOpen(false)}
          className="text-lg text-[#F0E8D8] underline underline-offset-4 hover:text-[#EF4444] transition-colors">
          Contact
        </a>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   SERVICE PILLS
 ══════════════════════════════════════════════════════════ */
const SERVICE_OPTIONS = ['🌐 Web & Cloud Security', '🔐 Cryptography', '⚙️ Reverse Engineering', '🛡️ AI Safety & Defense'];

function ServicePills() {
  const [selected, setSelected] = useState([]);
  const toggle = s => setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const active = selected.length > 0;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .35 }}>
      <p className="text-lg font-semibold tracking-tight mb-2">I'm interested in</p>
      <p className="text-sm mb-8 text-[#C4A882]">Select interests (optional)</p>

      <div className="flex flex-wrap gap-3 mb-5">
        {SERVICE_OPTIONS.map(s => {
          const on = selected.includes(s);
          return (
            <motion.button key={s} id={'pill-' + s.toLowerCase()}
              onClick={() => toggle(s)}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}
              className={'flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-medium outline-none transition-colors duration-150 ' + (on
                ? 'bg-[#C41E3A] text-[#ffffff] font-bold shadow-md'
                : 'bg-[#0A1A30] text-[#F0E8D8] border border-[#1A3055] hover:bg-[#0D2040]')}>
              {on && <span className="flex items-center"><ICheck s={12} /></span>}
              {s}
            </motion.button>
          );
        })}
      </div>

      {/* Contingent status banner */}
      <AnimatePresence mode="wait">
        {!active ? (
          <motion.p key="empty"
            initial={{ opacity: 0 }} animate={{ opacity: .5 }} exit={{ opacity: 0 }} transition={{ duration: .2 }}
            className="text-xs text-[#A8896A]">
            Select your interests to continue.
          </motion.p>
        ) : (
          <motion.div key="active"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: .3, ease: 'easeInOut' }} className="overflow-hidden">
            <div className="flex items-center justify-between gap-4 bg-[#071428] border border-[#1A3055] rounded-2xl px-5 py-4">
              <p className="text-sm text-[#C4A882] font-medium">
                You've selected: <strong className="font-semibold text-[#F0E8D8]">{selected.join(', ')}</strong>
              </p>
              <a href="#cta-section"
                className="flex items-center gap-1.5 font-semibold text-xs tracking-normal whitespace-nowrap text-[#C41E3A] hover:text-[#EF4444] transition-colors">
                Proceed <IArrow s={12} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   HERO CONTENT
 ══════════════════════════════════════════════════════════ */
function HeroContent() {
  const { displayed, done } = useTypewriter("Build. Defend.\nSecure the Future.", 38, 600);
  return (
    <div className="relative z-10 flex flex-col order-first lg:order-none w-full bg-[#040E1A] lg:bg-transparent pb-8 lg:pb-0 lg:min-h-screen">
      <main id="spade-hero" className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center">

        {/* Hackcurity badge */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .2 }}
          className="flex items-center gap-2 mb-8">
          <span className="w-[7px] h-[7px] rounded-full bg-[#C41E3A]" />
          <span className="text-[12px] font-semibold tracking-widest text-[#C41E3A]">REVA UNIVERSITY  CSE DEPARTMENT</span>
        </motion.div>

        {/* Headline with typewriter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <h1 className="text-5xl md:text-6xl lg:text-[76px] font-normal tracking-tight text-[#F0E8D8] leading-[1.08] mb-8 select-none w-full whitespace-pre-wrap">
            {displayed}
            {!done && <span className="inline-block w-[2px] h-[1.1em] bg-[#C41E3A] align-middle ml-[2px] animate-blink" />}
          </h1>
        </motion.div>

        {/* Description */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .1 }}>
          <p className="text-base md:text-lg text-[#C4A882] leading-relaxed font-normal mb-14 max-w-2xl">
            Welcome to the REVA University Cybersecurity Club. We foster hands-on skills in ethical hacking, cryptography, and defense engineering. Join us for Hackcurity 2026, a flagship 48-hour hackathon where minds collide to solve real-world security challenges.
          </p>
        </motion.div>

        {/* Event chips */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .22 }}
          className="flex flex-wrap items-center gap-3 mb-12">
          {[
            { I: ICalendar, t: 'August 2–5, 2026' },
            { I: IPin, t: 'REVA University Campus, Bengaluru' },
            { I: IUsers, t: 'Teams of 1–4' },
            { I: IClock, t: '48-Hour Sprint' },
          ].map(({ I, t }) => (
            <div key={t} className="flex items-center gap-1.5 text-sm text-[#A8896A] bg-[#071428] border border-[#1A3055] rounded-lg px-3 py-1.5">
              <I />{t}
            </div>
          ))}
        </motion.div>

        <ServicePills />
      </main>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION HEADER
 ══════════════════════════════════════════════════════════ */
function SectionHeader({ tag, h2, sub }) {
  const [ref, vis] = useInView(0.2);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={vis ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: .6 }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-[2px] rounded bg-[#C41E3A]" />
        <span className="text-[12px] font-semibold tracking-wide text-[#C41E3A]">{tag}</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#F0E8D8] leading-tight mb-4">{h2}</h2>
      {sub && <p className="text-base text-[#C4A882] leading-relaxed max-w-xl">{sub}</p>}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   STATS BAR
 ══════════════════════════════════════════════════════════ */
function StatsBar() {
  const [ref, vis] = useInView();
  const stats = [
    { v: '$25,000', I: ITrophy, l: 'Prize Pool' },
    { v: '500+', I: IUsers, l: 'Participants' },
    { v: '48h', I: IClock, l: 'Duration' },
    { v: 'Global', I: IGlobe, l: 'Open to All' },
  ];
  return (
    <section ref={ref} className="bg-[#071428] text-[#F0E8D8] border-y border-[#1A3055] py-11 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map(({ v, I, l }, i) => (
          <motion.div key={l} initial={{ opacity: 0, y: 20 }}
            animate={vis ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: .5, delay: i * .08 }}
            className="flex flex-col items-center gap-2 text-center">
            <I s={22} className="text-[#C41E3A]" />
            <span className="text-2xl font-bold tracking-tight text-[#F0E8D8]">{v}</span>
            <span className="text-xs font-medium tracking-wide text-[#C4A882]">{l}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   TRACKS
 ══════════════════════════════════════════════════════════ */
const TRACKS = [
  { color: '#F87171', tag: 'Offensive', title: 'Red Team & Exploitation', desc: 'CTF-style flags, live targets, and zero-day simulation in enterprise environments.', domain: 'Penetration Testing & Exploitation', problemStatement: 'To Be Announced', I: IShield },
  { color: '#60A5FA', tag: 'AI Safety', title: 'Adversarial ML & AI Security', desc: 'Prompt injection, model poisoning, and differential privacy challenges on live models.', domain: 'AI & Machine Learning Security', problemStatement: 'To Be Announced', I: IZap },
  { color: '#FBBF24', tag: 'Cryptography', title: 'Crypto & Protocol Attacks', desc: 'Break weak implementations, forge signatures, exploit misconfigurations in protocols.', domain: 'Cryptographic Systems', problemStatement: 'To Be Announced', I: ILock },
  { color: '#34D399', tag: 'Zero-Trust', title: 'Network & Identity Defense', desc: 'Design and stress-test zero-trust architectures and IAM policies under live attack.', domain: 'Zero-Trust Architecture', problemStatement: 'To Be Announced', I: IGlobe },
  { color: '#C084FC', tag: 'Web3', title: 'Smart Contract Auditing', desc: 'Hunt bugs in Solidity, exploit reentrancy and flash-loan vulnerabilities in DeFi.', domain: 'Blockchain & Smart Contracts', problemStatement: 'To Be Announced', I: IDatabase },
  { color: '#F472B6', tag: 'Open', title: 'Open Innovation Track', desc: 'No constraints. Build any security tool or research that makes the world safer.', domain: 'Security Research & Innovation', problemStatement: 'To Be Announced', I: ICode },
];

function TrackCard({ track, delay }) {
  const [ref, vis] = useInView();
  const tiltRef = useTilt(10);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }}
      animate={vis ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} transition={{ duration: .5, delay }}>
      <div ref={tiltRef} className="tilt h-full rounded-2xl border border-[#1A3055] bg-[#071428] p-6 flex flex-col">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
          style={{ background: '#0D2040', color: track.color }}>
          <track.I s={18} />
        </div>
        <div className="text-lg font-semibold text-[#F0E8D8] mb-1">{getTrackEmoji(track.title)} {track.title}</div>
        <div className="text-xs text-[#A8896A] mb-3 font-medium">{track.domain}</div>
        <div className="text-sm text-[#C4A882] leading-relaxed mb-4 flex-1">{track.desc}</div>
        <div className="flex items-center justify-between gap-3">
          <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-lg"
            style={{ background: track.color + '12', color: track.color }}>{getTrackEmoji(track.tag)} {track.tag}</span>
          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#0E1E3A] text-[#C41E3A]">
            {track.problemStatement}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function TracksSection() {
  return (
    <section id="tracks-section" className="py-24 px-6 bg-[#040E1A]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader tag="Challenge Tracks" h2={<>Pick Your Path</>}
          sub="Choose from six specialized security challenges with dedicated prizes, mentors, and real-world scenarios." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
          {TRACKS.map((t, i) => <TrackCard key={t.title} track={t} delay={i * .07} />)}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   TIMELINE
 ══════════════════════════════════════════════════════════ */
const TL = [
  { ph: '01', c: '#C4A882', l: '📝 Registration Opens', d: 'July 1, 2026', t: 'Sign up solo or as a team of up to 4. Early registrants receive a Hackcurity swag kit.' },
  { ph: '02', c: '#C4A882', l: '🔓 Problem Statements Released', d: 'July 15, 2026', t: 'All five challenge tracks go live. Study the briefs and start planning your approach.' },
  { ph: '03', c: '#C4A882', l: '💬 Mentor Office Hours Begin', d: 'July 22, 2026', t: 'Weekly 1:1 sessions with industry mentors. Get feedback before the hackathon starts.' },
  { ph: '04', c: '#C4A882', l: '🚀 48-Hour Hackathon Kicks Off', d: 'Aug 2, 2026 — 09:00 IST', t: 'The clock starts. Build, break, defend. Mentors available around the clock.' },
  { ph: '05', c: '#C4A882', l: '🔒 Final Submissions Locked', d: 'Aug 4, 2026 — 09:00 IST', t: 'All code repositories freeze. Prepare your 5-minute demo pitch for the judges.' },
  { ph: '06', c: '#C4A882', l: '🏆 Awards & Closing Ceremony', d: 'August 5, 2026', t: 'Winners announced live. $25,000 distributed across five tracks. See you on stage!' },
];
function TLItem({ item, delay }) {
  const [ref, vis] = useInView();
  const tiltRef = useTilt(4);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, x: -24 }}
      animate={vis ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }} transition={{ duration: .5, delay }}
      className="flex items-start gap-5 lg:gap-8">
      <div className="hidden lg:flex flex-shrink-0 w-[104px] flex-col items-center">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-md"
          style={{ background: item.c }}>{item.ph}</div>
      </div>
      <div ref={tiltRef} className="tilt flex-1 bg-[#0A1A30] border border-[#1A3055] rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="lg:hidden w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
            style={{ background: item.c }}>{item.ph}</div>
          <div>
            <div className="text-base font-semibold text-[#F0E8D8]">{item.l}</div>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[#C4A882] font-medium">
              <ICalendar s={12} />{item.d}
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-[#C4A882] leading-relaxed">{item.t}</p>
      </div>
    </motion.div>
  );
}

function TimelineSection() {
  return (
    <section id="timeline-section" className="py-24 px-6 bg-[#071428] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeader tag="Timeline" h2="Event Schedule"
          sub="Stay on track with all key dates and important milestones from registration through awards." />
        <div className="relative flex flex-col gap-5 mt-14">
          <div className="hidden lg:block absolute left-[52px] top-6 bottom-6 w-[2px] rounded-full"
            style={{ background: 'linear-gradient(to bottom,#1A3055,#1E3A5F,#1A3055)' }} />
          {TL.map((item, i) => <TLItem key={item.ph} item={item} delay={i * .08} />)}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   JUDGES
 ══════════════════════════════════════════════════════════ */
const JUDGES = [
  { n: 'Priya Raman', r: 'Head of Security Research', o: 'CipherCore', I: IEye, c: '#0A1A30' },
  { n: 'Ankit Mehta', r: 'Principal Red Team Engineer', o: 'NullByte Labs', I: ISkull, c: '#0A1A30' },
  { n: 'Sofia Chen', r: 'AI Safety Researcher', o: 'DeepGuard AI', I: IBrain, c: '#0A1A30' },
  { n: 'Marcus Webb', r: 'CISO', o: 'VaultSec', I: IShieldCheck, c: '#0A1A30' },
  { n: 'Dev Kapoor', r: 'Cryptography Engineer', o: 'Enclave.io', I: IFingerprint, c: '#0A1A30' },
];

function JudgeCard({ j, delay }) {
  const [ref, vis] = useInView();
  const tiltRef = useTilt(8);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }}
      animate={vis ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: .5, delay }}>
      <div ref={tiltRef} className="tilt flex flex-col items-center gap-3 text-center p-6 rounded-2xl border border-[#1A3055] bg-[#071428]">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-semibold border border-current"
          style={{ background: j.c + '20', color: j.c }}>
          <j.I s={28} />
        </div>
        <div>
          <div className="text-base font-semibold text-[#F0E8D8]">{j.n}</div>
          <div className="text-sm text-[#C4A882] leading-snug mt-0.5">{j.r}</div>
        </div>
        <div className="text-xs font-semibold px-2 py-0.5 rounded bg-[#C41E3A]/10 text-[#C41E3A] border border-[#C41E3A]/20">{j.o}</div>
      </div>
    </motion.div>
  );
}

function JudgesSection() {
  return (
    <section id="judges-section" className="py-24 px-6 bg-[#040E1A]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader tag="The Team" h2="Judges & Mentors"
          sub="Experienced security leaders and researchers guiding and evaluating your work." />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mt-14">
          {JUDGES.map((j, i) => <JudgeCard key={j.n + '-' + i} j={j} delay={i * .055} />)}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   SPONSORS
 ══════════════════════════════════════════════════════════ */
function SponsorsSection() {
  const [ref, vis] = useInView();
  const tiers = [
    {
      l: 'Gold',
      badgeClass: 'text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/5',
      cardClass: 'border-[#C41E3A]/20 bg-[#1A1112]/30 text-white font-semibold text-lg px-8 py-4 shadow-[0_0_15px_-3px_rgba(196,30,58,0.08)] hover:border-[#C41E3A]/60 hover:shadow-[0_0_20px_-1px_rgba(196,30,58,0.2)] hover:text-[#EF4444]',
      ns: [
        { name: 'CipherCore', icon: '🔒' },
        { name: 'NullByte Labs', icon: '🧪' },
        { name: 'VaultSec', icon: '🔑' }
      ]
    },
    {
      l: 'Silver',
      badgeClass: 'text-[#E5E7EB] border-[#E5E7EB]/20 bg-[#E5E7EB]/5',
      cardClass: 'border-[#1A3055] bg-[#0A1A30]/30 text-[#C4A882] font-medium text-base px-6 py-3 hover:border-[#C41E3A]/50 hover:bg-[#0D2040]/30 hover:text-white',
      ns: [
        { name: 'GridIron', icon: '🌐' },
        { name: 'RedThread', icon: '🧵' },
        { name: 'Enclave.io', icon: '🏰' },
        { name: 'KeyHaven', icon: '🗝️' }
      ]
    },
    {
      l: 'Community',
      badgeClass: 'text-[#C41E3A] border-[#C41E3A]/30 bg-[#C41E3A]/5',
      cardClass: 'border-[#1A3055]/60 bg-[#071428]/30 text-[#A8896A] font-medium text-sm px-5 py-2.5 hover:border-[#C41E3A]/40 hover:bg-[#0A1A30]/30 hover:text-[#F0E8D8]',
      ns: [
        { name: 'HackClub', icon: '🛸' },
        { name: 'OWASP', icon: '🐝' },
        { name: 'DEF CON', icon: '💀' },
        { name: 'BugBounty.dev', icon: '🐛' },
        { name: 'SecureX', icon: '🛡️' }
      ]
    }
  ];

  return (
    <section id="sponsors-section" className="bg-[#071428] border-y border-[#1A3055] py-24 px-6">
      <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={vis ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: .6 }}
        className="max-w-7xl mx-auto flex flex-col items-center">

        {/* Section Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-[2px] rounded bg-[#C41E3A]" />
            <span className="text-xs font-semibold tracking-wide text-[#C41E3A] uppercase">Partners</span>
            <div className="w-4 h-[2px] rounded bg-[#C41E3A]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#F0E8D8] mb-3">Backed by Industry Leaders</h2>
          <p className="text-sm text-[#C4A882] max-w-md mx-auto">Hackurity 2026 is made possible through the generous support of our security community partners.</p>
        </div>

        <div className="flex flex-col gap-12 w-full items-center">
          {tiers.map(t => (
            <div key={t.l} className="flex flex-col items-center gap-5 w-full">
              <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${t.badgeClass}`}>
                {t.l} Partners
              </span>
              <div className="flex flex-wrap justify-center gap-4 max-w-4xl w-full">
                {t.ns.map(n => (
                  <motion.div
                    key={n.name}
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 16 }}
                    className={`flex items-center gap-2.5 rounded-xl border backdrop-blur-sm cursor-default transition-colors duration-200 ${t.cardClass}`}
                  >
                    <span className="text-xl leading-none">{n.icon}</span>
                    <span>{n.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   CONTACT FORM
 ══════════════════════════════════════════════════════════ */
function ContactForm() {
  const [st, setSt] = useState({ name: '', email: '', org: '', msg: '' });
  const [status, setS] = useState(null);
  const magRef = useMagnetic(0.4);
  const inp = "w-full border-[1.5px] border-[#1A3055] rounded-lg px-4 py-3 text-base font-[inherit] text-[#F0E8D8] bg-[#0A1A30] focus:outline-none focus:border-[#C41E3A] focus:bg-[#0D2040] transition-all duration-200";

  const submit = e => {
    e.preventDefault();
    if (!st.name || !st.email || !st.msg) { setS('err'); return; }
    setS('sending');
    setTimeout(() => { setS('done'); setSt({ name: '', email: '', org: '', msg: '' }); }, 1300);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#F0E8D8]">Name</label>
          <input className={inp} type="text" placeholder="Your name"
            value={st.name} onChange={e => setSt(p => ({ ...p, name: e.target.value }))} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#F0E8D8]">Email</label>
          <input className={inp} type="email" placeholder="your@email.com"
            value={st.email} onChange={e => setSt(p => ({ ...p, email: e.target.value }))} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#F0E8D8]">
          Organization <span style={{ opacity: .5, fontWeight: 400 }}>(optional)</span>
        </label>
        <input className={inp} type="text" placeholder="Your organization"
          value={st.org} onChange={e => setSt(p => ({ ...p, org: e.target.value }))} />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#F0E8D8]">Message</label>
        <textarea className={inp + ' resize-y min-h-[110px]'}
          placeholder="Tell us how we can help..."
          value={st.msg} onChange={e => setSt(p => ({ ...p, msg: e.target.value }))} />
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <span ref={magRef}>
          <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }}
            disabled={status === 'sending' || status === 'done'}
            className="flex items-center gap-2 bg-[#C41E3A] text-[#ffffff] px-6 py-3 rounded-lg text-base font-bold tracking-tight shadow-lg hover:shadow-xl hover:bg-[#EF4444] transition-all disabled:opacity-60">
            {status === 'sending' ? 'Sending…' : status === 'done' ? '✓ Sent!' : <><span>Send</span><ISend s={15} /></>}
          </motion.button>
        </span>
        {status === 'err' && <p className="text-sm text-red-500">Please fill in all required fields.</p>}
        {status === 'done' && <p className="text-sm font-medium text-green-500">Thanks! We'll be in touch soon.</p>}
      </div>
    </form>
  );
}

/* ══════════════════════════════════════════════════════════
   REGISTRATION MODAL  (3-step)
 ══════════════════════════════════════════════════════════ */
const TRACKS_LIST = [
  'Red Team & Exploitation',
  'Adversarial ML & AI Security',
  'Crypto & Protocol Attacks',
  'Network & Identity Defense',
  'Smart Contract Auditing',
  'Open Innovation Track',
];
const ROLES = ['Developer', 'Security Researcher', 'Designer', 'Product / Other'];
const SIZES = ['1 (Solo)', '2', '3', '4'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

function RegModal({ onClose }) {
  const [step, setStep] = useState(1);   // 1 | 2 | 3 | 'done'
  const [errors, setErrs] = useState({});

  // ── Step 1: Team basics ──────────────────────────
  const [team, setTeam] = useState({
    name: '', size: '', institution: '', track: '', level: '',
  });

  // ── Step 2: Members (up to 4 rows) ───────────────
  const blankMember = () => ({ name: '', email: '', role: '', github: '' });
  const [members, setMembers] = useState([blankMember()]);

  // ── Step 3: Project idea + agreements ────────────
  const [extra, setExtra] = useState({ idea: '', terms: false, conduct: false });

  // ── Shared input style ────────────────────────────
  const inp = (err) =>
    `w-full border-[1.5px] ${err ? 'border-red-500' : 'border-[#1A3055]'} rounded-[10px] px-4 py-[10px] text-[.9rem] font-[inherit] text-[#F0E8D8] bg-[#0A1A30] focus:outline-none focus:border-[#C41E3A] focus:bg-[#0D2040] transition-all duration-200`;

  // close on Escape
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, []);

  // prevent body scroll while modal open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // ── Validation ────────────────────────────────────
  function validateStep1() {
    const e = {};
    if (!team.name.trim()) e.name = 'Team name is required.';
    if (!team.size) e.size = 'Select team size.';
    if (!team.track) e.track = 'Select a challenge track.';
    if (!team.level) e.level = 'Select your experience level.';
    setErrs(e);
    return Object.keys(e).length === 0;
  }
  function validateStep2() {
    const e = {};
    const count = parseInt(team.size) || 1;
    members.slice(0, count).forEach((m, i) => {
      if (!m.name.trim()) e[`m${i}name`] = 'Name required';
      if (!m.email.trim()) e[`m${i}email`] = 'Email required';
      else if (!/^[^@]+@[^@]+\.[^@]+$/.test(m.email)) e[`m${i}email`] = 'Valid email required';
      if (!m.role) e[`m${i}role`] = 'Role required';
    });
    setErrs(e);
    return Object.keys(e).length === 0;
  }
  function validateStep3() {
    const e = {};
    if (!extra.idea.trim()) e.idea = 'Please share a brief project idea.';
    if (!extra.terms) e.terms = 'You must accept the Terms & Conditions.';
    if (!extra.conduct) e.conduct = 'You must accept the Code of Conduct.';
    setErrs(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3) {
      if (!validateStep3()) return;
      setStep('done'); return;
    }
    const count = parseInt(team.size) || 1;
    // Ensure member array matches selected size
    setMembers(prev => {
      const arr = [...prev];
      while (arr.length < count) arr.push(blankMember());
      return arr.slice(0, count);
    });
    setErrs({});
    setStep(s => s + 1);
  }
  function back() { setErrs({}); setStep(s => s - 1); }

  const memberCount = parseInt(team.size) || 1;

  // ── Stepper UI ────────────────────────────────────
  const STEPS = ['Team Info', 'Members', 'Project'];

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      {/* Modal panel */}
      <div className="relative bg-[#071428] border border-[#1A3055] w-full max-w-2xl rounded-[24px] shadow-2xl overflow-hidden"
        style={{ maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-[#1A3055] flex-shrink-0">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-4 h-[2px] rounded bg-[#C41E3A]" />
                <span className="text-xs font-semibold tracking-wide text-[#C41E3A]">Hackcurity 2026</span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-[#F0E8D8]">
                {step === 'done' ? 'You\'re registered! 🎉' : 'Register Your Team'}
              </h2>
              {step !== 'done' && <p className="text-sm text-[#C4A882] mt-1">Free registration · 500+ participants · $25,000 in prizes</p>}
            </div>
            <button onClick={onClose} aria-label="Close"
              className="w-9 h-9 rounded-full flex items-center justify-center border border-[#1A3055] bg-[#0A1A30] hover:bg-[#0D2040] transition-colors flex-shrink-0 mt-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A8896A" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>

          {/* Step progress */}
          {step !== 'done' && (
            <div className="flex items-center gap-0">
              {STEPS.map((label, i) => {
                const num = i + 1;
                const done = num < step;
                const curr = num === step;
                return (
                  <Fragment key={label}>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${done ? 'bg-[#C41E3A] text-[#ffffff]' :
                        curr ? 'bg-[#EF4444] text-[#ffffff] shadow-md shadow-emerald-950/20' :
                          'bg-[#0A1A30] text-[#A8896A] border border-[#1A3055]'
                        }`}>
                        {done ? <ICheck s={13} /> : num}
                      </div>
                      <span className={`text-[.65rem] font-semibold uppercase tracking-wider ${curr ? 'text-[#EF4444]' : done ? 'text-[#C41E3A]' : 'text-[#A8896A]'
                        }`}>{label}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-[2px] mx-2 mb-5 rounded-full transition-all duration-500 ${done ? 'bg-[#C41E3A]' : 'bg-[#1A3055]'
                        }`} />
                    )}
                  </Fragment>
                );
              })}
            </div>
          )}
        </div>

        {/* Body (scrollable) */}
        <div className="flex-1 overflow-y-auto px-8 py-6">

          {/* ── STEP 1: Team Info ── */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#F0E8D8] flex items-center gap-1.5">👥 Team Name *</label>
                  <input className={inp(errors.name)} type="text" placeholder="e.g. Threat Research Team"
                    value={team.name} onChange={e => setTeam(p => ({ ...p, name: e.target.value }))} />
                  {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#F0E8D8] flex items-center gap-1.5">🔢 Team Size *</label>
                  <select className={inp(errors.size)} value={team.size}
                    onChange={e => setTeam(p => ({ ...p, size: e.target.value }))}>
                    <option value="">Select…</option>
                    {SIZES.map(s => <option key={s} value={s.charAt(0)}>{s} member{s.charAt(0) !== '1' ? 's' : ''}</option>)}
                  </select>
                  {errors.size && <span className="text-[.72rem] text-red-500">{errors.size}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#F0E8D8] flex items-center gap-1.5">🏢 Organization <span className="normal-case font-normal opacity-50">(optional)</span></label>
                <input className={inp(false)} type="text" placeholder="University or company"
                  value={team.institution} onChange={e => setTeam(p => ({ ...p, institution: e.target.value }))} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#F0E8D8] flex items-center gap-1.5">🎯 Challenge Track *</label>
                <select className={inp(errors.track)} value={team.track}
                  onChange={e => setTeam(p => ({ ...p, track: e.target.value }))}>
                  <option value="">Choose a track…</option>
                  {TRACKS_LIST.map(t => <option key={t} value={t}>{getTrackEmoji(t)} {t}</option>)}
                </select>
                {errors.track && <span className="text-[.72rem] text-red-500">{errors.track}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#F0E8D8] flex items-center gap-1.5">⚡ Experience Level *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {LEVELS.map(l => (
                    <button key={l} type="button" onClick={() => setTeam(p => ({ ...p, level: l }))}
                      className={`py-2 px-3 rounded-[10px] text-sm font-medium border transition-all duration-150 text-center ${team.level === l
                        ? 'bg-[#C41E3A] text-[#ffffff] border-[#C41E3A] font-bold shadow-md'
                        : 'bg-[#0A1A30] text-[#F0E8D8] border-[#1A3055] hover:border-[#C41E3A]'
                        }`}>{l}</button>
                  ))}
                </div>
                {errors.level && <span className="text-[.72rem] text-red-500">{errors.level}</span>}
              </div>

              {/* Info pill */}
              <div className="flex items-start gap-3 bg-[#0A1A30] border border-[#1A3055] rounded-2xl px-4 py-3 mt-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C41E3A" strokeWidth="2" strokeLinecap="round" style={{ marginTop: 1, flexShrink: 0 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                <p className="text-sm text-[#C4A882] leading-relaxed">
                  You can change tracks until <strong className="text-[#F0E8D8]">July 25, 2026</strong>. All tracks have equal prize eligibility.
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 2: Team Members ── */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              {Array.from({ length: memberCount }, (_, i) => (
                <div key={i} className="rounded-[16px] border border-[#1A3055] bg-[#0A1A30] p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[.7rem] font-bold flex-shrink-0"
                      style={{ background: ['#C41E3A', '#EF4444', '#991B1B', '#7F1D1D'][i], color: '#ffffff' }}>{i + 1}</div>
                    <span className="text-sm font-semibold text-[#F0E8D8]">
                      {i === 0 ? 'Team Leader (you)' : `Member ${i + 1}`}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#F0E8D8] flex items-center gap-1.5">👤 Full Name *</label>
                      <input className={inp(errors[`m${i}name`])} type="text" placeholder="Your name"
                        value={members[i]?.name || ''}
                        onChange={e => setMembers(arr => { const a = [...arr]; a[i] = { ...a[i], name: e.target.value }; return a; })} />
                      {errors[`m${i}name`] && <span className="text-xs text-red-500">{errors[`m${i}name`]}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#F0E8D8] flex items-center gap-1.5">✉️ Email *</label>
                      <input className={inp(errors[`m${i}email`])} type="email" placeholder="name@email.com"
                        value={members[i]?.email || ''}
                        onChange={e => setMembers(arr => { const a = [...arr]; a[i] = { ...a[i], email: e.target.value }; return a; })} />
                      {errors[`m[` + i + `]email`] && <span className="text-xs text-red-500">{errors[`m${i}email`]}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#F0E8D8] flex items-center gap-1.5">🛠️ Role *</label>
                      <select className={inp(errors[`m${i}role`])}
                        value={members[i]?.role || ''}
                        onChange={e => setMembers(arr => { const a = [...arr]; a[i] = { ...a[i], role: e.target.value }; return a; })}>
                        <option value="">Select role…</option>
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      {errors[`m${i}role`] && <span className="text-[.7rem] text-red-500">{errors[`m${i}role`]}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#F0E8D8] flex items-center gap-1.5">🔗 Portfolio <span className="normal-case font-normal opacity-50">(optional)</span></label>
                      <input className={inp(false)} type="url" placeholder="https://github.com/username"
                        value={members[i]?.github || ''}
                        onChange={e => setMembers(arr => { const a = [...arr]; a[i] = { ...a[i], github: e.target.value }; return a; })} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── STEP 3: Project + Agreements ── */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#F0E8D8] flex items-center gap-1.5">💡 Project Idea <span className="normal-case font-normal opacity-50">(brief summary)</span></label>
                <textarea className={inp(errors.idea) + ' resize-y min-h-[110px]'}
                  placeholder="What will you build and why?"
                  value={extra.idea} onChange={e => setExtra(p => ({ ...p, idea: e.target.value }))} />
                {errors.idea && <span className="text-xs text-red-500">{errors.idea}</span>}
              </div>

              {/* Summary card */}
              <div className="rounded-2xl border border-[#1A3055] bg-[#0A1A30] p-5">
                <p className="text-xs font-semibold tracking-wide text-[#C41E3A] flex items-center gap-1 mb-3">📝 Registration Summary</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {[
                    ['👥 Team', team.name],
                    ['🔢 Size', memberCount + ' member' + (memberCount > 1 ? 's' : '')],
                    ['🎯 Track', getTrackEmoji(team.track) + ' ' + team.track],
                    ['⚡ Level', team.level],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <span className="text-[#C4A882]">{k}: </span>
                      <span className="font-semibold text-[#F0E8D8]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agreements */}
              <div className="flex flex-col gap-3">
                {[{ key: 'terms', label: <>I agree to the <a href="#" className="underline text-[#C41E3A] hover:text-[#EF4444]" onClick={e => e.stopPropagation()}>Terms & Conditions</a> of Hackcurity 2026.</> },
                { key: 'conduct', label: <>I agree to uphold the <a href="#" className="underline text-[#C41E3A] hover:text-[#EF4444]" onClick={e => e.stopPropagation()}>Code of Conduct</a> throughout the event.</> }].map(({ key, label }) => (
                  <label key={key} className="flex items-start gap-3 cursor-pointer group">
                    <span className={`mt-[2px] flex-shrink-0 w-5 h-5 rounded-[6px] border-[1.5px] flex items-center justify-center transition-all duration-150 ${extra[key] ? 'bg-[#C41E3A] border-[#C41E3A] text-[#ffffff]' : 'bg-[#0A1A30] border-[#1A3055] text-transparent group-hover:border-[#C41E3A]'
                      }` + (errors[key] ? ' !border-red-500' : '')}>
                      {extra[key] && <ICheck s={11} />}
                    </span>
                    <input type="checkbox" className="sr-only" checked={extra[key]}
                      onChange={e => setExtra(p => ({ ...p, [key]: e.target.checked }))} />
                    <span className="text-sm text-[#C4A882] leading-relaxed">{label}</span>
                  </label>
                ))}
                {(errors.terms || errors.conduct) && (
                  <p className="text-[.72rem] text-red-500">Please accept both agreements to continue.</p>
                )}
              </div>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {step === 'done' && (
            <div className="flex flex-col items-center text-center py-8 gap-5">
              <div className="w-20 h-20 rounded-full bg-[#C41E3A] flex items-center justify-center shadow-2xl shadow-red-950/30">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#040E1A" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-[#F0E8D8] mb-2">🎉 You're in, {members[0]?.name || 'Hacker'}!</h3>
                <p className="text-[#C4A882] leading-relaxed max-w-sm">
                  Team <strong className="text-[#F0E8D8]">{team.name}</strong> registered for <strong className="text-[#F0E8D8]">{getTrackEmoji(team.track)} {team.track}</strong>.
                  Confirmation email sent to all members.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 w-full max-w-sm mt-2">
                {[
                  { v: 'Aug 2', l: 'Start Date' },
                  { v: '48h', l: 'Duration' },
                  { v: '$' + ['5,000', '8,000', '10,000', '6,000', '4,000', '3,000'][TRACKS_LIST.indexOf(team.track)] || '5,000', l: 'Track Prize' },
                ].map(({ v, l }) => (
                  <div key={l} className="rounded-xl border border-[#1A3055] bg-[#0A1A30] py-3 px-2 text-center">
                    <div className="text-lg font-bold text-[#F0E8D8]">{v}</div>
                    <div className="text-xs font-medium text-[#C4A882] tracking-wide">{l}</div>
                  </div>
                ))}
              </div>
              <button onClick={onClose}
                className="mt-2 bg-[#C41E3A] text-[#ffffff] px-7 py-3 rounded-lg font-bold text-sm hover:shadow-lg hover:bg-[#EF4444] transition-all shadow-md">
                Close
              </button>
            </div>
          )}
        </div>

        {/* Footer / nav */}
        {step !== 'done' && (
          <div className="px-8 py-5 border-t border-[#1A3055] flex items-center justify-between flex-shrink-0 bg-[#0A1A30]">
            <span className="text-xs text-[#C4A882]">
              Step {step} of {STEPS.length}
            </span>
            <div className="flex items-center gap-3">
              {step > 1 && (
                <button onClick={back}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#F0E8D8] border border-[#1A3055] bg-[#0A1A30] hover:bg-[#0D2040] transition-colors">
                  Back
                </button>
              )}
              <motion.button onClick={next} whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold bg-[#C41E3A] text-[#ffffff] hover:shadow-lg hover:bg-[#EF4444] transition-all shadow-md">
                {step === 3 ? 'Submit Registration' : 'Continue'}
                {step < 3 && <IArrow s={15} />}
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CTA SECTION
 ══════════════════════════════════════════════════════════ */
function CTASection({ onRegister }) {
  const magRef = useMagnetic(0.4);
  return (
    <section id="cta-section" className="bg-[#040E1A] border-t border-[#1A3055] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
          <div>
            <SectionHeader tag="Registration" h2={<>Join the Event</>}
              sub="Open to students, professionals, and researchers worldwide. Sign up free while spots are available." />
            <span ref={magRef} className="mt-8 inline-block">
              <motion.button onClick={onRegister} whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }} id="btn-register"
                className="inline-flex items-center gap-2 bg-[#C41E3A] text-[#ffffff] px-7 py-3.5 rounded-lg text-base font-bold tracking-tight shadow-lg hover:shadow-xl hover:bg-[#EF4444] transition-all">
                Register Now <IArrow s={16} />
              </motion.button>
            </span>
            {/* Social proof */}
            <div className="flex items-center gap-3 mt-6">
              <div className="flex -space-x-2">
                {['#C41E3A', '#EF4444', '#991B1B', '#7F1D1D', '#B91C1C'].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#040E1A] flex items-center justify-center text-[#ffffff] text-xs font-bold flex-shrink-0"
                    style={{ background: c }}>{'ABCDE'[i]}</div>
                ))}
              </div>
              <p className="text-sm text-[#C4A882]"><strong className="text-[#F0E8D8]">347</strong> teams registered · <strong className="text-[#F0E8D8]">153</strong> spots left</p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-[2px] rounded bg-[#C41E3A]" />
              <span className="text-sm font-semibold tracking-wide text-[#C41E3A]">Contact Us</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#F0E8D8] mb-6">Get in Touch</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   FOOTER
 ══════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="bg-[#071428] border-t border-[#1A3055] py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#C4A882]">
        <div className="flex items-center gap-2 font-semibold text-[#F0E8D8]">
          Hackcurity <span className="text-[#C4A882] font-normal text-base">&times; 2026</span>
        </div>
        <div className="flex items-center gap-6">
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" className="hover:text-[#F0E8D8] transition-colors">{l}</a>
          ))}
        </div>
        <span>&copy; 2026 All rights reserved.</span>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════
   APP ROOT
 ══════════════════════════════════════════════════════════ */
function App() {
  const [regOpen, setRegOpen] = useState(false);
  return (
    <div className="relative bg-[#040E1A] text-[#F0E8D8] font-sans selection:bg-[#0D2040] selection:text-[#F0E8D8] antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen">
      <Navbar />
      <div className="lg:relative lg:min-h-screen">
        <BackgroundVideo />
        <HeroContent />
      </div>
      <StatsBar />
      <TracksSection />
      <TimelineSection />
      <JudgesSection />
      <SponsorsSection />
      <CTASection onRegister={() => setRegOpen(true)} />
      <Footer />
      {regOpen && <RegModal onClose={() => setRegOpen(false)} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

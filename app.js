const { useState, useEffect, useRef, Fragment } = React;

/* ══════════════════════════════════════════════════════════
   INLINE MOTION SHIM
   CSS-transitions-based drop-in for Framer Motion.
   Supports: initial, animate, exit, transition, whileHover, whileTap.
 ══════════════════════════════════════════════════════════ */
function _toStyle(state) {
  if (!state) return {};
  const s = {};
  if (state.opacity  !== undefined) s.opacity   = state.opacity;
  if (state.scale    !== undefined) s.transform  = `scale(${state.scale})`;
  if (state.y        !== undefined) s.transform  = `translateY(${state.y}px)`;
  if (state.x        !== undefined) s.transform  = `translateX(${state.x}px)`;
  if (state.height   !== undefined) s.height     = typeof state.height === 'number' ? `${state.height}px` : state.height;
  return s;
}

function _makeMotionEl(tag) {
  return React.forwardRef(function MotionEl(
    { initial, animate, exit, transition, whileHover, whileTap, style={}, className='', children, ...rest },
    ref
  ) {
    const [on, setOn] = useState(false);
    const [hov, setHov] = useState(false);
    const [tap, setTap] = useState(false);

    useEffect(() => { const id = requestAnimationFrame(() => setOn(true)); return () => cancelAnimationFrame(id); }, []);

    const dur   = transition?.duration ?? 0.5;
    const delay = transition?.delay    ?? 0;
    const ease  = transition?.ease     ?? 'ease';
    const tr    = `all ${dur}s ${ease}${delay ? ` ${delay}s` : ''}`;

    let computed = {};
    if (!on)              computed = { ...computed, ..._toStyle(initial), transition: 'none' };
    else if (animate)     computed = { ...computed, ..._toStyle(animate), transition: tr };
    if (on && hov && whileHover) { Object.assign(computed, _toStyle(whileHover)); computed.transition = 'all .15s ease'; }
    if (on && tap && whileTap)   { Object.assign(computed, _toStyle(whileTap));   computed.transition = 'all .1s ease'; }

    const handlers = {};
    if (whileHover) { handlers.onMouseEnter = () => setHov(true);  handlers.onMouseLeave = () => { setHov(false); setTap(false); }; }
    if (whileTap)   { handlers.onMouseDown  = () => setTap(true);  handlers.onMouseUp    = () => setTap(false); }

    return React.createElement(tag, { ref, style: { ...style, ...computed }, className, ...handlers, ...rest }, children);
  });
}

const _TAGS = ['div','span','button','a','p','section','header','main','nav','h1','h2','h3','form'];
const motion = Object.fromEntries(_TAGS.map(t => [t, _makeMotionEl(t)]));

/* AnimatePresence — simplified: handles opacity swaps + height:auto via CSS */
function AnimatePresence({ children, mode }) {
  return children;
}

/* ══════════════════════════════════════════════════════════
   HOOKS
 ══════════════════════════════════════════════════════════ */
function useTypewriter(text, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone]           = useState(false);
  useEffect(() => {
    setDisplayed(''); setDone(false);
    let i = 0, iv;
    const t = setTimeout(() => {
      iv = setInterval(() => {
        i++; setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
    }, startDelay);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, [text, speed, startDelay]);
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

function useMagnetic(strength = 0.38) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const move  = e => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX-(r.left+r.width/2))*strength}px,${(e.clientY-(r.top+r.height/2))*strength}px)`; };
    const reset = () => { el.style.transform = ''; };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', reset);
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', reset); };
  }, []);
  return ref;
}

function useTilt(max = 12) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const move = e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      el.style.transition = 'transform .08s linear, box-shadow .2s';
      el.style.transform  = `perspective(600px) rotateY(${x*max}deg) rotateX(${-y*max}deg) scale(1.02)`;
      el.style.boxShadow  = `${-x*14}px ${y*14}px 36px rgba(74,222,128,.06)`;
    };
    const reset = () => { el.style.transition = 'transform .35s ease, box-shadow .35s ease'; el.style.transform = ''; el.style.boxShadow = ''; };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', reset);
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', reset); };
  }, []);
  return ref;
}

/* ══════════════════════════════════════════════════════════
   INLINE SVG ICONS
 ══════════════════════════════════════════════════════════ */
const Ico = ({size=20,sw=2,children,className='',style={}}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    {children}
  </svg>
);
const ICheck    = ({s=14}) => <Ico size={s} sw={2.5}><polyline points="20 6 9 17 4 12"/></Ico>;
const IArrow    = ({s=18}) => <Ico size={s} sw={2.5}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></Ico>;
const ICalendar = ({s=14}) => <Ico size={s}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Ico>;
const IPin      = ({s=14}) => <Ico size={s}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Ico>;
const IUsers    = ({s=14}) => <Ico size={s}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Ico>;
const IClock    = ({s=14}) => <Ico size={s}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Ico>;
const ITrophy   = ({s=22}) => <Ico size={s}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></Ico>;
const IGlobe    = ({s=22}) => <Ico size={s}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></Ico>;
const IShield   = ({s=20}) => <Ico size={s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Ico>;
const IZap      = ({s=20}) => <Ico size={s}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Ico>;
const ILock     = ({s=20}) => <Ico size={s}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Ico>;
const ICode     = ({s=20}) => <Ico size={s}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></Ico>;
const IDatabase = ({s=20}) => <Ico size={s}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></Ico>;
const ISend     = ({s=15}) => <Ico size={s} sw={2.5}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></Ico>;

/* ══════════════════════════════════════════════════════════
   BACKGROUND VIDEO
 ══════════════════════════════════════════════════════════ */
function BackgroundVideo() {
  const vidRef  = useRef(null);
  const prevX   = useRef(null);
  const tgt     = useRef(0);

  /* Desktop scrubbing */
  useEffect(() => {
    const v = vidRef.current; if (!v) return;
    const onSeeked = () => {};
    const onMove   = e => {
      if (window.innerWidth < 1024) return;
      const cx = e.clientX;
      if (prevX.current === null) { prevX.current = cx; return; }
      const delta = cx - prevX.current; prevX.current = cx;
      if (!v.duration) return;
      tgt.current += (delta / window.innerWidth) * 0.8 * v.duration;
      tgt.current  = Math.max(0, Math.min(v.duration, tgt.current));
      v.currentTime = tgt.current;
    };
    v.addEventListener('seeked', onSeeked);
    window.addEventListener('mousemove', onMove);
    return () => { v.removeEventListener('seeked', onSeeked); window.removeEventListener('mousemove', onMove); };
  }, []);

  /* Mobile autoplay */
  useEffect(() => {
    const v = vidRef.current; if (!v) return;
    const check = () => { if (window.innerWidth < 1024) { v.autoplay = true; v.loop = true; v.play().catch(() => {}); } };
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-[#080C0A] lg:bg-transparent">
      <video ref={vidRef} muted playsInline preload="auto"
        className="w-full h-full object-cover object-right lg:object-right-bottom">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4" type="video/mp4" />
      </video>
      {/* Desktop fade overlay */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none"
        style={{background:'linear-gradient(to right,rgba(8,12,10,.95) 36%,rgba(8,12,10,.4) 65%,transparent 100%)'}} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   NAVBAR
 ══════════════════════════════════════════════════════════ */
function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const magRef = useMagnetic(0.42);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 20); window.addEventListener('scroll', fn); return () => window.removeEventListener('scroll', fn); }, []);

  const links = [
    {l:'Labs',     h:'#tracks-section'},
    {l:'Studio',   h:'#timeline-section'},
    {l:'Openings', h:'#judges-section'},
    {l:'Shop',     h:'#sponsors-section'},
  ];

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-10 px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center bg-transparent transition-all duration-300${scrolled?' backdrop-blur-md !bg-[#080C0A]/80 border-b border-[#263028]':''}`}>
        {/* Logo */}
        <div className="flex flex-row items-end gap-3">
          <span className="text-[21px] sm:text-[26px] tracking-tight text-[#E0EAE2] font-medium select-none">Mainframe&reg;</span>
          <span className="text-[25px] sm:text-[30px] text-[#E0EAE2] select-none tracking-[-0.02em] font-medium leading-none mb-1">&#10033;</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex flex-row items-center text-[23px] text-[#E0EAE2]">
          {links.map((l,i) => (
            <Fragment key={l.l}>
              <a href={l.h} className="hover:opacity-60 transition-opacity">{l.l}</a>
              {i < links.length-1 && <span className="opacity-40">,&nbsp;</span>}
            </Fragment>
          ))}
        </nav>

        {/* Desktop CTA */}
        <span ref={magRef} className="hidden md:block">
          <a href="#cta-section" className="text-[23px] text-[#E0EAE2] underline underline-offset-2 hover:opacity-60 transition-opacity">
            Get in touch
          </a>
        </span>

        {/* Hamburger */}
        <button onClick={() => setOpen(o => !o)} id="mobile-menu-btn" aria-label="Toggle menu"
          className="md:hidden flex flex-col gap-[5px] justify-center items-center w-8 h-8">
          <span className={`block w-6 h-[2px] bg-[#E0EAE2] transition-all duration-300${open?' rotate-45 translate-y-[7px]':''}`} />
          <span className={`block w-6 h-[2px] bg-[#E0EAE2] transition-all duration-300${open?' opacity-0':''}`} />
          <span className={`block w-6 h-[2px] bg-[#E0EAE2] transition-all duration-300${open?' -rotate-45 -translate-y-[7px]':''}`} />
        </button>
      </header>

      {/* Mobile overlay */}
      <div className={`fixed inset-0 z-[9] bg-[#080C0A]/95 backdrop-blur-sm flex flex-col justify-center items-center gap-8 md:hidden transition-opacity duration-300${open?' opacity-100 pointer-events-auto':' opacity-0 pointer-events-none'}`}>
        {links.map(l => (
          <a key={l.l} href={l.h} onClick={() => setOpen(false)}
            className="text-3xl font-medium text-[#E0EAE2] hover:opacity-60 transition-opacity">{l.l}</a>
        ))}
        <a href="#cta-section" onClick={() => setOpen(false)}
          className="text-2xl text-[#E0EAE2] underline underline-offset-4 hover:opacity-60 transition-opacity">
          Get in touch
        </a>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   SERVICE PILLS
 ══════════════════════════════════════════════════════════ */
const SERVICE_OPTIONS = ['Brand','Digital','Campaign','Other'];

function ServicePills() {
  const [selected, setSelected] = useState([]);
  const toggle = s => setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const active  = selected.length > 0;

  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.5,delay:.35}}>
      <p className="text-2xl font-medium tracking-tight mb-2">What sort of service?</p>
      <p className="text-base mb-8" style={{opacity:.85,color:'#7A9582'}}>Select all that apply</p>

      <div className="flex flex-wrap gap-3 mb-5">
        {SERVICE_OPTIONS.map(s => {
          const on = selected.includes(s);
          return (
            <motion.button key={s} id={'pill-'+s.toLowerCase()}
              onClick={() => toggle(s)}
              whileHover={{scale:1.04}} whileTap={{scale:.96}}
              className={'flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-medium outline-none transition-colors duration-150 '+(on
                ? 'bg-[#4ADE80] text-[#080C0A] shadow-md shadow-emerald-950/20 transform'
                : 'bg-[#141B16] text-[#E0EAE2] border border-[#263028] hover:bg-[#1A2420]')}>
              {on && <span className="flex items-center" style={{animation:'scaleIn .22s cubic-bezier(.34,1.56,.64,1) both'}}><ICheck s={13}/></span>}
              {s}
            </motion.button>
          );
        })}
      </div>

      {/* Contingent status banner */}
      <AnimatePresence mode="wait">
        {!active ? (
          <motion.p key="empty"
            initial={{opacity:0}} animate={{opacity:.5}} exit={{opacity:0}} transition={{duration:.2}}
            className="text-xs italic text-[#4D6557]">
            Please click to select services above.
          </motion.p>
        ) : (
          <motion.div key="active"
            initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}
            transition={{duration:.3,ease:'easeInOut'}} className="overflow-hidden">
            <div className="flex items-center justify-between gap-4 bg-[#0F1511] border border-[#263028] rounded-2xl px-5 py-4">
              <p className="text-sm text-[#7A9582] font-medium">
                Ready to inquire about: <strong className="font-semibold text-[#E0EAE2]">{selected.join(', ')}</strong>
              </p>
              <a href="#cta-section"
                className="flex items-center gap-1.5 font-semibold text-xs uppercase tracking-wider whitespace-nowrap hover:opacity-70 transition-opacity"
                style={{color:'#4ADE80'}}>
                Let's Go <IArrow s={13}/>
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
  const { displayed, done } = useTypewriter("we'd love to\nhear from you!", 38, 600);
  return (
    <div className="relative z-10 flex flex-col order-first lg:order-none w-full bg-[#080C0A] lg:bg-transparent pb-8 lg:pb-0 lg:min-h-screen">
      <main id="spade-hero" className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center">

        {/* Hackcurity badge */}
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{duration:.5,delay:.2}}
          className="flex items-center gap-2 mb-8">
          <span className="w-[7px] h-[7px] rounded-full bg-[#4ADE80]" style={{animation:'pulse 2.5s ease-in-out infinite'}} />
          <span className="text-[11px] font-bold uppercase tracking-[.13em] text-[#4ADE80]">Hackcurity 2026 &mdash; Hack the Future</span>
        </motion.div>

        {/* Headline with typewriter */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6}}>
          <h1 className="text-5xl md:text-6xl lg:text-[76px] font-normal tracking-tight text-[#E0EAE2] leading-[1.08] mb-8 select-none w-full whitespace-pre-wrap">
            {displayed}
            {!done && <span className="inline-block w-[2px] h-[1.1em] bg-[#4ADE80] align-middle ml-[2px] animate-blink" />}
          </h1>
        </motion.div>

        {/* Description */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.1}}>
          <p className="text-lg md:text-xl text-[#7A9582] leading-relaxed font-normal mb-14 max-w-2xl">
            Whether you have questions, feedback,<br />
            drop us a message and we'll get back to you as soon as possible.
          </p>
        </motion.div>

        {/* Event chips */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.5,delay:.22}}
          className="flex flex-wrap items-center gap-3 mb-12">
          {[
            {I:ICalendar, t:'August 2–5, 2026'},
            {I:IPin,      t:'Online + On-site, Bengaluru'},
            {I:IUsers,    t:'Teams of 1–4'},
            {I:IClock,    t:'48-Hour Sprint'},
          ].map(({I,t}) => (
            <div key={t} className="flex items-center gap-1.5 text-sm text-[#7A9582] bg-[#0F1511] border border-[#263028] rounded-lg px-3 py-1.5">
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
function SectionHeader({tag, h2, sub}) {
  const [ref, vis] = useInView(0.2);
  return (
    <motion.div ref={ref} initial={{opacity:0,y:20}} animate={vis?{opacity:1,y:0}:{opacity:0,y:20}} transition={{duration:.6}}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-[2px] rounded bg-[#4ADE80]" />
        <span className="text-[.7rem] font-bold uppercase tracking-[.15em] text-[#4ADE80]">{tag}</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-normal tracking-tight text-[#E0EAE2] leading-tight mb-4">{h2}</h2>
      {sub && <p className="text-lg text-[#7A9582] leading-relaxed max-w-xl">{sub}</p>}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   STATS BAR
 ══════════════════════════════════════════════════════════ */
function StatsBar() {
  const [ref, vis] = useInView();
  const stats = [
    {v:'$25,000', I:ITrophy, l:'Prize Pool'},
    {v:'500+',    I:IUsers,  l:'Participants'},
    {v:'48h',     I:IClock,  l:'Non-Stop'},
    {v:'Global',  I:IGlobe,  l:'Open to All'},
  ];
  return (
    <section ref={ref} className="bg-[#0F1511] text-[#E0EAE2] border-y border-[#263028] py-11 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map(({v,I,l},i) => (
          <motion.div key={l} initial={{opacity:0,y:20}}
            animate={vis?{opacity:1,y:0}:{opacity:0,y:20}} transition={{duration:.5,delay:i*.08}}
            className="flex flex-col items-center gap-2 text-center">
            <I s={22} className="text-[#4ADE80]"/>
            <span className="text-[2rem] font-bold tracking-tight text-[#E0EAE2]">{v}</span>
            <span className="text-[.7rem] uppercase tracking-[.14em] text-[#7A9582] font-medium">{l}</span>
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
  {color:'#F87171',tag:'Offensive',    title:'Red Team & Exploitation',     desc:'CTF-style flags, live targets, and zero-day simulation in enterprise environments.',    I:IShield},
  {color:'#60A5FA',tag:'AI Safety',    title:'Adversarial ML & AI Security', desc:'Prompt injection, model poisoning, and differential privacy challenges on live models.', I:IZap},
  {color:'#FBBF24',tag:'Cryptography', title:'Crypto & Protocol Attacks',    desc:'Break weak implementations, forge signatures, exploit misconfigurations in protocols.',   I:ILock},
  {color:'#34D399',tag:'Zero-Trust',   title:'Network & Identity Defense',   desc:'Design and stress-test zero-trust architectures and IAM policies under live attack.',      I:IGlobe},
  {color:'#C084FC',tag:'Web3',         title:'Smart Contract Auditing',      desc:'Hunt bugs in Solidity, exploit reentrancy and flash-loan vulnerabilities in DeFi.',        I:IDatabase},
  {color:'#F472B6',tag:'Open',         title:'Open Innovation Track',        desc:'No constraints. Build any security tool or research that makes the world safer.',          I:ICode},
];

function TrackCard({track, delay}) {
  const [ref, vis] = useInView();
  const tiltRef    = useTilt(10);
  return (
    <motion.div ref={ref} initial={{opacity:0,y:24}}
      animate={vis?{opacity:1,y:0}:{opacity:0,y:24}} transition={{duration:.5,delay}}>
      <div ref={tiltRef} className="tilt h-full rounded-[20px] border border-[#263028] bg-[#0F1511] p-7">
        <div className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-5"
          style={{background:track.color+'18',color:track.color}}>
          <track.I s={20}/>
        </div>
        <div className="text-[1.05rem] font-semibold text-[#E0EAE2] mb-2">{track.title}</div>
        <div className="text-[.875rem] text-[#7A9582] leading-[1.65] mb-4">{track.desc}</div>
        <span className="inline-block text-[.65rem] font-bold uppercase tracking-[.12em] px-2.5 py-1 rounded-[6px]"
          style={{background:track.color+'14',color:track.color}}>{track.tag}</span>
      </div>
    </motion.div>
  );
}

function TracksSection() {
  return (
    <section id="tracks-section" className="py-24 px-6 bg-[#080C0A]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader tag="Challenge Tracks" h2={<>Five arenas.<br/>One winner.</>}
          sub="Pick your battlefield. Each track has its own prize pool, dedicated mentors, and real-world impact." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
          {TRACKS.map((t,i) => <TrackCard key={t.title} track={t} delay={i*.07} />)}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   TIMELINE
 ══════════════════════════════════════════════════════════ */
const TL = [
  {ph:'01',c:'#4ADE80',l:'Registration Opens',         d:'July 1, 2026',              t:'Sign up solo or as a team of up to 4. Early registrants receive a Hackcurity swag kit.'},
  {ph:'02',c:'#22C55E',l:'Problem Statements Released', d:'July 15, 2026',             t:'All five challenge tracks go live. Study the briefs and start planning your approach.'},
  {ph:'03',c:'#16A34A',l:'Mentor Office Hours Begin',   d:'July 22, 2026',             t:'Weekly 1:1 sessions with industry mentors. Get feedback before the hackathon starts.'},
  {ph:'04',c:'#15803D',l:'48-Hour Hackathon Kicks Off', d:'Aug 2, 2026 — 09:00 IST',  t:'The clock starts. Build, break, defend. Mentors available around the clock.'},
  {ph:'05',c:'#166534',l:'Final Submissions Locked',    d:'Aug 4, 2026 — 09:00 IST',  t:'All code repositories freeze. Prepare your 5-minute demo pitch for the judges.'},
  {ph:'06',c:'#14532D',l:'Awards & Closing Ceremony',   d:'August 5, 2026',            t:'Winners announced live. $25,000 distributed across five tracks. See you on stage!'},
];

function TLItem({item, delay}) {
  const [ref, vis] = useInView();
  const tiltRef    = useTilt(4);
  return (
    <motion.div ref={ref} initial={{opacity:0,x:-24}}
      animate={vis?{opacity:1,x:0}:{opacity:0,x:-24}} transition={{duration:.5,delay}}
      className="flex items-start gap-5 lg:gap-8">
      <div className="hidden lg:flex flex-shrink-0 w-[104px] flex-col items-center">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[.7rem] font-bold shadow-md"
          style={{background:item.c}}>{item.ph}</div>
      </div>
      <div ref={tiltRef} className="tilt flex-1 bg-[#141B16] border border-[#263028] rounded-[18px] p-6">
        <div className="flex items-start gap-3">
          <div className="lg:hidden w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-[.6rem] font-bold flex-shrink-0"
            style={{background:item.c}}>{item.ph}</div>
          <div>
            <div className="text-[1.0625rem] font-semibold text-[#E0EAE2]">{item.l}</div>
            <div className="flex items-center gap-1.5 mt-0.5 text-[.8125rem] text-[#7A9582] font-medium">
              <ICalendar s={12}/>{item.d}
            </div>
          </div>
        </div>
        <p className="mt-3 text-[.85rem] text-[#7A9582] leading-[1.7]">{item.t}</p>
      </div>
    </motion.div>
  );
}

function TimelineSection() {
  return (
    <section id="timeline-section" className="py-24 px-6 bg-[#0F1511] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeader tag="Schedule" h2="Event Timeline"
          sub="From registration to the grand finale — every key date for Hackcurity 2026." />
        <div className="relative flex flex-col gap-5 mt-14">
          <div className="hidden lg:block absolute left-[52px] top-6 bottom-6 w-[2px] rounded-full"
            style={{background:'linear-gradient(to bottom,#263028,#4D6557,#263028)'}} />
          {TL.map((item,i) => <TLItem key={item.ph} item={item} delay={i*.08} />)}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   JUDGES
 ══════════════════════════════════════════════════════════ */
const JUDGES = [
  {n:'Priya Raman',       r:'Head of Security Research',   o:'CipherCore',    i:'PR',c:'#16A34A'},
  {n:'Ankit Mehta',       r:'Principal Red Team Engineer',  o:'NullByte Labs', i:'AM',c:'#22C55E'},
  {n:'Sofia Chen',        r:'AI Safety Researcher',         o:'DeepGuard AI',  i:'SC',c:'#4ADE80'},
  {n:'Marcus Webb',       r:'CISO',                         o:'VaultSec',      i:'MW',c:'#15803D'},
  {n:'Dev Kapoor',        r:'Cryptography Engineer',        o:'Enclave.io',    i:'DK',c:'#14532D'},
  {n:'Sofia Chen',        r:'AI Safety Researcher',         o:'DeepGuard AI',  i:'SC',c:'#4ADE80'},
  {n:'Dev Kapoor',        r:'Cryptography Engineer',        o:'Enclave.io',    i:'DK',c:'#14532D'},
  {n:'Yuki Tanaka',       r:'Penetration Tester',           o:'RedThread',     i:'YT',c:'#2E7D32'},
];

function JudgeCard({j, delay}) {
  const [ref, vis] = useInView();
  const tiltRef    = useTilt(8);
  return (
    <motion.div ref={ref} initial={{opacity:0,y:20}}
      animate={vis?{opacity:1,y:0}:{opacity:0,y:20}} transition={{duration:.5,delay}}>
      <div ref={tiltRef} className="tilt flex flex-col items-center gap-3 text-center p-6 rounded-[20px] border border-[#263028] bg-[#0F1511]">
        <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-xl font-bold"
          style={{background:j.c, color: j.c === '#4ADE80' || j.c === '#22C55E' ? '#080C0A' : '#ffffff'}}>{j.i}</div>
        <div>
          <div className="text-[.9375rem] font-semibold text-[#E0EAE2]">{j.n}</div>
          <div className="text-[.8rem] text-[#7A9582] leading-snug mt-0.5">{j.r}</div>
        </div>
        <div className="text-[.65rem] font-bold uppercase tracking-[.1em] text-[#4ADE80]">{j.o}</div>
      </div>
    </motion.div>
  );
}

function JudgesSection() {
  return (
    <section id="judges-section" className="py-24 px-6 bg-[#080C0A]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader tag="The Panel" h2="Judges & Mentors"
          sub="Industry leaders and security researchers who will evaluate, guide, and inspire." />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mt-14">
          {JUDGES.map((j,i) => <JudgeCard key={j.n + '-' + i} j={j} delay={i*.055} />)}
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
    {l:'Gold',      sz:'text-xl px-9 py-4',    ns:['CipherCore','NullByte Labs','VaultSec']},
    {l:'Silver',    sz:'text-base px-6 py-3',   ns:['GridIron','RedThread','Enclave.io','KeyHaven']},
    {l:'Community', sz:'text-sm px-5 py-2.5',   ns:['HackClub','OWASP','DEF CON','BugBounty.dev','SecureX']},
  ];
  return (
    <section id="sponsors-section" className="bg-[#0F1511] border-y border-[#263028] py-20 px-6">
      <motion.div ref={ref} initial={{opacity:0}} animate={vis?{opacity:1}:{opacity:0}} transition={{duration:.6}}
        className="max-w-7xl mx-auto text-center">
        <span className="block text-[.7rem] font-bold uppercase tracking-[.16em] mb-10 text-[#7A9582]/70">
          Our Sponsors & Partners
        </span>
        <div className="flex flex-col gap-9">
          {tiers.map(t => (
            <div key={t.l}>
              <p className="text-[.65rem] font-bold uppercase tracking-[.15em] mb-4 text-[#7A9582]/50">{t.l}</p>
              <div className="flex flex-wrap justify-center gap-4">
                {t.ns.map(n => (
                  <div key={n} className={'rounded-xl font-bold tracking-tight border border-[#263028] bg-[#141B16] hover:bg-[#1A2420] text-[#7A9582] hover:text-[#4ADE80] transition-all duration-200 '+t.sz}>
                    {n}
                  </div>
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
  const [st, setSt]   = useState({name:'',email:'',org:'',msg:''});
  const [status, setS] = useState(null);
  const magRef         = useMagnetic(0.4);
  const inp = "w-full border-[1.5px] border-[#263028] rounded-[10px] px-4 py-3 text-[.9375rem] font-[inherit] text-[#E0EAE2] bg-[#141B16] focus:outline-none focus:border-[#4ADE80] focus:bg-[#1A2420] transition-all duration-200";

  const submit = e => {
    e.preventDefault();
    if (!st.name||!st.email||!st.msg) { setS('err'); return; }
    setS('sending');
    setTimeout(() => { setS('done'); setSt({name:'',email:'',org:'',msg:''}); }, 1300);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[.75rem] font-bold uppercase tracking-[.04em] text-[#E0EAE2]">Name</label>
          <input className={inp} type="text" placeholder="Jane Smith"
            value={st.name} onChange={e=>setSt(p=>({...p,name:e.target.value}))} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[.75rem] font-bold uppercase tracking-[.04em] text-[#E0EAE2]">Email</label>
          <input className={inp} type="email" placeholder="jane@example.com"
            value={st.email} onChange={e=>setSt(p=>({...p,email:e.target.value}))} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[.75rem] font-bold uppercase tracking-[.04em] text-[#E0EAE2]">
          Organisation <span style={{opacity:.5,fontWeight:400,textTransform:'none',letterSpacing:0}}>(optional)</span>
        </label>
        <input className={inp} type="text" placeholder="Acme Security"
          value={st.org} onChange={e=>setSt(p=>({...p,org:e.target.value}))} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[.75rem] font-bold uppercase tracking-[.04em] text-[#E0EAE2]">Message</label>
        <textarea className={inp+' resize-y min-h-[110px]'}
          placeholder="Tell us about your team, questions, or sponsorship interest…"
          value={st.msg} onChange={e=>setSt(p=>({...p,msg:e.target.value}))} />
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <span ref={magRef}>
          <motion.button type="submit" whileHover={{scale:1.03}} whileTap={{scale:.97}}
            disabled={status==='sending'||status==='done'}
            className="flex items-center gap-2 bg-[#4ADE80] text-[#080C0A] px-7 py-3.5 rounded-[12px] text-[.9375rem] font-bold tracking-tight shadow-lg hover:bg-[#22C55E] transition-colors disabled:opacity-60">
            {status==='sending'?'Sending…':status==='done'?'✓ Sent!':<><span>Send Message</span><ISend s={15}/></>}
          </motion.button>
        </span>
        {status==='err'  && <p className="text-[.8rem] text-red-500">Please fill in all required fields.</p>}
        {status==='done' && <p className="text-[.8rem] font-medium" style={{color:'#4ADE80'}}>We'll get back to you within 2 business days.</p>}
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
const ROLES  = ['Developer','Security Researcher','Designer','Product / Other'];
const SIZES  = ['1 (Solo)','2','3','4'];
const LEVELS = ['Beginner','Intermediate','Advanced','Expert'];

function RegModal({ onClose }) {
  const [step, setStep]   = useState(1);   // 1 | 2 | 3 | 'done'
  const [errors, setErrs] = useState({});

  // ── Step 1: Team basics ──────────────────────────
  const [team, setTeam] = useState({
    name: '', size: '', institution: '', track: '', level: '',
  });

  // ── Step 2: Members (up to 4 rows) ───────────────
  const blankMember = () => ({ name:'', email:'', role:'', github:'' });
  const [members, setMembers] = useState([blankMember()]);

  // ── Step 3: Project idea + agreements ────────────
  const [extra, setExtra] = useState({ idea:'', terms:false, conduct:false });

  // ── Shared input style ────────────────────────────
  const inp = (err) =>
    `w-full border-[1.5px] ${err?'border-red-500':'border-[#263028]'} rounded-[10px] px-4 py-[10px] text-[.9rem] font-[inherit] text-[#E0EAE2] bg-[#141B16] focus:outline-none focus:border-[#4ADE80] focus:bg-[#1A2420] transition-all duration-200`;

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
    if (!team.name.trim())        e.name  = 'Team name is required.';
    if (!team.size)               e.size  = 'Select team size.';
    if (!team.track)              e.track = 'Select a challenge track.';
    if (!team.level)              e.level = 'Select your experience level.';
    setErrs(e);
    return Object.keys(e).length === 0;
  }
  function validateStep2() {
    const e = {};
    const count = parseInt(team.size) || 1;
    members.slice(0, count).forEach((m, i) => {
      if (!m.name.trim())  e[`m${i}name`]  = 'Name required';
      if (!m.email.trim()) e[`m${i}email`] = 'Email required';
      else if (!/^[^@]+@[^@]+\.[^@]+$/.test(m.email)) e[`m${i}email`] = 'Valid email required';
      if (!m.role)         e[`m${i}role`]  = 'Role required';
    });
    setErrs(e);
    return Object.keys(e).length === 0;
  }
  function validateStep3() {
    const e = {};
    if (!extra.idea.trim())  e.idea    = 'Please share a brief project idea.';
    if (!extra.terms)        e.terms   = 'You must accept the Terms & Conditions.';
    if (!extra.conduct)      e.conduct = 'You must accept the Code of Conduct.';
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
      style={{background:'rgba(0,0,0,.65)', backdropFilter:'blur(6px)'}}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      {/* Modal panel */}
      <div className="relative bg-[#0F1511] border border-[#263028] w-full max-w-2xl rounded-[24px] shadow-2xl overflow-hidden"
        style={{maxHeight:'92vh', display:'flex', flexDirection:'column'}}>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-[#263028] flex-shrink-0">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-4 h-[2px] rounded bg-[#4ADE80]" />
                <span className="text-[.65rem] font-bold uppercase tracking-[.15em] text-[#4ADE80]">Hackcurity 2026</span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-[#E0EAE2]">
                {step === 'done' ? 'You\'re registered! 🎉' : 'Register Your Team'}
              </h2>
              {step !== 'done' && <p className="text-sm text-[#7A9582] mt-1">Free registration · 500+ participants · $25,000 in prizes</p>}
            </div>
            <button onClick={onClose} aria-label="Close"
              className="w-9 h-9 rounded-full flex items-center justify-center border border-[#263028] bg-[#141B16] hover:bg-[#1A2420] transition-colors flex-shrink-0 mt-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7A9582" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Step progress */}
          {step !== 'done' && (
            <div className="flex items-center gap-0">
              {STEPS.map((label, i) => {
                const num   = i + 1;
                const done  = num < step;
                const curr  = num === step;
                return (
                  <Fragment key={label}>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        done ? 'bg-[#22C55E] text-[#080C0A]' :
                        curr ? 'bg-[#4ADE80] text-[#080C0A] shadow-md shadow-emerald-950/20' :
                               'bg-[#141B16] text-[#7A9582] border border-[#263028]'
                      }`}>
                        {done ? <ICheck s={13}/> : num}
                      </div>
                      <span className={`text-[.65rem] font-semibold uppercase tracking-wider ${
                        curr ? 'text-[#4ADE80]' : done ? 'text-[#22C55E]' : 'text-[#4D6557]'
                      }`}>{label}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-[2px] mx-2 mb-5 rounded-full transition-all duration-500 ${
                        done ? 'bg-[#22C55E]' : 'bg-[#263028]'
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
                  <label className="text-[.75rem] font-bold uppercase tracking-[.04em] text-[#E0EAE2]">Team Name *</label>
                  <input className={inp(errors.name)} type="text" placeholder="e.g. ZeroDay Ninjas"
                    value={team.name} onChange={e=>setTeam(p=>({...p,name:e.target.value}))} />
                  {errors.name && <span className="text-[.72rem] text-red-500">{errors.name}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[.75rem] font-bold uppercase tracking-[.04em] text-[#E0EAE2]">Team Size *</label>
                  <select className={inp(errors.size)} value={team.size}
                    onChange={e=>setTeam(p=>({...p,size:e.target.value}))}>
                    <option value="">Select…</option>
                    {SIZES.map(s => <option key={s} value={s.charAt(0)}>{s} member{s.charAt(0)!=='1'?'s':''}</option>)}
                  </select>
                  {errors.size && <span className="text-[.72rem] text-red-500">{errors.size}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[.75rem] font-bold uppercase tracking-[.04em] text-[#E0EAE2]">Institution / Organisation <span className="normal-case font-normal opacity-50 tracking-normal">(optional)</span></label>
                <input className={inp(false)} type="text" placeholder="University, company, or independent"
                  value={team.institution} onChange={e=>setTeam(p=>({...p,institution:e.target.value}))} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[.75rem] font-bold uppercase tracking-[.04em] text-[#E0EAE2]">Challenge Track *</label>
                <select className={inp(errors.track)} value={team.track}
                  onChange={e=>setTeam(p=>({...p,track:e.target.value}))}>
                  <option value="">Select a track…</option>
                  {TRACKS_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.track && <span className="text-[.72rem] text-red-500">{errors.track}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[.75rem] font-bold uppercase tracking-[.04em] text-[#E0EAE2]">Team Experience Level *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {LEVELS.map(l => (
                    <button key={l} type="button" onClick={() => setTeam(p=>({...p,level:l}))}
                      className={`py-2 px-3 rounded-[10px] text-sm font-medium border transition-all duration-150 text-center ${
                        team.level === l
                          ? 'bg-[#4ADE80] text-[#080C0A] border-[#4ADE80] shadow-md'
                          : 'bg-[#141B16] text-[#E0EAE2] border-[#263028] hover:border-[#4ADE80]'
                      }`}>{l}</button>
                  ))}
                </div>
                {errors.level && <span className="text-[.72rem] text-red-500">{errors.level}</span>}
              </div>

              {/* Info pill */}
              <div className="flex items-start gap-3 bg-[#141B16] border border-[#263028] rounded-2xl px-4 py-3 mt-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" style={{marginTop:1,flexShrink:0}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p className="text-[.8rem] text-[#7A9582] leading-relaxed">
                  You can change your track up until <strong className="text-[#E0EAE2]">July 25, 2026</strong>. All tracks are equally eligible for the grand prize.
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 2: Team Members ── */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              {Array.from({length: memberCount}, (_, i) => (
                <div key={i} className="rounded-[16px] border border-[#263028] bg-[#141B16] p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[.7rem] font-bold flex-shrink-0"
                      style={{background:['#4ADE80','#22C55E','#16A34A','#15803D'][i], color: i < 2 ? '#080C0A' : '#ffffff'}}>{i+1}</div>
                    <span className="text-sm font-semibold text-[#E0EAE2]">
                      {i === 0 ? 'Team Leader (you)' : `Member ${i+1}`}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[.72rem] font-bold uppercase tracking-[.04em] text-[#7A9582]">Full Name *</label>
                      <input className={inp(errors[`m${i}name`])} type="text" placeholder="Jane Smith"
                        value={members[i]?.name||''}
                        onChange={e=>setMembers(arr=>{ const a=[...arr]; a[i]={...a[i],name:e.target.value}; return a; })} />
                      {errors[`m${i}name`] && <span className="text-[.7rem] text-red-500">{errors[`m${i}name`]}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[.72rem] font-bold uppercase tracking-[.04em] text-[#7A9582]">Email *</label>
                      <input className={inp(errors[`m${i}email`])} type="email" placeholder="jane@example.com"
                        value={members[i]?.email||''}
                        onChange={e=>setMembers(arr=>{ const a=[...arr]; a[i]={...a[i],email:e.target.value}; return a; })} />
                      {errors[`m${i}email`] && <span className="text-[.7rem] text-red-500">{errors[`m${i}email`]}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[.72rem] font-bold uppercase tracking-[.04em] text-[#7A9582]">Role *</label>
                      <select className={inp(errors[`m${i}role`])}
                        value={members[i]?.role||''}
                        onChange={e=>setMembers(arr=>{ const a=[...arr]; a[i]={...a[i],role:e.target.value}; return a; })}>
                        <option value="">Select role…</option>
                        {ROLES.map(r=><option key={r} value={r}>{r}</option>)}
                      </select>
                      {errors[`m${i}role`] && <span className="text-[.7rem] text-red-500">{errors[`m${i}role`]}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[.72rem] font-bold uppercase tracking-[.04em] text-[#7A9582]">GitHub / Portfolio <span className="normal-case font-normal opacity-50 tracking-normal">(optional)</span></label>
                      <input className={inp(false)} type="url" placeholder="https://github.com/username"
                        value={members[i]?.github||''}
                        onChange={e=>setMembers(arr=>{ const a=[...arr]; a[i]={...a[i],github:e.target.value}; return a; })} />
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
                <label className="text-[.75rem] font-bold uppercase tracking-[.04em] text-[#E0EAE2]">Project Idea / Approach * <span className="normal-case font-normal opacity-50 tracking-normal">(2–3 sentences)</span></label>
                <textarea className={inp(errors.idea)+' resize-y min-h-[110px]'}
                  placeholder="Briefly describe what you plan to build or explore. What problem does it solve? This helps us match you with relevant mentors."
                  value={extra.idea} onChange={e=>setExtra(p=>({...p,idea:e.target.value}))} />
                {errors.idea && <span className="text-[.72rem] text-red-500">{errors.idea}</span>}
              </div>

              {/* Summary card */}
              <div className="rounded-2xl border border-[#263028] bg-[#141B16] p-5">
                <p className="text-[.7rem] font-bold uppercase tracking-[.12em] text-[#4ADE80] mb-3">Registration Summary</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {[
                    ['Team',    team.name],
                    ['Size',    memberCount + ' member' + (memberCount > 1 ? 's' : '')],
                    ['Track',   team.track],
                    ['Level',   team.level],
                  ].map(([k,v]) => (
                    <div key={k}>
                      <span className="text-[#7A9582]">{k}: </span>
                      <span className="font-medium text-[#E0EAE2]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agreements */}
              <div className="flex flex-col gap-3">
                {[{key:'terms', label:<>I agree to the <a href="#" className="underline text-[#4ADE80]" onClick={e=>e.stopPropagation()}>Terms & Conditions</a> of Hackcurity 2026.</>},
                  {key:'conduct', label:<>I agree to uphold the <a href="#" className="underline text-[#4ADE80]" onClick={e=>e.stopPropagation()}>Code of Conduct</a> throughout the event.</>}].map(({key,label}) => (
                  <label key={key} className="flex items-start gap-3 cursor-pointer group">
                    <span className={`mt-[2px] flex-shrink-0 w-5 h-5 rounded-[6px] border-[1.5px] flex items-center justify-center transition-all duration-150 ${
                      extra[key] ? 'bg-[#4ADE80] border-[#4ADE80] text-[#080C0A]' : 'bg-[#141B16] border-[#263028] text-transparent group-hover:border-[#4ADE80]'
                    }` + (errors[key] ? ' !border-red-500' : '')}>
                      {extra[key] && <ICheck s={11}/>}
                    </span>
                    <input type="checkbox" className="sr-only" checked={extra[key]}
                      onChange={e=>setExtra(p=>({...p,[key]:e.target.checked}))} />
                    <span className="text-[.85rem] text-[#7A9582] leading-relaxed">{label}</span>
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
              <div className="w-20 h-20 rounded-full bg-[#4ADE80] flex items-center justify-center shadow-2xl shadow-emerald-950/30">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#080C0A" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-[#E0EAE2] mb-2">You're in, {members[0]?.name || 'Hacker'}!</h3>
                <p className="text-[#7A9582] leading-relaxed max-w-sm">
                  Your team <strong className="text-[#E0EAE2]">{team.name}</strong> is registered for the <strong className="text-[#E0EAE2]">{team.track}</strong> track.
                  A confirmation email has been sent to all team members.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 w-full max-w-sm mt-2">
                {[
                  {v:'Aug 2', l:'Start Date'},
                  {v:'48h',  l:'Duration'},
                  {v:'$'+['5,000','8,000','10,000','6,000','4,000','3,000'][TRACKS_LIST.indexOf(team.track)]||'5,000', l:'Track Prize'},
                ].map(({v,l}) => (
                  <div key={l} className="rounded-2xl border border-[#263028] bg-[#141B16] py-3 px-2 text-center">
                    <div className="text-lg font-bold text-[#E0EAE2]">{v}</div>
                    <div className="text-[.65rem] text-[#7A9582] uppercase tracking-wider font-medium">{l}</div>
                  </div>
                ))}
              </div>
              <button onClick={onClose}
                className="mt-2 bg-[#4ADE80] text-[#080C0A] px-8 py-3.5 rounded-[14px] font-semibold text-sm hover:bg-[#22C55E] transition-colors shadow-lg">
                Back to Site
              </button>
            </div>
          )}
        </div>

        {/* Footer / nav */}
        {step !== 'done' && (
          <div className="px-8 py-5 border-t border-[#263028] flex items-center justify-between flex-shrink-0 bg-[#141B16]">
            <span className="text-[.75rem] text-[#7A9582]">
              Step {step} of {STEPS.length}
            </span>
            <div className="flex items-center gap-3">
              {step > 1 && (
                <button onClick={back}
                  className="px-5 py-2.5 rounded-[10px] text-sm font-medium text-[#E0EAE2] border border-[#263028] bg-[#141B16] hover:bg-[#1A2420] transition-colors">
                  Back
                </button>
              )}
              <motion.button onClick={next} whileHover={{scale:1.03}} whileTap={{scale:.97}}
                className="flex items-center gap-2 px-6 py-2.5 rounded-[10px] text-sm font-semibold bg-[#4ADE80] text-[#080C0A] hover:bg-[#22C55E] transition-colors shadow-md">
                {step === 3 ? 'Submit Registration' : 'Continue'}
                {step < 3 && <IArrow s={15}/>}
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
    <section id="cta-section" className="bg-[#080C0A] border-t border-[#263028] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
          <div>
            <SectionHeader tag="Register" h2={<>Ready to<br/>compete?</>}
              sub="Open to students, professionals, and independent researchers worldwide. Registration is free — spots are limited." />
            <span ref={magRef} className="mt-8 inline-block">
              <motion.button onClick={onRegister} whileHover={{scale:1.04}} whileTap={{scale:.97}} id="btn-register"
                className="inline-flex items-center gap-2 bg-[#4ADE80] text-[#080C0A] px-8 py-4 rounded-[16px] text-base font-bold tracking-tight shadow-xl hover:bg-[#22C55E] transition-colors">
                Register Now <IArrow s={18}/>
              </motion.button>
            </span>
            {/* Social proof */}
            <div className="flex items-center gap-3 mt-6">
              <div className="flex -space-x-2">
                {['#4ADE80','#22C55E','#16A34A','#15803D','#14532D'].map((c,i)=>(
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#080C0A] flex items-center justify-center text-white text-[.55rem] font-bold flex-shrink-0"
                    style={{background:c, color: c==='#4ADE80' || c==='#22C55E' ? '#080C0A' : '#ffffff'}}>{'ABCDE'[i]}</div>
                ))}
              </div>
              <p className="text-sm text-[#7A9582]"><strong className="text-[#E0EAE2]">347</strong> teams registered · <strong className="text-[#E0EAE2]">153</strong> spots left</p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-[2px] rounded bg-[#4ADE80]" />
              <span className="text-[.7rem] font-bold uppercase tracking-[.15em] text-[#4ADE80]">Contact</span>
            </div>
            <h2 className="text-[1.75rem] font-normal tracking-tight text-[#E0EAE2] mb-6">Send us a message</h2>
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
    <footer className="bg-[#0F1511] border-t border-[#263028] py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#7A9582]">
        <div className="flex items-center gap-2 font-medium text-[#E0EAE2] text-base">
          Mainframe&reg; <span className="text-[#7A9582] font-normal text-sm">&times; Hackcurity 2026</span>
        </div>
        <div className="flex items-center gap-6">
          {['Privacy','Terms','Contact'].map(l => (
            <a key={l} href="#" className="hover:text-[#E0EAE2] transition-colors">{l}</a>
          ))}
        </div>
        <span style={{opacity:.65}}>&copy; 2026 Mainframe Inc. All rights reserved.</span>
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
    <div className="relative bg-[#080C0A] text-[#E0EAE2] font-sans selection:bg-[#1A4530] selection:text-[#E0EAE2] antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen">
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

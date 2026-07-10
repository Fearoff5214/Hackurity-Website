const { useState, useEffect, useRef, Fragment } = React;

/* ══════════════════════════════════════════════════════════
   INLINE MOTION SHIM
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

function AnimatePresence({ children }) { return children; }

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
    // Magnetic effect only on real pointer devices
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
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
    // Tilt effect only on real pointer devices (not touch)
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    const move = e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      el.style.transition = 'transform .08s linear, box-shadow .2s';
      el.style.transform  = `perspective(700px) rotateY(${x*max}deg) rotateX(${-y*max}deg) scale(1.02)`;
    };
    const reset = () => { el.style.transition = 'transform .35s ease'; el.style.transform = ''; };
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
   DECORATIVE ELEMENTS
 ══════════════════════════════════════════════════════════ */
function CornerBracket({ color = '#BFFF00', size = 24, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M2 10 L2 2 L10 2" stroke={color} strokeWidth="3" strokeLinecap="square"/>
    </svg>
  );
}

function DiamondDivider({ color = '#FF2D78' }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <div style={{flex:1, height:'2px', background:`linear-gradient(90deg, transparent, ${color})`}} />
      <svg width="12" height="12" viewBox="0 0 12 12">
        <rect x="2" y="2" width="8" height="8" transform="rotate(45 6 6)" fill={color}/>
      </svg>
      <div style={{flex:1, height:'2px', background:`linear-gradient(90deg, ${color}, transparent)`}} />
    </div>
  );
}

function NeonTag({ children, color = '#BFFF00', bg = 'rgba(191,255,0,0.1)' }) {
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:'6px',
      background: bg, border: `1.5px solid ${color}`,
      color, padding:'3px 12px', borderRadius:'2px',
      fontFamily:'Space Mono, monospace', fontSize:'0.65rem',
      fontWeight:700, letterSpacing:'.16em', textTransform:'uppercase',
      boxShadow: `0 0 12px ${color}55`,
    }}>
      {children}
    </span>
  );
}

function OrnamentalNumber({ n, color }) {
  return (
    <div style={{
      fontFamily:'Bebas Neue, cursive',
      fontSize: '7rem', lineHeight: 1,
      color: 'transparent',
      WebkitTextStroke: `2px ${color}`,
      opacity: 0.15,
      position:'absolute', top:'-0.5rem', right:'1rem',
      userSelect:'none', pointerEvents:'none',
    }}>{n}</div>
  );
}

/* ══════════════════════════════════════════════════════════
   MARQUEE BAND
 ══════════════════════════════════════════════════════════ */
function MarqueeBand() {
  const items = ['HACKCURITY 2026', '★', '$25,000 PRIZES', '●', '500+ HACKERS', '★', '48H SPRINT', '●', 'AUG 2–5', '★', 'BENGALURU + ONLINE', '●'];
  const doubled = [...items, ...items];
  return (
    <div style={{
      background:'var(--magenta)', overflow:'hidden',
      borderTop:'3px solid var(--acid)', borderBottom:'3px solid var(--acid)',
      padding:'10px 0', position:'relative', zIndex:5,
    }}>
      <div className="marquee-track" style={{display:'flex', gap:'2rem', whiteSpace:'nowrap', width:'max-content'}}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            fontFamily:'Bebas Neue, cursive', fontSize:'1.1rem', letterSpacing:'.18em',
            color: item === '★' || item === '●' ? 'rgba(255,255,255,.5)' : '#fff',
          }}>{item}</span>
        ))}
      </div>
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
      <header style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        padding:'14px 28px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        borderBottom: scrolled ? '2px solid var(--magenta)' : '2px solid transparent',
        background: scrolled ? 'rgba(10,0,5,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        transition:'all .3s ease',
      }}>
        {/* Logo */}
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          <div style={{
            fontFamily:'Black Ops One, cursive', fontSize:'1.4rem',
            color:'var(--acid)', letterSpacing:'.04em',
            textShadow:'0 0 20px rgba(191,255,0,.5)',
          }}>MAINFRAME</div>
          <div style={{
            background:'var(--magenta)', color:'#fff',
            fontFamily:'Space Mono, monospace', fontSize:'.55rem',
            padding:'2px 7px', letterSpacing:'.1em', fontWeight:700,
            clipPath:'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)',
          }}>®</div>
        </div>

        {/* Desktop nav */}
        <nav style={{display:'flex', gap:'28px', alignItems:'center'}}>
          {links.map(l => (
            <a key={l.l} href={l.h} style={{
              fontFamily:'Space Mono, monospace', fontSize:'.8rem',
              color:'var(--text)', letterSpacing:'.12em', textTransform:'uppercase',
              textDecoration:'none', fontWeight:700,
              transition:'color .15s',
            }}
            onMouseEnter={e => e.target.style.color='var(--acid)'}
            onMouseLeave={e => e.target.style.color='var(--text)'}
            className="hidden md:block"
            >{l.l}</a>
          ))}
        </nav>

        {/* CTA */}
        <span ref={magRef} className="hidden md:block">
          <a href="#cta-section" style={{
            fontFamily:'Bebas Neue, cursive', fontSize:'1.1rem',
            letterSpacing:'.12em', color:'#000',
            background:'var(--acid)', padding:'8px 22px',
            textDecoration:'none', border:'2px solid var(--acid)',
            boxShadow:'4px 4px 0 var(--magenta)',
            transition:'box-shadow .15s, transform .15s',
            display:'inline-block',
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow='6px 6px 0 var(--magenta)'; e.currentTarget.style.transform='translate(-1px,-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow='4px 4px 0 var(--magenta)'; e.currentTarget.style.transform=''; }}
          >GET IN TOUCH</a>
        </span>

        {/* Hamburger */}
        <button onClick={() => setOpen(o => !o)} id="mobile-menu-btn" aria-label="Toggle menu"
          className="md:hidden" style={{background:'none', border:'none', padding:0}}>
          <div style={{display:'flex', flexDirection:'column', gap:'5px', width:'28px'}}>
            <span style={{display:'block', height:'3px', background:'var(--acid)', transition:'all .3s', transform: open ? 'rotate(45deg) translate(5px,5px)' : ''}} />
            <span style={{display:'block', height:'3px', background:'var(--acid)', transition:'all .3s', opacity: open ? 0 : 1}} />
            <span style={{display:'block', height:'3px', background:'var(--acid)', transition:'all .3s', transform: open ? 'rotate(-45deg) translate(5px,-5px)' : ''}} />
          </div>
        </button>
      </header>

      {/* Mobile overlay */}
      <div className="md:hidden" style={{
        position:'fixed', inset:0, zIndex:99,
        background:'rgba(10,0,5,.97)',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'32px',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        transition:'opacity .3s',
      }}>
        {links.map(l => (
          <a key={l.l} href={l.h} onClick={() => setOpen(false)} style={{
            fontFamily:'Bebas Neue, cursive', fontSize:'3rem',
            color:'var(--acid)', letterSpacing:'.15em', textDecoration:'none',
          }}>{l.l}</a>
        ))}
        <a href="#cta-section" onClick={() => setOpen(false)} style={{
          fontFamily:'Bebas Neue, cursive', fontSize:'1.8rem',
          color:'var(--magenta)', letterSpacing:'.15em', textDecoration:'none',
        }}>GET IN TOUCH</a>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   BACKGROUND VIDEO
 ══════════════════════════════════════════════════════════ */
function BackgroundVideo() {
  const vidRef = useRef(null);
  const prevX  = useRef(null);
  const tgt    = useRef(0);

  useEffect(() => {
    const v = vidRef.current; if (!v) return;
    const onMove = e => {
      if (window.innerWidth < 1024) return;
      const cx = e.clientX;
      if (prevX.current === null) { prevX.current = cx; return; }
      const delta = cx - prevX.current; prevX.current = cx;
      if (!v.duration) return;
      tgt.current += (delta / window.innerWidth) * 0.8 * v.duration;
      tgt.current  = Math.max(0, Math.min(v.duration, tgt.current));
      v.currentTime = tgt.current;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const v = vidRef.current; if (!v) return;
    const check = () => { if (window.innerWidth < 1024) { v.autoplay = true; v.loop = true; v.play().catch(() => {}); } };
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="order-last lg:order-none" style={{
      position:'relative', overflow:'hidden',
      width:'100%', aspectRatio:'auto',
    }}>
      <div className="hidden lg:block" style={{
        position:'absolute', inset:0, zIndex:2,
        background:'linear-gradient(to right,rgba(10,0,5,.97) 38%,rgba(10,0,5,.5) 65%,transparent 100%)',
      }} />
      {/* Magenta tint overlay */}
      <div className="hidden lg:block" style={{
        position:'absolute', inset:0, zIndex:2,
        background:'rgba(155,0,255,.12)',
        mixBlendMode:'multiply',
      }} />
      <video ref={vidRef} muted playsInline preload="auto"
        style={{width:'100%', height:'100%', objectFit:'cover', objectPosition:'right bottom'}}>
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4" type="video/mp4" />
      </video>
    </div>
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

  const pillColors = { Brand:'#BFFF00', Digital:'#00F0FF', Campaign:'#FF2D78', Other:'#FF6B00' };

  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.5,delay:.35}}>
      <p style={{fontFamily:'Bebas Neue, cursive', fontSize:'1.8rem', letterSpacing:'.08em', color:'var(--acid)', marginBottom:'4px'}}>What sort of service?</p>
      <p style={{fontFamily:'Space Mono, monospace', fontSize:'.7rem', color:'rgba(245,240,255,.5)', marginBottom:'20px', letterSpacing:'.08em'}}>// select_all_that_apply</p>

      <div style={{display:'flex', flexWrap:'wrap', gap:'10px', marginBottom:'16px'}}>
        {SERVICE_OPTIONS.map(s => {
          const on = selected.includes(s);
          const c  = pillColors[s];
          return (
            <motion.button key={s} id={'pill-'+s.toLowerCase()}
              onClick={() => toggle(s)}
              whileHover={{scale:1.06}} whileTap={{scale:.94}}
              style={{
                display:'flex', alignItems:'center', gap:'8px',
                padding:'8px 20px',
                background: on ? c : 'rgba(255,255,255,.04)',
                color: on ? '#000' : c,
                border: `2px solid ${c}`,
                boxShadow: on ? `4px 4px 0 rgba(0,0,0,.4), 0 0 16px ${c}55` : `0 0 8px ${c}33`,
                fontFamily:'Space Mono, monospace', fontWeight:700,
                fontSize:'.8rem', letterSpacing:'.08em', textTransform:'uppercase',
                transition:'all .15s',
                clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)',
              }}>
              {on && <span style={{animation:'scaleIn .22s cubic-bezier(.34,1.56,.64,1) both'}}><ICheck s={13}/></span>}
              {s}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {!active ? (
          <motion.p key="empty" initial={{opacity:0}} animate={{opacity:.45}} exit={{opacity:0}} transition={{duration:.2}}
            style={{fontFamily:'Space Mono, monospace', fontSize:'.7rem', color:'rgba(245,240,255,.45)', fontStyle:'italic'}}>
            ↑ click to select services
          </motion.p>
        ) : (
          <motion.div key="active" initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}
            transition={{duration:.3}} style={{overflow:'hidden'}}>
            <div style={{
              border:'2px solid var(--acid)', padding:'14px 18px',
              background:'rgba(191,255,0,.06)', boxShadow:'4px 4px 0 var(--magenta)',
              display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px',
            }}>
              <p style={{fontFamily:'Space Mono, monospace', fontSize:'.75rem', color:'rgba(245,240,255,.8)'}}>
                Inquire: <strong style={{color:'var(--acid)'}}>{selected.join(' + ')}</strong>
              </p>
              <a href="#cta-section" style={{
                fontFamily:'Bebas Neue, cursive', fontSize:'.95rem', letterSpacing:'.12em',
                color:'var(--magenta)', textDecoration:'none', display:'flex', alignItems:'center', gap:'4px',
                whiteSpace:'nowrap',
              }}>LET'S GO <IArrow s={14}/></a>
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
    <div style={{
      position:'relative', zIndex:10,
      display:'flex', flexDirection:'column',
      background:'var(--bg)', minHeight:'100vh',
    }} className="lg:bg-transparent">
      {/* Grid overlay */}
      <div className="grid-overlay" style={{position:'absolute', inset:0, zIndex:0, pointerEvents:'none'}} />

      {/* Decorative corner brackets */}
      <CornerBracket color="#BFFF00" size={48} style={{position:'absolute', top:'80px', left:'20px', zIndex:2}} />
      <CornerBracket color="#FF2D78" size={48} style={{position:'absolute', top:'80px', left:'20px', zIndex:2, transform:'rotate(90deg) translate(-20px,0)', transformOrigin:'top left'}} />
      <CornerBracket color="#00F0FF" size={32} style={{position:'absolute', bottom:'40px', right:'20px', zIndex:2, transform:'rotate(180deg)'}} />

      <main id="spade-hero" style={{
        width:'100%', maxWidth:'1280px', margin:'0 auto',
        padding:'clamp(90px, 15vw, 130px) clamp(16px, 5vw, 40px) clamp(40px, 8vw, 72px)',
        flex:1, display:'flex', flexDirection:'column', justifyContent:'center',
        position:'relative', zIndex:2,
      }}>
        {/* Live badge */}
        <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} transition={{duration:.5,delay:.15}}
          style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'28px', flexWrap:'wrap'}}>
          <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
            <span style={{
              width:'10px', height:'10px', borderRadius:'50%', background:'var(--acid)',
              display:'inline-block', animation:'pulse 2s ease-in-out infinite',
              boxShadow:'0 0 10px var(--acid)',
            }} />
            <NeonTag color="#BFFF00" bg="rgba(191,255,0,.08)">Hackcurity 2026</NeonTag>
          </div>
          <NeonTag color="#FF2D78" bg="rgba(255,45,120,.08)">Hack the Future</NeonTag>
          <NeonTag color="#00F0FF" bg="rgba(0,240,255,.08)">Aug 2–5</NeonTag>
        </motion.div>

        {/* Headline */}
        <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.7}}>
          <h1 style={{
            fontFamily:'Black Ops One, cursive',
            fontSize:'clamp(3.2rem, 9vw, 7.5rem)',
            lineHeight:1.05,
            color:'var(--text)',
            marginBottom:'24px',
            letterSpacing:'.02em',
            whiteSpace:'pre-wrap',
            textShadow:'0 0 40px rgba(191,255,0,.12)',
          }}>
            {displayed}
            {!done && <span style={{
              display:'inline-block', width:'4px', height:'1em', background:'var(--acid)',
              verticalAlign:'middle', marginLeft:'4px', animation:'blink 1s step-end infinite',
            }} />}
          </h1>
        </motion.div>

        {/* Sub */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.12}}>
          <p style={{
            fontFamily:'Space Grotesk, sans-serif', fontSize:'1.1rem',
            color:'rgba(245,240,255,.65)', lineHeight:1.7,
            marginBottom:'36px', maxWidth:'520px',
            fontWeight:400,
          }}>
            Whether you have questions, feedback,<br />
            drop us a message and we'll get back to you as soon as possible.
          </p>
        </motion.div>

        {/* Event chips */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.5,delay:.22}}
          style={{display:'flex', flexWrap:'wrap', gap:'10px', marginBottom:'44px'}}>
          {[
            {I:ICalendar, t:'August 2–5, 2026',          c:'#BFFF00'},
            {I:IPin,      t:'Online + On-site, Bengaluru', c:'#FF2D78'},
            {I:IUsers,    t:'Teams of 1–4',                c:'#00F0FF'},
            {I:IClock,    t:'48-Hour Sprint',               c:'#FF6B00'},
          ].map(({I,t,c}) => (
            <div key={t} style={{
              display:'flex', alignItems:'center', gap:'8px',
              fontFamily:'Space Mono, monospace', fontSize:'.72rem',
              color: c, border:`1.5px solid ${c}44`,
              padding:'6px 14px',
              background:`${c}10`,
              letterSpacing:'.06em',
            }}>
              <I s={12}/>{t}
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
function SectionHeader({tag, h2, sub, accent='#BFFF00'}) {
  const [ref, vis] = useInView(0.2);
  return (
    <motion.div ref={ref} initial={{opacity:0,y:24}} animate={vis?{opacity:1,y:0}:{opacity:0,y:24}} transition={{duration:.6}}>
      <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px'}}>
        <div style={{width:'30px', height:'4px', background:`linear-gradient(90deg, ${accent}, transparent)`, borderRadius:'2px'}} />
        <NeonTag color={accent} bg={`${accent}12`}>{tag}</NeonTag>
      </div>
      <h2 style={{
        fontFamily:'Black Ops One, cursive',
        fontSize:'clamp(2.2rem, 5vw, 3.8rem)',
        color:'var(--text)', lineHeight:1.1,
        letterSpacing:'.03em', marginBottom:'14px',
      }}>{h2}</h2>
      {sub && <p style={{fontFamily:'Space Grotesk, sans-serif', fontSize:'1rem', color:'rgba(245,240,255,.55)', lineHeight:1.7, maxWidth:'520px'}}>{sub}</p>}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   STATS BAR
 ══════════════════════════════════════════════════════════ */
function StatsBar() {
  const [ref, vis] = useInView();
  const stats = [
    {v:'$25,000', I:ITrophy, l:'Prize Pool',    c:'#BFFF00'},
    {v:'500+',    I:IUsers,  l:'Participants',   c:'#FF2D78'},
    {v:'48h',     I:IClock,  l:'Non-Stop',       c:'#00F0FF'},
    {v:'Global',  I:IGlobe,  l:'Open to All',    c:'#FF6B00'},
  ];
  return (
    <section ref={ref} style={{
      background:'var(--surface)',
      borderTop:'3px solid var(--purple)', borderBottom:'3px solid var(--purple)',
      padding:'56px 28px', position:'relative', overflow:'hidden',
    }}>
      {/* Stripe bg */}
      <div className="stripe-bg" style={{position:'absolute', inset:0, pointerEvents:'none'}} />
      <div className="stats-grid" style={{maxWidth:'1280px', margin:'0 auto', position:'relative', zIndex:1}}>
        {stats.map(({v,I,l,c},i) => (
          <motion.div key={l} initial={{opacity:0,y:24}}
            animate={vis?{opacity:1,y:0}:{opacity:0,y:24}} transition={{duration:.5,delay:i*.09}}
            style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'10px', textAlign:'center'}}>
            <div style={{
              width:'56px', height:'56px', borderRadius:'50%',
              background:`${c}18`, border:`2px solid ${c}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              color: c, boxShadow:`0 0 20px ${c}44`,
            }}>
              <I s={24}/>
            </div>
            <span style={{
              fontFamily:'Bebas Neue, cursive', fontSize:'3rem', lineHeight:1,
              color: c, textShadow:`0 0 20px ${c}88`,
              letterSpacing:'.05em',
            }}>{v}</span>
            <span style={{fontFamily:'Space Mono, monospace', fontSize:'.62rem', color:'rgba(245,240,255,.5)', letterSpacing:'.14em', textTransform:'uppercase'}}>{l}</span>
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
  {color:'#FF2D78',tag:'Offensive',    title:'Red Team & Exploitation',     desc:'CTF-style flags, live targets, and zero-day simulation in enterprise environments.',    I:IShield},
  {color:'#00F0FF',tag:'AI Safety',    title:'Adversarial ML & AI Security', desc:'Prompt injection, model poisoning, and differential privacy challenges on live models.', I:IZap},
  {color:'#FFE000',tag:'Cryptography', title:'Crypto & Protocol Attacks',    desc:'Break weak implementations, forge signatures, exploit misconfigurations in protocols.',   I:ILock},
  {color:'#BFFF00',tag:'Zero-Trust',   title:'Network & Identity Defense',   desc:'Design and stress-test zero-trust architectures and IAM policies under live attack.',      I:IGlobe},
  {color:'#9B00FF',tag:'Web3',         title:'Smart Contract Auditing',      desc:'Hunt bugs in Solidity, exploit reentrancy and flash-loan vulnerabilities in DeFi.',        I:IDatabase},
  {color:'#FF6B00',tag:'Open',         title:'Open Innovation Track',        desc:'No constraints. Build any security tool or research that makes the world safer.',          I:ICode},
];

function TrackCard({track, delay, index}) {
  const [ref, vis] = useInView();
  const tiltRef    = useTilt(8);
  return (
    <motion.div ref={ref} initial={{opacity:0,y:28}}
      animate={vis?{opacity:1,y:0}:{opacity:0,y:28}} transition={{duration:.5,delay}}>
      <div ref={tiltRef} className="tilt max-card" style={{
        height:'100%', position:'relative', overflow:'hidden',
        border:`2px solid ${track.color}55`,
        background:`linear-gradient(135deg, ${track.color}0A 0%, var(--surface) 60%)`,
        padding:'28px', boxShadow:`0 0 28px ${track.color}22`,
      }}>
        <OrnamentalNumber n={String(index+1).padStart(2,'0')} color={track.color} />
        
        {/* Corner accent */}
        <div style={{
          position:'absolute', top:0, right:0,
          width:'60px', height:'60px',
          background:`linear-gradient(225deg, ${track.color}44 0%, transparent 70%)`,
        }} />
        
        <div style={{
          width:'48px', height:'48px', display:'flex', alignItems:'center', justifyContent:'center',
          background:`${track.color}1A`, border:`2px solid ${track.color}66`,
          marginBottom:'18px', color: track.color,
          boxShadow:`0 0 16px ${track.color}44`,
        }}>
          <track.I s={22}/>
        </div>
        
        <div style={{
          fontFamily:'Black Ops One, cursive', fontSize:'1.05rem',
          color:'var(--text)', marginBottom:'10px', letterSpacing:'.03em',
        }}>{track.title}</div>
        
        <div style={{
          fontFamily:'Space Grotesk, sans-serif', fontSize:'.875rem',
          color:'rgba(245,240,255,.6)', lineHeight:1.65, marginBottom:'16px',
        }}>{track.desc}</div>
        
        <div style={{
          display:'inline-block',
          fontFamily:'Space Mono, monospace', fontSize:'.6rem', fontWeight:700,
          letterSpacing:'.14em', textTransform:'uppercase',
          padding:'3px 10px', border:`1.5px solid ${track.color}`,
          color: track.color, background:`${track.color}14`,
        }}>{track.tag}</div>
      </div>
    </motion.div>
  );
}

function TracksSection() {
  return (
    <section id="tracks-section" style={{padding:'clamp(48px,8vw,88px) clamp(16px,5vw,28px)', background:'var(--bg)', position:'relative', overflow:'hidden'}}>
      <div className="dot-matrix" style={{position:'absolute', inset:0, pointerEvents:'none', opacity:.5}} />
      <div style={{maxWidth:'1280px', margin:'0 auto', position:'relative', zIndex:1}}>
        <SectionHeader tag="Challenge Tracks" accent="#FF2D78"
          h2={<>Five arenas.<br/>One winner.</>}
          sub="Pick your battlefield. Each track has its own prize pool, dedicated mentors, and real-world impact." />
        <DiamondDivider color="#FF2D78" />
        <div className="grid-auto-lg" style={{marginTop:'48px'}}>
          {TRACKS.map((t,i) => <TrackCard key={t.title} track={t} delay={i*.07} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   TIMELINE
 ══════════════════════════════════════════════════════════ */
const TL = [
  {ph:'01',c:'#BFFF00',l:'Registration Opens',         d:'July 1, 2026',              t:'Sign up solo or as a team of up to 4. Early registrants receive a Hackcurity swag kit.'},
  {ph:'02',c:'#00F0FF',l:'Problem Statements Released', d:'July 15, 2026',             t:'All five challenge tracks go live. Study the briefs and start planning your approach.'},
  {ph:'03',c:'#FF6B00',l:'Mentor Office Hours Begin',   d:'July 22, 2026',             t:'Weekly 1:1 sessions with industry mentors. Get feedback before the hackathon starts.'},
  {ph:'04',c:'#FF2D78',l:'48-Hour Hackathon Kicks Off', d:'Aug 2, 2026 — 09:00 IST',  t:'The clock starts. Build, break, defend. Mentors available around the clock.'},
  {ph:'05',c:'#9B00FF',l:'Final Submissions Locked',    d:'Aug 4, 2026 — 09:00 IST',  t:'All code repositories freeze. Prepare your 5-minute demo pitch for the judges.'},
  {ph:'06',c:'#FFE000',l:'Awards & Closing Ceremony',   d:'August 5, 2026',            t:'Winners announced live. $25,000 distributed across five tracks. See you on stage!'},
];

function TLItem({item, delay}) {
  const [ref, vis] = useInView();
  return (
    <motion.div ref={ref} initial={{opacity:0,x:-28}}
      animate={vis?{opacity:1,x:0}:{opacity:0,x:-28}} transition={{duration:.5,delay}}
      style={{display:'flex', alignItems:'flex-start', gap:'20px'}}>
      {/* Phase bubble */}
      <div style={{
        flexShrink:0, width:'52px', height:'52px',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily:'Bebas Neue, cursive', fontSize:'1.2rem',
        background: item.c, color:'#000',
        clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
        flexDirection:'column', boxShadow:`0 0 20px ${item.c}88`,
      }}>{item.ph}</div>

      {/* Card */}
      <div className="max-card" style={{
        flex:1, border:`2px solid ${item.c}44`,
        background:`linear-gradient(135deg, ${item.c}08, var(--surface))`,
        padding:'20px 24px', position:'relative', overflow:'hidden',
        boxShadow:`0 0 20px ${item.c}18`,
      }}>
        {/* Top accent bar */}
        <div style={{position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg, ${item.c}, transparent)`}} />
        
        <div style={{fontFamily:'Black Ops One, cursive', fontSize:'1rem', color:'var(--text)', letterSpacing:'.03em'}}>{item.l}</div>
        <div style={{display:'flex', alignItems:'center', gap:'6px', marginTop:'4px',
          fontFamily:'Space Mono, monospace', fontSize:'.72rem', color: item.c, letterSpacing:'.06em'}}>
          <ICalendar s={11}/>{item.d}
        </div>
        <p style={{marginTop:'10px', fontFamily:'Space Grotesk, sans-serif', fontSize:'.875rem', color:'rgba(245,240,255,.55)', lineHeight:1.7}}>{item.t}</p>
      </div>
    </motion.div>
  );
}

function TimelineSection() {
  return (
    <section id="timeline-section" style={{padding:'clamp(48px,8vw,88px) clamp(16px,5vw,28px)', background:'var(--surface)', position:'relative', overflow:'hidden'}}>
      <div className="stripe-bg" style={{position:'absolute', inset:0, pointerEvents:'none'}} />
      <div style={{maxWidth:'1280px', margin:'0 auto', position:'relative', zIndex:1}}>
        <SectionHeader tag="Schedule" accent="#00F0FF" h2="Event Timeline"
          sub="From registration to the grand finale — every key date for Hackcurity 2026." />
        <DiamondDivider color="#00F0FF" />
        <div style={{display:'flex', flexDirection:'column', gap:'16px', marginTop:'48px'}}>
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
  {n:'Priya Raman',  r:'Head of Security Research',  o:'CipherCore',    i:'PR',c:'#BFFF00'},
  {n:'Ankit Mehta',  r:'Principal Red Team Engineer', o:'NullByte Labs',  i:'AM',c:'#FF2D78'},
  {n:'Sofia Chen',   r:'AI Safety Researcher',        o:'DeepGuard AI',   i:'SC',c:'#00F0FF'},
  {n:'Marcus Webb',  r:'CISO',                        o:'VaultSec',       i:'MW',c:'#FF6B00'},
  {n:'Dev Kapoor',   r:'Cryptography Engineer',       o:'Enclave.io',     i:'DK',c:'#9B00FF'},
  {n:'Yuki Tanaka',  r:'Penetration Tester',          o:'RedThread',      i:'YT',c:'#FFE000'},
  {n:'Zara Ali',     r:'Blockchain Security Lead',    o:'ChainVault',     i:'ZA',c:'#FF2D78'},
  {n:'Kai Nakamura', r:'Zero-Trust Architect',        o:'Fortress.dev',   i:'KN',c:'#BFFF00'},
];

function JudgeCard({j, delay}) {
  const [ref, vis] = useInView();
  const tiltRef    = useTilt(8);
  return (
    <motion.div ref={ref} initial={{opacity:0,y:24}}
      animate={vis?{opacity:1,y:0}:{opacity:0,y:24}} transition={{duration:.5,delay}}>
      <div ref={tiltRef} className="tilt max-card" style={{
        display:'flex', flexDirection:'column', alignItems:'center', gap:'12px',
        textAlign:'center', padding:'28px 20px',
        border:`2px solid ${j.c}44`,
        background:`linear-gradient(135deg, ${j.c}0A, var(--surface))`,
        boxShadow:`0 0 24px ${j.c}22`, position:'relative', overflow:'hidden',
      }}>
        {/* bg initial */}
        <div style={{
          position:'absolute', top:'-20px', right:'-10px',
          fontFamily:'Bebas Neue, cursive', fontSize:'5rem',
          color: j.c, opacity:.07, lineHeight:1, userSelect:'none',
        }}>{j.i}</div>

        <div style={{
          width:'72px', height:'72px',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:'Black Ops One, cursive', fontSize:'1.4rem',
          background: j.c, color:'#000',
          clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
          boxShadow:`0 0 24px ${j.c}88`,
        }}>{j.i}</div>

        <div>
          <div style={{fontFamily:'Black Ops One, cursive', fontSize:'.95rem', color:'var(--text)', letterSpacing:'.03em'}}>{j.n}</div>
          <div style={{fontFamily:'Space Grotesk, sans-serif', fontSize:'.78rem', color:'rgba(245,240,255,.55)', marginTop:'3px'}}>{j.r}</div>
        </div>
        <NeonTag color={j.c} bg={`${j.c}14`}>{j.o}</NeonTag>
      </div>
    </motion.div>
  );
}

function JudgesSection() {
  return (
    <section id="judges-section" style={{padding:'clamp(48px,8vw,88px) clamp(16px,5vw,28px)', background:'var(--bg)', position:'relative', overflow:'hidden'}}>
      <div className="dot-matrix" style={{position:'absolute', inset:0, pointerEvents:'none'}} />
      <div style={{maxWidth:'1280px', margin:'0 auto', position:'relative', zIndex:1}}>
        <SectionHeader tag="The Panel" accent="#9B00FF" h2="Judges & Mentors"
          sub="Industry leaders and security researchers who will evaluate, guide, and inspire." />
        <DiamondDivider color="#9B00FF" />
        <div className="grid-auto-md" style={{marginTop:'48px'}}>
          {JUDGES.map((j,i) => <JudgeCard key={j.n+'-'+i} j={j} delay={i*.055} />)}
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
    {l:'Gold',      c:'#FFE000', ns:['CipherCore','NullByte Labs','VaultSec']},
    {l:'Silver',    c:'#00F0FF', ns:['GridIron','RedThread','Enclave.io','KeyHaven']},
    {l:'Community', c:'#9B00FF', ns:['HackClub','OWASP','DEF CON','BugBounty.dev','SecureX']},
  ];
  return (
    <section id="sponsors-section" style={{
      background:'var(--surface)',
      borderTop:'3px solid var(--yellow)', borderBottom:'3px solid var(--yellow)',
      padding:'clamp(48px,8vw,80px) clamp(16px,5vw,28px)', position:'relative', overflow:'hidden',
    }}>
      <div className="stripe-bg" style={{position:'absolute', inset:0, pointerEvents:'none'}} />
      <motion.div ref={ref} initial={{opacity:0}} animate={vis?{opacity:1}:{opacity:0}} transition={{duration:.6}}
        style={{maxWidth:'1280px', margin:'0 auto', textAlign:'center', position:'relative', zIndex:1}}>
        
        <div style={{
          fontFamily:'Bebas Neue, cursive', fontSize:'1rem', letterSpacing:'.22em',
          color:'rgba(245,240,255,.4)', marginBottom:'40px',
        }}>OUR SPONSORS & PARTNERS</div>
        
        <div style={{display:'flex', flexDirection:'column', gap:'36px'}}>
          {tiers.map(t => (
            <div key={t.l}>
              <NeonTag color={t.c} bg={`${t.c}10`}>{t.l} TIER</NeonTag>
              <div style={{display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'14px', marginTop:'16px'}}>
                {t.ns.map(n => (
                  <div key={n} className="max-card" style={{
                    fontFamily:'Black Ops One, cursive', letterSpacing:'.06em',
                    padding: t.l === 'Gold' ? '14px 32px' : t.l === 'Silver' ? '10px 24px' : '8px 18px',
                    fontSize: t.l === 'Gold' ? '1.1rem' : t.l === 'Silver' ? '.95rem' : '.8rem',
                    border:`2px solid ${t.c}55`, color: t.c,
                    background:`${t.c}0A`, boxShadow:`0 0 12px ${t.c}22`,
                    transition:'all .2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 0 24px ${t.c}66`; e.currentTarget.style.background=`${t.c}18`; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow=`0 0 12px ${t.c}22`; e.currentTarget.style.background=`${t.c}0A`; }}
                  >{n}</div>
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

  const inp = `w-full px-4 py-3 text-sm font-mono text-[var(--text)]
    bg-[rgba(255,255,255,0.04)] border-2 border-[rgba(191,255,0,0.2)]
    focus:outline-none focus:border-[var(--acid)]
    transition-all duration-200 placeholder-[rgba(245,240,255,0.3)]`;

  const submit = e => {
    e.preventDefault();
    if (!st.name||!st.email||!st.msg) { setS('err'); return; }
    setS('sending');
    setTimeout(() => { setS('done'); setSt({name:'',email:'',org:'',msg:''}); }, 1300);
  };

  return (
    <form onSubmit={submit} style={{display:'flex', flexDirection:'column', gap:'16px'}} noValidate>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,200px),1fr))', gap:'14px'}}>
        <div>
          <label style={{fontFamily:'Space Mono, monospace', fontSize:'.65rem', letterSpacing:'.1em', color:'var(--acid)', textTransform:'uppercase', display:'block', marginBottom:'6px'}}>Name</label>
          <input className={inp} type="text" placeholder="Jane Smith"
            value={st.name} onChange={e=>setSt(p=>({...p,name:e.target.value}))} />
        </div>
        <div>
          <label style={{fontFamily:'Space Mono, monospace', fontSize:'.65rem', letterSpacing:'.1em', color:'var(--acid)', textTransform:'uppercase', display:'block', marginBottom:'6px'}}>Email</label>
          <input className={inp} type="email" placeholder="jane@example.com"
            value={st.email} onChange={e=>setSt(p=>({...p,email:e.target.value}))} />
        </div>
      </div>
      <div>
        <label style={{fontFamily:'Space Mono, monospace', fontSize:'.65rem', letterSpacing:'.1em', color:'rgba(245,240,255,.5)', textTransform:'uppercase', display:'block', marginBottom:'6px'}}>
          Organisation <span style={{textTransform:'none', fontWeight:400, opacity:.6}}>(optional)</span>
        </label>
        <input className={inp} type="text" placeholder="Acme Security"
          value={st.org} onChange={e=>setSt(p=>({...p,org:e.target.value}))} />
      </div>
      <div>
        <label style={{fontFamily:'Space Mono, monospace', fontSize:'.65rem', letterSpacing:'.1em', color:'var(--acid)', textTransform:'uppercase', display:'block', marginBottom:'6px'}}>Message</label>
        <textarea className={inp+' resize-y min-h-[110px]'} style={{resize:'vertical', minHeight:'110px'}}
          placeholder="Tell us about your team, questions, or sponsorship interest…"
          value={st.msg} onChange={e=>setSt(p=>({...p,msg:e.target.value}))} />
      </div>
      <div style={{display:'flex', alignItems:'center', gap:'16px', flexWrap:'wrap'}}>
        <span ref={magRef}>
          <motion.button type="submit" whileHover={{scale:1.04}} whileTap={{scale:.96}}
            disabled={status==='sending'||status==='done'}
            style={{
              display:'flex', alignItems:'center', gap:'8px',
              background:'var(--acid)', color:'#000', border:'2px solid var(--acid)',
              padding:'12px 28px', fontFamily:'Black Ops One, cursive',
              fontSize:'1rem', letterSpacing:'.08em',
              boxShadow: status==='done' ? '0 0 20px rgba(191,255,0,.4)' : '4px 4px 0 var(--magenta)',
              transition:'all .15s', opacity: (status==='sending'||status==='done') ? .7 : 1,
            }}>
            {status==='sending'?'SENDING…':status==='done'?'✓ SENT!':<><span>SEND MESSAGE</span><ISend s={15}/></>}
          </motion.button>
        </span>
        {status==='err'  && <p style={{fontFamily:'Space Mono, monospace', fontSize:'.75rem', color:'#ff4466'}}>↑ Fill all required fields.</p>}
        {status==='done' && <p style={{fontFamily:'Space Mono, monospace', fontSize:'.75rem', color:'var(--acid)'}}>We'll reply within 2 business days.</p>}
      </div>
    </form>
  );
}

/* ══════════════════════════════════════════════════════════
   REGISTRATION MODAL (3-step)
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

const STEP_COLORS = ['#BFFF00','#00F0FF','#FF2D78'];

function RegModal({ onClose }) {
  const [step, setStep]   = useState(1);
  const [errors, setErrs] = useState({});

  const [team, setTeam] = useState({ name: '', size: '', institution: '', track: '', level: '' });
  const blankMember = () => ({ name:'', email:'', role:'', github:'' });
  const [members, setMembers] = useState([blankMember()]);
  const [extra, setExtra] = useState({ idea:'', terms:false, conduct:false });

  const inpStyle = (err) => ({
    width:'100%', padding:'10px 14px',
    background:'rgba(255,255,255,.04)',
    border:`2px solid ${err ? '#ff4466' : 'rgba(191,255,0,.2)'}`,
    color:'var(--text)', fontFamily:'Space Grotesk, sans-serif', fontSize:'.9rem',
    outline:'none', transition:'border-color .15s',
    fontWeight:400,
  });

  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function validateStep1() {
    const e = {};
    if (!team.name.trim()) e.name  = 'Team name required.';
    if (!team.size)        e.size  = 'Select team size.';
    if (!team.track)       e.track = 'Select a challenge track.';
    if (!team.level)       e.level = 'Select experience level.';
    setErrs(e); return Object.keys(e).length === 0;
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
    setErrs(e); return Object.keys(e).length === 0;
  }
  function validateStep3() {
    const e = {};
    if (!extra.idea.trim()) e.idea    = 'Share a brief project idea.';
    if (!extra.terms)       e.terms   = 'Accept Terms & Conditions.';
    if (!extra.conduct)     e.conduct = 'Accept Code of Conduct.';
    setErrs(e); return Object.keys(e).length === 0;
  }

  function next() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3) { if (!validateStep3()) return; setStep('done'); return; }
    const count = parseInt(team.size) || 1;
    setMembers(prev => { const arr = [...prev]; while (arr.length < count) arr.push(blankMember()); return arr.slice(0, count); });
    setErrs({}); setStep(s => s + 1);
  }
  function back() { setErrs({}); setStep(s => s - 1); }
  const memberCount = parseInt(team.size) || 1;
  const STEPS = ['Team Info', 'Members', 'Project'];

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:1000,
      display:'flex', alignItems:'center', justifyContent:'center', padding:'16px',
      background:'rgba(10,0,5,.85)', backdropFilter:'blur(8px)',
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div style={{
        position:'relative', width:'100%', maxWidth:'680px',
        background:'var(--surface)', maxHeight:'92vh',
        display:'flex', flexDirection:'column',
        border:'2px solid var(--acid)',
        boxShadow:'0 0 60px rgba(191,255,0,.25), 8px 8px 0 var(--magenta)',
        overflow:'hidden',
      }}>
        {/* Corner brackets */}
        <div style={{position:'absolute', top:0, left:0, zIndex:2}}>
          <CornerBracket color="#BFFF00" size={28} />
        </div>

        {/* Header */}
        <div style={{padding:'clamp(16px,4vw,28px) clamp(16px,4vw,32px) 22px', borderBottom:'2px solid rgba(191,255,0,.15)', flexShrink:0}}>
          <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'20px'}}>
            <div>
              <NeonTag color="#BFFF00" bg="rgba(191,255,0,.08)">Hackcurity 2026</NeonTag>
              <h2 style={{fontFamily:'Black Ops One, cursive', fontSize:'1.8rem', color:'var(--text)', marginTop:'8px', letterSpacing:'.04em'}}>
                {step === 'done' ? "YOU'RE REGISTERED! 🎉" : 'REGISTER YOUR TEAM'}
              </h2>
              {step !== 'done' && <p style={{fontFamily:'Space Mono, monospace', fontSize:'.65rem', color:'rgba(245,240,255,.4)', marginTop:'4px', letterSpacing:'.08em'}}>FREE · 500+ PARTICIPANTS · $25,000 IN PRIZES</p>}
            </div>
            <button onClick={onClose} aria-label="Close" style={{
              width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center',
              border:'2px solid rgba(191,255,0,.3)', background:'transparent',
              color:'rgba(245,240,255,.6)', flexShrink:0, marginTop:'2px',
              transition:'border-color .15s, color .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='var(--magenta)'; e.currentTarget.style.color='var(--magenta)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(191,255,0,.3)'; e.currentTarget.style.color='rgba(245,240,255,.6)'; }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {step !== 'done' && (
            <div style={{display:'flex', alignItems:'center', gap:'0'}}>
              {STEPS.map((label, i) => {
                const num  = i + 1;
                const done = num < step;
                const curr = num === step;
                const c    = STEP_COLORS[i];
                return (
                  <Fragment key={label}>
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'5px'}}>
                      <div style={{
                        width:'34px', height:'34px', display:'flex', alignItems:'center', justifyContent:'center',
                        fontFamily:'Black Ops One, cursive', fontSize:'.85rem',
                        background: done ? c : curr ? c : 'rgba(255,255,255,.06)',
                        color: (done||curr) ? '#000' : 'rgba(245,240,255,.4)',
                        border: `2px solid ${(done||curr) ? c : 'rgba(255,255,255,.12)'}`,
                        boxShadow: curr ? `0 0 16px ${c}88` : 'none',
                        transition:'all .3s',
                      }}>
                        {done ? <ICheck s={13}/> : num}
                      </div>
                      <span style={{
                        fontFamily:'Space Mono, monospace', fontSize:'.55rem', letterSpacing:'.12em',
                        textTransform:'uppercase',
                        color: curr ? c : done ? c : 'rgba(245,240,255,.3)',
                      }}>{label}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{
                        flex:1, height:'2px', margin:'0 6px 18px',
                        background: done ? STEP_COLORS[i] : 'rgba(255,255,255,.08)',
                        transition:'background .4s',
                      }} />
                    )}
                  </Fragment>
                );
              })}
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{flex:1, overflowY:'auto', padding:'clamp(16px,4vw,24px) clamp(16px,4vw,32px)'}}>

          {/* Step 1 */}
          {step === 1 && (
            <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
              {/* Team name + size — stacks on narrow modal */}
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,180px),1fr))', gap:'14px'}}>
                <div>
                  <label style={{fontFamily:'Space Mono, monospace', fontSize:'.62rem', letterSpacing:'.1em', color:'var(--acid)', textTransform:'uppercase', display:'block', marginBottom:'6px'}}>Team Name *</label>
                  <input style={inpStyle(errors.name)} type="text" placeholder="e.g. ZeroDay Ninjas"
                    value={team.name} onChange={e=>setTeam(p=>({...p,name:e.target.value}))} />
                  {errors.name && <span style={{fontFamily:'Space Mono, monospace', fontSize:'.68rem', color:'#ff4466'}}>{errors.name}</span>}
                </div>
                <div>
                  <label style={{fontFamily:'Space Mono, monospace', fontSize:'.62rem', letterSpacing:'.1em', color:'var(--acid)', textTransform:'uppercase', display:'block', marginBottom:'6px'}}>Team Size *</label>
                  <select style={{...inpStyle(errors.size), appearance:'none'}} value={team.size}
                    onChange={e=>setTeam(p=>({...p,size:e.target.value}))}>
                    <option value="">Select…</option>
                    {SIZES.map(s => <option key={s} value={s.charAt(0)}>{s} member{s.charAt(0)!=='1'?'s':''}</option>)}
                  </select>
                  {errors.size && <span style={{fontFamily:'Space Mono, monospace', fontSize:'.68rem', color:'#ff4466'}}>{errors.size}</span>}
                </div>
              </div>

              <div>
                <label style={{fontFamily:'Space Mono, monospace', fontSize:'.62rem', letterSpacing:'.1em', color:'rgba(245,240,255,.4)', textTransform:'uppercase', display:'block', marginBottom:'6px'}}>Institution / Organisation (optional)</label>
                <input style={inpStyle(false)} type="text" placeholder="University, company, or independent"
                  value={team.institution} onChange={e=>setTeam(p=>({...p,institution:e.target.value}))} />
              </div>

              <div>
                <label style={{fontFamily:'Space Mono, monospace', fontSize:'.62rem', letterSpacing:'.1em', color:'var(--acid)', textTransform:'uppercase', display:'block', marginBottom:'6px'}}>Challenge Track *</label>
                <select style={{...inpStyle(errors.track), appearance:'none'}} value={team.track}
                  onChange={e=>setTeam(p=>({...p,track:e.target.value}))}>
                  <option value="">Select a track…</option>
                  {TRACKS_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.track && <span style={{fontFamily:'Space Mono, monospace', fontSize:'.68rem', color:'#ff4466'}}>{errors.track}</span>}
              </div>

              <div>
                <label style={{fontFamily:'Space Mono, monospace', fontSize:'.62rem', letterSpacing:'.1em', color:'var(--acid)', textTransform:'uppercase', display:'block', marginBottom:'8px'}}>Team Experience Level *</label>
                <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px'}}>
                  {LEVELS.map((l,i) => {
                    const lc = ['#BFFF00','#00F0FF','#FF6B00','#FF2D78'][i];
                    const on = team.level === l;
                    return (
                      <button key={l} type="button" onClick={() => setTeam(p=>({...p,level:l}))} style={{
                        padding:'8px 6px', textAlign:'center',
                        fontFamily:'Space Mono, monospace', fontSize:'.7rem', letterSpacing:'.06em',
                        background: on ? lc : 'rgba(255,255,255,.04)',
                        color: on ? '#000' : lc,
                        border:`2px solid ${on ? lc : `${lc}44`}`,
                        boxShadow: on ? `0 0 16px ${lc}66` : 'none',
                        transition:'all .15s',
                      }}>{l}</button>
                    );
                  })}
                </div>
                {errors.level && <span style={{fontFamily:'Space Mono, monospace', fontSize:'.68rem', color:'#ff4466'}}>{errors.level}</span>}
              </div>

              <div style={{
                display:'flex', alignItems:'flex-start', gap:'10px',
                border:'2px solid rgba(191,255,0,.2)', padding:'14px 16px',
                background:'rgba(191,255,0,.04)',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BFFF00" strokeWidth="2" strokeLinecap="round" style={{marginTop:1,flexShrink:0}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p style={{fontFamily:'Space Grotesk, sans-serif', fontSize:'.8rem', color:'rgba(245,240,255,.6)', lineHeight:1.6}}>
                  You can change your track up until <strong style={{color:'var(--text)'}}>July 25, 2026</strong>. All tracks are equally eligible for the grand prize.
                </p>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
              {Array.from({length: memberCount}, (_, i) => {
                const mc = ['#BFFF00','#00F0FF','#FF6B00','#FF2D78'][i];
                return (
                  <div key={i} style={{border:`2px solid ${mc}33`, padding:'20px', background:`${mc}06`}}>
                    <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px'}}>
                      <div style={{
                        width:'30px', height:'30px', display:'flex', alignItems:'center', justifyContent:'center',
                        fontFamily:'Black Ops One, cursive', fontSize:'.8rem',
                        background: mc, color:'#000', flexShrink:0,
                      }}>{i+1}</div>
                      <span style={{fontFamily:'Space Mono, monospace', fontSize:'.72rem', color: mc, letterSpacing:'.1em', textTransform:'uppercase'}}>
                        {i === 0 ? 'Team Leader (you)' : `Member ${i+1}`}
                      </span>
                    </div>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
                      {[
                        {k:`m${i}name`, lbl:'Full Name *', t:'text', ph:'Jane Smith', field:'name'},
                        {k:`m${i}email`, lbl:'Email *', t:'email', ph:'jane@example.com', field:'email'},
                      ].map(({k,lbl,t,ph,field}) => (
                        <div key={k}>
                          <label style={{fontFamily:'Space Mono, monospace', fontSize:'.6rem', letterSpacing:'.1em', color:`${mc}cc`, textTransform:'uppercase', display:'block', marginBottom:'5px'}}>{lbl}</label>
                          <input style={inpStyle(errors[k])} type={t} placeholder={ph}
                            value={members[i]?.[field]||''}
                            onChange={e=>setMembers(arr=>{ const a=[...arr]; a[i]={...a[i],[field]:e.target.value}; return a; })} />
                          {errors[k] && <span style={{fontFamily:'Space Mono, monospace', fontSize:'.65rem', color:'#ff4466'}}>{errors[k]}</span>}
                        </div>
                      ))}
                      <div>
                        <label style={{fontFamily:'Space Mono, monospace', fontSize:'.6rem', letterSpacing:'.1em', color:`${mc}cc`, textTransform:'uppercase', display:'block', marginBottom:'5px'}}>Role *</label>
                        <select style={{...inpStyle(errors[`m${i}role`]), appearance:'none'}}
                          value={members[i]?.role||''}
                          onChange={e=>setMembers(arr=>{ const a=[...arr]; a[i]={...a[i],role:e.target.value}; return a; })}>
                          <option value="">Select role…</option>
                          {ROLES.map(r=><option key={r} value={r}>{r}</option>)}
                        </select>
                        {errors[`m${i}role`] && <span style={{fontFamily:'Space Mono, monospace', fontSize:'.65rem', color:'#ff4466'}}>{errors[`m${i}role`]}</span>}
                      </div>
                      <div>
                        <label style={{fontFamily:'Space Mono, monospace', fontSize:'.6rem', letterSpacing:'.1em', color:'rgba(245,240,255,.3)', textTransform:'uppercase', display:'block', marginBottom:'5px'}}>GitHub (optional)</label>
                        <input style={inpStyle(false)} type="url" placeholder="https://github.com/..."
                          value={members[i]?.github||''}
                          onChange={e=>setMembers(arr=>{ const a=[...arr]; a[i]={...a[i],github:e.target.value}; return a; })} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div style={{display:'flex', flexDirection:'column', gap:'18px'}}>
              <div>
                <label style={{fontFamily:'Space Mono, monospace', fontSize:'.62rem', letterSpacing:'.1em', color:'var(--acid)', textTransform:'uppercase', display:'block', marginBottom:'6px'}}>
                  Project Idea * <span style={{textTransform:'none', fontWeight:400, color:'rgba(245,240,255,.35)', fontSize:'.6rem'}}>(2–3 sentences)</span>
                </label>
                <textarea style={{...inpStyle(errors.idea), resize:'vertical', minHeight:'110px', fontFamily:'Space Grotesk, sans-serif'}}
                  placeholder="Briefly describe what you plan to build or explore…"
                  value={extra.idea} onChange={e=>setExtra(p=>({...p,idea:e.target.value}))} />
                {errors.idea && <span style={{fontFamily:'Space Mono, monospace', fontSize:'.68rem', color:'#ff4466'}}>{errors.idea}</span>}
              </div>

              <div style={{border:'2px solid rgba(191,255,0,.15)', padding:'18px', background:'rgba(191,255,0,.04)'}}>
                <p style={{fontFamily:'Space Mono, monospace', fontSize:'.6rem', letterSpacing:'.14em', color:'var(--acid)', textTransform:'uppercase', marginBottom:'12px'}}>Registration Summary</p>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 20px'}}>
                  {[['Team', team.name],['Size', memberCount+' member'+(memberCount>1?'s':'')],['Track', team.track],['Level', team.level]].map(([k,v]) => (
                    <div key={k} style={{fontFamily:'Space Grotesk, sans-serif', fontSize:'.82rem'}}>
                      <span style={{color:'rgba(245,240,255,.45)'}}>{k}: </span>
                      <span style={{color:'var(--acid)', fontWeight:600}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                {[{key:'terms',label:<>I agree to the <a href="#" style={{color:'var(--acid)'}}>Terms & Conditions</a> of Hackcurity 2026.</>},
                  {key:'conduct',label:<>I agree to uphold the <a href="#" style={{color:'var(--acid)'}}>Code of Conduct</a> throughout the event.</>}].map(({key,label}) => (
                  <label key={key} style={{display:'flex', alignItems:'flex-start', gap:'12px', cursor:'pointer'}}>
                    <span style={{
                      marginTop:'2px', flexShrink:0, width:'20px', height:'20px',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      border:`2px solid ${extra[key] ? 'var(--acid)' : 'rgba(191,255,0,.3)'}`,
                      background: extra[key] ? 'var(--acid)' : 'transparent',
                      color:'#000', transition:'all .15s',
                      ...(errors[key] ? {borderColor:'#ff4466'} : {}),
                    }}>
                      {extra[key] && <ICheck s={11}/>}
                    </span>
                    <input type="checkbox" style={{display:'none'}} checked={extra[key]}
                      onChange={e=>setExtra(p=>({...p,[key]:e.target.checked}))} />
                    <span style={{fontFamily:'Space Grotesk, sans-serif', fontSize:'.85rem', color:'rgba(245,240,255,.65)', lineHeight:1.6}}>{label}</span>
                  </label>
                ))}
                {(errors.terms||errors.conduct) && <p style={{fontFamily:'Space Mono, monospace', fontSize:'.68rem', color:'#ff4466'}}>Please accept both agreements.</p>}
              </div>
            </div>
          )}

          {/* Done */}
          {step === 'done' && (
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'32px 0', gap:'20px'}}>
              <div style={{
                width:'80px', height:'80px', display:'flex', alignItems:'center', justifyContent:'center',
                background:'var(--acid)', color:'#000',
                boxShadow:'0 0 40px rgba(191,255,0,.5), 8px 8px 0 var(--magenta)',
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <h3 style={{fontFamily:'Black Ops One, cursive', fontSize:'2rem', color:'var(--acid)', letterSpacing:'.05em'}}>
                  YOU'RE IN, {(members[0]?.name||'HACKER').toUpperCase()}!
                </h3>
                <p style={{fontFamily:'Space Grotesk, sans-serif', fontSize:'.95rem', color:'rgba(245,240,255,.65)', marginTop:'8px', lineHeight:1.7}}>
                  Team <strong style={{color:'var(--text)'}}>{team.name}</strong> is registered for the <strong style={{color:'var(--acid)'}}>{team.track}</strong> track. Confirmation sent to all members.
                </p>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', width:'100%', maxWidth:'380px', marginTop:'8px'}}>
                {[{v:'Aug 2', l:'Start Date', c:'#BFFF00'},{v:'48h', l:'Duration', c:'#00F0FF'},{v:'$'+(['5,000','8,000','10,000','6,000','4,000','3,000'][TRACKS_LIST.indexOf(team.track)]||'5,000'), l:'Track Prize', c:'#FF2D78'}].map(({v,l,c}) => (
                  <div key={l} style={{border:`2px solid ${c}55`, padding:'14px 10px', textAlign:'center', background:`${c}0A`}}>
                    <div style={{fontFamily:'Bebas Neue, cursive', fontSize:'1.7rem', color:c, textShadow:`0 0 10px ${c}88`}}>{v}</div>
                    <div style={{fontFamily:'Space Mono, monospace', fontSize:'.55rem', color:'rgba(245,240,255,.4)', letterSpacing:'.12em', textTransform:'uppercase', marginTop:'2px'}}>{l}</div>
                  </div>
                ))}
              </div>
              <button onClick={onClose} style={{
                fontFamily:'Black Ops One, cursive', fontSize:'1rem', letterSpacing:'.1em',
                background:'var(--acid)', color:'#000', border:'2px solid var(--acid)',
                padding:'12px 36px', boxShadow:'4px 4px 0 var(--magenta)',
                transition:'all .15s', marginTop:'8px',
              }}>BACK TO SITE</button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 'done' && (
          <div style={{
            padding:'18px 32px',
            borderTop:'2px solid rgba(191,255,0,.15)',
            display:'flex', alignItems:'center', justifyContent:'space-between',
            background:'rgba(0,0,0,.2)', flexShrink:0,
          }}>
            <span style={{fontFamily:'Space Mono, monospace', fontSize:'.65rem', color:'rgba(245,240,255,.35)', letterSpacing:'.1em'}}>
              STEP {step} / {STEPS.length}
            </span>
            <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
              {step > 1 && (
                <button onClick={back} style={{
                  fontFamily:'Space Mono, monospace', fontSize:'.78rem',
                  padding:'9px 20px', color:'rgba(245,240,255,.7)',
                  background:'rgba(255,255,255,.06)', border:'2px solid rgba(255,255,255,.12)',
                  transition:'all .15s', letterSpacing:'.06em',
                }}>BACK</button>
              )}
              <motion.button onClick={next} whileHover={{scale:1.04}} whileTap={{scale:.96}} style={{
                display:'flex', alignItems:'center', gap:'8px',
                fontFamily:'Black Ops One, cursive', fontSize:'.9rem', letterSpacing:'.1em',
                padding:'10px 24px', background:'var(--acid)', color:'#000',
                border:'2px solid var(--acid)', boxShadow:'3px 3px 0 var(--magenta)',
              }}>
                {step === 3 ? 'SUBMIT' : 'CONTINUE'}
                {step < 3 && <IArrow s={16}/>}
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
    <section id="cta-section" style={{
      background:'var(--bg)', borderTop:'3px solid var(--acid)',
      padding:'clamp(48px,8vw,88px) clamp(16px,5vw,28px)', position:'relative', overflow:'hidden',
    }}>
      <div className="dot-matrix" style={{position:'absolute', inset:0, pointerEvents:'none'}} />
      {/* Large decorative text — clipped so it never causes horizontal scroll */}
      <div className="deco-bg-text" style={{
        position:'absolute', bottom:'-20px', right:0,
        fontFamily:'Bebas Neue, cursive', fontSize:'min(18vw,200px)',
        color:'transparent', WebkitTextStroke:'2px rgba(191,255,0,.06)',
        lineHeight:1, maxWidth:'100%',
      }}>HACK</div>

      <div style={{maxWidth:'1280px', margin:'0 auto', position:'relative', zIndex:1}}>
        <div className="cta-grid" style={{alignItems:'start'}}>
          <div>
            <SectionHeader tag="Register" accent="#BFFF00"
              h2={<>Ready to<br/>compete?</>}
              sub="Open to students, professionals, and independent researchers worldwide. Registration is free — spots are limited." />
            <DiamondDivider color="#BFFF00" />
            <span ref={magRef} style={{display:'inline-block', marginTop:'24px'}}>
              <motion.button onClick={onRegister} whileHover={{scale:1.05}} whileTap={{scale:.96}} id="btn-register" style={{
                display:'inline-flex', alignItems:'center', gap:'10px',
                fontFamily:'Black Ops One, cursive', fontSize:'clamp(1rem,3vw,1.3rem)', letterSpacing:'.08em',
                background:'var(--acid)', color:'#000',
                padding:'14px clamp(20px,4vw,36px)', border:'2px solid var(--acid)',
                boxShadow:'6px 6px 0 var(--magenta)',
                transition:'box-shadow .15s, transform .15s',
              }}>
                REGISTER NOW <IArrow s={20}/>
              </motion.button>
            </span>

            {/* Social proof */}
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginTop:'20px', flexWrap:'wrap'}}>
              <div style={{display:'flex'}}>
                {['#BFFF00','#FF2D78','#00F0FF','#FF6B00','#9B00FF'].map((c,i)=>(
                  <div key={i} style={{
                    width:'30px', height:'30px', borderRadius:'50%',
                    border:'2px solid var(--bg)', display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:'Black Ops One, cursive', fontSize:'.6rem',
                    background:c, color:'#000', marginLeft: i ? '-8px' : 0, flexShrink:0,
                  }}>{'ABCDE'[i]}</div>
                ))}
              </div>
              <p style={{fontFamily:'Space Mono, monospace', fontSize:'.7rem', color:'rgba(245,240,255,.5)'}}>
                <strong style={{color:'var(--text)'}}>347</strong> teams · <strong style={{color:'var(--magenta)'}}>153</strong> spots left
              </p>
            </div>
          </div>

          <div>
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px'}}>
              <div style={{width:'24px', height:'4px', background:'linear-gradient(90deg,var(--cyan),transparent)'}} />
              <NeonTag color="#00F0FF" bg="rgba(0,240,255,.08)">Contact</NeonTag>
            </div>
            <h2 style={{fontFamily:'Black Ops One, cursive', fontSize:'clamp(1.4rem,3.5vw,2rem)', color:'var(--text)', letterSpacing:'.04em', marginBottom:'24px'}}>SEND US A MESSAGE</h2>
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
    <footer style={{
      background:'var(--surface)',
      borderTop:'3px solid var(--magenta)',
      padding:'clamp(20px,4vw,28px) clamp(16px,5vw,28px)',
    }}>
      <div style={{
        maxWidth:'1280px', margin:'0 auto',
        display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:'16px',
      }}>
        <div style={{fontFamily:'Black Ops One, cursive', fontSize:'1.1rem', color:'var(--acid)', letterSpacing:'.06em', textShadow:'0 0 15px rgba(191,255,0,.4)'}}>
          MAINFRAME® <span style={{color:'rgba(245,240,255,.3)', fontFamily:'Space Mono, monospace', fontSize:'.65rem', letterSpacing:'.1em', fontWeight:400}}>× HACKCURITY 2026</span>
        </div>
        <div style={{display:'flex', gap:'20px', flexWrap:'wrap'}}>
          {['Privacy','Terms','Contact'].map(l => (
            <a key={l} href="#" style={{
              fontFamily:'Space Mono, monospace', fontSize:'.7rem', letterSpacing:'.1em',
              textTransform:'uppercase', textDecoration:'none',
              color:'rgba(245,240,255,.4)', transition:'color .15s',
            }}
            onMouseEnter={e => e.target.style.color='var(--acid)'}
            onMouseLeave={e => e.target.style.color='rgba(245,240,255,.4)'}
            >{l}</a>
          ))}
        </div>
        <span style={{fontFamily:'Space Mono, monospace', fontSize:'.65rem', color:'rgba(245,240,255,.25)'}}>© 2026 Mainframe Inc. All rights reserved.</span>
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
    <div style={{
      position:'relative', background:'var(--bg)', color:'var(--text)',
      fontFamily:'Space Grotesk, sans-serif',
      overflowX:'hidden', minHeight:'100vh',
      // Ensure no child with position:absolute can cause horizontal scroll
      contain:'paint',
    }}>
      <Navbar />
      {/* Marquee sits just below the fixed navbar */}
      <div style={{paddingTop:'58px'}}>
        <MarqueeBand />
        <div className="lg:relative" style={{position:'relative'}}>
          <div className="hidden lg:block" style={{position:'absolute', inset:0, overflow:'hidden'}}>
            <BackgroundVideo />
          </div>
          <HeroContent />
        </div>
        <div className="lg:hidden">
          <BackgroundVideo />
        </div>
      </div>
      <StatsBar />
      <TracksSection />
      <MarqueeBand />
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

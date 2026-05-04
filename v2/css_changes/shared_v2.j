/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SHARED.JS — Global Interactions & Animations
 * ═══════════════════════════════════════════════════════════════════════════
 * THEME: Biological / Organic Dark
 *
 * Changes from base:
 *   - Cursor: bioluminescent particle trail (replaces dot + ring)
 *   - Ambient canvas: bioluminescent teal + amber orbs
 *   - Hero canvas: teal/amber particle field
 *   - All colour values updated to biological palette
 *
 * Handles:
 *   1. Footer year auto-fill
 *   2. Bioluminescent cursor trail (15 fading particles)
 *   3. Smart page loader
 *   4. GSAP scroll reveals (.rv, .rv-l, .rv-r, .rv-s)
 *   5. Nav scroll-state
 *   6. Skill bar fill animations
 *   7. Hero entrance timeline
 *   8. Terminal typewriter
 *   9. Stack-page scroll spy
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. FOOTER YEAR ──────────────────────────────────────────────────── */
  document.querySelectorAll('.yr').forEach(el => {
    el.textContent = new Date().getFullYear();
  });


  /* ─── 2. BIOLUMINESCENT CURSOR TRAIL ─────────────────────────────────── */
  /*
   * Replaces the old dot + ring with a cascade of fading particles
   * that trail behind the cursor like bioluminescence in dark water.
   * Requires: <div id="cur"></div> in HTML.
   * Trail dots are created here and styled via .bio-trail-dot in shared.css.
   */
  const cur = document.getElementById('cur');

  if (cur) {
    const TRAIL_LENGTH = 16;
    const trail = [];

    // Build trail particle divs
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const dot = document.createElement('div');
      dot.className = 'bio-trail-dot';
      // Size decreases toward the tail
      const size = Math.max(2, 8 - i * 0.35);
      dot.style.cssText = `width:${size}px;height:${size}px;`;
      document.body.appendChild(dot);
      trail.push({ el: dot, x: -100, y: -100 });
    }

    let mx = -100, my = -100;

    // Main dot follows mouse instantly
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + 'px';
      cur.style.top  = my + 'px';
    });

    // Trail cascades with decreasing speed — earlier particles are faster
    const animTrail = () => {
      let px = mx, py = my;
      trail.forEach((dot, i) => {
        // Speed decreases as we go toward the tail
        const speed = 0.28 - i * 0.012;
        dot.x += (px - dot.x) * Math.max(speed, 0.04);
        dot.y += (py - dot.y) * Math.max(speed, 0.04);

        dot.el.style.left    = dot.x + 'px';
        dot.el.style.top     = dot.y + 'px';

        // Opacity and glow fade toward the tail
        const alpha = (1 - i / TRAIL_LENGTH) * 0.75;
        dot.el.style.opacity = alpha;

        // Teal → amber gradient through the trail (first few teal, then amber)
        const t = i / TRAIL_LENGTH;
        if (t < 0.5) {
          // Teal core
          dot.el.style.background = `rgba(0,255,204,${alpha})`;
          dot.el.style.boxShadow  = `0 0 ${6 - i * 0.2}px rgba(0,255,204,0.6)`;
        } else {
          // Amber tail — like bioluminescent wake dissipating
          dot.el.style.background = `rgba(255,170,68,${alpha * 0.6})`;
          dot.el.style.boxShadow  = `0 0 ${4 - (i - 8) * 0.15}px rgba(255,170,68,0.4)`;
        }

        // Cascade: each dot leads the next
        px = dot.x; py = dot.y;
      });
      requestAnimationFrame(animTrail);
    };
    animTrail();

    // Enlarge main dot on interactive elements
    const onEnter = () => document.body.classList.add('hov');
    const onLeave = () => document.body.classList.remove('hov');
    const interactiveSelector = [
      'a', 'button',
      '.proj-card', '.stack-card', '.cross-link-card',
      '.btn-primary', '.btn-ghost', '.btn-outline',
      '.data-panel', '.platform-row', '.arch-node',
      '.stat', '.module'
    ].join(', ');

    document.querySelectorAll(interactiveSelector).forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });
  }


  /* ─── 3. GSAP SETUP ───────────────────────────────────────────────────── */
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const initAnimations = () => {

    /* 3a. Nav transparency transition */
    const transparentNav = document.querySelector('.main-nav.transparent');
    if (transparentNav) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 80) transparentNav.classList.add('scrolled');
        else transparentNav.classList.remove('scrolled');
      }, { passive: true });
    }


    /* 3b. Scroll reveals — .rv (fade up) */
    gsap.utils.toArray('.rv').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 35 },
        {
          opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        }
      );
    });

    /* 3c. Scroll reveals — .rv-l (slide from left) */
    gsap.utils.toArray('.rv-l').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: -35 },
        {
          opacity: 1, x: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        }
      );
    });

    /* 3d. Scroll reveals — .rv-r (slide from right) */
    gsap.utils.toArray('.rv-r').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: 35 },
        {
          opacity: 1, x: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        }
      );
    });

    /* 3e. Scroll reveals — .rv-s (scale up) */
    gsap.utils.toArray('.rv-s').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, scale: 0.94 },
        {
          opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        }
      );
    });


    /* 3f. Data panel — materialise from the deep (blur-in with glow) */
    gsap.utils.toArray('.data-panel').forEach(panel => {
      gsap.fromTo(panel,
        { opacity: 0, scale: 0.96, filter: 'blur(6px)' },
        {
          opacity: 1, scale: 1, filter: 'blur(0px)',
          duration: 1.1, ease: 'power2.out',
          scrollTrigger: { trigger: panel, start: 'top 87%', once: true }
        }
      );
    });


    /* 3g. Skill bar fill animation */
    document.querySelectorAll('.skill-fill').forEach(bar => {
      ScrollTrigger.create({
        trigger: bar, start: 'top 88%', once: true,
        onEnter: () => { bar.style.width = (bar.dataset.w || '0') + '%'; }
      });
    });


    /* 3h. Hero entrance timeline */
    if (document.querySelector('.h-name')) {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.to('.h-name .word', { y: 0, duration: 1.6, ease: 'power4.out', stagger: 0.14 })
        .to('.h-eyebrow', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=1')
        .to('.h-role',    { opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.6')
        .to('.h-tagline', { opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.5')
        .to('.h-cta-row', { opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.5')
        .to('.h-coord',   { opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.4')
        .to('#scroll-cue',{ opacity: 1, duration: 0.9 }, '-=0.3');

      gsap.from('.photo-frame', { scale: 0.88, opacity: 0, duration: 1.8, delay: 0.5, ease: 'power4.out' });
      gsap.from('.annot',       { opacity: 0, duration: 1, stagger: 0.25, delay: 1.4, ease: 'power3.out' });
      gsap.from('.status-pill', { opacity: 0, y: 10, duration: 0.8, stagger: 0.18, delay: 1.7, ease: 'power3.out' });
    }


    /* 3i. Terminal typewriter effect */
    const termSection = document.getElementById('contact');
    if (termSection && document.getElementById('term-text')) {
      ScrollTrigger.create({
        trigger: termSection, start: 'top 75%', once: true,
        onEnter: () => {
          const msg = 'whoami --full-profile';
          const el  = document.getElementById('term-text');
          let i = 0;
          const iv = setInterval(() => {
            el.textContent += msg[i++];
            if (i >= msg.length) {
              clearInterval(iv);
              const termCursor = document.getElementById('term-cursor');
              if (termCursor) termCursor.style.display = 'none';
              setTimeout(() => {
                const termOutput = document.getElementById('term-output');
                if (termOutput) termOutput.style.display = 'block';
              }, 400);
            }
          }, 60);
        }
      });
    }


    /* 3j. Stack-page scroll spy */
    const modules  = document.querySelectorAll('.module');
    const idxLinks = document.querySelectorAll('.index-list a');
    if (modules.length && idxLinks.length) {
      window.addEventListener('scroll', () => {
        let current = '';
        modules.forEach(sec => {
          if (window.pageYOffset >= sec.offsetTop - 380) {
            current = sec.getAttribute('id');
          }
        });
        idxLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
      }, { passive: true });
    }


    /* 3k. Progress bar fills */
    document.querySelectorAll('.fill-anim').forEach(bar => {
      ScrollTrigger.create({
        trigger: bar, start: 'top 90%', once: true,
        onEnter: () => { bar.style.width = (bar.dataset.w || '0') + '%'; }
      });
    });

    // Wire all new init functions
    if (typeof initAll === 'function') initAll();

  }; // end initAnimations


  /* ─── 4. SMART LOADER ─────────────────────────────────────────────────── */
  const loader = document.getElementById('loader');

  if (loader) {
    const isFirst = !sessionStorage.getItem('ia_loaded');
    const ldFill  = document.getElementById('ld-fill-el');
    const ldPct   = document.getElementById('ld-pct-el');

    if (isFirst) {
      let pct = 0;
      const iv = setInterval(() => {
        pct = Math.min(100, pct + Math.random() * 18 + 4);
        if (ldPct)  ldPct.textContent  = `Initialising organism... ${Math.floor(pct)}%`;
        if (ldFill) ldFill.style.width = pct + '%';

        if (pct >= 100) {
          clearInterval(iv);
          sessionStorage.setItem('ia_loaded', '1');
          setTimeout(() => {
            gsap.to(loader, {
              opacity: 0, duration: 0.9, ease: 'power2.inOut',
              onComplete: () => { loader.style.display = 'none'; initAnimations(); }
            });
          }, 280);
        }
      }, 60);

    } else {
      gsap.to(loader, {
        opacity: 0, duration: 0.22,
        onComplete: () => { loader.style.display = 'none'; initAnimations(); }
      });
    }

  } else {
    initAnimations();
  }

}); // end DOMContentLoaded


/* ═══════════════════════════════════════════════════════════════════════════
   NEW INIT FUNCTIONS — v2 Upgrade (Biological Dark Edition)
   ═══════════════════════════════════════════════════════════════════════════ */


/* ─── LENIS SMOOTH SCROLL ─────────────────────────────────────────────────── */
function initLenis() {
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({ lerp: 0.06, smoothWheel: true }); // slightly slower — organic feel
  window._lenis = lenis;

  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  document.documentElement.style.scrollBehavior = 'auto';
}


/* ─── MAGNETIC BUTTON EFFECT ──────────────────────────────────────────────── */
function initMagneticButtons() {
  const STRENGTH = 0.38;
  const RANGE    = 90;

  document.querySelectorAll('.mag-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < RANGE) {
        btn.style.transform = `translate(${dx * STRENGTH}px, ${dy * STRENGTH}px)`;
      }
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}


/* ─── VANILLA TILT 3D ────────────────────────────────────────────────────── */
function initVanillaTilt() {
  if (typeof VanillaTilt === 'undefined') return;

  const projCards = document.querySelectorAll('.proj-card:not([data-tilt-disabled])');
  if (projCards.length) {
    VanillaTilt.init(projCards, {
      max:        6,
      speed:      500,
      glare:      true,
      'max-glare': 0.08, // subtle — bioluminescent sheen not harsh glare
      perspective: 900,
      scale:       1.01,
    });
  }

  const tiltCards = document.querySelectorAll('.tilt-card:not([data-tilt-disabled])');
  if (tiltCards.length) {
    VanillaTilt.init(tiltCards, {
      max:        5,
      speed:      500,
      glare:      false,
      perspective: 1000,
    });
  }
}


/* ─── PROJECT CARD SPOTLIGHT ──────────────────────────────────────────────── */
function initProjectSpotlight() {
  document.querySelectorAll('.proj-card').forEach(card => {
    const spot = card.querySelector('.pc-spotlight');
    if (!spot) return;

    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%';
      const my = ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%';
      spot.style.setProperty('--mx', mx);
      spot.style.setProperty('--my', my);
    });
  });
}


/* ─── ANIMATED COUNT-UP ────────────────────────────────────────────────────── */
function initCountUp() {
  const easeOut = t => 1 - Math.pow(1 - t, 4);

  const animate = (el, target, suffix) => {
    const start    = performance.now();
    const duration = 1400;
    const step = ts => {
      const t       = Math.min((ts - start) / duration, 1);
      const current = Math.round(easeOut(t) * target);
      el.textContent = current + suffix;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const raw    = el.dataset.count;
      const num    = parseFloat(raw);
      if (isNaN(num)) return;
      const suffix = el.dataset.countSuffix || '';
      animate(el, num, suffix);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
}


/* ─── SECTION INDICATOR DOTS ──────────────────────────────────────────────── */
function initSectionDots() {
  const container = document.getElementById('section-dots');
  if (!container) return;

  const sections = Array.from(
    document.querySelectorAll('section[id], main[id]')
  );
  if (!sections.length) return;

  sections.forEach(sec => {
    const btn = document.createElement('button');
    btn.className = 'sec-dot';
    btn.setAttribute('aria-label', sec.id);
    btn.title = sec.id.replace(/-/g, ' ');

    btn.addEventListener('click', () => {
      if (window._lenis) {
        window._lenis.scrollTo(sec, { offset: -80, duration: 1.4 });
      } else {
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    container.appendChild(btn);
  });

  const dots = container.querySelectorAll('.sec-dot');

  const updateDots = () => {
    let active = 0;
    sections.forEach((sec, i) => {
      if (window.scrollY >= sec.offsetTop - window.innerHeight * 0.45) {
        active = i;
      }
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === active));
  };

  window.addEventListener('scroll', updateDots, { passive: true });
  updateDots();
}


/* ─── NAV SCROLL-SPY GLOW ─────────────────────────────────────────────────── */
function initNavSpy() {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!navLinks.length) return;

  const sections = Array.from(navLinks).map(a => {
    const id = a.getAttribute('href').replace('#', '');
    return document.getElementById(id);
  }).filter(Boolean);

  const updateNav = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - window.innerHeight * 0.45) {
        current = sec.id;
      }
    });
    navLinks.forEach(a => {
      const matches = a.getAttribute('href') === '#' + current;
      a.dataset.active = matches ? 'true' : 'false';
    });
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}


/* ─── AMBIENT CANVAS ORBS (Bioluminescent) ───────────────────────────────────
   Deep-sea ambient light: softly drifting bioluminescent glows.
   Colour palette updated from copper/navy to teal/amber biological signals.
─────────────────────────────────────────────────────────────────────────── */
function initAmbientCanvas(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Bioluminescent orb definitions
  // Teal (--accent #00ffcc) dominant, amber (--accent-2 #ffaa44) secondary
  const orbs = [
    { x: 0.2, y: 0.3, r: 0.30, dx: 0.00025, dy: 0.00018, t: 0,   color: 'rgba(0,255,204,0.07)'  },
    { x: 0.7, y: 0.6, r: 0.34, dx:-0.00020, dy: 0.00022, t: 1.5, color: 'rgba(0,200,255,0.06)'  },
    { x: 0.5, y: 0.8, r: 0.22, dx: 0.00030, dy:-0.00025, t: 3.0, color: 'rgba(255,170,68,0.05)' },
    { x: 0.8, y: 0.2, r: 0.20, dx:-0.00018, dy:-0.00020, t: 2.0, color: 'rgba(0,255,204,0.05)'  },
    { x: 0.1, y: 0.7, r: 0.18, dx: 0.00022, dy: 0.00015, t: 4.0, color: 'rgba(255,170,68,0.04)' },
    { x: 0.55, y: 0.35, r: 0.16, dx: 0.00015, dy: 0.00028, t: 2.5, color: 'rgba(0,255,204,0.04)' },
  ];

  let W, H, raf;

  const resize = () => {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;
  };

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    orbs.forEach(o => {
      o.t += 0.003; // slightly slower — organic drift
      const px = (o.x + Math.sin(o.t * 1.3) * 0.10) * W;
      const py = (o.y + Math.cos(o.t * 0.9) * 0.08) * H;
      const rr = o.r * Math.min(W, H);

      const g = ctx.createRadialGradient(px, py, 0, px, py, rr);
      g.addColorStop(0, o.color);
      g.addColorStop(0.5, o.color.replace(/[\d.]+\)$/, m => (parseFloat(m) * 0.3) + ')'));
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, rr, 0, Math.PI * 2);
      ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });
  raf = requestAnimationFrame(draw);

  const mo = new MutationObserver(() => {
    if (!document.contains(canvas)) {
      cancelAnimationFrame(raf);
      mo.disconnect();
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });
}


/* ─── HERO CANVAS (Three.js bioluminescent particle field) ───────────────────
   Replaces copper/navy particles with bioluminescent teal/amber.
   Deep-sea creature light patterns on a black void.
─────────────────────────────────────────────────────────────────────────── */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const parent   = canvas.parentElement;
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

  camera.position.z = 5;

  // ── Bioluminescent particle field ────────────────────────────────────────
  const PARTICLE_COUNT = 840;  // slightly more — denser field of organisms
  const SPREAD         = 4.5;

  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors    = new Float32Array(PARTICLE_COUNT * 3);

  // Teal #00ffcc → R:0, G:1, B:0.8
  // Amber #ffaa44 → R:1, G:0.667, B:0.267
  // Deep water blue #00c8ff → R:0, G:0.784, B:1
  const tealR  = 0/255,   tealG  = 255/255, tealB  = 204/255;
  const amberR = 255/255, amberG = 170/255, amberB = 68/255;
  const blueR  = 0/255,   blueG  = 200/255, blueB  = 255/255;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Fibonacci sphere for organic, even distribution
    const phi   = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const r     = SPREAD * (0.5 + Math.random() * 0.5);

    positions[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i*3+2] = r * Math.cos(phi);

    // Three-way colour mix based on position:
    // Top → teal (bioluminescent signal)
    // Middle → deep blue (deep water)
    // Bottom → amber (warmth through organic tissue)
    const t = (positions[i*3+1] / SPREAD + 1) / 2; // 0 bottom → 1 top
    const noise = Math.random() * 0.15; // organic variation

    if (t > 0.6) {
      // Upper — teal
      const blend = (t - 0.6) / 0.4;
      colors[i*3]   = tealR * blend + blueR * (1-blend);
      colors[i*3+1] = tealG * blend + blueG * (1-blend);
      colors[i*3+2] = tealB * blend + blueB * (1-blend);
    } else {
      // Lower — amber to blue
      const blend = t / 0.6;
      colors[i*3]   = blueR * blend + amberR * (1-blend) + noise * 0.1;
      colors[i*3+1] = blueG * blend + amberG * (1-blend);
      colors[i*3+2] = blueB * blend + amberB * (1-blend);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors,    3));

  const mat = new THREE.PointsMaterial({
    size:            0.04,
    vertexColors:    true,
    transparent:     true,
    opacity:         0.85,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // ── Mouse parallax ────────────────────────────────────────────────────────
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 0.6;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.6;
  });

  // ── Resize ────────────────────────────────────────────────────────────────
  const resize = () => {
    const W = parent.offsetWidth;
    const H = parent.offsetHeight;
    renderer.setSize(W, H, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  };

  window.addEventListener('resize', resize, { passive: true });
  resize();

  // ── Animation loop ────────────────────────────────────────────────────────
  let t = 0;
  const animate = () => {
    requestAnimationFrame(animate);
    t += 0.0008;

    // Organic slow rotation — like a creature drifting
    points.rotation.y += 0.0010;
    points.rotation.x += 0.0003;
    // Subtle breathe — field expands and contracts
    const breathe = 1 + Math.sin(t) * 0.015;
    points.scale.set(breathe, breathe, breathe);

    currentX += (targetX - currentX) * 0.035;
    currentY += (targetY - currentY) * 0.035;
    camera.position.x = currentX;
    camera.position.y = -currentY;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  };

  animate();
}


/* ─── PARALLAX DEPTH LAYERS ──────────────────────────────────────────────── */
function initParallaxLayers() {
  const els = document.querySelectorAll('[data-depth]');
  if (!els.length) return;

  const update = () => {
    const sy = window.scrollY;
    els.forEach(el => {
      const depth = parseFloat(el.dataset.depth) || 0;
      el.style.transform = `translateY(${sy * depth * -1}px)`;
    });
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}


/* ─── EDUCATION TIMELINE DRAW ─────────────────────────────────────────────── */
function initEducationTimeline() {
  const section  = document.getElementById('education');
  const lineFill = document.querySelector('.edu-line-fill');
  const items    = document.querySelectorAll('.edu-item');
  if (!section || !lineFill || !items.length) return;

  const update = () => {
    const rect   = section.getBoundingClientRect();
    const totalH = section.offsetHeight;
    const scroll = -rect.top;
    const pct    = Math.max(0, Math.min(scroll / (totalH * 0.9), 1));
    lineFill.style.height = (pct * 100) + '%';

    items.forEach(item => {
      const ir = item.getBoundingClientRect();
      if (ir.top < window.innerHeight * 0.75) {
        item.classList.add('in-view');
      }
    });
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}


/* ─── HEX SKILL BACK FACE FILL ───────────────────────────────────────────── */
function initHexSkills() {
  if (typeof ScrollTrigger === 'undefined') return;

  document.querySelectorAll('.hex-level-fill').forEach(bar => {
    ScrollTrigger.create({
      trigger: bar,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        bar.style.width = (bar.dataset.w || '0') + '%';
      }
    });
  });
}


/* ─── WIRE ALL NEW INITS ──────────────────────────────────────────────────── */
function initAll() {
  initLenis();
  initMagneticButtons();
  initVanillaTilt();
  initProjectSpotlight();
  initCountUp();
  initSectionDots();
  initNavSpy();
  initParallaxLayers();
  initEducationTimeline();
  initHexSkills();

  document.querySelectorAll('.ambient-canvas').forEach(c => initAmbientCanvas(c));

  initHeroCanvas();
}
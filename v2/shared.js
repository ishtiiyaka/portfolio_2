/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SHARED.JS — Global Interactions & Animations
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Handles:
 *   1. Footer year auto-fill
 *   2. Custom cursor (dot + trailing ring)
 *   3. Smart page loader (full anim on first visit, fast fade after)
 *   4. GSAP scroll reveals (.rv, .rv-l, .rv-r, .rv-s)
 *   5. Nav scroll-state (transparent → solid)
 *   6. Skill bar fill animations
 *   7. Hero entrance timeline (index/main page)
 *   8. Terminal typewriter (contact section)
 *   9. Stack-page scroll spy (index-list highlight)
 *
 * Include this file at the bottom of every page that has
 * <link rel="stylesheet" href="shared.css"> in the head.
 * GSAP + ScrollTrigger must be loaded before this file.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. FOOTER YEAR ──────────────────────────────────────────────────── */
  document.querySelectorAll('.yr').forEach(el => {
    el.textContent = new Date().getFullYear();
  });


  /* ─── 2. CUSTOM CURSOR ────────────────────────────────────────────────── */
  const cur     = document.getElementById('cur');
  const curRing = document.getElementById('cur-ring');

  if (cur && curRing) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    // Dot follows mouse instantly
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + 'px';
      cur.style.top  = my + 'px';
    });

    // Ring trails with smooth easing
    const animRing = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      curRing.style.left = rx + 'px';
      curRing.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    };
    animRing();

    // Enlarge cursor on interactive elements
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
  if (typeof gsap === 'undefined') return; // guard: GSAP not loaded
  gsap.registerPlugin(ScrollTrigger);

  const initAnimations = () => {

    /* 3a. Nav transparency transition (only for .main-nav.transparent) */
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
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        }
      );
    });

    /* 3c. Scroll reveals — .rv-l (slide from left) */
    gsap.utils.toArray('.rv-l').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: -35 },
        {
          opacity: 1, x: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        }
      );
    });

    /* 3d. Scroll reveals — .rv-r (slide from right) */
    gsap.utils.toArray('.rv-r').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: 35 },
        {
          opacity: 1, x: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        }
      );
    });

    /* 3e. Scroll reveals — .rv-s (scale up) */
    gsap.utils.toArray('.rv-s').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, scale: 0.94 },
        {
          opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        }
      );
    });


    /* 3f. Data panel blur-in (stack + project pages) */
    gsap.utils.toArray('.data-panel').forEach(panel => {
      gsap.fromTo(panel,
        { opacity: 0, scale: 0.96, filter: 'blur(4px)' },
        {
          opacity: 1, scale: 1, filter: 'blur(0px)',
          duration: 0.9, ease: 'power2.out',
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


    /* 3h. Hero entrance timeline (index / main page only) */
    if (document.querySelector('.h-name')) {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.to('.h-name .word', { y: 0, duration: 1.4, ease: 'power4.out', stagger: 0.12 })
        .to('.h-eyebrow', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.9')
        .to('.h-role',    { opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.5')
        .to('.h-tagline', { opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.4')
        .to('.h-cta-row', { opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.4')
        .to('.h-coord',   { opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.3')
        .to('#scroll-cue',{ opacity: 1, duration: 0.7 }, '-=0.2');

      gsap.from('.photo-frame', { scale: 0.9, opacity: 0, duration: 1.6, delay: 0.5, ease: 'power4.out' });
      gsap.from('.annot',       { opacity: 0, duration: 0.8, stagger: 0.2, delay: 1.2, ease: 'power3.out' });
      gsap.from('.status-pill', { opacity: 0, y: 10, duration: 0.6, stagger: 0.15, delay: 1.5, ease: 'power3.out' });
    }


    /* 3i. Terminal typewriter effect (contact section) */
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


    /* 3j. Stack-page scroll spy — highlights the index-list link
          for the currently visible .module section               */
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


    /* 3k. RTOS / progress bar fills (project-bcm style) */
    document.querySelectorAll('.fill-anim').forEach(bar => {
      ScrollTrigger.create({
        trigger: bar, start: 'top 90%', once: true,
        onEnter: () => { bar.style.width = (bar.dataset.w || '0') + '%'; }
      });
    });

    // ── NEW v2 UPGRADE FUNCTIONS ──────────────────────────────────────────
    // All wired through initAll() defined below the DOMContentLoaded block.
    // To disable any single feature, see the comment at the top of its function.
    if (typeof initAll === 'function') initAll();

  }; // end initAnimations


  /* ─── 4. SMART LOADER ─────────────────────────────────────────────────── */
  /*
   * First visit  → full progress-bar loader animation (~1.2s)
   * Return visit → instant fade (sessionStorage flag)
   */
  const loader = document.getElementById('loader');

  if (loader) {
    const isFirst = !sessionStorage.getItem('ia_loaded');
    const ldFill  = document.getElementById('ld-fill-el');
    const ldPct   = document.getElementById('ld-pct-el');

    if (isFirst) {
      let pct = 0;
      const iv = setInterval(() => {
        pct = Math.min(100, pct + Math.random() * 18 + 4);
        if (ldPct)  ldPct.textContent  = `Loading system... ${Math.floor(pct)}%`;
        if (ldFill) ldFill.style.width = pct + '%';

        if (pct >= 100) {
          clearInterval(iv);
          sessionStorage.setItem('ia_loaded', '1');
          setTimeout(() => {
            gsap.to(loader, {
              opacity: 0, duration: 0.7, ease: 'power2.inOut',
              onComplete: () => { loader.style.display = 'none'; initAnimations(); }
            });
          }, 280);
        }
      }, 60);

    } else {
      // Fast exit on subsequent navigations
      gsap.to(loader, {
        opacity: 0, duration: 0.22,
        onComplete: () => { loader.style.display = 'none'; initAnimations(); }
      });
    }

  } else {
    // No loader on this page — run animations immediately
    initAnimations();
  }

}); // end DOMContentLoaded


/* ═══════════════════════════════════════════════════════════════════════════
   NEW INIT FUNCTIONS — v2 Upgrade
   All called inside initAnimations() above (already wired in via initAll())
   Each function is self-contained and safely no-ops if its dependency
   (DOM element or CDN library) is not present on the current page.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── LENIS SMOOTH SCROLL ────────────────────────────────────────────────────
   Requires: Lenis CDN script loaded before shared.js
   To disable: remove the Lenis CDN <script> tag
   Pages: main.html, about.html, education.html
─────────────────────────────────────────────────────────────────────────── */
function initLenis() {
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
  window._lenis = lenis; // expose so section-dots can call lenis.scrollTo()

  // Hook into GSAP ticker for perfect sync with ScrollTrigger
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  // Remove native smooth scroll to avoid double-smooth conflict
  document.documentElement.style.scrollBehavior = 'auto';
}


/* ─── MAGNETIC BUTTON EFFECT ─────────────────────────────────────────────────
   Selector: .mag-btn  — add this class to any CTA you want magnetic
   Strength: 0.38 (increase = stronger pull)
   Range:    90px (how close cursor must be before magnet activates)
   To disable for one button: remove class mag-btn
   To disable entirely: delete this function call from initAnimations()
─────────────────────────────────────────────────────────────────────────── */
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
        const tx = dx * STRENGTH;
        const ty = dy * STRENGTH;
        btn.style.transform = `translate(${tx}px, ${ty}px)`;
      }
    });

    btn.addEventListener('mouseleave', () => {
      // Spring back to origin
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}


/* ─── VANILLA TILT 3D ────────────────────────────────────────────────────────
   Applied to: .proj-card  and  .tilt-card (add this class to any element)
   Requires: VanillaTilt CDN script loaded before shared.js
   To add tilt to a new element: add class tilt-card
   To disable tilt on one element: add data-tilt-disabled attribute
   To disable entirely: remove VanillaTilt CDN script
─────────────────────────────────────────────────────────────────────────── */
function initVanillaTilt() {
  if (typeof VanillaTilt === 'undefined') return;

  // Project cards — subtle tilt with soft glare
  const projCards = document.querySelectorAll('.proj-card:not([data-tilt-disabled])');
  if (projCards.length) {
    VanillaTilt.init(projCards, {
      max:        7,
      speed:      400,
      glare:      true,
      'max-glare': 0.10,
      perspective: 900,
      scale:       1.01,
    });
  }

  // Any generic .tilt-card (e.g., terminal block in contact)
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


/* ─── PROJECT CARD SPOTLIGHT ─────────────────────────────────────────────────
   Creates a radial-gradient spotlight that follows cursor inside each card.
   Requires: .pc-spotlight div inside each .proj-card (added in main.html)
   To disable: remove <div class="pc-spotlight"> from each proj-card
─────────────────────────────────────────────────────────────────────────── */
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


/* ─── ANIMATED COUNT-UP ──────────────────────────────────────────────────────
   Trigger: IntersectionObserver on elements with [data-count] attribute
   Duration: 1400ms with easeOutExpo curve
   Non-numeric values (∞, UET, etc.) are skipped automatically
   To add count-up to an element: add data-count="NUMBER" attribute
─────────────────────────────────────────────────────────────────────────── */
function initCountUp() {
  const easeOut = t => 1 - Math.pow(1 - t, 4); // easeOutQuart

  const animate = (el, target, suffix) => {
    const start    = performance.now();
    const duration = 1400;
    const step = ts => {
      const t       = Math.min((ts - start) / duration, 1);
      const current = Math.round(easeOut(t) * target);
      el.textContent = current + suffix;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix; // ensure exact final value
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const raw    = el.dataset.count;
      const num    = parseFloat(raw);
      if (isNaN(num)) return; // skip ∞, UET, etc.

      // Detect and preserve suffix (e.g. "+")
      const suffix = el.dataset.countSuffix || '';
      animate(el, num, suffix);
      observer.unobserve(el); // only run once
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
}


/* ─── SECTION INDICATOR DOTS ─────────────────────────────────────────────────
   Reads all <section id="..."> on the page and builds a fixed right-side
   dot navigation. Active dot updates on scroll.
   Requires: <div id="section-dots"></div> in HTML
   To disable entirely: remove that div from the page HTML
   A section is automatically included if it has an id="" attribute.
─────────────────────────────────────────────────────────────────────────── */
function initSectionDots() {
  const container = document.getElementById('section-dots');
  if (!container) return;

  // Collect all sections with IDs (excluding loader/nav/footer)
  const sections = Array.from(
    document.querySelectorAll('section[id], main[id]')
  );
  if (!sections.length) return;

  // Build dots
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
  updateDots(); // set initial state
}


/* ─── NAV SCROLL-SPY GLOW ────────────────────────────────────────────────────
   Highlights nav links whose target section is in view.
   Works on main.html anchor links (#section-id) and active class links.
   To disable: remove data-active logic (CSS underline still works via .active)
─────────────────────────────────────────────────────────────────────────── */
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


/* ─── AMBIENT CANVAS ORBS ────────────────────────────────────────────────────
   Draws softly drifting gradient orbs on a <canvas class="ambient-canvas">
   placed inside a section.
   Call: initAmbientCanvas(canvasElement)
   To disable for a section: remove <canvas class="ambient-canvas"> from it
─────────────────────────────────────────────────────────────────────────── */
function initAmbientCanvas(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // ── Orb definitions ──────────────────────────────────────────────────────
  // Add/remove objects here to change the orb count and colours.
  // radius: size, speedX/Y: drift speed, color: rgba string
  const orbs = [
    { x: 0.2, y: 0.3, r: 0.28, dx: 0.00025, dy: 0.00018, t: 0,   color: 'rgba(181,101,29,0.09)'  },
    { x: 0.7, y: 0.6, r: 0.32, dx:-0.00020, dy: 0.00022, t: 1.5, color: 'rgba(26,58,110,0.12)'   },
    { x: 0.5, y: 0.8, r: 0.22, dx: 0.00030, dy:-0.00025, t: 3.0, color: 'rgba(212,132,58,0.07)'  },
    { x: 0.8, y: 0.2, r: 0.20, dx:-0.00018, dy:-0.00020, t: 2.0, color: 'rgba(26,58,110,0.08)'   },
    { x: 0.1, y: 0.7, r: 0.18, dx: 0.00022, dy: 0.00015, t: 4.0, color: 'rgba(181,101,29,0.06)'  },
  ];

  let W, H, raf;

  const resize = () => {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;
  };

  const draw = (ts) => {
    ctx.clearRect(0, 0, W, H);
    orbs.forEach(o => {
      // Parametric drift using sin/cos for organic movement
      o.t += 0.004;
      const px = (o.x + Math.sin(o.t * 1.3) * 0.12) * W;
      const py = (o.y + Math.cos(o.t * 0.9) * 0.10) * H;
      const rr = o.r * Math.min(W, H);

      const g = ctx.createRadialGradient(px, py, 0, px, py, rr);
      g.addColorStop(0, o.color);
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

  // Cleanup if canvas is ever removed
  const mo = new MutationObserver(() => {
    if (!document.contains(canvas)) {
      cancelAnimationFrame(raf);
      mo.disconnect();
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });
}


/* ─── HERO CANVAS (Three.js particle field) ──────────────────────────────────
   Creates a geometric particle field inside .hero-right
   Requires: Three.js CDN loaded before shared.js
   Requires: <canvas id="hero-canvas"> inside .hero-right
   To disable: remove that canvas element from hero-right HTML
   Particles: ~700 copper/white dots forming slow-rotating icosahedron lattice
─────────────────────────────────────────────────────────────────────────── */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const parent  = canvas.parentElement;
  const scene   = new THREE.Scene();
  const camera  = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

  camera.position.z = 5;

  // ── Particles ─────────────────────────────────────────────────────────────
  // Count/spread can be changed here without touching any other code
  const PARTICLE_COUNT = 720;
  const SPREAD         = 4.5;

  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors    = new Float32Array(PARTICLE_COUNT * 3);

  const copperR = 181/255, copperG = 101/255, copperB = 29/255;
  const blueR   =  26/255, blueG   =  58/255, blueB   = 110/255;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Fibonacci sphere distribution for even coverage
    const phi   = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const r     = SPREAD * (0.6 + Math.random() * 0.4);

    positions[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i*3+2] = r * Math.cos(phi);

    // Mix copper and blue based on y position
    const t = (positions[i*3+1] / SPREAD + 1) / 2;
    colors[i*3]   = copperR * t + blueR * (1-t);
    colors[i*3+1] = copperG * t + blueG * (1-t);
    colors[i*3+2] = copperB * t + blueB * (1-t);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors,    3));

  const mat = new THREE.PointsMaterial({
    size:         0.045,
    vertexColors: true,
    transparent:  true,
    opacity:      0.75,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // ── Mouse parallax ────────────────────────────────────────────────────────
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 0.8;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.8;
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
  const animate = () => {
    requestAnimationFrame(animate);

    // Slow auto-rotation
    points.rotation.y += 0.0012;
    points.rotation.x += 0.0004;

    // Mouse parallax (lerp)
    currentX += (targetX - currentX) * 0.04;
    currentY += (targetY - currentY) * 0.04;
    camera.position.x = currentX;
    camera.position.y = -currentY;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  };

  animate();
}


/* ─── PARALLAX DEPTH LAYERS ──────────────────────────────────────────────────
   Elements with data-depth="0.2" shift at 20% of scroll speed (parallax)
   Used on hero section items for depth illusion.
   To add parallax to any element: add data-depth="0.0 to 1.0"
   To disable: remove data-depth attributes
─────────────────────────────────────────────────────────────────────────── */
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


/* ─── EDUCATION TIMELINE DRAW ────────────────────────────────────────────────
   Animates the vertical centre-line fill and activates dots on scroll.
   Requires: .edu-line-fill div and .edu-item elements in #education section
─────────────────────────────────────────────────────────────────────────── */
function initEducationTimeline() {
  const section  = document.getElementById('education');
  const lineFill = document.querySelector('.edu-line-fill');
  const items    = document.querySelectorAll('.edu-item');
  if (!section || !lineFill || !items.length) return;

  const update = () => {
    const rect   = section.getBoundingClientRect();
    const totalH = section.offsetHeight;
    const scroll = -rect.top; // how far scrolled into the section
    const pct    = Math.max(0, Math.min(scroll / (totalH * 0.9), 1));
    lineFill.style.height = (pct * 100) + '%';

    // Activate dots as their card enters viewport
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


/* ─── HEX SKILL BACK FACE FILL ───────────────────────────────────────────────
   Triggers the level bar fill on .hex-cell back face when entering viewport
─────────────────────────────────────────────────────────────────────────── */
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


/* ─── WIRE ALL NEW INITS ─────────────────────────────────────────────────────
   Call all new functions after GSAP is ready.
   This function is called at the END of initAnimations() inside the
   DOMContentLoaded block above (patched in by adding initAll() call).
─────────────────────────────────────────────────────────────────────────── */
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

  // Ambient orbs — init each canvas found on this page
  document.querySelectorAll('.ambient-canvas').forEach(c => initAmbientCanvas(c));

  // Hero Three.js canvas (main page only)
  initHeroCanvas();
}

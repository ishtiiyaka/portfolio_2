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

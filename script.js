/* global gsap, ScrollTrigger */

const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
const isMobile = window.innerWidth <= 768; // Helper for responsive logic

function qs(sel, root = document) {
  return root.querySelector(sel);
}

function qsa(sel, root = document) {
  return [...root.querySelectorAll(sel)];
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function initIntro() {
  const intro = qs("#intro");
  const btn = qs("#openInvitationBtn");
  const site = qs("#site");

  document.body.classList.add("locked");

  const showSite = () => {
    site.style.visibility = "visible";
    site.style.opacity = "1";
    site.removeAttribute("aria-hidden");
  };

  const hideIntro = () => {
    intro.style.display = "none";
    intro.setAttribute("aria-hidden", "true");
  };

  btn?.addEventListener("click", () => {
    if (prefersReducedMotion) {
      showSite();
      intro.style.opacity = "0";
      hideIntro();
      document.body.classList.remove("locked");
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      initStoryAnimations();
      initGallery();
      initCountdown();
      initParticles();
      return;
    }

    showSite();

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => {
        document.body.classList.remove("locked");
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        initStoryAnimations();
        initGallery();
        initCountdown();
        initParticles();
        hideIntro();
      },
    });

    tl.to(intro, { autoAlpha: 0, duration: 0.65 }, 0)
      .set(site, { autoAlpha: 1 }, 0.1)
      .from(
        ".hero .ganesha, .hero .balaji, .hero .mantra, .hero .display, .hero .lead, .hero .hero-meta, .hero .scroll-cue",
        { y: 26, autoAlpha: 0, duration: 0.85, stagger: 0.08 },
        0.15,
      );
  });
}

function initStoryAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  if (!prefersReducedMotion) {
    ScrollTrigger.normalizeScroll(true);
  }

  const hero = qs(".story-section.hero");
  if (hero) {
    gsap.set(hero, { autoAlpha: 1, y: 0 });
  }

  const sections = qsa(".story-section").filter((s) => !s.classList.contains("hero"));

  sections.forEach((section) => {
    gsap.set(section, { autoAlpha: 0, y: isMobile ? 30 : 54 });

    ScrollTrigger.create({
      trigger: section,
      start: isMobile ? "top 90%" : "top 78%",
      once: true,
      onEnter: () => {
        gsap.to(section, { autoAlpha: 1, y: 0, duration: isMobile ? 0.7 : 0.9, ease: "power3.out" });

        const animTargets = qsa(
          ".section-header, .invitation-text > *, .couple-inner > *, .events-grid .event-card, .gallery-frame, .countdown-wrap, .countdown-note, .footer-inner > *",
          section,
        );

        if (animTargets.length) {
          gsap.fromTo(
            animTargets,
            { y: 20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: isMobile ? 0.6 : 0.85, ease: "power3.out", stagger: isMobile ? 0.04 : 0.06, delay: 0.08 },
          );
        }

        if (section.classList.contains("couple")) {
          const bg = qs(".couple-bg", section);
          if (bg) {
            gsap.fromTo(bg, { scale: 1.12 }, { scale: 1.06, duration: 1.35, ease: "power2.out" });
          }
        }
      },
    });
  });

  if (!prefersReducedMotion) {
    const floatTargets = qsa(".event-flourish, .balaji");
    floatTargets.forEach((el) => {
      gsap.to(el, { y: "+=10", duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
    });

    // Gopuram Scroll Parallax (Throttled with rAF)
    const gopuram = qs(".hero-gopuram");
    if (gopuram) {
      let ticking = false;
      window.addEventListener("scroll", () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            let scroll = window.scrollY;
            gopuram.style.setProperty("--parallax-y", `${scroll * 0.1}px`);
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }
  }
}

function initGallery() {
  const img = qs("#galleryImage");
  const dotsWrap = qs("#galleryDots");
  if (!img || !dotsWrap) return;

  const images = [
    "assets/WhatsApp Image 2026-03-12 at 7.41.59 PM.jpeg",
    "assets/WhatsApp Image 2026-03-10 at 8.03.34 PM (2).jpeg",
    "assets/WhatsApp Image 2026-03-10 at 9.58.06 PM (1).jpeg",
    "assets/WhatsApp Image 2026-03-10 at 9.58.05 PM.jpeg",
    "assets/WhatsApp Image 2026-03-10 at 9.58.06 PM.jpeg",
    "assets/WhatsApp Image 2026-03-10 at 9.58.07 PM.jpeg",
  ];

  let index = 0;
  let timer = null;

  const dots = images.map((_, i) => {
    const d = document.createElement("span");
    d.className = "dot" + (i === 0 ? " active" : "");
    dotsWrap.appendChild(d);
    return d;
  });

  function setActiveDot(i) {
    dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
  }

  function show(i, immediate = false) {
    index = (i + images.length) % images.length;
    setActiveDot(index);

    if (prefersReducedMotion || immediate || !window.gsap) {
      img.src = images[index];
      img.style.opacity = "1";
      img.style.transform = "scale(1.04)";
      return;
    }

    const tl = gsap.timeline();
    tl.to(img, { autoAlpha: 0, duration: 0.35, ease: "power2.out" })
      .set(img, { attr: { src: images[index] } })
      .set(img, { scale: 1.08 })
      .to(img, { autoAlpha: 1, duration: 0.55, ease: "power2.out" })
      .to(img, { scale: 1.04, duration: 3.9, ease: "power1.out" }, "<");
  }

  function start() {
    if (timer) window.clearInterval(timer);
    timer = window.setInterval(() => show(index + 1), 5200);
  }

  show(0, true);
  start();

  const gallerySection = qs(".story-section.gallery");
  if (gallerySection && window.ScrollTrigger && !prefersReducedMotion) {
    ScrollTrigger.create({
      trigger: gallerySection,
      start: "top 85%",
      end: "bottom 15%",
      onEnter: start,
      onEnterBack: start,
      onLeave: () => timer && window.clearInterval(timer),
      onLeaveBack: () => timer && window.clearInterval(timer),
    });
  }
}

function initCountdown() {
  const daysEl = qs("#cdDays");
  const hoursEl = qs("#cdHours");
  const minsEl = qs("#cdMinutes");
  const secsEl = qs("#cdSeconds");
  const noteEl = qs("#countdownNote");
  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  const WEDDING_ISO = "2026-04-12T07:30:00+05:30";
  const target = new Date(WEDDING_ISO).getTime();

  const pad2 = (n) => String(n).padStart(2, "0");

  function render() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      daysEl.textContent = "0";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      if (noteEl) {
        noteEl.textContent = "Today is the glorious day! Welcome to our wedding celebrations! ";
        noteEl.classList.add("celebrating");
      }
      return false;
    }

    const s = Math.floor(diff / 1000);
    const days = Math.floor(s / (24 * 3600));
    const hours = Math.floor((s % (24 * 3600)) / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;

    daysEl.textContent = String(days);
    hoursEl.textContent = pad2(hours);
    minsEl.textContent = pad2(minutes);
    secsEl.textContent = pad2(seconds);
    if (noteEl) noteEl.textContent = "We can’t wait to celebrate with you.";
    return true;
  }

  render();
  window.setInterval(() => {
    const keep = render();
    if (!keep) return;

    if (!prefersReducedMotion && window.gsap) {
      gsap.fromTo(
        [daysEl, hoursEl, minsEl, secsEl],
        { textShadow: "0 0 0px rgba(212,175,55,0)" },
        { textShadow: "0 0 18px rgba(212,175,55,.35)", duration: 0.3, yoyo: true, repeat: 1, ease: "sine.inOut" },
      );
    }
  }, 1000);
}

function createParticleSystem(canvas, options) {
  const ctx = canvas.getContext("2d");
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  const settings = {
    count: options.count ?? 70,
    speed: options.speed ?? 0.18,
    radiusMin: options.radiusMin ?? 0.6,
    radiusMax: options.radiusMax ?? 2.2,
    alphaMin: options.alphaMin ?? 0.12,
    alphaMax: options.alphaMax ?? 0.55,
    color: options.color ?? "212,175,55",
    twinkle: options.twinkle ?? true,
    drift: options.drift ?? 0.08,
  };

  let w = 0;
  let h = 0;
  let raf = 0;
  let particles = [];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = Math.max(1, Math.floor(rect.width));
    h = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function seed() {
    particles = new Array(settings.count).fill(0).map(() => ({
      x: rand(0, w),
      y: rand(0, h),
      r: rand(settings.radiusMin, settings.radiusMax),
      a: rand(settings.alphaMin, settings.alphaMax),
      vx: rand(-settings.drift, settings.drift),
      vy: rand(settings.speed * 0.6, settings.speed * 1.25),
      phase: rand(0, Math.PI * 2),
      tw: rand(0.6, 1.7),
    }));
  }

  function step(t) {
    ctx.clearRect(0, 0, w, h);
    const time = (t || 0) / 1000;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y > h + 20) p.y = -20;

      const tw = settings.twinkle ? 0.5 + 0.5 * Math.sin(time * p.tw + p.phase) : 1;
      const alpha = clamp(p.a * (0.7 + 0.6 * tw), 0.02, 0.8);

      ctx.beginPath();
      ctx.fillStyle = `rgba(${settings.color},${alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = window.requestAnimationFrame(step);
  }

  function start() {
    if (prefersReducedMotion) return;
    resize();
    seed();
    raf = window.requestAnimationFrame(step);
  }

  function stop() {
    if (raf) window.cancelAnimationFrame(raf);
    raf = 0;
  }

  const ro = new ResizeObserver(() => {
    resize();
    seed();
  });
  ro.observe(canvas);

  return { start, stop, resize };
}

function initParticles() {
  if (prefersReducedMotion) return;
  const canvases = qsa("canvas.particles");

  // Selection of configuration remains the same
  canvases.forEach((c) => {
    const kind = c.getAttribute("data-particles");
    const cfg =
      kind === "night"
        ? { count: 110, speed: 0.14, radiusMin: 0.6, radiusMax: 1.8, alphaMin: 0.08, alphaMax: 0.45, color: "245,230,200", drift: 0.05 }
        : { count: 80, speed: 0.16, radiusMin: 0.7, radiusMax: 2.4, alphaMin: 0.10, alphaMax: 0.55, color: "212,175,55", drift: 0.09 };

    const sys = createParticleSystem(c, cfg);

    // Performance Optimization: Only run particles when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sys.start();
        } else {
          sys.stop();
        }
      });
    }, { rootMargin: "50px" });

    observer.observe(c);
  });
}

function bootstrap() {
  initIntro();
}

window.addEventListener("DOMContentLoaded", bootstrap);




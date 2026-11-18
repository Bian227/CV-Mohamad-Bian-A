/* ==========================================================
   Mohamad Bian Alfiansyah - CV website
   EDIT THE CONFIG BELOW with your real contact details.
   ========================================================== */
const CONFIG = {
  email: "your.email@example.com",
  whatsapp: { number: "6281234567890", label: "+62 812-3456-7890" }, // country code, no "+"
  github: { url: "https://github.com/yourusername", label: "github.com/yourusername" },
  linkedin: { url: "https://www.linkedin.com/in/yourusername", label: "linkedin.com/in/yourusername" },
  roles: [
    "Software Engineering Student",
    "Web Developer",
    "UI/UX Enthusiast",
    "Fast Learner"
  ]
};

(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const store = {
    get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
    }
  };

  /* ---------- Theme (light / dark) ---------- */
  const themeBtn = $("#themeBtn");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#080c20" : "#f3f5fc");
    window.dispatchEvent(new Event("themechange"));
  }

  applyTheme(store.get("bian-theme") || (systemDark.matches ? "dark" : "light"));

  themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    store.set("bian-theme", next);
  });

  if (systemDark.addEventListener) {
    systemDark.addEventListener("change", (e) => {
      if (!store.get("bian-theme")) applyTheme(e.matches ? "dark" : "light");
    });
  }

  /* ---------- Mobile menu ---------- */
  const burger = $("#burger");
  const menu = $("#menu");

  function setMenu(open) {
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !burger.contains(e.target)) setMenu(false);
  });

  /* ---------- Scroll: progress bar, sticky nav, back-to-top ---------- */
  const nav = $("#nav");
  const progress = $("#progress");
  const toTop = $("#toTop");
  let ticking = false;

  function onScroll() {
    const max = root.scrollHeight - window.innerHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
    nav.classList.toggle("scrolled", window.scrollY > 8);
    toTop.classList.toggle("show", window.scrollY > 600);
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  /* ---------- Active nav link ---------- */
  const links = $$(".menu a");
  const sections = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Typing effect ---------- */
  const typed = $("#typed");
  const roles = CONFIG.roles;
  if (typed && roles.length && !reduceMotion) {
    let r = 0;
    let c = roles[0].length;
    let deleting = false;
    typed.textContent = roles[0];
    const tick = () => {
      const word = roles[r];
      typed.textContent = word.slice(0, c);
      let delay = deleting ? 35 : 70;
      if (!deleting && c === word.length) {
        deleting = true;
        delay = 1500;
      } else if (deleting && c === 0) {
        deleting = false;
        r = (r + 1) % roles.length;
        delay = 350;
      } else {
        c += deleting ? -1 : 1;
      }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 2000);
  }

  /* ---------- Reveal on scroll ---------- */
  // Items start visible. Only items below the fold get hidden, then revealed as they enter.
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    $$(".reveal").forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.92) {
        el.classList.add("pre");
        io.observe(el);
      }
    });
  }

  /* ---------- Code card tilt ---------- */
  const codeCard = $("#codeCard");
  if (codeCard && finePointer && !reduceMotion) {
    const holder = codeCard.parentElement;
    holder.addEventListener("pointermove", (e) => {
      const rect = holder.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      codeCard.style.transform = "rotateY(" + x * 10 + "deg) rotateX(" + -y * 10 + "deg)";
    });
    holder.addEventListener("pointerleave", () => { codeCard.style.transform = ""; });
  }

  /* ---------- Cursor glow ---------- */
  const glow = $("#glow");
  if (glow && finePointer && !reduceMotion) {
    let gx = 0, gy = 0, pending = false;
    window.addEventListener("pointermove", (e) => {
      gx = e.clientX; gy = e.clientY;
      glow.classList.add("on");
      if (!pending) {
        pending = true;
        requestAnimationFrame(() => {
          glow.style.transform = "translate(" + gx + "px," + gy + "px)";
          pending = false;
        });
      }
    });
    document.addEventListener("pointerleave", () => glow.classList.remove("on"));
  }

  /* ---------- Hero background: connected dots ---------- */
  const canvas = $("#net");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    const hero = canvas.parentElement;
    const mouse = { x: -9999, y: -9999 };
    let w = 0, h = 0, dpr = 1, rgb = "44,71,245", dots = [], raf = 0, visible = true;

    const readColor = () => {
      const value = getComputedStyle(root).getPropertyValue("--net-rgb").trim();
      if (value) rgb = value;
    };

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(22, Math.min(90, Math.round((w * h) / 15000)));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.4 + 0.8
      }));
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        ctx.fillStyle = "rgba(" + rgb + ",.55)";
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.strokeStyle = "rgba(" + rgb + "," + (0.2 * (1 - d / 120)) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < 150) {
          ctx.strokeStyle = "rgba(" + rgb + "," + (0.45 * (1 - dm / 150)) + ")";
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
    };

    const step = () => {
      for (const p of dots) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      draw();
      raf = visible && !document.hidden ? requestAnimationFrame(step) : 0;
    };

    const start = () => { if (!raf && !reduceMotion) raf = requestAnimationFrame(step); };

    hero.addEventListener("pointermove", (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
    window.addEventListener("resize", resize);
    window.addEventListener("themechange", () => { readColor(); draw(); });
    document.addEventListener("visibilitychange", start);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        if (visible) start();
      }).observe(hero);
    }

    readColor();
    resize();
    start();
  }

  /* ---------- Project filter ---------- */
  const chips = $$(".chip[data-filter]");
  const projects = $$(".project");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter;
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      projects.forEach((p) => {
        p.hidden = !(filter === "all" || p.dataset.cat.split(" ").includes(filter));
      });
    });
  });

  /* ---------- Contact details from CONFIG ---------- */
  $$("[data-contact]").forEach((el) => {
    const type = el.dataset.contact;
    if (type === "email") {
      el.href = "mailto:" + CONFIG.email;
      el.textContent = CONFIG.email;
    } else if (type === "whatsapp") {
      el.href = "https://wa.me/" + CONFIG.whatsapp.number;
      el.textContent = CONFIG.whatsapp.label;
    } else if (CONFIG[type]) {
      el.href = CONFIG[type].url;
      el.textContent = CONFIG[type].label;
    }
  });

  const status = $("#formStatus");
  const say = (text, kind) => {
    status.textContent = text;
    status.className = "form-status" + (kind ? " " + kind : "");
  };

  /* ---------- Contact form (opens the visitor's email app) ---------- */
  const form = $("#contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#f-name").value.trim();
    const from = $("#f-email").value.trim();
    const message = $("#f-msg").value.trim();
    if (!name || !message) {
      say("Please add your name and a short message.", "err");
      return;
    }
    const subject = encodeURIComponent("Hello Bian, message from " + name);
    const body = encodeURIComponent(message + "\n\nRegards,\n" + name + (from ? "\n" + from : ""));
    window.location.href = "mailto:" + CONFIG.email + "?subject=" + subject + "&body=" + body;
    say("Opening your email app. If nothing opens, copy the address on the left and write to me directly.", "ok");
  });

  /* ---------- Copy email ---------- */
  const copyBtn = $("#copyEmail");
  const defaultLabel = copyBtn.textContent;
  copyBtn.addEventListener("click", async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(CONFIG.email);
      ok = true;
    } catch (err) {
      const link = $('[data-contact="email"]');
      const range = document.createRange();
      range.selectNodeContents(link);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
    copyBtn.textContent = ok ? "Copied" : "Press Ctrl+C to copy";
    setTimeout(() => { copyBtn.textContent = defaultLabel; }, 2000);
  });

  /* ---------- Footer year ---------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
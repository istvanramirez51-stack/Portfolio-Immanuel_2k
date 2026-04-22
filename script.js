/**
 * PORTFOLIO — script.js
 * Author : Immanuel
 * Stack  : Vanilla JS (no dependencies)
 */

/* ─────────────────────────────────────
   0. LOADING SCREEN
───────────────────────────────────── */
(function initLoader() {
  const loader  = document.getElementById('loader');
  const bar     = document.getElementById('loaderBar');
  const text    = document.getElementById('loaderText');
  if (!loader || !bar) return;

  const messages = ['Memuat portofolio...', 'Menyiapkan tampilan...', 'Hampir selesai...'];
  let progress   = 0;
  let msgIdx     = 0;

  // Tick progress bar
  const interval = setInterval(() => {
    // Accelerate near end
    const step = progress < 70 ? Math.random() * 8 + 4
               : progress < 90 ? Math.random() * 3 + 1
               : 0.5;

    progress = Math.min(progress + step, 98);
    bar.style.width = progress + '%';

    // Cycle messages
    const newIdx = progress < 40 ? 0 : progress < 80 ? 1 : 2;
    if (newIdx !== msgIdx) {
      msgIdx = newIdx;
      if (text) text.textContent = messages[msgIdx];
    }
  }, 80);

  // Hide loader once page is fully loaded
  function hideLoader() {
    clearInterval(interval);
    bar.style.width = '100%';
    if (text) text.textContent = 'Selesai!';
    setTimeout(() => {
      loader.classList.add('hide');
      document.body.style.overflow = '';
    }, 400);
  }

  // Lock scroll during load
  document.body.style.overflow = 'hidden';

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
    // Fallback: hide after 4s regardless
    setTimeout(hideLoader, 4000);
  }
})();

/* ─────────────────────────────────────
   1. THEME TOGGLE (Dark / Light)
───────────────────────────────────── */
(function initTheme() {
  const html         = document.documentElement;
  const toggleBtn    = document.getElementById('themeToggle');
  const STORAGE_KEY  = 'portfolio-theme';

  // Apply saved preference on load
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) html.setAttribute('data-theme', saved);

  toggleBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
  });
})();


/* ─────────────────────────────────────
   2. TYPED TEXT EFFECT
───────────────────────────────────── */
(function initTyped() {
  const el      = document.getElementById('typedText');
  if (!el) return;

  const words   = ['UI/UX Designer', 'Front-End Developer', 'Creative Coder', 'can`be anything', 'If you can, please make a reasonable request'];
  let wordIdx   = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;

  function type() {
    if (paused) return;

    const currentWord = words[wordIdx];

    if (!deleting) {
      // Typing forward
      charIdx++;
      el.textContent = currentWord.slice(0, charIdx);

      if (charIdx === currentWord.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; type(); }, 1800);
        return;
      }
    } else {
      // Deleting
      charIdx--;
      el.textContent = currentWord.slice(0, charIdx);

      if (charIdx === 0) {
        deleting = false;
        wordIdx  = (wordIdx + 1) % words.length;
        paused   = true;
        setTimeout(() => { paused = false; type(); }, 400);
        return;
      }
    }

    const speed = deleting ? 60 : 100;
    setTimeout(type, speed);
  }

  // Kick off after a short delay
  setTimeout(type, 600);
})();


/* ─────────────────────────────────────
   3. SIDEBAR — Active Link on Scroll
───────────────────────────────────── */
(function initActiveNav() {
  const links    = document.querySelectorAll('.sidebar__link');
  const sections = document.querySelectorAll('section[id]');

  function setActive() {
    const scrollY = window.scrollY + 150;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        links.forEach(l => l.classList.remove('active'));
        const match = document.querySelector(`.sidebar__link[href="#${id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();


/* ─────────────────────────────────────
   4. MOBILE HAMBURGER
───────────────────────────────────── */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const sidebar   = document.getElementById('sidebar');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    sidebar.classList.toggle('open');
  });

  // Close on nav link click (mobile)
  document.querySelectorAll('.sidebar__link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        hamburger.classList.remove('open');
        sidebar.classList.remove('open');
      }
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      window.innerWidth <= 768 &&
      !sidebar.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      hamburger.classList.remove('open');
      sidebar.classList.remove('open');
    }
  });
})();


/* ─────────────────────────────────────
   5. SKILL BARS — Animate on scroll
───────────────────────────────────── */
(function initSkillBars() {
  const bars     = document.querySelectorAll('.skill-bar');
  let animated   = false;

  function animateBars() {
    if (animated) return;

    const section  = document.getElementById('skills');
    if (!section) return;

    const rect     = section.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      bars.forEach(bar => {
        const pct  = bar.getAttribute('data-percent');
        const fill = bar.querySelector('.skill-bar__fill');
        if (fill) {
          // Small delay to ensure CSS transition picks up
          requestAnimationFrame(() => {
            fill.style.width = pct + '%';
          });
        }
      });
      animated = true;
    }
  }

  window.addEventListener('scroll', animateBars, { passive: true });
  animateBars(); // check on load in case already visible
})();


/* ─────────────────────────────────────
   6. SCROLL REVEAL
───────────────────────────────────── */
(function initScrollReveal() {
  // Add reveal classes dynamically to major elements
  const targets = [
    { selector: '.hero__text',       cls: 'reveal-left'  },
    { selector: '.hero__image',      cls: 'reveal-right' },
    { selector: '.about__image',     cls: 'reveal-left'  },
    { selector: '.about__content',   cls: 'reveal-right' },
    { selector: '.skills__left',     cls: 'reveal-left'  },
    { selector: '.skills__right',    cls: 'reveal-right' },
    { selector: '.project-card',     cls: 'reveal'       },
    { selector: '.contact__info',    cls: 'reveal-left'  },
    { selector: '.contact__form-wrap', cls: 'reveal-right' },
    { selector: '.section-title',    cls: 'reveal'       },
    { selector: '.section-subtitle', cls: 'reveal'       },
  ];

  targets.forEach(({ selector, cls }) => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add(cls);
    });
  });

  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger project cards
        const delay = entry.target.classList.contains('project-card')
          ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80
          : 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
})();


/* ─────────────────────────────────────
   7. SCROLL TO TOP BUTTON
───────────────────────────────────── */
(function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ─────────────────────────────────────
   8. CONTACT FORM
───────────────────────────────────── */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputs = form.querySelectorAll('[required]');
    let valid    = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = '#f44336';
        input.addEventListener('input', () => {
          input.style.borderColor = '';
        }, { once: true });
      }
    });

    if (!valid) return;

    // Simulate sending
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Mengirim...';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled    = false;
      submitBtn.innerHTML   = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
        Kirim Pesan
      `;
      success.classList.add('visible');
      setTimeout(() => success.classList.remove('visible'), 4000);
    }, 1200);
  });
})();


/* ─────────────────────────────────────
   9. SMOOTH SCROLL (fallback for Safari)
───────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* ─────────────────────────────────────
   10. CURSOR GLOW EFFECT (desktop only)
───────────────────────────────────── */
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch devices

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    width: 350px;
    height: 350px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(46,110,245,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    top: 0;
    left: 0;
  `;
  document.body.appendChild(glow);

  let cx = 0, cy = 0;
  let tx = 0, ty = 0;

  document.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  function animate() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(animate);
  }

  animate();
})();

// untuk mengirim email, saya menggunakan emailjs, jadi pastikan untuk mengganti 'YOUR_SERVICE

/* ─────────────────────────────────────
   11. JOURNEY PIXEL RUNNER GAME
───────────────────────────────────── */
(function initJourneyGame() {
  const canvas = document.getElementById('journeyCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  /* ── Milestone data ── */
  const MILESTONES = [
    { year: '2021', title: 'Hello World!',    desc: 'Menulis baris kode HTML pertama — awal dari segalanya.',           icon: '💻', tag: 'HTML & CSS',    color: '#e34c26' },
    { year: '2022', title: 'Masuk Figma',     desc: 'Mulai mendesain UI/UX dan jatuh cinta dengan visual design.',      icon: '🎨', tag: 'UI/UX Design',  color: '#F24E1E' },
    { year: '2022', title: 'Website Pertama', desc: 'Deploy website pertama ke internet — perasaan yang tak terlupakan!', icon: '🚀', tag: 'Front-End',     color: '#22c55e' },
    { year: '2023', title: 'Lulus SMA',       desc: 'Lulus SMA Taman Siswa P.Siantar & siap terjun ke dunia tech.',    icon: '🎓', tag: 'Milestone',     color: '#a855f7' },
    { year: '2023', title: 'JavaScript!',     desc: 'Mendalami vanilla JS — DOM, event, dan async/await.',              icon: '⚡', tag: 'JavaScript',    color: '#eab308' },
    { year: '2024', title: 'Git & GitHub',    desc: 'Belajar version control dan aktif berkontribusi di GitHub.',       icon: '🔧', tag: 'Dev Tools',     color: '#F05032' },
    { year: '2024-2025', title: 'Junior Dev! 🎉',  desc: 'Resmi menjadi Front-End Developer Junior dengan portfolio solid!', icon: '⭐', tag: 'Level Up!',     color: '#2EF69A' },
  ];

  /* ── Constants ── */
  const S          = 3;          // pixel scale
  const CHAR_W     = 6 * S;      // 18px
  const CHAR_H     = 15 * S;     // 45px
  const OBS_W      = 26;
  const OBS_H      = 58;
  const SPEED      = 2.8;
  const GRAVITY    = 0.52;
  const JUMP_VY    = -10.5;
  const GROUND_PAD = 62;         // canvas bottom padding for ground

  /* ── State ── */
  let running       = false;
  let animFrame     = null;
  let groundOffset  = 0;
  let objs          = [];
  let particles     = [];
  let popupTimer    = null;

  const char = {
    x:        72,
    y:        0,
    vy:       0,
    onGround: true,
    frame:    0,
  };

  /* ── Static star positions (generated once) ── */
  const STARS = Array.from({ length: 22 }, () => ({
    bx:   Math.random() * 1800,
    y:    Math.random() * 90 + 8,
    size: Math.random() > 0.65 ? 2 : 1,
  }));

  /* ── Helpers ── */
  function isDark() {
    const t = document.documentElement.getAttribute('data-theme');
    return !t || t === 'dark';
  }

  function groundY() {
    return canvas.height - GROUND_PAD;
  }

  /* ── Initialise / resize ── */
  function init() {
    canvas.width  = canvas.offsetWidth || 700;
    canvas.height = 230;
    char.y = groundY() - CHAR_H;
    spawnObstacles();
    buildDots();
  }

  function spawnObstacles() {
    const W = canvas.width || 700;
    objs = MILESTONES.map((m, i) => ({
      ...m,
      x:       W + 220 + i * 390,
      cleared: false,
    }));
  }

  function buildDots() {
    const el = document.getElementById('journeyDots');
    if (!el) return;
    el.innerHTML = MILESTONES.map((_, i) =>
      `<span class="jdot" id="jdot${i}"></span>`
    ).join('');
  }

  /* ── HUD updates ── */
  function activateDot(idx) {
    const dot = document.getElementById('jdot' + idx);
    if (dot) dot.classList.add('active');
    const cpEl = document.getElementById('journeyCheckpoint');
    if (cpEl) cpEl.textContent = (idx + 1) + ' / ' + MILESTONES.length;
  }

  function setStatus(txt, active) {
    const el = document.getElementById('journeyStatus');
    if (!el) return;
    el.textContent = txt;
    el.classList.toggle('running', !!active);
  }

  /* ── Popup ── */
  function showPopup(m, idx) {
    const popup = document.getElementById('journeyPopup');
    if (!popup) return;
    document.getElementById('popupYear').textContent  = m.year;
    document.getElementById('popupIcon').textContent  = m.icon;
    document.getElementById('popupTitle').textContent = m.title;
    document.getElementById('popupDesc').textContent  = m.desc;
    const tag = document.getElementById('popupTag');
    tag.textContent         = m.tag;
    tag.style.background    = m.color + '22';
    tag.style.color         = m.color;
    tag.style.border        = '1px solid ' + m.color + '55';
    popup.style.setProperty('--pop-color', m.color);
    popup.classList.add('visible');
    activateDot(idx);
    if (popupTimer) clearTimeout(popupTimer);
    popupTimer = setTimeout(() => popup.classList.remove('visible'), 3200);
  }

  /* ── Particles ── */
  function burst(x, y, color) {
    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
      const speed = Math.random() * 3.5 + 1;
      particles.push({
        x, y,
        vx:   Math.cos(angle) * speed,
        vy:   Math.sin(angle) * speed - 2,
        size: Math.random() * 4 + 2,
        color,
        life: 38 + Math.floor(Math.random() * 20),
        maxLife: 58,
      });
    }
  }

  /* ── Drawing ── */
  function drawBG() {
    const dark = isDark();
    const gy   = groundY();

    /* Sky */
    const grad = ctx.createLinearGradient(0, 0, 0, gy);
    if (dark) {
      grad.addColorStop(0, '#060d1f');
      grad.addColorStop(1, '#0a1428');
    } else {
      grad.addColorStop(0, '#d0e0ff');
      grad.addColorStop(1, '#eaf0ff');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, gy);

    /* Stars (dark only) */
    if (dark) {
      STARS.forEach(st => {
        const sx = ((st.bx - groundOffset * 0.05) % canvas.width + canvas.width) % canvas.width;
        ctx.fillStyle = 'rgba(255,255,255,' + (0.35 + st.size * 0.25) + ')';
        ctx.fillRect(sx, st.y, st.size, st.size);
      });
    }

    /* Subtle scan-lines */
    ctx.fillStyle = dark ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.04)';
    for (let y = 0; y < gy; y += 4) ctx.fillRect(0, y, canvas.width, 2);

    /* Horizontal grid */
    ctx.strokeStyle = dark ? 'rgba(46,110,245,0.07)' : 'rgba(46,110,245,0.09)';
    ctx.lineWidth   = 1;
    for (let y = 24; y < gy; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  function drawGround() {
    const dark = isDark();
    const gy   = groundY();

    /* Fill */
    ctx.fillStyle = dark ? '#040b18' : '#dce8ff';
    ctx.fillRect(0, gy, canvas.width, GROUND_PAD);

    /* Glowing line */
    ctx.save();
    ctx.strokeStyle  = '#2e6ef5';
    ctx.lineWidth    = 2;
    ctx.shadowColor  = '#2e6ef5';
    ctx.shadowBlur   = 10;
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(canvas.width, gy);
    ctx.stroke();
    ctx.restore();

    /* Scrolling pixel tiles row 1 */
    const tw = 18;
    const off1 = groundOffset % tw;
    ctx.fillStyle = dark ? 'rgba(46,110,245,0.14)' : 'rgba(46,110,245,0.12)';
    for (let x = -tw + off1; x < canvas.width + tw; x += tw) {
      ctx.fillRect(x, gy + 4, tw - 2, 4);
    }

    /* Row 2 (slower parallax) */
    const off2 = (groundOffset * 0.5) % (tw * 2);
    ctx.fillStyle = dark ? 'rgba(46,110,245,0.06)' : 'rgba(46,110,245,0.07)';
    for (let x = -(tw * 2) + off2; x < canvas.width + tw; x += tw * 2) {
      ctx.fillRect(x + 2, gy + 12, tw - 4, 3);
    }
  }

  function drawChar(cx, cy, frame) {
    const dark = isDark();
    /* Palette */
    const SKIN  = '#FFCC9A';
    const HAIR  = '#1e0d00';
    const SHIRT = '#2e6ef5';
    const PANTS = '#182038';
    const SHOE  = '#0c0c18';
    const SCREEN= '#aac9ff';
    const HL    = 'rgba(255,255,255,0.18)';

    const legF  = Math.floor(frame / 5) % 4;

    /* Shadow on ground */
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.ellipse(cx + CHAR_W / 2, groundY() + 4, CHAR_W * 0.6, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    /* Hair */
    ctx.fillStyle = HAIR;
    ctx.fillRect(cx + S,     cy,           4 * S, S);
    ctx.fillRect(cx,         cy + S,       S,     S);
    ctx.fillRect(cx + 5 * S, cy + S,       S,     S);

    /* Head */
    ctx.fillStyle = SKIN;
    ctx.fillRect(cx + S, cy + S, 4 * S, 3 * S);

    /* Eyes */
    ctx.fillStyle = '#333';
    ctx.fillRect(cx + 2 * S, cy + 2 * S, S, S);
    ctx.fillRect(cx + 4 * S, cy + 2 * S, S, S);

    /* Body / shirt */
    ctx.fillStyle = SHIRT;
    ctx.fillRect(cx, cy + 4 * S, 6 * S, 5 * S);

    /* Shirt highlight */
    ctx.fillStyle = HL;
    ctx.fillRect(cx, cy + 4 * S, 6 * S, S);

    /* Laptop screen on chest */
    ctx.fillStyle = SCREEN;
    ctx.fillRect(cx + S, cy + 5 * S, 3 * S, 2 * S);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(cx + S, cy + 5 * S, 3 * S, S);

    /* Pants */
    ctx.fillStyle = PANTS;
    ctx.fillRect(cx, cy + 9 * S, 6 * S, 2 * S);

    /* Legs (4-frame run cycle) */
    ctx.fillStyle = PANTS;
    const ly = cy + 11 * S;
    const lh = 2 * S;

    if (legF === 0) {
      ctx.fillRect(cx,           ly,      2 * S, lh);
      ctx.fillRect(cx + 3 * S,   ly,      2 * S, lh);
    } else if (legF === 1) {
      ctx.fillRect(cx + S,       ly,      2 * S, lh + S);
      ctx.fillRect(cx + 3 * S,   ly - S,  2 * S, lh);
    } else if (legF === 2) {
      ctx.fillRect(cx + S,       ly,      2 * S, lh);
      ctx.fillRect(cx + 3 * S,   ly,      2 * S, lh);
    } else {
      ctx.fillRect(cx,           ly - S,  2 * S, lh);
      ctx.fillRect(cx + 2 * S,   ly,      2 * S, lh + S);
    }

    /* Shoes */
    ctx.fillStyle = SHOE;
    const sy = ly + lh;
    if (legF === 1) {
      ctx.fillRect(cx - S,     sy,     3 * S, S);
      ctx.fillRect(cx + 3 * S, sy - S, 2 * S, S);
    } else if (legF === 3) {
      ctx.fillRect(cx,         sy - S, 2 * S, S);
      ctx.fillRect(cx + 2 * S, sy,     3 * S, S);
    } else {
      ctx.fillRect(cx,         sy,     2 * S, S);
      ctx.fillRect(cx + 3 * S, sy,     2 * S, S);
    }
  }

  function drawObstacle(ob) {
    const gy   = groundY();
    const dark = isDark();
    const ox   = ob.x;

    /* Glow shadow */
    ctx.save();
    ctx.shadowColor = ob.color;
    ctx.shadowBlur  = 16;

    /* Main pillar */
    ctx.fillStyle = ob.color;
    ctx.fillRect(ox, gy - OBS_H, OBS_W, OBS_H);
    ctx.shadowBlur = 0;
    ctx.restore();

    /* Right shade */
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.fillRect(ox + OBS_W - 6, gy - OBS_H, 6, OBS_H);

    /* Pixel notches */
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    for (let py = gy - OBS_H + 18; py < gy - 8; py += 11) {
      ctx.fillRect(ox + 4,        py,     5, 3);
      ctx.fillRect(ox + 14,       py + 5, 5, 3);
    }

    /* Top cap */
    ctx.save();
    ctx.shadowColor = ob.color;
    ctx.shadowBlur  = 10;
    ctx.fillStyle   = ob.color;
    ctx.fillRect(ox - 5, gy - OBS_H - 11, OBS_W + 10, 13);
    ctx.shadowBlur  = 0;
    ctx.restore();

    /* Top cap highlight */
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(ox - 5, gy - OBS_H - 11, OBS_W + 10, 3);

    /* Year label */
    ctx.save();
    ctx.fillStyle    = '#fff';
    ctx.font         = 'bold 10px "Space Mono", monospace';
    ctx.textAlign    = 'center';
    ctx.shadowColor  = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur   = 6;
    ctx.fillText(ob.year, ox + OBS_W / 2, gy - OBS_H + 18);
    ctx.restore();
    ctx.textAlign = 'left';
  }

  function drawParticles() {
    particles.forEach(p => {
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle   = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    ctx.globalAlpha = 1;
  }

  /* ── Game loop ── */
  function loop() {
    if (!running) return;

    groundOffset += SPEED;
    char.frame++;

    /* Gravity */
    if (!char.onGround) {
      char.vy += GRAVITY;
      char.y  += char.vy;
      if (char.y >= groundY() - CHAR_H) {
        char.y      = groundY() - CHAR_H;
        char.vy     = 0;
        char.onGround = true;
      }
    }

    /* Obstacles */
    const gy2 = groundY();
    let hitDetected = false;
    objs.forEach((ob, idx) => {
      ob.x -= SPEED;

      /* Collision (slightly inset hitbox for fairness) */
      const hx = char.x + 4, hy = char.y + 4, hw = CHAR_W - 8, hh = CHAR_H - 6;
      const ox2 = ob.x + 2, ow2 = OBS_W - 4, oTop = gy2 - OBS_H;
      if (!hitDetected && hx < ox2 + ow2 && hx + hw > ox2 && hy + hh > oTop && hy < gy2) {
        hitDetected = true;
        die();
      }

      /* Cleared? */
      if (!ob.cleared && ob.x + OBS_W < char.x) {
        ob.cleared = true;
        burst(char.x + CHAR_W / 2, char.y, ob.color);
        showPopup(ob, idx);
      }
    });

    /* Respawn when all obstacles have left the canvas */
    if (objs.every(ob => ob.x < -60)) {
      spawnObstacles();
      /* Reset dots */
      MILESTONES.forEach((_, i) => {
        const d = document.getElementById('jdot' + i);
        if (d) d.classList.remove('active');
      });
      const cpEl = document.getElementById('journeyCheckpoint');
      if (cpEl) cpEl.textContent = '0 / ' + MILESTONES.length;
    }

    /* Update particles */
    particles.forEach(p => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.18;
      p.life--;
    });
    particles = particles.filter(p => p.life > 0);

    /* Render */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBG();
    drawGround();
    objs.forEach(ob => {
      if (ob.x < canvas.width + 50 && ob.x > -(OBS_W + 10)) drawObstacle(ob);
    });
    drawParticles();
    drawChar(char.x, char.y, char.frame);

    animFrame = requestAnimationFrame(loop);
  }

  /* ── Game states: 'idle' | 'playing' | 'dead' ── */
  let gameState = 'idle';
  let deadTimer = null;
  let canRestart = false;
  let score = 0;

  function doJump() {
    if (gameState === 'idle') {
      gameState = 'playing';
      running = true;
      setStatus('● PLAYING', true);
      char.onGround = false;
      char.vy = JUMP_VY;
      loop();
      return;
    }
    if (gameState === 'dead' && canRestart) {
      resetGame();
      return;
    }
    if (gameState === 'playing' && char.onGround) {
      char.onGround = false;
      char.vy = JUMP_VY;
    }
  }

  function die() {
    if (gameState !== 'playing') return;
    gameState = 'dead';
    running = false;
    canRestart = false;
    if (animFrame) cancelAnimationFrame(animFrame);
    setStatus('● GAME OVER', false);

    /* Draw dead frame */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBG();
    drawGround();
    objs.forEach(ob => {
      if (ob.x < canvas.width + 50 && ob.x > -(OBS_W + 10)) drawObstacle(ob);
    });
    drawParticles();
    drawCharDead(char.x, char.y);
    drawDeadOverlay();

    if (deadTimer) clearTimeout(deadTimer);
    deadTimer = setTimeout(() => {
      canRestart = true;
      /* Redraw overlay with restart hint */
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBG();
      drawGround();
      objs.forEach(ob => {
        if (ob.x < canvas.width + 50 && ob.x > -(OBS_W + 10)) drawObstacle(ob);
      });
      drawCharDead(char.x, char.y);
      drawDeadOverlay(true);
    }, 1400);
  }

  function resetGame() {
    score = 0;
    char.y = groundY() - CHAR_H;
    char.vy = 0;
    char.onGround = true;
    char.frame = 0;
    particles = [];
    spawnObstacles();
    MILESTONES.forEach((_, i) => {
      const d = document.getElementById('jdot' + i);
      if (d) d.classList.remove('active');
    });
    const cpEl = document.getElementById('journeyCheckpoint');
    if (cpEl) cpEl.textContent = '0 / ' + MILESTONES.length;
    gameState = 'idle';
    canRestart = false;
    setStatus('● READY', false);
    drawStatic();
    drawIdleOverlay();
  }

  /* ── Overlay drawing ── */
  function drawIdleOverlay() {
    const dark = isDark();
    const cx = canvas.width / 2;
    const cy = canvas.height / 2 - 10;

    ctx.save();
    /* Dim vignette */
    ctx.fillStyle = dark ? 'rgba(6,13,31,0.45)' : 'rgba(220,232,255,0.45)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* Pill background */
    const pill = { w: 260, h: 44, r: 22 };
    const px = cx - pill.w / 2;
    const py = cy - pill.h / 2;
    ctx.beginPath();
    ctx.roundRect(px, py, pill.w, pill.h, pill.r);
    ctx.fillStyle = dark ? 'rgba(6,13,31,0.82)' : 'rgba(255,255,255,0.88)';
    ctx.fill();
    ctx.strokeStyle = '#2e6ef5';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#2e6ef5';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    /* Text */
    ctx.fillStyle = dark ? '#e8edf7' : '#111827';
    ctx.font = 'bold 13px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SPACE / KLIK / TAP  untuk mulai', cx, cy + 5);

    /* Pulsing arrow hint below */
    const alpha = 0.5 + 0.5 * Math.sin(Date.now() / 400);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#2e6ef5';
    ctx.font = '11px "Space Mono", monospace';
    ctx.fillText('▲ LONCAT', cx, cy + pill.h / 2 + 18);
    ctx.globalAlpha = 1;

    ctx.restore();
    ctx.textAlign = 'left';
  }

  function drawDeadOverlay(showRestart = false) {
    const dark = isDark();
    const cx = canvas.width / 2;
    const cy = canvas.height / 2 - 10;

    ctx.save();
    ctx.fillStyle = dark ? 'rgba(6,13,31,0.5)' : 'rgba(220,232,255,0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const pill = { w: 240, h: showRestart ? 70 : 46, r: 14 };
    const px = cx - pill.w / 2;
    const py = cy - pill.h / 2;
    ctx.beginPath();
    ctx.roundRect(px, py, pill.w, pill.h, pill.r);
    ctx.fillStyle = dark ? 'rgba(6,13,31,0.88)' : 'rgba(255,255,255,0.9)';
    ctx.fill();
    ctx.strokeStyle = '#f44';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#f44';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#f55';
    ctx.font = 'bold 15px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('💥  GAME OVER', cx, showRestart ? cy - 6 : cy + 6);

    if (showRestart) {
      ctx.fillStyle = dark ? '#8fa3c8' : '#3a5080';
      ctx.font = '10px "Space Mono", monospace';
      ctx.fillText('SPACE / KLIK / TAP untuk ulang', cx, cy + 16);
    }

    ctx.restore();
    ctx.textAlign = 'left';
  }

  function drawCharDead(cx, cy) {
    /* Reuse normal drawChar but tinted red */
    ctx.save();
    ctx.globalAlpha = 0.7;
    drawChar(cx, cy, 0);
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#ff3333';
    ctx.fillRect(cx, cy, CHAR_W, CHAR_H);
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  /* Draw one static frame (used for idle state) */
  function drawStatic() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBG();
    drawGround();
    objs.forEach(ob => {
      if (ob.x < canvas.width + 50 && ob.x > -(OBS_W + 10)) drawObstacle(ob);
    });
    drawChar(char.x, char.y, 0);
  }

  /* Idle animation loop (just pulses the overlay) */
  let idleFrame = null;
  function idleLoop() {
    if (gameState !== 'idle') return;
    drawStatic();
    drawIdleOverlay();
    idleFrame = requestAnimationFrame(idleLoop);
  }

  function startIdle() {
    if (idleFrame) cancelAnimationFrame(idleFrame);
    idleLoop();
  }

  function stopIdle() {
    if (idleFrame) cancelAnimationFrame(idleFrame);
    idleFrame = null;
  }

  /* ── Input handlers ── */
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') {
      /* Only handle if journey section is visible */
      const rect = canvas.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        e.preventDefault();
        doJump();
      }
    }
  });

  canvas.addEventListener('click',     () => doJump());
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); doJump(); }, { passive: false });

  /* ── IntersectionObserver — show idle when in view, stop when not ── */
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        if (gameState === 'idle') startIdle();
        setStatus(gameState === 'playing' ? '● PLAYING' : '● READY', gameState === 'playing');
      } else {
        stopIdle();
        if (gameState === 'playing') {
          running = false;
          if (animFrame) cancelAnimationFrame(animFrame);
          gameState = 'idle';
          char.y = groundY() - CHAR_H;
          char.vy = 0;
          char.onGround = true;
          particles = [];
          spawnObstacles();
          MILESTONES.forEach((_, i) => {
            const d = document.getElementById('jdot' + i);
            if (d) d.classList.remove('active');
          });
          const cpEl = document.getElementById('journeyCheckpoint');
          if (cpEl) cpEl.textContent = '0 / ' + MILESTONES.length;
          setStatus('● IDLE', false);
        }
      }
    });
  }, { threshold: 0.25 });

  /* ── Boot ── */
  window.addEventListener('resize', () => {
    canvas.width = canvas.offsetWidth;
    char.y = groundY() - CHAR_H;
    spawnObstacles();
    if (gameState === 'idle') {
      drawStatic();
      drawIdleOverlay();
    }
  });

  requestAnimationFrame(() => {
    init();
    drawStatic();
    drawIdleOverlay();
    sectionObserver.observe(canvas);
  });
})();
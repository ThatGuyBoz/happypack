(() => {

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('in-view');
        }, parseFloat(delay) * 1000);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  document.querySelectorAll('.rv,.rv-y,.rv-l,.rv-r').forEach(el => {
    if (!el.parentElement) return;

    // FIXED: get siblings properly
    const siblings = el.parentElement.children;
    const idx = Array.from(siblings).indexOf(el);

    if (idx > 0) el.dataset.delay = (idx * 0.1).toFixed(2);

    io.observe(el);
  });

  document.querySelectorAll('.svc-card,.rev-card,.pol-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;

      card.style.transform =
        `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-6px) scale(1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  document.querySelectorAll('.btn-primary,.btn-submit,.btn-nav').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.22;
      const y = (e.clientY - r.top - r.height / 2) * 0.22;

      btn.style.transform = `translate(${x}px, ${y}px) translateY(-2px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ── PAW BURST on svc-bar tiles ──
  const BURST_EMOJIS = ['🐾','🐾','🐾','✨','💫','🌟','💜','🩵','💛','🌸'];
  const HORSE_EMOJIS = ['🐎','🐎','🐎','✨','💫','🌟','💜','🌿','💛','🌸'];

  function spawnParticles(cx, cy, emojis = BURST_EMOJIS) {

    [0, 150].forEach((delay, i) => {
      const w = document.createElement('div');
      w.className = 'paw-wave';
      w.style.left = cx + 'px';
      w.style.top  = cy + 'px';
      w.style.animationDelay = delay + 'ms';

      if (i === 1) {
        w.style.setProperty('--wc', 'rgba(200,152,58,0.45)');
      }

      document.body.appendChild(w);
      setTimeout(() => w.remove(), 900 + delay);
    });

    for (let i = 0; i < 16; i++) {
      const p = document.createElement('div');
      p.className = 'paw-particle';
      p.textContent = emojis[i % emojis.length];

      const angle = (360 / 16) * i + (Math.random() * 14 - 7);
      const dist  = 50 + Math.random() * 85;
      const rad   = angle * Math.PI / 180;

      p.style.left = cx + 'px';
      p.style.top  = cy + 'px';
      p.style.fontSize = (0.7 + Math.random() * 0.7) + 'rem';

      p.style.setProperty('--tx', (Math.cos(rad) * dist).toFixed(1) + 'px');
      p.style.setProperty('--ty', (Math.sin(rad) * dist).toFixed(1) + 'px');
      p.style.setProperty('--rot', (Math.random() * 90 - 45).toFixed(1) + 'deg');
      p.style.setProperty('--sc', (0.8 + Math.random() * 0.6).toFixed(2));

      p.style.animationDuration = (0.6 + Math.random() * 0.45).toFixed(2) + 's';
      p.style.animationDelay    = ((i < 8 ? 0 : 0.08) + (Math.random() * 0.1)).toFixed(3) + 's';

      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1500);
    }
  }

  document.querySelectorAll('.svc-bar-item').forEach(tile => {
    tile.addEventListener('click', e => {
      const rect = tile.getBoundingClientRect();

      const cx = e.clientX || rect.left + rect.width / 2;
      const cy = e.clientY || rect.top  + rect.height / 2;

      const nameEl = tile.querySelector('.svc-bar-name');
      const isHorse = nameEl && nameEl.textContent.includes('Big Overgrown');

      spawnParticles(cx, cy, isHorse ? HORSE_EMOJIS : BURST_EMOJIS);

      tile.classList.remove('paw-active');
      void tile.offsetWidth; // force reflow
      tile.classList.add('paw-active');
    });

    tile.addEventListener('mouseleave', () => {
      tile.classList.remove('paw-active');
    });
  });

  const btn = document.getElementById('submitBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      btn.textContent = '✓ Sent! We will be in touch soon 🌿';
      btn.style.background = 'linear-gradient(145deg,#3D8868,#2A6650,#1A4E3A)';
      btn.disabled = true;
    });
  }

})();
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  /* ── Particles (floating dust motes / fireflies) ── */
  const PARTICLE_COUNT = 80;
  const particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3 - 0.1,
      alpha: Math.random() * 0.5 + 0.15,
      pulse: Math.random() * Math.PI * 2,
    });
  }

  /* ── Books (floating silhouettes) ── */
  const BOOK_COUNT = 12;
  const books = [];

  for (let i = 0; i < BOOK_COUNT; i++) {
    const w = Math.random() * 40 + 20;
    const h = Math.random() * 60 + 40;
    books.push({
      x: Math.random() * (W + 200) - 100,
      y: Math.random() * (H + 200) - 100,
      w,
      h,
      angle: (Math.random() - 0.5) * 0.3,
      dx: (Math.random() - 0.5) * 0.15,
      dy: (Math.random() - 0.5) * 0.15,
      color: `hsla(${40 + Math.random() * 20}, ${30 + Math.random() * 30}%, ${10 + Math.random() * 10}%, ${0.03 + Math.random() * 0.04})`,
      spine: `hsla(${42 + Math.random() * 15}, 60%, ${15 + Math.random() * 10}%, ${0.05 + Math.random() * 0.06})`,
    });
  }

  /* ── Floating pages ── */
  const PAGE_COUNT = 6;
  const pages = [];

  for (let i = 0; i < PAGE_COUNT; i++) {
    pages.push({
      x: Math.random() * W,
      y: Math.random() * H,
      w: Math.random() * 18 + 10,
      h: Math.random() * 14 + 8,
      dx: (Math.random() - 0.5) * 0.2,
      dy: Math.random() * 0.15 + 0.05,
      rotation: (Math.random() - 0.5) * 0.02,
      angle: 0,
      alpha: 0.03 + Math.random() * 0.04,
    });
  }

  /* ── Shelf lines ── */
  function drawShelves() {
    ctx.strokeStyle = 'rgba(245, 197, 24, 0.015)';
    ctx.lineWidth = 1;
    const shelfY = H - 80;
    const step = 50;

    for (let y = shelfY; y < H + 20; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= W; x += 4) {
        const wave = Math.sin(x * 0.005 + y * 0.01 + Date.now() * 0.0001) * 2;
        ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
    }
  }

  /* ── Draw loop ── */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Warm gradient background
    const grad = ctx.createRadialGradient(W / 2, H * 0.3, 0, W / 2, H * 0.3, W * 0.7);
    grad.addColorStop(0, 'rgba(30, 25, 15, 1)');
    grad.addColorStop(0.5, 'rgba(10, 10, 8, 1)');
    grad.addColorStop(1, 'rgba(5, 5, 5, 1)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Shelves
    drawShelves();

    // Books
    for (const b of books) {
      b.x += b.dx;
      b.y += b.dy;
      if (b.x < -150) b.x = W + 50;
      if (b.x > W + 150) b.x = -50;
      if (b.y < -150) b.y = H + 50;
      if (b.y > H + 150) b.y = -50;

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.angle);

      // Book body
      ctx.fillStyle = b.color;
      ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);

      // Spine (left edge highlight)
      ctx.fillStyle = b.spine;
      ctx.fillRect(-b.w / 2, -b.h / 2, 3, b.h);

      // Pages edge (right side)
      ctx.fillStyle = 'rgba(200, 180, 150, 0.02)';
      ctx.fillRect(b.w / 2 - 2, -b.h / 2, 2, b.h);

      ctx.restore();
    }

    // Pages
    for (const p of pages) {
      p.x += p.dx;
      p.y += p.dy;
      p.angle += p.rotation;
      if (p.y > H + 50) {
        p.y = -50;
        p.x = Math.random() * W;
      }
      if (p.x < -50) p.x = W + 50;
      if (p.x > W + 50) p.x = -50;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = `rgba(200, 180, 150, ${p.alpha})`;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    // Particles
    const now = Date.now() * 0.001;
    for (const p of particles) {
      p.x += p.dx;
      p.y += p.dy;
      p.pulse += 0.02;

      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      const alpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 197, 24, ${alpha})`;
      ctx.fill();
    }

    // Warm glow spots
    const t = now * 0.5;
    for (let i = 0; i < 3; i++) {
      const gx = W * (0.2 + 0.6 * (0.5 + 0.5 * Math.sin(t + i * 2.1)));
      const gy = H * (0.2 + 0.6 * (0.5 + 0.5 * Math.cos(t * 0.7 + i * 1.7)));
      const grd = ctx.createRadialGradient(gx, gy, 0, gx, gy, 120 + 40 * Math.sin(t + i));
      grd.addColorStop(0, 'rgba(245, 197, 24, 0.015)');
      grd.addColorStop(1, 'rgba(245, 197, 24, 0)');
      ctx.fillStyle = grd;
      ctx.fillRect(gx - 160, gy - 160, 320, 320);
    }

    requestAnimationFrame(draw);
  }

  draw();
})();

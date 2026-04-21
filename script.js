const canvas = document.getElementById("space");

if (canvas) {
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  // ⭐ CAMADAS DE ESTRELAS (PARALLAX)
  const layers = [
    { count: 60, speed: 0.2, size: 1 },
    { count: 40, speed: 0.4, size: 1.5 },
    { count: 25, speed: 0.6, size: 2 }
  ];

  let stars = [];

  layers.forEach(layer => {
    for (let i = 0; i < layer.count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: layer.size * Math.random(),
        speed: layer.speed,
        opacity: Math.random(),
        layer: layer
      });
    }
  });

  // 🌠 SHOOTING STARS
  const shootingStars = [];

  function spawnShootingStar() {
    shootingStars.push({
      x: Math.random() * canvas.width,
      y: 0,
      length: 200,
      speed: 6,
      opacity: 1
    });
  }

  setInterval(spawnShootingStar, 6000);

  // 🧠 MOUSE INTERAÇÃO
  let mouse = { x: null, y: null };

  window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // 🌌 NEBULOSA (GRADIENTE DINÂMICO)
  function drawNebula() {
    const grad = ctx.createRadialGradient(
      canvas.width * 0.7,
      canvas.height * 0.3,
      0,
      canvas.width * 0.7,
      canvas.height * 0.3,
      500
    );

    grad.addColorStop(0, "rgba(120, 0, 255, 0.08)");
    grad.addColorStop(1, "transparent");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawNebula();

    // ⭐ ESTRELAS
    stars.forEach(star => {
      star.y += star.speed;

      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }

      // brilho pulsando
      star.opacity += (Math.random() - 0.5) * 0.05;
      star.opacity = Math.max(0.2, Math.min(1, star.opacity));

      // interação com mouse
      if (mouse.x) {
        let dx = star.x - mouse.x;
        let dy = star.y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          star.x += dx * 0.01;
          star.y += dy * 0.01;
        }
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
      ctx.fill();
    });

    // 🌠 SHOOTING STARS
    shootingStars.forEach((s, i) => {
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.length, s.y + s.length / 2);
      ctx.strokeStyle = `rgba(255,255,255,${s.opacity})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      s.x += s.speed;
      s.y += s.speed;
      s.opacity -= 0.01;

      if (s.opacity <= 0) shootingStars.splice(i, 1);
    });

    requestAnimationFrame(draw);
  }

  draw();
}

const canvas = document.getElementById("space");

if (canvas) {
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  const stars = [];

  for (let i = 0; i < 120; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5,
      opacity: Math.random(),
      speed: Math.random() * 0.2
    });
  }

  let mouse = { x: null, y: null };

  window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
      star.y += star.speed;

      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }

      // interação com mouse
      if (mouse.x !== null) {
        let dx = star.x - mouse.x;
        let dy = star.y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          star.x += dx * 0.01;
          star.y += dy * 0.01;
        }
      }

      // brilho suave
      star.opacity += (Math.random() - 0.5) * 0.03;
      star.opacity = Math.max(0.2, Math.min(1, star.opacity));

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
}

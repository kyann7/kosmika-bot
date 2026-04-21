const canvas = document.getElementById("space");

if (canvas) {
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  // ⭐ estrelas suaves (sem linhas bugadas)
  const stars = [];

  for (let i = 0; i < 100; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5,
      opacity: Math.random(),
      speed: Math.random() * 0.2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
      // movimento leve
      star.y += star.speed;

      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
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

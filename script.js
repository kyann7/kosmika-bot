const canvas = document.getElementById("space");

if (canvas) {
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  // ⭐ ESTRELAS
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

  // 🪐 PLANETAS
  const planets = [
    { x: 200, y: 150, r: 40 },
    { x: canvas.width - 300, y: canvas.height - 200, r: 60 }
  ];

  // 🛸 NAVES
  const ships = [];

  function spawnShip() {
    ships.push({
      x: -50,
      y: Math.random() * canvas.height,
      speed: 1 + Math.random() * 1
    });
  }

  setInterval(spawnShip, 8000); // aparece a cada 8s

  // 🌀 BURACO NEGRO
  const blackHole = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 80,
    angle: 0
  };

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ⭐ estrelas (com brilho)
    stars.forEach(star => {
      star.opacity += (Math.random() - 0.5) * 0.05;
      star.opacity = Math.max(0.2, Math.min(1, star.opacity));

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
      ctx.fill();
    });

    // 🪐 planetas
    planets.forEach(p => {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      grad.addColorStop(0, "rgba(150,150,255,0.4)");
      grad.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    // 🌀 buraco negro
    blackHole.angle += 0.01;
    ctx.beginPath();
    ctx.arc(blackHole.x, blackHole.y, blackHole.radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(120,0,255,0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 🛸 naves
    ships.forEach((ship, i) => {
      ship.x += ship.speed;

      ctx.fillStyle = "#aaa";
      ctx.fillRect(ship.x, ship.y, 20, 4);

      if (ship.x > canvas.width + 50) {
        ships.splice(i, 1);
      }
    });

    requestAnimationFrame(draw);
  }

  draw();
}

const canvas = document.getElementById('space');
const ctx = canvas.getContext('2d');

let particles = [];
let specialElements = [];
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    specialElements = [];
    // Recriando suas 150 estrelas
    for (let i = 0; i < 150; i++) {
        particles.push(new Star());
    }
    // Trazendo de volta a nave e o buraco negro
    specialElements.push(new SpecialObject('ship'));
    specialElements.push(new SpecialObject('blackhole'));
}

class Star {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.3;
        this.color = ['#5865F2', '#9b59ff', '#ffffff'][Math.floor(Math.random() * 3)];
        this.speedX = (Math.random() - 0.5) * 0.25; 
        this.speedY = (Math.random() - 0.5) * 0.25;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
            let force = (mouse.radius - distance) / mouse.radius;
            this.x -= (dx / distance) * force * 1.5;
            this.y -= (dy / distance) * force * 1.5;
        }
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }
}

class SpecialObject {
    constructor(type) { this.type = type; this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speedX = (Math.random() - 0.5) * (this.type === 'ship' ? 1.2 : 0.4);
        this.speedY = (Math.random() - 0.5) * (this.type === 'ship' ? 1.2 : 0.4);
        this.size = this.type === 'ship' ? 10 : 30;
        this.angle = Math.atan2(this.speedY, this.speedX);
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.type === 'ship') {
            ctx.rotate(this.angle);
            ctx.fillStyle = '#00d4ff';
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#00d4ff';
            ctx.beginPath(); ctx.moveTo(12, 0); ctx.lineTo(-8, -6); ctx.lineTo(-8, 6); ctx.closePath(); ctx.fill();
        } else {
            let grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
            grad.addColorStop(0.1, '#000'); grad.addColorStop(0.8, '#9b59ff33'); grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad; ctx.shadowBlur = 15; ctx.shadowColor = '#9b59ff';
            ctx.beginPath(); ctx.arc(0, 0, this.size, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x < -100 || this.x > canvas.width + 100 || this.y < -100 || this.y > canvas.height + 100) {
            if (Math.random() < 0.005) {
                this.reset();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    specialElements.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(animate);
}

init();
animate();
window.addEventListener('resize', init);

// ==========================================
// STATUS DO DISCORD (TEMPO REAL)
// ==========================================

const heroDiv = document.querySelector('.hero');
const statusGroup = document.createElement('div');
statusGroup.className = 'status-wrapper';

statusGroup.innerHTML = `
  <div class="status-card">
    <span>🛰️​ Servidores</span>
    <h3 id="servidores-real">50+</h3>
  </div>
  <div class="status-card">
    <span>👥 Membros Online</span>
    <h3 id="membros-real">...</h3>
  </div>
  <div class="status-card">
    <span>⚡ Status</span>
    <h3><span class="online-indicator"></span>Online</h3>
  </div>
`;

if(heroDiv) {
    heroDiv.appendChild(statusGroup);
}

async function atualizarDadosKosmika() {
    const SEU_GUILD_ID = "931659654369513542"; 
    
    try {
        const response = await fetch(`https://discord.com/api/guilds/${SEU_GUILD_ID}/widget.json`);
        const data = await response.json();

        if (data && data.presence_count !== undefined) {
            // O Widget mostra os ONLINE. 
            document.getElementById('membros-real').innerText = data.presence_count;
        }
    } catch (err) {
        console.log("Erro na API, usando valor padrão.");
        document.getElementById('membros-real').innerText = "150+";
    }
}

atualizarDadosKosmika();
setInterval(atualizarDadosKosmika, 30000);

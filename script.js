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
    
    // 150 Estrelas de fundo (Poeira estelar lenta)
    for (let i = 0; i < 150; i++) {
        particles.push(new Star());
    }

    // Começamos com apenas 1 nave e 1 buraco negro (Raridade)
    specialElements.push(new SpecialObject('ship'));
    specialElements.push(new SpecialObject('blackhole'));
}

class Star {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.3; // Estrelas um pouco menores e mais finas
        this.color = ['#5865F2', '#9b59ff', '#ffffff'][Math.floor(Math.random() * 3)];
        
        // VELOCIDADE REDUZIDA: Agora elas flutuam bem devagar
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

        // Interação suave com o mouse
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
            let force = (mouse.radius - distance) / mouse.radius;
            this.x -= (dx / distance) * force * 1.5; // Correnteza mais suave
            this.y -= (dy / distance) * force * 1.5;
        }

        // Teletransporte de borda
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }
}

class SpecialObject {
    constructor(type) {
        this.type = type;
        this.reset();
    }
    reset() {
        // Agora eles podem demorar mais para reaparecer
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        
        // VELOCIDADE DOS ESPECIAIS: Também reduzida para não ser frenético
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
            ctx.beginPath();
            ctx.moveTo(12, 0);
            ctx.lineTo(-8, -6);
            ctx.lineTo(-8, 6);
            ctx.closePath();
            ctx.fill();
        } else {
            // Buraco Negro com aura roxa profunda
            let grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
            grad.addColorStop(0.1, '#000');
            grad.addColorStop(0.8, '#9b59ff33'); // Mais transparente/raro
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#9b59ff';
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Ao sair da tela, eles esperam um pouco antes de voltar (simula raridade)
        if (this.x < -100 || this.x > canvas.width + 100 || 
            this.y < -100 || this.y > canvas.height + 100) {
            
            // 0.5% de chance de reaparecer a cada frame após sair
            if (Math.random() < 0.005) {
                this.reset();
                // Garante que reapareça nas bordas
                if (Math.random() > 0.5) {
                    this.x = Math.random() > 0.5 ? -50 : canvas.width + 50;
                } else {
                    this.y = Math.random() > 0.5 ? -50 : canvas.height + 50;
                }
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

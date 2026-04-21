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
    
    // Estrelas de fundo (Poeira estelar)
    for (let i = 0; i < 150; i++) {
        particles.push(new Star());
    }
}

class Star {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.color = ['#5865F2', '#9b59ff', '#ffffff'][Math.floor(Math.random() * 3)];
        this.speedX = (Math.random() - 0.5) * 0.5; // Movimento constante lento
        this.speedY = (Math.random() - 0.5) * 0.5;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
    update() {
        // Movimento natural
        this.x += this.speedX;
        this.y += this.speedY;

        // Interação com mouse (Correnteza)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
            let force = (mouse.radius - distance) / mouse.radius;
            this.x -= (dx / distance) * force * 2;
            this.y -= (dy / distance) * force * 2;
        }

        // Reposicionar se sair da tela
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
}

class SpecialObject {
    constructor(type) {
        this.type = type; // 'ship' ou 'blackhole'
        this.reset();
    }
    reset() {
        this.x = -100;
        this.y = Math.random() * canvas.height;
        this.speedX = this.type === 'ship' ? Math.random() * 2 + 1 : 0.2;
        this.size = this.type === 'ship' ? 15 : 40;
        this.active = true;
    }
    draw() {
        if (this.type === 'ship') {
            // Desenho simples de uma nave (triângulo neon)
            ctx.fillStyle = '#00d4ff';
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - 20, this.y - 10);
            ctx.lineTo(this.x - 20, this.y + 10);
            ctx.closePath();
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00d4ff';
            ctx.fill();
        } else {
            // Buraco Negro (Círculo escuro com aura roxa)
            let grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            grad.addColorStop(0.2, '#000');
            grad.addColorStop(0.8, '#9b59ff');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.shadowBlur = 0; // Reseta brilho para não poluir
    }
    update() {
        this.x += this.speedX;
        if (this.x > canvas.width + 100) this.reset();
    }
}

// Criar naves e buracos negros
const ship = new SpecialObject('ship');
const blackHole = new SpecialObject('blackhole');

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    ship.update();
    ship.draw();

    blackHole.update();
    blackHole.draw();

    requestAnimationFrame(animate);
}

init();
animate();
window.addEventListener('resize', init);

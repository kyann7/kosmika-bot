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
    
    // 150 Estrelas de fundo
    for (let i = 0; i < 150; i++) {
        particles.push(new Star());
    }

    // Criando 3 naves e 2 buracos negros para começar
    for (let i = 0; i < 3; i++) specialElements.push(new SpecialObject('ship'));
    for (let i = 0; i < 2; i++) specialElements.push(new SpecialObject('blackhole'));
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
        // Movimento em qualquer direção
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
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
            this.x -= (dx / distance) * force * 3;
            this.y -= (dy / distance) * force * 3;
        }

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
        // Começa em bordas aleatórias
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        
        // Velocidade aleatória para QUALQUER direção
        this.speedX = (Math.random() - 0.5) * (this.type === 'ship' ? 3 : 1);
        this.speedY = (Math.random() - 0.5) * (this.type === 'ship' ? 3 : 1);
        
        this.size = this.type === 'ship' ? 12 : 35;
        this.angle = Math.atan2(this.speedY, this.speedX); // Direção para onde a nave aponta
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        if (this.type === 'ship') {
            ctx.rotate(this.angle); // A nave aponta para onde ela anda
            ctx.fillStyle = '#00d4ff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00d4ff';
            ctx.beginPath();
            ctx.moveTo(15, 0);
            ctx.lineTo(-10, -8);
            ctx.lineTo(-10, 8);
            ctx.closePath();
            ctx.fill();
        } else {
            // Buraco Negro pulsante
            let grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
            grad.addColorStop(0.1, '#000');
            grad.addColorStop(0.7, '#9b59ff');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.shadowBlur = 20;
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

        // Atravessa as bordas e volta do outro lado
        if (this.x < -50) this.x = canvas.width + 50;
        if (this.x > canvas.width + 50) this.x = -50;
        if (this.y < -50) this.y = canvas.height + 50;
        if (this.y > canvas.height + 50) this.y = -50;
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

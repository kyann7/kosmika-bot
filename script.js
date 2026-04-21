const canvas = document.getElementById('space');
const ctx = canvas.getContext('2d');

let particles = [];
const mouse = {
    x: null,
    y: null,
    radius: 150 // Área de influência do mouse
};

// Captura movimento do mouse
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    
    // Criamos 150 elementos espaciais
    for (let i = 0; i < 150; i++) {
        let size = Math.random() * 3 + 1;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        
        // Cores: Azul Discord, Roxo Neon e Branco Estelar
        let colors = ['#5865F2', '#9b59ff', '#ffffff', '#00d4ff'];
        let color = colors[Math.floor(Math.random() * colors.length)];
        
        particles.push(new Particle(x, y, size, color));
    }
}

class Particle {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.baseX = x; // Posição original para onde ela sempre volta
        this.baseY = y;
        this.density = (Math.random() * 30) + 2; // "Peso" para a correnteza
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        
        // Adiciona um leve brilho neon aos elementos maiores
        if(this.size > 2) {
            ctx.shadowBlur = 8;
            ctx.shadowColor = this.color;
        }
    }

    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            // Efeito de Correnteza: Empurra a partícula para longe
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let force = (mouse.radius - distance) / mouse.radius;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;
            
            this.x -= directionX;
            this.y -= directionY;
        } else {
            // Retorno suave à posição de origem
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 20;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 20;
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
    }
    requestAnimationFrame(animate);
}

// Inicialização e Redimensionamento
init();
animate();
window.addEventListener('resize', () => {
    init();
});

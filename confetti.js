// Simple confetti effect
// Based on a simplified version of canvas-confetti

// Canvas setup
const confettiCanvas = document.createElement('canvas');
confettiCanvas.id = 'confetti-canvas';
confettiCanvas.style.position = 'fixed';
confettiCanvas.style.top = '0';
confettiCanvas.style.left = '0';
confettiCanvas.style.width = '100%';
confettiCanvas.style.height = '100%';
confettiCanvas.style.pointerEvents = 'none';
confettiCanvas.style.zIndex = '9999';
document.body.appendChild(confettiCanvas);

const ctx = confettiCanvas.getContext('2d');
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

// Confetti particles
const particles = [];
const colors = [
  '#4361ee', // primary blue
  '#4cc9f0', // light blue
  '#7b68ee', // purple
  '#f72585', // pink
  '#4ade80', // green
];

// Update canvas size on resize
window.addEventListener('resize', () => {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
});

// Particle class
class Particle {
  constructor() {
    this.x = Math.random() * confettiCanvas.width;
    this.y = Math.random() * confettiCanvas.height - confettiCanvas.height;
    this.size = Math.random() * 10 + 5;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.speed = Math.random() * 5 + 2;
    this.angle = Math.random() * 360;
    this.rotation = Math.random() * 90;
    this.rotationSpeed = Math.random() * 2 - 1;
    this.shape = Math.random() > 0.5 ? 'circle' : 'rect';
  }

  update() {
    this.y += this.speed;
    this.rotation += this.rotationSpeed;
    
    // Add some horizontal drift
    this.x += Math.sin(this.angle * Math.PI / 180) * 0.5;
    
    // Reset particle if it goes off-screen
    if (this.y > confettiCanvas.height) {
      this.y = -this.size;
      this.x = Math.random() * confettiCanvas.width;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.fillStyle = this.color;
    
    if (this.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    }
    
    ctx.restore();
  }
}

// Animation variables
let animationId = null;
let isConfettiActive = false;

// Animation loop
function animate() {
  if (!isConfettiActive) return;
  
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });
  
  animationId = requestAnimationFrame(animate);
}

// Start confetti
function startConfetti() {
  isConfettiActive = true;
  
  // Create particles
  particles.length = 0; // Clear existing particles
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }
  
  // Start animation if not already running
  if (!animationId) {
    animate();
  }
}

// Stop confetti
function stopConfetti() {
  isConfettiActive = false;
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  cancelAnimationFrame(animationId);
  animationId = null;
}
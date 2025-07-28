// === Popup management ===
function closePopups() {
  document.querySelectorAll('.popup-section').forEach(section => {
    section.classList.remove('active');
  });
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const targetId = link.getAttribute('data-target');
    closePopups();
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.classList.add('active');
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// === Neuronal animated background ===
const canvas = document.getElementById('neural-bg');
const ctx = canvas.getContext('2d');

let width, height;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
window.addEventListener('resize', resize);
resize();

// --- Nodes ---
class Node {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.radius = 1.5 + Math.random() * 2;
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(88, 166, 255, 0.8)';
    ctx.shadowColor = '#58a6ff';
    ctx.shadowBlur = 10;
    ctx.fill();
  }
}

// --- Lines between nodes ---
function drawLines(nodes) {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        ctx.strokeStyle = `rgba(88, 166, 255, ${1 - dist / 140})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.shadowColor = '#58a6ff';
        ctx.shadowBlur = 8;
        ctx.stroke();
      }
    }
  }
}

// --- Pulse circles ---
class PulseCircle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = 5 + Math.random() * 15;
    this.alpha = 0.4;
    this.growing = true;
  }

  animate() {
    if (this.growing) {
      this.alpha += 0.008;
      if (this.alpha >= 0.7) this.growing = false;
    } else {
      this.alpha -= 0.008;
      if (this.alpha <= 0.4) this.growing = true;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(88, 166, 255, ${this.alpha})`;
    ctx.shadowColor = '#58a6ff';
    ctx.shadowBlur = 15;
    ctx.fill();
  }
}

// --- Sparks ---
class Spark {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = 1 + Math.random() * 1.5;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.alpha = 1;
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;

    this.alpha -= 0.005;
    if (this.alpha < 0) this.alpha = 1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 220, 255, ${this.alpha})`;
    ctx.fill();
  }
}

// --- Init animation ---
let nodes = [];
let pulses = [];
let sparks = [];

function init() {
  nodes = [];
  pulses = [];
  sparks = [];

  const nodeCount = Math.floor((width * height) / 12000);

  for (let i = 0; i < nodeCount; i++) {
    nodes.push(new Node());
  }
  for (let i = 0; i < 20; i++) {
    pulses.push(new PulseCircle());
  }
  for (let i = 0; i < 40; i++) {
    sparks.push(new Spark());
  }
}

init();

// --- Animation Loop ---
function animate() {
  ctx.clearRect(0, 0, width, height);

  // Background gradient
  let gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
  gradient.addColorStop(0, '#0d1117');
  gradient.addColorStop(1, '#161b22');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Animate sparkles
  sparks.forEach(spark => {
    spark.move();
    spark.draw();
  });

  // Animate pulsing
  pulses.forEach(pulse => {
    pulse.animate();
    pulse.draw();
  });

  // Animate nodes
  nodes.forEach(node => {
    node.move();
    node.draw();
  });

  // Draw neuron lines
  drawLines(nodes);

  requestAnimationFrame(animate);
}

animate();

// Resize handler
window.addEventListener('resize', () => {
  resize();
  init();
});

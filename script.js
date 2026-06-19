// script.js - Premium Interactive Personal Portfolio Behaviors

// 1. Typewriter Animation Helper
function runTypewriter(el, text) {
  el.textContent = "";
  let i = 0;
  if (el.typewriterInterval) {
    clearInterval(el.typewriterInterval);
  }
  
  el.typewriterInterval = setInterval(() => {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(el.typewriterInterval);
    }
  }, 75);
}

// 2. Language Toggle & Initialization
function updateLanguage(lang) {
  document.documentElement.setAttribute('data-lang', lang);
  localStorage.setItem('portfolio-lang', lang);

  // Update active state on language toggle button UI
  const btnEn = document.querySelector('#lang-toggle .lang-en');
  const btnZh = document.querySelector('#lang-toggle .lang-zh');
  if (btnEn && btnZh) {
    if (lang === 'en') {
      btnEn.classList.add('active');
      btnZh.classList.remove('active');
      document.title = "Lei Zhou | Portfolio";
    } else {
      btnZh.classList.add('active');
      btnEn.classList.remove('active');
      document.title = "周磊 | 个人作品集";
    }
  }

  // Target the hero typewriter element specifically
  const heroLabel = document.querySelector('.hero-card .mono-label');

  // Update text content for elements with data-en/data-zh attributes
  document.querySelectorAll('[data-en][data-zh]').forEach(el => {
    const translation = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-zh');
    
    if (el === heroLabel) {
      runTypewriter(el, translation);
    } else {
      el.textContent = translation;
    }
  });

  // Reset client detail text back to current language default
  const detailText = document.querySelector('.client-detail-text');
  if (detailText) {
    const defaultText = lang === 'en' ? detailText.getAttribute('data-en') : detailText.getAttribute('data-zh');
    detailText.textContent = defaultText;
  }
}

// Initialize Language & Interactive Animations on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('portfolio-lang') || 'en';
  updateLanguage(savedLang);

  // Setup language toggle click listener
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-lang') || 'en';
      const next = current === 'en' ? 'zh' : 'en';
      updateLanguage(next);
    });
  }

  // 3. Mouse Tracking Glow & 3D Tilt Effects
  const cards = document.querySelectorAll('.bento-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate 3D perspective rotation (Only for desktop viewports)
      if (window.innerWidth > 768) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = -(y - centerY) / (rect.height / 15); // Max ~4 degrees tilt
        const rotateY = (x - centerX) / (rect.width / 15);
        
        card.style.transform = `perspective(1000px) translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      } else {
        card.style.transform = 'translateY(-4px)';
      }
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) translateY(0) rotateX(0) rotateY(0)';
    });
  });

  // 4. Client List Interactive Tooltips
  const clientItems = document.querySelectorAll('.client-list li');
  const detailText = document.querySelector('.client-detail-text');
  if (detailText && clientItems.length > 0) {
    clientItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        const lang = document.documentElement.getAttribute('data-lang') || 'en';
        const tooltip = lang === 'en' ? item.getAttribute('data-tooltip-en') : item.getAttribute('data-tooltip-zh');
        detailText.textContent = tooltip;
        detailText.style.color = 'var(--color-eng-accent)';
      });

      item.addEventListener('mouseleave', () => {
        const lang = document.documentElement.getAttribute('data-lang') || 'en';
        const defaultText = lang === 'en' ? detailText.getAttribute('data-en') : detailText.getAttribute('data-zh');
        detailText.textContent = defaultText;
        detailText.style.color = '';
      });
    });
  }

  // 5. Scroll Reveal Animation (Progressive Enhancement)
  cards.forEach(card => {
    card.setAttribute('data-reveal', '');
  });

  const revealElements = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.04,
    rootMargin: '0px 0px -20px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 6. Smooth Anchor Scrolling for All Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#')) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          
          const headerOffset = 90;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // 7. Initialize Tech-style Dynamic Canvas Background
  initBgCanvas();
});

// 7. Tech-style Dynamic Line Background (Canvas Particle System)
function initBgCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Set particle density based on screen size
  const maxParticles = width < 768 ? 35 : 85;
  const connectionDist = 120;
  
  // Track mouse position
  let mouse = { x: null, y: null, radius: 150 };
  
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off walls
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(37, 99, 235, 0.45)'; // dynamic engineering blue dots
      ctx.fill();
    }
  }

  function setup() {
    particles = [];
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw background blueprint-like grid lines for tech look
    const gridSize = 40;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(37, 99, 235, 0.03)'; // subtle grid in blue
    ctx.lineWidth = 0.8;
    for (let x = 0; x < width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Update and draw particles
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    // Connect particles with lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDist) {
          const alpha = (1 - dist / connectionDist) * 0.18; // increased visibility
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Connect to mouse if close
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const alpha = (1 - dist / mouse.radius) * 0.3; // increased visibility for interaction
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(236, 72, 153, ${alpha})`; // pink accent interaction
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  setup();
  animate();
}

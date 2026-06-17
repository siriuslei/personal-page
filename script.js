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

  // 6. Smooth Anchor Scrolling for Navbar Links
  document.querySelectorAll('.nav-links a').forEach(anchor => {
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
});

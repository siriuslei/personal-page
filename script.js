// script.js - Premium Interactive Personal Portfolio Behaviors

// 1. Language Toggle & Initialization
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

  // Update text content for elements with data-en/data-zh attributes
  document.querySelectorAll('[data-en][data-zh]').forEach(el => {
    const translation = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-zh');
    
    // For elements with HTML markup inside, or normal text
    if (el.classList.contains('mono-label') && !translation.startsWith('> ') && !translation.startsWith('// ')) {
      el.textContent = translation;
    } else {
      el.textContent = translation;
    }
  });
}

// Initialize Language on DOM Content Loaded
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

  // 2. Mouse Tracking Glow Effects
  const cards = document.querySelectorAll('.bento-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 3. Scroll Reveal Animation (Progressive Enhancement)
  // Dynamically add data-reveal attribute to bento cards for animation entry
  cards.forEach(card => {
    card.setAttribute('data-reveal', '');
  });

  const revealElements = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger reveal of cards visible on viewport entry
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.06,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 4. Smooth Anchor Scrolling for Navbar Links
  document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#')) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          
          // Calculate header offset for precise scrolling placement
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

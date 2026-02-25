/* ======================================================
   CHEVROLET CAMARO — Dynamic Scroll & Interaction Engine
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── References ──
  const hero = document.querySelector('.hero');
  const heroBgImg = document.getElementById('heroBgImg');
  const heroCar = document.getElementById('heroCar');
  const heroBrand = document.getElementById('heroBrand');
  const heroNav = document.getElementById('heroNav');
  const navToggle = document.getElementById('navToggle');
  const playBtn = document.getElementById('playBtn');
  const contactForm = document.getElementById('contactForm');
  const fileInput = document.getElementById('formFile');
  const uploadStatus = document.getElementById('uploadStatus');
  const submitBtn = document.getElementById('submitBtn');
  const scrollRevealEls = document.querySelectorAll('.scroll-reveal');

  // ── Hero loaded animation (zoom out bg) ──
  requestAnimationFrame(() => {
    setTimeout(() => {
      hero.classList.add('loaded');
    }, 100);
  });


  // ── Mobile Nav Toggle ──
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      heroNav.classList.toggle('active');
    });
  }

  // Close nav when clicking link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navToggle) navToggle.classList.remove('active');
      if (heroNav) heroNav.classList.remove('active');
    });
  });


  // ── Parallax on Scroll ──
  function handleParallax() {
    const scrollY = window.scrollY;
    const heroH = window.innerHeight;

    if (scrollY < heroH && heroCar) {
      const progress = scrollY / heroH;

      // Car: move up, scale down, fade
      const carY = progress * 100;
      const carScale = 1 - progress * 0.2;
      const carOpacity = 1 - progress * 0.7;
      heroCar.style.transform = `translateY(${-carY}px) scale(${carScale}) rotate(${-1 + progress * 3}deg)`;
      heroCar.style.opacity = carOpacity;

      // Brand text: parallax up slower
      if (heroBrand) {
        heroBrand.style.transform = `translateY(${-scrollY * 0.3}px)`;
      }

      // Background: subtle zoom on scroll
      if (heroBgImg) {
        const bgScale = 1 + progress * 0.08;
        heroBgImg.style.transform = `scale(${bgScale})`;
      }
    }
  }


  // ── Scroll Reveal (Intersection Observer) ──
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay) || 0;

        setTimeout(() => {
          el.classList.add('revealed');
        }, delay);

        revealObserver.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  scrollRevealEls.forEach(el => revealObserver.observe(el));


  // ── Feature Cards: tilt on hover (mouse 3D effect) ──
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `
                translateY(-4px)
                perspective(600px)
                rotateX(${-y * 6}deg)
                rotateY(${x * 6}deg)
            `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) perspective(600px) rotateX(0deg) rotateY(0deg)';
    });
  });


  // ── Video Card: play button interaction ──
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      // Pulse animation feedback
      playBtn.style.transform = 'translate(-50%, -50%) scale(0.9)';
      setTimeout(() => {
        playBtn.style.transform = 'translate(-50%, -50%) scale(1)';
      }, 150);
      // User will add video functionality here
    });
  }


  // ── File Upload ──
  if (fileInput && uploadStatus) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        uploadStatus.textContent = fileInput.files[0].name;
        uploadStatus.style.color = '#ccc';
      } else {
        uploadStatus.textContent = 'No file chosen';
        uploadStatus.style.color = '';
      }
    });
  }


  // ── Form Submit ──
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Button feedback
      submitBtn.innerHTML = '<span>SENT ✓</span>';
      submitBtn.style.borderColor = 'rgba(100, 200, 100, 0.5)';
      submitBtn.style.color = '#8f8';
      submitBtn.disabled = true;

      // Reset after 3s
      setTimeout(() => {
        submitBtn.innerHTML = '<span>SUBMIT REQUEST</span>';
        submitBtn.style.borderColor = '';
        submitBtn.style.color = '';
        submitBtn.disabled = false;
        contactForm.reset();
        uploadStatus.textContent = 'No file chosen';
        uploadStatus.style.color = '';
      }, 3000);
    });
  }


  // ── Smooth Scroll for Anchors ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });


  // ── Throttled Scroll Handler ──
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });


  // ── Mouse-follow Glow on Hero ──
  const heroOverlay = document.querySelector('.hero-overlay');

  document.addEventListener('mousemove', (e) => {
    if (window.scrollY > window.innerHeight) return; // only in hero viewport

    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;

    if (heroOverlay) {
      heroOverlay.style.background = `
                radial-gradient(circle at ${x}% ${y}%,
                    rgba(255, 255, 255, 0.02) 0%,
                    transparent 40%),
                linear-gradient(to bottom,
                    rgba(0, 0, 0, 0.4) 0%,
                    rgba(0, 0, 0, 0.15) 40%,
                    rgba(0, 0, 0, 0.3) 70%,
                    rgba(10, 10, 10, 1) 100%),
                linear-gradient(to right,
                    rgba(0, 0, 0, 0.5) 0%,
                    transparent 50%)
            `;
    }
  });


  // ── Initial state ──
  handleParallax();

});
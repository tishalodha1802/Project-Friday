// ==========================================================================
// Project Friday — Core Site Interactions
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // ── 0. Hero Animated Notion-Style Pill Cycling ──
  const heroPill = document.getElementById('heroPill');
  const heroPillWord = document.getElementById('heroPillWord');
  
  if (heroPill && heroPillWord) {
    const states = [
      { word: 'Build', class: 'hero-pill--build' },
      { word: 'Deploy', class: 'hero-pill--ship' },
      { word: 'Automate', class: 'hero-pill--create' },
      { word: 'Scale', class: 'hero-pill--scale' }
    ];
    let currentIndex = 0;

    setInterval(() => {
      currentIndex = (currentIndex + 1) % states.length;
      const nextState = states[currentIndex];

      // Smooth exit
      heroPillWord.style.opacity = '0';
      heroPillWord.style.transform = 'translateY(-6px)';

      setTimeout(() => {
        states.forEach(s => heroPill.classList.remove(s.class));
        heroPill.classList.add(nextState.class);
        heroPillWord.textContent = nextState.word;
        heroPillWord.style.transform = 'translateY(6px)';

        requestAnimationFrame(() => {
          heroPillWord.style.opacity = '1';
          heroPillWord.style.transform = 'translateY(0)';
        });
      }, 200);
    }, 2800);
  }

  // ── 1. Services Accordion Logic ──
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('.accordion-icon');
      const isOpen = content.style.display === 'block';

      // Close all accordion panels
      document.querySelectorAll('.accordion-content').forEach(c => {
        c.style.display = 'none';
      });
      document.querySelectorAll('.accordion-header .accordion-icon').forEach(i => {
        i.innerHTML = '&#709;'; // arrow down
      });

      // If it wasn't open, open it
      if (!isOpen) {
        content.style.display = 'block';
        if (icon) icon.innerHTML = '&#708;'; // arrow up
      }
    });
  });

  // Open the first accordion item by default
  if (accordionHeaders.length > 0) {
    const firstContent = accordionHeaders[0].nextElementSibling;
    const firstIcon = accordionHeaders[0].querySelector('.accordion-icon');
    if (firstContent) firstContent.style.display = 'block';
    if (firstIcon) firstIcon.innerHTML = '&#708;';
  }

  // ── 2. WhatsApp Inquiry Submission ──
  const form = document.querySelector('.contact-form');
  const targetPhone = '917665941949'; // Your WhatsApp Number

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn ? btn.textContent : 'Send WhatsApp Inquiry';

      const firstName = document.getElementById('firstName')?.value.trim() || '';
      const lastName = document.getElementById('lastName')?.value.trim() || '';
      const fullName = `${firstName} ${lastName}`.trim();
      const email = document.getElementById('email')?.value.trim() || '';
      const phone = document.getElementById('phone')?.value.trim() || 'Not specified';
      const orgName = document.getElementById('orgName')?.value.trim() || 'Not specified';
      const role = document.getElementById('role')?.value.trim() || 'Not specified';
      const service = document.getElementById('service')?.value || 'General Inquiry';
      const message = document.getElementById('message')?.value.trim() || '';

      // Collect checked sources
      const checkedSources = Array.from(document.querySelectorAll('input[name="source"]:checked'))
        .map(cb => cb.value);
      const heardVia = checkedSources.length > 0 ? checkedSources.join(', ') : 'Not specified';

      // Format structured WhatsApp message
      const text = `*New Project Friday Inquiry*\n` +
        `--------------------------------\n` +
        `👤 *Name:* ${fullName}\n` +
        `📧 *Email:* ${email}\n` +
        `📞 *Phone:* ${phone}\n` +
        `🏫 *Organization / School:* ${orgName}\n` +
        `💼 *Role / Title:* ${role}\n` +
        `🎯 *Service Needed:* ${service}\n` +
        `🔍 *Heard Via:* ${heardVia}\n` +
        `--------------------------------\n` +
        `📝 *Project Details:*\n${message}`;

      const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;

      if (btn) {
        btn.textContent = 'Opening WhatsApp...';
        btn.disabled = true;
      }

      // Launch WhatsApp
      window.open(whatsappUrl, '_blank');

      setTimeout(() => {
        form.reset();
        if (btn) {
          btn.textContent = originalText;
          btn.disabled = false;
        }
      }, 3500);
    });
  }

  // ── 3. Navbar scroll elevation ──
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    });
  }

  // ── 4. Mobile Navigation Menu Toggle ──
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta, .nav-cta-btn, .nav-secondary-link');

  if (navToggle && navMenu) {
    const toggleMenu = (open) => {
      const willOpen = typeof open === 'boolean' ? open : !navMenu.classList.contains('is-open');
      navMenu.classList.toggle('is-open', willOpen);
      navToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    };

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('is-open') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        toggleMenu(false);
        navToggle.focus();
      }
    });
  }

  // ── 4. HD Image Lightbox Modal ──
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const modalClose = document.getElementById('modalClose');
  const clickableImages = document.querySelectorAll('.window-screenshot, .spotlight-img');

  clickableImages.forEach(img => {
    img.addEventListener('click', () => {
      if (modal && modalImg) {
        modalImg.src = img.src;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // ── 5. Hero Video Play/Pause on Click ──
  const heroVideo = document.getElementById('heroErpVideo');
  if (heroVideo) {
    heroVideo.style.cursor = 'pointer';
    heroVideo.addEventListener('click', () => {
      if (heroVideo.paused) {
        heroVideo.play();
      } else {
        heroVideo.pause();
      }
    });
  }

  // ── 6. Light / Dark Theme Mode Toggle ──
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const updateThemeState = (theme) => {
      const isDark = theme === 'dark';
      themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      themeToggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    };

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateThemeState(currentTheme);

    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const targetTheme = isDark ? 'light' : 'dark';
      if (targetTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      try {
        localStorage.setItem('pf_theme', targetTheme);
      } catch (err) {}
      updateThemeState(targetTheme);
    });
  }

  // ── 7. 3D Project Card Slider with Interactive Hover Tilt ──
  const sliderStage = document.getElementById('projectSliderStage');
  const sliderTrack = document.getElementById('projectSliderTrack');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dotsContainer = document.getElementById('sliderDots');
  const filterTabs = document.querySelectorAll('.slider-tab');

  if (sliderStage && sliderTrack) {
    const allCards = Array.from(sliderTrack.querySelectorAll('.slider-card'));
    let filteredCards = [...allCards];
    let currentIndex = 0;

    const updateSlider = () => {
      filteredCards.forEach((card, i) => {
        card.classList.remove('is-active', 'is-prev', 'is-next', 'is-hidden-left', 'is-hidden-right');
        card.style.display = 'flex';
        card.style.removeProperty('--tilt-x');
        card.style.removeProperty('--tilt-y');

        if (i === currentIndex) {
          card.classList.add('is-active');
        } else if (i === currentIndex - 1 || (currentIndex === 0 && i === filteredCards.length - 1 && filteredCards.length > 2)) {
          card.classList.add('is-prev');
        } else if (i === currentIndex + 1 || (currentIndex === filteredCards.length - 1 && i === 0 && filteredCards.length > 2)) {
          card.classList.add('is-next');
        } else if (i < currentIndex) {
          card.classList.add('is-hidden-left');
        } else {
          card.classList.add('is-hidden-right');
        }
      });

      // Update dots
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        filteredCards.forEach((_, i) => {
          const dot = document.createElement('button');
          dot.className = `slider-dot ${i === currentIndex ? 'is-active' : ''}`;
          dot.setAttribute('type', 'button');
          dot.setAttribute('aria-label', `Go to project ${i + 1}`);
          dot.addEventListener('click', () => {
            currentIndex = i;
            updateSlider();
          });
          dotsContainer.appendChild(dot);
        });
      }
    };

    const goTo = (index) => {
      currentIndex = (index + filteredCards.length) % filteredCards.length;
      updateSlider();
    };

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    // Clicking prev/next side cards directly slides to them
    sliderTrack.addEventListener('click', (e) => {
      const card = e.target.closest('.slider-card');
      if (!card) return;
      if (card.classList.contains('is-prev')) {
        goTo(currentIndex - 1);
      } else if (card.classList.contains('is-next')) {
        goTo(currentIndex + 1);
      }
    });

    // Category filter tabs
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');

        const filter = tab.getAttribute('data-filter');
        allCards.forEach(c => c.style.display = 'none');

        if (filter === 'all') {
          filteredCards = [...allCards];
        } else {
          filteredCards = allCards.filter(c => c.getAttribute('data-category') === filter);
        }

        currentIndex = 0;
        updateSlider();
      });
    });

    // Hash navigation listener (header links: Websites, Web Apps, Apps)
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'websites' || hash === 'webapps' || hash === 'apps') {
        const matchingTab = document.querySelector(`.slider-tab[data-filter="${hash}"]`);
        if (matchingTab) {
          matchingTab.click();
        }
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();

    // 3D Interactive Mouse Tilt on Active Card
    sliderStage.addEventListener('mousemove', (e) => {
      const activeCard = sliderTrack.querySelector('.slider-card.is-active');
      if (!activeCard) return;
      const rect = activeCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((y - centerY) / centerY) * -6;
      const tiltY = ((x - centerX) / centerX) * 8;
      activeCard.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
      activeCard.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    });

    sliderStage.addEventListener('mouseleave', () => {
      const activeCard = sliderTrack.querySelector('.slider-card.is-active');
      if (activeCard) {
        activeCard.style.setProperty('--tilt-x', '0deg');
        activeCard.style.setProperty('--tilt-y', '0deg');
      }
    });

    // Touch Swipe support
    let touchStartX = 0;
    sliderStage.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    sliderStage.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 45) {
        if (diff > 0) goTo(currentIndex + 1);
        else goTo(currentIndex - 1);
      }
    }, { passive: true });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
      if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
      if (e.key === 'ArrowRight') goTo(currentIndex + 1);
    });

    // Initial setup
    updateSlider();
  }
});

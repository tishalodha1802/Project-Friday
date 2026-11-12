// ==========================================================================
// Project Friday — Core Site Interactions
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // ── Opening Logo Intro Overlay ──
  const siteIntro = document.getElementById('siteIntro');
  if (siteIntro) {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      siteIntro.classList.add('is-done');
    } else {
      setTimeout(() => {
        siteIntro.classList.add('is-leaving');
      }, 950);
      setTimeout(() => {
        siteIntro.classList.add('is-done');
      }, 1450);
    }
  }

  // ── 0. Hero Notion-Style Rotating Verbs Pill ──
  const heroPill = document.getElementById('heroPill');
  const heroPillFrame = document.getElementById('heroPillFrame');
  let heroPillWord = document.getElementById('heroPillWord');
  
  if (heroPill && heroPillFrame && heroPillWord) {
    const states = [
      { word: 'Build', class: 'hero-pill--build' },
      { word: 'Deploy', class: 'hero-pill--ship' },
      { word: 'Automate', class: 'hero-pill--create' },
      { word: 'Scale', class: 'hero-pill--scale' }
    ];
    let currentIndex = 0;
    let isTransitioning = false;

    // Set initial frame width to match initial word
    heroPillFrame.style.inlineSize = `${heroPillWord.offsetWidth}px`;

    const cycleNext = () => {
      if (document.hidden || isTransitioning) return;
      isTransitioning = true;

      currentIndex = (currentIndex + 1) % states.length;
      const nextState = states[currentIndex];
      const currentEl = heroPillWord;

      // Create incoming word element
      const nextEl = document.createElement('span');
      nextEl.className = 'hero-pill-word';
      nextEl.textContent = nextState.word;
      nextEl.style.position = 'absolute';
      nextEl.style.left = '0';
      nextEl.style.top = '0';
      nextEl.style.transform = 'translateY(100%)';
      nextEl.style.opacity = '0';
      nextEl.style.pointerEvents = 'none';

      heroPillFrame.appendChild(nextEl);

      // Measure incoming word width
      const nextWidth = nextEl.offsetWidth;

      // Lock current width first to ensure clean transition
      heroPillFrame.style.inlineSize = `${currentEl.offsetWidth}px`;
      void heroPillFrame.offsetWidth;

      // Smoothly expand/contract frame width
      heroPillFrame.style.inlineSize = `${nextWidth}px`;

      // Update pill theme class (CSS transitions background-color & dot over var(--dur-mid))
      states.forEach(s => heroPill.classList.remove(s.class));
      heroPill.classList.add(nextState.class);

      // Trigger animation for outgoing and incoming words
      void nextEl.offsetWidth;
      currentEl.style.transform = 'translateY(-100%)';
      currentEl.style.opacity = '0';
      nextEl.style.transform = 'translateY(0)';
      nextEl.style.opacity = '1';

      setTimeout(() => {
        currentEl.remove();
        nextEl.style.position = '';
        nextEl.style.left = '';
        nextEl.style.top = '';
        nextEl.style.transform = '';
        nextEl.style.opacity = '';
        nextEl.style.pointerEvents = '';
        nextEl.id = 'heroPillWord';
        heroPillWord = nextEl;
        isTransitioning = false;
      }, 340);
    };

    setInterval(cycleNext, 2600);
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

  // ── 2. Contact Form Submission (Web3Forms to uditya@projectfriday.in) ──
  const form = document.getElementById('contactForm') || document.querySelector('.contact-form');
  const targetPhone = '917665941949';

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const statusEl = document.getElementById('formStatus');
      const originalText = 'Send Inquiry';

      const firstName = document.getElementById('firstName')?.value.trim() || '';
      const lastName = document.getElementById('lastName')?.value.trim() || '';
      const fullName = `${firstName} ${lastName}`.trim();
      const email = document.getElementById('email')?.value.trim() || '';
      const phone = document.getElementById('phone')?.value.trim() || 'Not specified';
      const orgName = document.getElementById('orgName')?.value.trim() || 'Not specified';
      const role = document.getElementById('role')?.value.trim() || 'Not specified';
      const service = document.getElementById('service')?.value || 'General Inquiry';
      const message = document.getElementById('message')?.value.trim() || '';

      const checkedSources = Array.from(document.querySelectorAll('input[name="source"]:checked'))
        .map(cb => cb.value);
      const heardVia = checkedSources.length > 0 ? checkedSources.join(', ') : 'Not specified';

      // WhatsApp fallback text
      const waText = `*New Project Friday Inquiry*\n` +
        `--------------------------------\n` +
        `👤 *Name:* ${fullName}\n` +
        `📧 *Email:* ${email}\n` +
        `📞 *Phone:* ${phone}\n` +
        `🏫 *Organization:* ${orgName}\n` +
        `💼 *Role:* ${role}\n` +
        `🎯 *Service:* ${service}\n` +
        `🔍 *Heard Via:* ${heardVia}\n` +
        `--------------------------------\n` +
        `📝 *Details:*\n${message}`;
      const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waText)}`;

      if (btn) {
        btn.textContent = 'Sending Inquiry...';
        btn.disabled = true;
      }
      if (statusEl) {
        statusEl.className = 'form-status';
        statusEl.style.display = 'none';
        statusEl.innerHTML = '';
      }

      const payload = {
        access_key: '2b77447a-99a2-4935-a906-05b444314856',
        subject: `New Project Inquiry from ${fullName || 'Website Lead'}`,
        from_name: 'Project Friday Website',
        name: fullName,
        email: email,
        phone: phone,
        organization: orgName,
        role: role,
        service: service,
        heard_via: heardVia,
        message: message
      };

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          if (btn) {
            btn.textContent = '✓ Message Sent to Email';
          }
          if (statusEl) {
            statusEl.className = 'form-status is-success';
            statusEl.style.display = 'block';
            statusEl.innerHTML = `Thank you! Your inquiry has been delivered directly to <strong>uditya@projectfriday.in</strong>.<br><span style="margin-top: 6px; display: inline-block;">Need an instant reply? <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; font-weight: 600;">Chat on WhatsApp &rarr;</a></span>`;
          }
          form.reset();
          setTimeout(() => {
            if (btn) {
              btn.textContent = originalText;
              btn.disabled = false;
            }
          }, 5000);
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        if (btn) {
          btn.textContent = originalText;
          btn.disabled = false;
        }
        if (statusEl) {
          statusEl.className = 'form-status is-error';
          statusEl.style.display = 'block';
          statusEl.innerHTML = `Could not deliver email right now. Please try again or <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; font-weight: 600;">message us on WhatsApp &rarr;</a>`;
        }
      }
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

  // ── 7. Featured Projects Vertical Slideshow (2 Slides / Pane) ──
  const vslideshowTrack = document.getElementById('vslideshowTrack');
  const vslidePrev = document.getElementById('vslidePrev');
  const vslideNext = document.getElementById('vslideNext');
  const vslideToggle = document.getElementById('vslideToggle');
  const vslideIndicators = document.getElementById('vslideIndicators');
  const filterBtns = document.querySelectorAll('.project-filter');
  const vslideshowStage = document.getElementById('vslideshowStage');

  if (vslideshowTrack) {
    const allPanes = Array.from(vslideshowTrack.querySelectorAll('.vslide-pane'));
    let activePanes = [...allPanes];
    let currentIndex = 0;
    let autoInterval = null;
    let isPaused = false;
    let isTransitioning = false;

    const updateIndicators = () => {
      if (!vslideIndicators) return;
      vslideIndicators.innerHTML = '';
      if (activePanes.length <= 1) return;
      activePanes.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = `vslide-dot ${i === currentIndex ? 'is-active' : ''}`;
        dot.setAttribute('type', 'button');
        dot.setAttribute('aria-label', `Go to slide pair ${i + 1}`);
        dot.addEventListener('click', () => {
          if (i !== currentIndex && !isTransitioning) {
            goTo(i, i > currentIndex ? 'next' : 'prev');
          }
        });
        vslideIndicators.appendChild(dot);
      });
    };

    const goTo = (targetIdx, direction = 'next') => {
      if (isTransitioning || activePanes.length <= 1) return;
      isTransitioning = true;

      const prevIdx = currentIndex;
      currentIndex = (targetIdx + activePanes.length) % activePanes.length;

      const currentPane = activePanes[prevIdx];
      const nextPane = activePanes[currentIndex];

      activePanes.forEach(p => {
        p.classList.remove('is-active', 'is-leaving', 'is-leaving-prev', 'is-entering-prev');
      });

      if (direction === 'next') {
        currentPane.classList.add('is-leaving');
        nextPane.classList.add('is-active');
      } else {
        currentPane.classList.add('is-leaving-prev');
        nextPane.classList.add('is-entering-prev');
        void nextPane.offsetWidth;
        nextPane.classList.remove('is-entering-prev');
        nextPane.classList.add('is-active');
      }

      updateIndicators();

      setTimeout(() => {
        currentPane.classList.remove('is-leaving', 'is-leaving-prev');
        isTransitioning = false;
      }, 700);
    };

    const startAutoPlay = () => {
      stopAutoPlay();
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (activePanes.length > 1 && !isPaused) {
        autoInterval = setInterval(() => {
          goTo(currentIndex + 1, 'next');
        }, 4500);
      }
    };

    const stopAutoPlay = () => {
      if (autoInterval) {
        clearInterval(autoInterval);
        autoInterval = null;
      }
    };

    if (vslidePrev) vslidePrev.addEventListener('click', () => goTo(currentIndex - 1, 'prev'));
    if (vslideNext) vslideNext.addEventListener('click', () => goTo(currentIndex + 1, 'next'));

    if (vslideToggle) {
      vslideToggle.addEventListener('click', () => {
        isPaused = !isPaused;
        const pauseIcon = vslideToggle.querySelector('.vslide-icon--pause');
        const playIcon = vslideToggle.querySelector('.vslide-icon--play');
        if (isPaused) {
          stopAutoPlay();
          vslideToggle.setAttribute('aria-label', 'Play slideshow');
          if (pauseIcon) pauseIcon.style.display = 'none';
          if (playIcon) playIcon.style.display = 'inline-block';
        } else {
          startAutoPlay();
          vslideToggle.setAttribute('aria-label', 'Pause slideshow');
          if (pauseIcon) pauseIcon.style.display = 'inline-block';
          if (playIcon) playIcon.style.display = 'none';
        }
      });
    }

    if (vslideshowStage) {
      vslideshowStage.addEventListener('mouseenter', stopAutoPlay);
      vslideshowStage.addEventListener('mouseleave', () => { if (!isPaused) startAutoPlay(); });
      vslideshowStage.addEventListener('focusin', stopAutoPlay);
      vslideshowStage.addEventListener('focusout', () => { if (!isPaused) startAutoPlay(); });

      // Vertical swipe support
      let touchStartY = 0;
      vslideshowStage.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      vslideshowStage.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diffY = touchStartY - touchEndY;
        if (Math.abs(diffY) > 40) {
          if (diffY > 0) goTo(currentIndex + 1, 'next');
          else goTo(currentIndex - 1, 'prev');
        }
      }, { passive: true });
    }

    // Category Filter Buttons
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        filterBtns.forEach(b => {
          const matches = b.getAttribute('data-filter') === filter;
          b.classList.toggle('is-active', matches);
          b.setAttribute('aria-selected', matches ? 'true' : 'false');
        });

        allPanes.forEach(pane => {
          const cards = Array.from(pane.querySelectorAll('.work-card'));
          const matchingCards = cards.filter(c => filter === 'all' || c.getAttribute('data-category') === filter);
          cards.forEach(c => {
            c.style.display = (filter === 'all' || c.getAttribute('data-category') === filter) ? '' : 'none';
          });
          pane.style.display = matchingCards.length > 0 ? '' : 'none';
        });

        activePanes = allPanes.filter(p => p.style.display !== 'none');
        currentIndex = 0;

        activePanes.forEach((p, idx) => {
          p.classList.remove('is-active', 'is-leaving', 'is-leaving-prev');
          if (idx === 0) p.classList.add('is-active');
        });

        updateIndicators();
        startAutoPlay();
      });
    });

    // Hash navigation listener (header links: Websites, Web Apps, Apps)
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['websites', 'webapps', 'apps'].includes(hash)) {
        const matchingBtn = document.querySelector(`.project-filter[data-filter="${hash}"]`);
        if (matchingBtn) matchingBtn.click();
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();

    // Initial setup
    updateIndicators();
    startAutoPlay();
  }

  // ── 8. General Scroll-Reveal Observer for Sections ──
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if (revealElements.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }
});

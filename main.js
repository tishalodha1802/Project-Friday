// ==========================================================================
// Project Friday — Core Site Interactions
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
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
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');

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
});

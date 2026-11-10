// ==========================================================================
// Project Friday — Core Site Interactions
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // ── 1. Services Accordion Logic ──
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('.icon');
      const isOpen = content.style.display === 'block';

      // Close all accordion panels
      document.querySelectorAll('.accordion-content').forEach(c => {
        c.style.display = 'none';
      });
      document.querySelectorAll('.accordion-header .icon').forEach(i => {
        i.innerHTML = '&#709;'; // arrow down
      });

      // If it wasn't open, open it
      if (!isOpen) {
        content.style.display = 'block';
        icon.innerHTML = '&#708;'; // arrow up
      }
    });
  });

  // Open the first accordion item by default
  if (accordionHeaders.length > 0) {
    const firstContent = accordionHeaders[0].nextElementSibling;
    const firstIcon = accordionHeaders[0].querySelector('.icon');
    if (firstContent) firstContent.style.display = 'block';
    if (firstIcon) firstIcon.innerHTML = '&#708;';
  }

  // ── 2. WhatsApp Inquiry Submission ──
  const form = document.querySelector('.contact-form');
  const targetPhone = '917665941949'; // Your WhatsApp Number

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.submit-btn');
      const originalText = btn.textContent;

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

      btn.textContent = '✓ Opening WhatsApp...';
      btn.style.background = '#25d366';
      btn.style.color = '#ffffff';

      // Launch WhatsApp
      window.open(whatsappUrl, '_blank');

      setTimeout(() => {
        form.reset();
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
      }, 3500);
    });
  }

  // ── 3. Navbar scroll elevation ──
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)';
      navbar.style.borderBottomColor = 'transparent';
    } else {
      navbar.style.boxShadow = 'none';
      navbar.style.borderBottomColor = 'rgba(0, 0, 0, 0.06)';
    }
  });

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
});

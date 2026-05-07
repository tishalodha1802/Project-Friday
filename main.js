const gallery = document.getElementById('gallery');
const images = ['proj1.png', 'proj2.png', 'proj3.png', 'proj4.png', 'proj5.png', 'proj6.jpg', 'proj7.jpg', 'proj8.jpg', 'proj9.jpg', 'proj10.jpg', 'proj11.jpg', 'proj12.jpg', 'proj13.jpg'];
const numItems = 28; // Number of scattered frames

const itemsData = [];

for (let i = 0; i < numItems; i++) {
  const img = document.createElement('img');
  img.src = images[i % images.length];
  img.className = 'gallery-item';

  // Randomize size to match the scattered aesthetic
  const size = 60 + Math.random() * 50; // 60px to 110px
  img.style.width = `${size}px`;
  img.style.height = `${size}px`;

  gallery.appendChild(img);

  // Scatter perfectly by using random angle and random radius
  // Keep them away from the immediate center (where text is)
  const angle = Math.random() * Math.PI * 2;
  const radius = 250 + Math.random() * (Math.max(window.innerWidth, window.innerHeight) / 1.2);

  // Each frame has a static rotation to look messy and scattered
  const baseRotation = (Math.random() - 0.5) * 120; 
  
  // Parallax depth for mouse interaction
  const depth = Math.random() * 2 + 0.5;

  itemsData.push({
    el: img,
    angle: angle,
    radius: radius,
    baseRotation: baseRotation,
    depth: depth,
    hoverScale: 1
  });

  // Handle hover effect
  img.addEventListener('mouseenter', () => {
    itemsData[i].hoverScale = 1.15;
  });
  img.addEventListener('mouseleave', () => {
    itemsData[i].hoverScale = 1;
  });
}

const speed = 0.0008; // Very slow global rotation speed

// Parallax target variables
let mouseX = 0;
let mouseY = 0;
let currentMouseX = 0;
let currentMouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) - 0.5;
  mouseY = (e.clientY / window.innerHeight) - 0.5;
});

function animate() {
  // Smooth out mouse movement
  currentMouseX += (mouseX - currentMouseX) * 0.05;
  currentMouseY += (mouseY - currentMouseY) * 0.05;

  itemsData.forEach(data => {
    // 1. "Running in circle slowly" - increment the angle
    data.angle += speed;

    // Calculate base position (orbiting the center)
    const orbitX = Math.cos(data.angle) * data.radius;
    const orbitY = Math.sin(data.angle) * data.radius;

    // 2. Add mouse parallax effect on top
    const parallaxX = currentMouseX * data.depth * -80;
    const parallaxY = currentMouseY * data.depth * -80;

    // Final position
    const finalX = orbitX + parallaxX;
    const finalY = orbitY + parallaxY;

    data.el.style.transform = `translate(calc(-50% + ${finalX}px), calc(-50% + ${finalY}px)) rotate(${data.baseRotation}deg) scale(${data.hoverScale})`;
  });

  requestAnimationFrame(animate);
}

// Start animation
animate();

// Form submission prevent default
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.submit-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    setTimeout(() => {
        btn.textContent = 'Message Sent!';
        btn.style.background = '#d4af37'; // gold color for success
        btn.style.color = '#fff';
        form.reset();
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '#111';
          btn.style.color = '#fff';
        }, 3000);
    }, 1500);
  });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.mixBlendMode = 'normal';
    navbar.style.background = 'rgba(255,255,255,0.9)';
    navbar.style.color = '#111';
    navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
    navbar.querySelectorAll('a').forEach(a => a.style.color = '#111');
  } else {
    navbar.style.mixBlendMode = 'difference';
    navbar.style.background = 'transparent';
    navbar.style.color = '#fff';
    navbar.style.boxShadow = 'none';
    navbar.querySelectorAll('a').forEach(a => a.style.color = '#fff');
  }
});

// Accordion logic
const accordionHeaders = document.querySelectorAll('.accordion-header');
accordionHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const content = header.nextElementSibling;
    const icon = header.querySelector('.icon');
    
    // Toggle current
    if (content.style.display === 'block') {
      content.style.display = 'none';
      icon.innerHTML = '&#709;'; // arrow down
    } else {
      // Close all others
      document.querySelectorAll('.accordion-content').forEach(c => c.style.display = 'none');
      document.querySelectorAll('.accordion-header .icon').forEach(i => i.innerHTML = '&#709;');
      
      content.style.display = 'block';
      icon.innerHTML = '&#708;'; // arrow up
    }
  });
});

/* ============================================
   DJ SRI — Vedhaa's Events | Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // === CUSTOM CURSOR ===
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');

  if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    // Ensure cursor is hidden initially to prevent flashing at 0,0
    cursorDot.style.opacity = '0';
    cursorOutline.style.opacity = '0';

    window.addEventListener('mousemove', (e) => {
      cursorDot.style.opacity = '1';
      cursorOutline.style.opacity = '1';
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const animateCursor = () => {
      let distX = mouseX - outlineX;
      let distY = mouseY - outlineY;
      
      outlineX = outlineX + (distX * 0.15);
      outlineY = outlineY + (distY * 0.15);
      
      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;
      
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const addHoverLinks = () => {
      const interactives = document.querySelectorAll('a, button, .gallery-item, input, select, textarea');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover-state'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover-state'));
      });
    };
    addHoverLinks();
    
    // Call addHoverLinks again after dynamic content or setup if needed
    setTimeout(addHoverLinks, 1000); 
  }

  // === 3D CARD TILT EFFECT ===
  const cards = document.querySelectorAll('.service-card, .testimonial-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });

  // === NAVBAR SCROLL EFFECT ===
  const navbar = document.getElementById('navbar');
  
  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleNavScroll);

  // === HAMBURGER MENU ===
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // === SMOOTH SCROLLING ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPos = target.offsetTop - navHeight;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  // === SCROLL ANIMATIONS (Intersection Observer) ===
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
    observer.observe(el);
  });

  // === COUNTER ANIMATION ===
  const counters = document.querySelectorAll('.hero-stat-number[data-count]');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current) + '+';
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + '+';
        }
      };

      updateCounter();
    });
  };

  // Trigger counter when hero section is visible
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(animateCounters, 1500);
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) heroObserver.observe(heroStats);

  // === HERO PARTICLE CANVAS ===
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = this.getRandomColor();
      }

      getRandomColor() {
        const colors = [
          'rgba(181, 55, 242,',   // purple
          'rgba(233, 30, 140,',   // pink
          'rgba(0, 240, 255,',    // cyan
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.fill();
      }
    }

    // Initialize particles
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.15;
            ctx.strokeStyle = `rgba(181, 55, 242, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      connectParticles();
      animationId = requestAnimationFrame(animateParticles);
    };

    animateParticles();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      cancelAnimationFrame(animationId);
    });
  }

  // === GALLERY LIGHTBOX ===
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxVideo = document.getElementById('lightboxVideo');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleryGrid = document.getElementById('galleryGrid');
  
  let currentMediaIndex = 0;
  let galleryMedia = []; // Array of objects: { type: 'image'|'video', src: '...' }

  const updateGalleryData = () => {
    const items = document.querySelectorAll('.gallery-item');
    galleryMedia = Array.from(items).map(item => ({
      type: item.getAttribute('data-type') || 'image',
      src: item.getAttribute('data-src') || item.querySelector('img').src,
      title: item.querySelector('h4')?.textContent || '',
      desc: item.querySelector('p')?.textContent || ''
    }));

    // Add click events to items
    items.forEach((item, index) => {
      // Remove old listeners if any (simple way is to clone and replace, but here we just re-add)
      item.onclick = () => {
        currentMediaIndex = index;
        openLightbox();
      };
    });
  };

  // Initial update
  updateGalleryData();

  const openLightbox = () => {
    const media = galleryMedia[currentMediaIndex];
    if (!media) return;

    // Reset media
    lightboxImg.style.display = 'none';
    lightboxVideo.style.display = 'none';
    lightboxVideo.pause();
    lightboxVideo.src = '';

    if (media.type === 'video') {
      lightbox.className = 'lightbox active mode-video';
      lightboxVideo.src = media.src;
      lightboxVideo.style.display = 'block';
      lightboxVideo.play().catch(e => console.log("Auto-play blocked"));
    } else {
      lightbox.className = 'lightbox active mode-image';
      lightboxImg.src = media.src;
      lightboxImg.style.display = 'block';
    }

    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightboxVideo.pause();
    lightboxVideo.src = '';
    document.body.style.overflow = '';
  };

  lightboxClose.addEventListener('click', closeLightbox);
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === document.querySelector('.lightbox-content-wrapper')) {
      closeLightbox();
    }
  });

  const navigateLightbox = (direction) => {
    if (galleryMedia.length === 0) return;
    currentMediaIndex = (currentMediaIndex + direction + galleryMedia.length) % galleryMedia.length;
    openLightbox();
  };

  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(-1);
  });

  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(1);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // Export refresh function for dynamic updates
  window.refreshGallery = updateGalleryData;

  // === TESTIMONIALS CAROUSEL ===
  const track = document.getElementById('testimonialTrack');
  const dots = document.querySelectorAll('.testimonial-dot');
  let currentSlide = 0;
  let autoPlayInterval;

  const goToSlide = (index) => {
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    dots.forEach(d => d.classList.remove('active'));
    dots[currentSlide].classList.add('active');
  };

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.getAttribute('data-index')));
      resetAutoPlay();
    });
  });

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % dots.length);
  };

  const startAutoPlay = () => {
    autoPlayInterval = setInterval(nextSlide, 5000);
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  };

  startAutoPlay();

  // Pause on hover
  const carousel = document.querySelector('.testimonial-carousel');
  carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
  carousel.addEventListener('mouseleave', startAutoPlay);

  // === CONTACT FORM ===
  const bookingForm = document.getElementById('bookingForm');
  const submitBtn = document.getElementById('submitBtn');

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData);
    
    // Simple validation
    if (!data.name || !data.phone || !data.eventType || !data.eventDate) {
      showNotification('Please fill in all required fields!', 'error');
      return;
    }

    // Simulate form submission
    submitBtn.innerHTML = '<span>⏳</span> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = '<span>✅</span> Request Sent!';
      submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      
      showNotification('Booking request sent successfully! DJ SRI will contact you soon. 🎧', 'success');
      
      bookingForm.reset();

      setTimeout(() => {
        submitBtn.innerHTML = '<span>🚀</span> Send Booking Request';
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);
    }, 1500);
  });

  // === NOTIFICATION SYSTEM ===
  const showNotification = (message, type = 'success') => {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span class="notification-icon">${type === 'success' ? '✅' : '⚠️'}</span>
      <span>${message}</span>
      <button class="notification-close" onclick="this.parentElement.remove()">✕</button>
    `;

    // Notification styles
    Object.assign(notification.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      padding: '16px 24px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: '3000',
      animation: 'fadeInUp 0.5s ease',
      fontSize: '0.95rem',
      maxWidth: '400px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      fontFamily: "'Inter', sans-serif"
    });

    if (type === 'success') {
      notification.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))';
      notification.style.border = '1px solid rgba(16, 185, 129, 0.3)';
      notification.style.color = '#6ee7b7';
    } else {
      notification.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(234, 88, 12, 0.15))';
      notification.style.border = '1px solid rgba(245, 158, 11, 0.3)';
      notification.style.color = '#fbbf24';
    }

    const closeBtn = notification.querySelector('.notification-close');
    Object.assign(closeBtn.style, {
      background: 'none',
      border: 'none',
      color: 'inherit',
      cursor: 'pointer',
      fontSize: '1rem',
      padding: '4px',
      opacity: '0.7'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'fadeIn 0.3s ease reverse';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  };

  // === ACTIVE NAV LINK ON SCROLL ===
  const sections = document.querySelectorAll('section[id]');
  
  const highlightNav = () => {
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      
      if (link && scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-links a').forEach(a => a.style.color = '');
        if (!link.classList.contains('nav-cta')) {
          link.style.color = '#fff';
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNav);

  // === PARALLAX SUBTLE EFFECT ON HERO ===
  window.addEventListener('scroll', () => {
    const heroContent = document.querySelector('.hero-content');
    const scrolled = window.scrollY;
    if (heroContent && scrolled < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
      heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
    }
  });

});

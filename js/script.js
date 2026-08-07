/* ==========================================================================
   Zenith Medicraft - ES6 Vanilla JavaScript Interactive Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Preloader Fade Out ---
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('loaded');
      }, 500);
    });
    // Fallback timer if load takes too long
    setTimeout(() => {
      if (!preloader.classList.contains('loaded')) {
        preloader.classList.add('loaded');
      }
    }, 2500);
  }

  // --- 2. Scroll Progress Bar & Sticky Navbar ---
  const navbar = document.querySelector('.navbar');
  const progressBar = document.querySelector('.scroll-progress-bar');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (navbar) {
      if (scrollTop > 50) {
        navbar.classList.add('scrolled');
        navbar.classList.remove('transparent');
      } else {
        navbar.classList.remove('scrolled');
        navbar.classList.add('transparent');
      }
    }

    if (backToTopBtn) {
      if (scrollTop > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 3. Active Nav Link on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  window.addEventListener('scroll', () => {
    let currentSection = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // --- 4. Mobile Menu Navigation ---
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  }

  if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', toggleMobileMenu);
  mobileNavLinks.forEach(link => link.addEventListener('click', toggleMobileMenu));

  // --- 5. Scroll Reveal Observer ---
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-zoom');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 6. Stats Counter Animation ---
  const counterElements = document.querySelectorAll('.stat-number');
  let animatedCounters = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedCounters) {
        animatedCounters = true;
        counterElements.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const duration = 2000;
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.innerText = target + (counter.getAttribute('data-suffix') || '');
              clearInterval(timer);
            } else {
              counter.innerText = Math.floor(current) + (counter.getAttribute('data-suffix') || '');
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.getElementById('statsSection');
  if (statsSection) counterObserver.observe(statsSection);

  // --- 7. Product Tab Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --- 8. Product Quick Spec View Modal ---
  const modalOverlay = document.getElementById('quickViewModal');
  const modalTitle = document.getElementById('modalProductTitle');
  const modalDesc = document.getElementById('modalProductDesc');
  const modalSpecs = document.getElementById('modalProductSpecs');
  const modalImage = document.getElementById('modalProductImage');
  const modalBrochureLink = document.getElementById('modalBrochureBtn');
  const closeModalBtns = document.querySelectorAll('.modal-close, .modal-close-btn');

  const productData = {
    '1': {
      title: 'MEDWORLD ETO Sterilizer',
      desc: 'Advanced Ethylene Oxide Gas Sterilizer designed for safe, highly efficient, and reliable low-temperature sterilization of heat- and moisture-sensitive medical equipment in compliance with ISO 11135.',
      specs: [
        'Chamber Volume: 100L - 1000L custom configurations',
        'Microprocessor Controlled Touchscreen Interface',
        'Automatic Aeration Cycle & Exhaust Gas Scrubber Integration',
        'Dual Temperature Sensor Safety Locks',
        'Full Stainless Steel 316L Chamber Construction'
      ],
      image: 'images/eto-sterilizer.jpg',
      brochure: 'brochures/MEDWORLD BROCHURE 01-1 (1).pdf'
    },
    '2': {
      title: 'PlaZen Plasma Sterilizer',
      desc: 'State-of-the-art Hydrogen Peroxide Low-Temperature Plasma Sterilizer providing non-toxic, rapid sterilization (25-45 mins) for complex lumened laparoscopic and endoscopic surgical instruments.',
      specs: [
        'Low Operating Temperature (<55°C)',
        'Rapid 28-Minute Fast Sterilization Cycle',
        'Environmentally Friendly: Water Vapor & Oxygen Byproducts Only',
        '7-inch Color Touch Panel with Real-time Diagnostics',
        'Compatible with Complex Flexible & Rigid Endoscopes'
      ],
      image: 'images/plasma-sterilizer.jpg',
      brochure: 'brochures/PlaZen MEDWORLD_New-1 (1).pdf'
    },
    '3': {
      title: 'MEDILAP 250 MDD+',
      desc: 'High-performance 250W Electro Surgical Generator suitable for precise monopolar cut, monopolar coag, and bipolar procedures in general surgery, gynecology, and orthopedics.',
      specs: [
        '250 Watts Maximum Power Output',
        'Pure Cut, Blend Cut, Fulguration & Desiccation Modes',
        'Bipolar Micro & Macro Coagulation Settings',
        'REMs Neutral Electrode Safety Patient Contact Monitoring',
        'Microcontroller Output Stabilization'
      ],
      image: 'images/medilap-250.jpg',
      brochure: 'brochures/MEDILAP 250 MDD+ (1) (1).pdf'
    },
    '4': {
      title: 'MEDILAP 400 DEXTER',
      desc: 'Heavy-duty 400W Electro Surgical Generator featuring advanced bipolar & monopolar operating modes for major open surgeries and endoscopic procedures.',
      specs: [
        '400 Watts Power Output with Instant Tissue Feedback',
        'Programmable User Memory Presets (Up to 99 Surgical Profiles)',
        'Endo-Cut Mode for Precise Endoscopic Polypectomy & Papillotomy',
        'Automatic Power Adjustment Based on Impedance',
        'Foot Pedal and Hand Switch Dual Activation'
      ],
      image: 'images/medilap-400-dexter.jpg',
      brochure: 'brochures/ELECTRO SURGICAL UNIT 400 DEXTER.pdf'
    },
    '5': {
      title: 'MEDILAP 400 MAESTRO',
      desc: 'Flagship Touchscreen-Enabled 400W Electro Surgical Unit featuring tissue-sensing technology, integrated vessel sealing, and laparoscopic compatibility.',
      specs: [
        'High-Resolution Smart Touchscreen Interface',
        'Intelligent Tissue-Sensing Vessel Sealing up to 7mm',
        'Simultaneous Monopolar Output for Two Surgeons',
        'Saline Resection Mode for Urology & TURP Procedures',
        'Integrated Error Log & Remote Diagnostic Module'
      ],
      image: 'images/medilap-400-maestro.jpg',
      brochure: 'brochures/ELECTRO SURGICAL UNIT 400 MAESTRO.pdf'
    },
    '6': {
      title: 'MEDIRAY-05+ Phototherapy',
      desc: 'Single Surface LED Phototherapy System engineered specifically for hyperbilirubinemia / neonatal jaundice treatment with high irradiance blue LED light.',
      specs: [
        'High Intensity Blue LED Spectrum (450nm - 470nm peak)',
        'Zero UV and IR Radiation to Ensure Neonatal Safety',
        'Built-in Treatment Timer & Cumulative Hour Meter',
        'Height Adjustable Cart with 360° Tilting Light Head',
        'Low Power Consumption (<45W) & Silent Fanless Design'
      ],
      image: 'images/phototherapy-mediray.jpg',
      brochure: 'brochures/PHOTO THERAPY (MEDIRAY -05+).pdf'
    },
    '7': {
      title: 'Ultrasonic Cleaner',
      desc: 'High-efficiency ultrasonic cleaning system designed for CSSD applications, delivering powerful cavitation-based cleaning for surgical instruments and accessories.',
      specs: [
        '23 / 33 KHz Variable Frequency',
        'Microcontroller-Based Auto Tuning with Overload Protection',
        'Durable MOSFET/IGBT Generator Technology',
        'Deep Cavitation Cleaning for Microscopic Crevices',
        'Stainless Steel Cleaning Tank with Safety Controls'
      ],
      image: 'images/ultrasonic cleaner.png',
      brochure: '#contact'
    },
    '8': {
      title: 'NOT-5600 Surgical Table',
      desc: 'Professional & reliable electrically operated multi-purpose surgical table designed for superior patient positioning, excellent C-arm accessibility, and maximum stability across a wide range of surgical procedures.',
      specs: [
        'Electrically Powered Tabletop with ergonomic hand controller',
        '300 mm Powered Longitudinal Slide for complete C-arm access',
        '26° Trendelenburg & Reverse Trendelenburg positions',
        '21° Left & Right Lateral Tilt for flexible patient positioning',
        'Flex & Reflex Positioning with adjustable head, back, and split leg sections',
        'Maximum Patient Weight Capacity of 360 kg',
        'Optional Automatic Tabletop Leveling for one-touch horizontal return',
        'Optional Carbon Fiber Orthopedic Extension for fluoroscopic imaging',
        'Optional Built-in Kidney Bridge for thoracic & renal procedures',
        'Backup Battery with Automatic AC/DC Switchover',
        'Auxiliary Emergency Control Panel',
        'Central Floor Locking Mechanism with foot pedal',
        'Heavy-Duty Swivel Casters for smooth transport'
      ],
      image: 'images/operatio theatre tables.jpeg',
      brochure: '#contact'
    }
  };

  const learnMoreBtns = document.querySelectorAll('.btn-learn-more');
  learnMoreBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = btn.getAttribute('data-product-id');
      const data = productData[productId];
      if (data && modalOverlay) {
        modalTitle.innerText = data.title;
        modalDesc.innerText = data.desc;
        modalImage.src = data.image;
        modalBrochureLink.href = data.brochure;

        modalSpecs.innerHTML = '';
        data.specs.forEach(spec => {
          const li = document.createElement('li');
          li.innerText = spec;
          modalSpecs.appendChild(li);
        });

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modalOverlay) modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // --- 9. Testimonial Slider ---
  const testimonials = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;

  function showSlide(index) {
    testimonials.forEach((t, i) => {
      t.classList.remove('active');
      if (dots[i]) dots[i].classList.remove('active');
    });
    testimonials[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    currentSlide = index;
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.getAttribute('data-slide'), 10);
      showSlide(slideIndex);
    });
  });

  // Auto advance slide every 5 seconds
  setInterval(() => {
    if (testimonials.length > 0) {
      let nextIndex = (currentSlide + 1) % testimonials.length;
      showSlide(nextIndex);
    }
  }, 5000);

  // --- 10. FAQ Accordion ---
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const parent = header.parentElement;
      const isActive = parent.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      if (!isActive) {
        parent.classList.add('active');
      }
    });
  });

  // --- 11. Button Ripple Effect ---
  const rippleBtns = document.querySelectorAll('.btn');

  rippleBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // --- 12. Form Submission Handling & Live Validation ---
  const enquiryForm = document.getElementById('enquiryForm');
  const modalEnquiryForm = document.getElementById('modalEnquiryForm');

  function handleFormSubmit(form) {
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('[name="name"]');
      const emailInput = form.querySelector('[name="email"]');
      const phoneInput = form.querySelector('[name="phone"]');

      if (!nameInput.value.trim()) {
        alert('Please enter your full name.');
        nameInput.focus();
        return;
      }

      if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
        alert('Please enter a valid email address.');
        emailInput.focus();
        return;
      }

      if (!phoneInput.value.trim()) {
        alert('Please enter your contact phone number.');
        phoneInput.focus();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Sending Request...';
      submitBtn.disabled = true;

      setTimeout(() => {
        alert('Thank you for contacting Zenith Medicraft. Our biomedical team will reach out to you within 24 hours!');
        form.reset();
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        if (quoteModal) quoteModal.classList.remove('active');
        document.body.style.overflow = '';
      }, 1200);
    });
  }

  handleFormSubmit(enquiryForm);
  handleFormSubmit(modalEnquiryForm);

  // --- 13. Dynamic Typing Effect for Hero ---
  const typingElement = document.getElementById('typingText');
  if (typingElement) {
    const phrases = [
      'Where Precision Meets Care',
      'Advanced Biomedical Equipment',
      'Turnkey Hospital Solutions',
      '24/7 Dedicated Technical Support'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
      }

      setTimeout(type, typeSpeed);
    }

    type();
  }
});

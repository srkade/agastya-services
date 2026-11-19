/**
 * Agastya Services - Interactive Script
 * Adaptive Dual Theme (Corporate Light / Deep Dark), Mobile Optimizations & Canvas
 * Leadership: Milan Chaudhari
 * Contact: milan.ch@agastyaservicehub.com | +91-8983575960
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initHeroCanvas();
  initScrollAnimations();
  initCounterStats();
  initNavbarScroll();
  initMobileMenu();
  initRoleTabs();
  initSalaryCalculator();
  initModals();
  initContactForms();
  initClipboardButtons();
});

/* ==========================================================================
   1. THEME SWITCHER (Light Corporate <-> Dark Executive)
   ========================================================================== */
let redrawCanvasColors = null;

function initThemeToggle() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const htmlEl = document.documentElement;

  // Retrieve saved theme or default to light
  const savedTheme = localStorage.getItem('agastya-theme') || 'light';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    if (theme === 'dark') {
      htmlEl.classList.add('dark');
      htmlEl.classList.remove('light');
    } else {
      htmlEl.classList.remove('dark');
      htmlEl.classList.add('light');
    }
    localStorage.setItem('agastya-theme', theme);
    updateToggleIcons(theme);

    if (typeof redrawCanvasColors === 'function') {
      redrawCanvasColors();
    }
  }

  function updateToggleIcons(theme) {
    toggleBtns.forEach((btn) => {
      const sunIcon = btn.querySelector('.theme-icon-sun');
      const moonIcon = btn.querySelector('.theme-icon-moon');
      const labelText = btn.querySelector('.theme-toggle-label');

      if (theme === 'dark') {
        if (sunIcon) sunIcon.classList.remove('hidden');
        if (moonIcon) moonIcon.classList.add('hidden');
        if (labelText) labelText.textContent = 'Light Mode';
        btn.setAttribute('title', 'Switch to Light Mode');
      } else {
        if (sunIcon) sunIcon.classList.add('hidden');
        if (moonIcon) moonIcon.classList.remove('hidden');
        if (labelText) labelText.textContent = 'Dark Mode';
        btn.setAttribute('title', 'Switch to Dark Mode');
      }
    });
  }

  toggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isDark = htmlEl.classList.contains('dark');
      applyTheme(isDark ? 'light' : 'dark');
    });
  });
}

/* ==========================================================================
   2. HERO CONSTELLATION CANVAS (Mobile & Dual-Theme Optimized)
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 32 : Math.min(Math.floor((width * height) / 13000), 75);
  const maxDistance = isMobile ? 95 : 125;

  let mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });

  if (!isMobile) {
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });
  }

  function getPalette() {
    const isDark = document.documentElement.classList.contains('dark');
    return isDark
      ? ['#ff6b00', '#ff8533', '#0260cb', '#3b82f6', '#ffffff']
      : ['#ff6b00', '#ea580c', '#002147', '#0260cb', '#cbd5e1'];
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * (isMobile ? 0.45 : 0.7);
      this.vy = (Math.random() - 0.5) * (isMobile ? 0.45 : 0.7);
      this.radius = Math.random() * 2 + 1.2;
      this.paletteIndex = Math.floor(Math.random() * 5);
      this.color = getPalette()[this.paletteIndex];
      this.isOrange = this.paletteIndex <= 1;
    }

    refreshColor() {
      this.color = getPalette()[this.paletteIndex];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (!isMobile && mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2.2;
          this.y -= (dy / dist) * force * 2.2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  redrawCanvasColors = () => {
    particles.forEach((p) => p.refreshColor());
  };

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.classList.contains('dark');

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const opacity = (1 - dist / maxDistance) * (isDark ? 0.35 : 0.22);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);

          if (particles[i].isOrange || particles[j].isOrange) {
            ctx.strokeStyle = `rgba(255, 107, 0, ${opacity})`;
          } else {
            ctx.strokeStyle = isDark
              ? `rgba(2, 96, 203, ${opacity})`
              : `rgba(0, 33, 71, ${opacity * 0.9})`;
          }
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-init');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -25px 0px' }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   4. ANIMATED COUNTERS
   ========================================================================== */
function initCounterStats() {
  const counterElements = document.querySelectorAll('[data-counter-target]');
  if (!counterElements.length) return;

  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-counter-target'), 10);
          const duration = 1600;
          const stepTime = 25;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.innerText = target.toLocaleString() + (el.getAttribute('data-counter-suffix') || '');
              clearInterval(timer);
            } else {
              el.innerText = Math.floor(current).toLocaleString() + (el.getAttribute('data-counter-suffix') || '');
            }
          }, stepTime);

          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.3 }
  );

  counterElements.forEach((el) => counterObserver.observe(el));
}

/* ==========================================================================
   5. NAVBAR SCROLL EFFECT
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('mainNav');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add(
        'bg-white/95',
        'dark:bg-[#050c18]/95',
        'backdrop-blur-md',
        'shadow-md',
        'border-b',
        'border-slate-200/80',
        'dark:border-[#0f274a]'
      );
      navbar.classList.remove('bg-transparent', 'border-transparent');
    } else {
      navbar.classList.remove(
        'bg-white/95',
        'dark:bg-[#050c18]/95',
        'shadow-md',
        'border-slate-200/80',
        'dark:border-[#0f274a]'
      );
      navbar.classList.add('bg-transparent', 'border-transparent');
    }
  });
}

/* ==========================================================================
   6. MOBILE MENU & TOUCH ERGONOMICS
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const closeBtn = document.getElementById('closeMobileMenu');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    drawer.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.add('translate-x-full');
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================================================
   7. ROLE TABS SYSTEM (WITH MOBILE AUTO-SCROLL)
   ========================================================================== */
function initRoleTabs() {
  const tabButtons = document.querySelectorAll('.role-tab-btn');
  const tabPanes = document.querySelectorAll('.role-tab-pane');

  if (!tabButtons.length) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab-target');

      // Update button states
      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Smooth scroll active tab button into center view on mobile devices
      if (window.innerWidth < 640) {
        btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }

      // Update tab pane visibility
      tabPanes.forEach((pane) => {
        if (pane.id === targetId) {
          pane.classList.remove('hidden');
          pane.classList.add('animate-fadeIn');
        } else {
          pane.classList.add('hidden');
          pane.classList.remove('animate-fadeIn');
        }
      });
    });
  });
}

/* ==========================================================================
   8. INTERACTIVE MANPOWER & COST ESTIMATOR
   ========================================================================== */
function initSalaryCalculator() {
  const countSlider = document.getElementById('calcHeadcount');
  const roleSelect = document.getElementById('calcRoleType');
  const modelSelect = document.getElementById('calcHiringModel');

  const countDisplay = document.getElementById('calcCountVal');
  const turnaroundDisplay = document.getElementById('calcTurnaround');
  const savingsDisplay = document.getElementById('calcSavings');
  const supportTierDisplay = document.getElementById('calcSupportTier');

  if (!countSlider || !countDisplay) return;

  function updateEstimates() {
    const count = parseInt(countSlider.value, 10);
    const roleType = roleSelect ? roleSelect.value : 'content-engineer';

    countDisplay.innerText = `${count} ${count === 1 ? 'Specialist' : 'Specialists'}`;

    if (count <= 3) {
      turnaroundDisplay.innerText = 'Immediate to 15 Days';
    } else if (count <= 10) {
      turnaroundDisplay.innerText = '15 - 30 Days (Standard Staffing Model)';
    } else {
      turnaroundDisplay.innerText = '30 - 45 Days (Phased Batch Deployment)';
    }

    const internalHiringOverheadPerHead = 35000;
    const estimatedSavings = Math.round(count * internalHiringOverheadPerHead * 0.42);
    savingsDisplay.innerText = `₹${(estimatedSavings / 1000).toFixed(0)}k+`;

    if (count >= 10) {
      supportTierDisplay.innerText = 'Dedicated Account Manager + Onsite SLA';
    } else if (count >= 5) {
      supportTierDisplay.innerText = 'Priority Recruiter & 30-Day Transition Support';
    } else {
      supportTierDisplay.innerText = 'Fast-Track Delivery & Statutory Guarantee';
    }
  }

  countSlider.addEventListener('input', updateEstimates);
  if (roleSelect) roleSelect.addEventListener('change', updateEstimates);
  if (modelSelect) modelSelect.addEventListener('change', updateEstimates);

  updateEstimates();
}

/* ==========================================================================
   9. MODALS (Candidate Apply & Employer Staffing)
   ========================================================================== */
function initModals() {
  const applyModal = document.getElementById('applyModal');
  const openApplyBtns = document.querySelectorAll('.open-apply-modal');
  const closeApplyBtn = document.getElementById('closeApplyModal');

  const hireModal = document.getElementById('hireModal');
  const openHireBtns = document.querySelectorAll('.open-hire-modal');
  const closeHireBtn = document.getElementById('closeHireModal');

  openApplyBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const prefillRole = btn.getAttribute('data-apply-role') || 'Trainee Content Engineer';
      const roleField = document.getElementById('modalApplyRoleField');
      if (roleField) roleField.value = prefillRole;

      if (applyModal) {
        applyModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeApplyBtn && applyModal) {
    closeApplyBtn.addEventListener('click', () => {
      applyModal.classList.add('hidden');
      document.body.style.overflow = '';
    });
  }

  openHireBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (hireModal) {
        hireModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeHireBtn && hireModal) {
    closeHireBtn.addEventListener('click', () => {
      hireModal.classList.add('hidden');
      document.body.style.overflow = '';
    });
  }

  window.addEventListener('click', (e) => {
    if (applyModal && e.target === applyModal) {
      applyModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
    if (hireModal && e.target === hireModal) {
      hireModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (applyModal && !applyModal.classList.contains('hidden')) {
        applyModal.classList.add('hidden');
        document.body.style.overflow = '';
      }
      if (hireModal && !hireModal.classList.contains('hidden')) {
        hireModal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    }
  });
}

/* ==========================================================================
   10. INTERACTIVE FORMS & WHATSAPP GENERATION
   ========================================================================== */
function initContactForms() {
  const mainContactForm = document.getElementById('mainContactForm');
  if (mainContactForm) {
    mainContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value.trim();
      const email = document.getElementById('contactEmail')?.value.trim();
      const phone = document.getElementById('contactPhone')?.value.trim();
      const type = document.getElementById('contactInquiryType')?.value;
      const message = document.getElementById('contactMessage')?.value.trim();

      if (!name || !email || !phone) {
        showToast('Please fill in your Name, Email, and Phone Number.', 'error');
        return;
      }

      const waText = encodeURIComponent(
        `*New Inquiry - Agastya Services*\n\n*To:* Milan Chaudhari\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Category:* ${type}\n*Message:* ${message || 'N/A'}`
      );
      const whatsappUrl = `https://wa.me/918983575960?text=${waText}`;

      showToast('Redirecting to WhatsApp to send message to Milan Chaudhari...', 'success');
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 750);

      mainContactForm.reset();
    });
  }

  const candidateModalForm = document.getElementById('candidateModalForm');
  if (candidateModalForm) {
    candidateModalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('candidateName')?.value.trim();
      const phone = document.getElementById('candidatePhone')?.value.trim();
      const email = document.getElementById('candidateEmail')?.value.trim();
      const role = document.getElementById('modalApplyRoleField')?.value;
      const qual = document.getElementById('candidateQual')?.value;
      const skills = document.getElementById('candidateSkills')?.value.trim();

      if (!name || !phone || !email) {
        showToast('Please provide your Name, Contact, and Email.', 'error');
        return;
      }

      const waText = encodeURIComponent(
        `*Job Application - Agastya Services*\n\n*Candidate:* ${name}\n*Applied Role:* ${role}\n*Phone:* ${phone}\n*Email:* ${email}\n*Qualification:* ${qual}\n*Key Skills/Tools:* ${skills || 'Diploma/BSC/BE Graduate'}\n\n*Status:* Ready for Technical Evaluation`
      );
      const whatsappUrl = `https://wa.me/918983575960?text=${waText}`;

      showToast('Application drafted! Connecting directly to Milan Chaudhari...', 'success');
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        document.getElementById('applyModal')?.classList.add('hidden');
        document.body.style.overflow = '';
      }, 850);

      candidateModalForm.reset();
    });
  }

  const employerModalForm = document.getElementById('employerModalForm');
  if (employerModalForm) {
    employerModalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const company = document.getElementById('empCompany')?.value.trim();
      const contactPerson = document.getElementById('empPerson')?.value.trim();
      const phone = document.getElementById('empPhone')?.value.trim();
      const email = document.getElementById('empEmail')?.value.trim();
      const positions = document.getElementById('empRolesNeeded')?.value.trim();
      const headcount = document.getElementById('empCount')?.value;

      if (!company || !contactPerson || !phone || !email) {
        showToast('Please complete Company, Contact Person, Phone, and Email.', 'error');
        return;
      }

      const waText = encodeURIComponent(
        `*Enterprise Staffing Request - Agastya Services*\n\n*Company:* ${company}\n*Contact Person:* ${contactPerson}\n*Phone:* ${phone}\n*Email:* ${email}\n*Headcount Needed:* ${headcount}\n*Requirements:* ${positions}`
      );
      const whatsappUrl = `https://wa.me/918983575960?text=${waText}`;

      showToast('Requisition received! Opening direct channel with Milan Chaudhari...', 'success');
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        document.getElementById('hireModal')?.classList.add('hidden');
        document.body.style.overflow = '';
      }, 850);

      employerModalForm.reset();
    });
  }
}

/* ==========================================================================
   11. COPY CLIPBOARD & TOAST NOTIFICATION
   ========================================================================== */
function initClipboardButtons() {
  const copyButtons = document.querySelectorAll('.copy-trigger');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy-text');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`, 'success');
      }).catch(() => {
        showToast('Could not copy automatically. Please copy manually.', 'error');
      });
    });
  });
}

function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'fixed bottom-5 right-5 z-[99999] flex flex-col gap-2 pointer-events-none max-w-[90vw]';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const isDark = document.documentElement.classList.contains('dark');
  const bgClass = type === 'success'
    ? (isDark ? 'bg-[#0b1b36] border-[#ff6b00]/60 text-orange-200' : 'bg-white border-orange-500 text-slate-800 shadow-xl')
    : (isDark ? 'bg-[#1e1010] border-rose-500/60 text-rose-300' : 'bg-rose-50 border-rose-400 text-rose-800 shadow-xl');
  const icon = type === 'success' ? '✓' : '⚠';

  toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-lg transform transition-all duration-300 translate-y-8 opacity-0 pointer-events-auto ${bgClass}`;
  toast.innerHTML = `
    <span class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${type === 'success' ? 'bg-[#ff6b00] text-white' : 'bg-rose-500 text-white'}">${icon}</span>
    <span class="text-xs sm:text-sm font-semibold">${message}</span>
  `;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-8', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => {
      toast.remove();
    }, 350);
  }, 4000);
}

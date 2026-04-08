/**
 * ============================================================================
 * SCRIPT PRINCIPAL - PORTFÓLIO FRANCISCO NICOLAS
 * ============================================================================
 * Este arquivo gerencia toda a interatividade do frontend, incluindo:
 * - Internacionalização (PT/EN)
 * - Alternância de Tema (Light/Dark Mode)
 * - Observadores de Scroll (Reveal e Scroll Spy)
 * - Interações visuais (Tilt 3D, Typewriter)
 * ============================================================================
 */

/**
 * 1. SISTEMA MULTI-IDIOMA (SAFE LOAD)
 */
function setLanguage(lang) {
  document.documentElement.setAttribute('lang', lang);
  localStorage.setItem('lang', lang);
  
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById('btn-' + lang);
  if (activeBtn) activeBtn.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('lang') || 'pt';
  setLanguage(savedLang);
});

/**
 * 2. EVENTO ÚNICO DE SCROLL OTIMIZADO (Navbar, Progresso e Back to Top)
 * (Combina as antigas funções de rolagem soltas usando requestAnimationFrame)
 */
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById("scroll-progress");
const backToTopBtn = document.getElementById('backToTop');
let isScrolling = false;

window.addEventListener('scroll', () => {
  if (!isScrolling) {
    window.requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      
      // Blur da Navbar
      if (scrollY > 20) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
      
      // Barra de Progresso de Leitura
      if (scrollProgress) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        scrollProgress.style.width = (winScroll / height) * 100 + "%";
      }
      
      // Botão Voltar ao Topo
      if (scrollY > 500) { if(backToTopBtn) backToTopBtn.classList.add('show'); }
      else { if(backToTopBtn) backToTopBtn.classList.remove('show'); }
      
      isScrolling = false;
    });
    isScrolling = true;
  }
}, { passive: true });

if(backToTopBtn) {
    backToTopBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

/**
 * 3. SCROLL SPY (Destacar menu ativo via IntersectionObserver)
 */
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links .nav-item');
const observerSpyOptions = { root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0 };

const observerSpy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const currentId = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, observerSpyOptions);

sections.forEach(sec => { observerSpy.observe(sec); });

/**
 * 4. SISTEMA DE TEMA (LIGHT / DARK MODE)
 */
const themeBtn = document.getElementById('themeToggle');
const body = document.documentElement;
const currentTheme = localStorage.getItem('theme') || 'dark'; // Dark como padrão
body.setAttribute('data-theme', currentTheme);

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
      let theme = body.getAttribute('data-theme');
      if (theme === 'dark') {
          body.removeAttribute('data-theme');
          localStorage.setItem('theme', 'light');
      } else {
          body.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
      }
  });
}

/**
 * 5. ANIMAÇÃO DE ENTRADA (FADE UP REVEAL)
 */
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(element => { revealObserver.observe(element); });

/**
 * 6. CONTROLES DO MENU MOBILE
 */
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

/**
 * 7. GERENCIAMENTO DE MODAIS (CASES E CERTIFICAÇÕES)
 */
function openModal(id) {
  const modal = document.getElementById(id);
  if(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModalBtn(id) {
  const modal = document.getElementById(id);
  if(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function closeModal(event, id) {
  if (event.target.id === id) { closeModalBtn(id); }
}

document.addEventListener('keydown', function(event) {
  if (event.key === "Escape") {
    const activeModal = document.querySelector('.modal-overlay.active');
    if (activeModal) { closeModalBtn(activeModal.id); }
  }
});

/**
 * 8. CARROSSEL DE EVENTOS (SCROLL HORIZONTAL)
 */
function scrollCarousel(direction) {
  const carousel = document.getElementById('eventsCarousel');
  if (!carousel) return;
  const card = carousel.querySelector('.event-card');
  
  if (card) {
    const scrollAmount = card.offsetWidth + 32;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    
    if (direction === 1 && Math.ceil(carousel.scrollLeft) >= maxScroll - 10) {
      carousel.scrollTo({ left: 0, behavior: 'smooth' }); 
    } 
    else if (direction === -1 && carousel.scrollLeft <= 10) {
      carousel.scrollTo({ left: maxScroll, behavior: 'smooth' }); 
    } 
    else {
      carousel.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
    }
  }
}

/**
 * 9. EFEITO 3D HOVER (TILT CARD) - OTIMIZADO
 */
if (window.matchMedia("(pointer: fine)").matches) {
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    let rect;
    
    card.addEventListener('mouseenter', () => {
       rect = card.getBoundingClientRect();
       card.style.transition = 'none';
    });

    card.addEventListener('mousemove', e => {
      if (!rect) return;
      
      window.requestAnimationFrame(() => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5; 
        const rotateY = ((x - centerX) / centerX) * 5;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });
    });

    card.addEventListener('mouseleave', () => {
      rect = null;
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.transition = 'transform 0.5s ease';
    });
  });
}

/**
 * 10. EFEITO MÁQUINA DE ESCREVER (TYPEWRITER)
 */
const wordsPt = ["Infraestrutura e Redes", "Cloud AWS", "Soluções em Laravel", "Automação Industrial"];
const wordsEn = ["Infrastructure & Networks", "AWS Cloud", "Laravel Solutions", "Industrial Automation"];
let iType = 0, jType = 0;
let currentWord = "";
let isDeleting = false;
let typeSpeed = 100;

function typeWriter() {
  const lang = document.documentElement.getAttribute('lang') || 'pt';
  const words = lang === 'pt' ? wordsPt : wordsEn;
  const target = lang === 'pt' ? document.querySelector('.typewriter-pt') : document.querySelector('.typewriter-en');
  
  const otherTarget = lang === 'pt' ? document.querySelector('.typewriter-en') : document.querySelector('.typewriter-pt');
  if (otherTarget) otherTarget.textContent = "";

  if (!target) return setTimeout(typeWriter, 500);

  currentWord = words[iType % words.length];

  if (isDeleting) {
    target.textContent = currentWord.substring(0, jType - 1);
    jType--;
    typeSpeed = 40;
  } else {
    target.textContent = currentWord.substring(0, jType + 1);
    jType++;
    typeSpeed = 80;
  }

  if (!isDeleting && jType === currentWord.length) {
    typeSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && jType === 0) {
    isDeleting = false;
    iType++;
    typeSpeed = 500; 
  }

  setTimeout(typeWriter, typeSpeed);
}
typeWriter();

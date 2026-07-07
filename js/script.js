// ===================== Theme Toggle (Dark/Light) =====================
const themeToggle = document.getElementById('themeToggle');
const THEME_KEY = 'portfolio-theme';

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

const storedTheme = localStorage.getItem(THEME_KEY);
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(storedTheme || (prefersDark ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';
  applyTheme(nextTheme);
  localStorage.setItem(THEME_KEY, nextTheme);
});

// ===================== Mobile Navigation =====================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===================== Header scroll state =====================
const header = document.getElementById('header');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 30;
  header.classList.toggle('scrolled', scrolled);
  backToTop.classList.toggle('visible', window.scrollY > 400);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===================== Active nav link on scroll =====================
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach((anchor) => {
          anchor.classList.toggle('active-link', anchor.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-45% 0px -45% 0px' }
);

sections.forEach((section) => sectionObserver.observe(section));

// ===================== Scroll reveal animations =====================
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach((el) => revealObserver.observe(el));

// ===================== Skill bar fill animation =====================
const skillBars = document.querySelectorAll('.skill-bar span');

skillBars.forEach((bar) => {
  bar.dataset.target = bar.style.width;
  bar.style.width = '0';
});

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.target;
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

skillBars.forEach((bar) => skillObserver.observe(bar));

// ===================== Typed text effect (Hero role) =====================
const roles = ['Full Stack Developer', 'Node.js Developer', 'Software Engineering Graduate', 'Quick Learner'];
const typedTextEl = document.getElementById('typedText');
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typedTextEl.textContent = currentRole.substring(0, charIndex);

  let delay = isDeleting ? 45 : 90;

  if (!isDeleting && charIndex === currentRole.length) {
    delay = 1400;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }

  setTimeout(typeLoop, delay);
}

typeLoop();

// ===================== Contact form validation =====================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

const validators = {
  name: (value) => value.trim().length >= 2,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
  subject: (value) => value.trim().length >= 3,
  message: (value) => value.trim().length >= 10,
};

const errorMessages = {
  name: 'Please enter your name (at least 2 characters).',
  email: 'Please enter a valid email address.',
  subject: 'Subject must be at least 3 characters.',
  message: 'Message must be at least 10 characters.',
};

function validateField(field) {
  const value = field.value;
  const isValid = validators[field.name](value);
  const errorEl = document.getElementById(`${field.name}Error`);

  field.classList.toggle('invalid', !isValid);
  if (errorEl) {
    errorEl.textContent = isValid ? '' : errorMessages[field.name];
  }

  return isValid;
}

['name', 'email', 'subject', 'message'].forEach((fieldName) => {
  const field = document.getElementById(fieldName);
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.classList.contains('invalid')) validateField(field);
  });
});

const CONTACT_API_URL = 'https://your-backend-host.example.com/api/contact';

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fields = ['name', 'email', 'subject', 'message'].map((id) => document.getElementById(id));
  const allValid = fields.map((field) => validateField(field)).every(Boolean);

  if (!allValid) {
    formStatus.textContent = 'Please fix the errors above.';
    formStatus.style.color = '#e53e3e';
    return;
  }

  const payload = Object.fromEntries(fields.map((field) => [field.name, field.value.trim()]));

  formStatus.style.color = '';
  formStatus.textContent = 'Sending...';

  try {
    const response = await fetch(CONTACT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Request failed');

    formStatus.textContent = 'Thank you! Your message has been sent successfully.';
    contactForm.reset();
  } catch (err) {
    formStatus.style.color = '#e53e3e';
    formStatus.textContent = 'Something went wrong. Please email me directly instead.';
  }
});

// ===================== Footer year =====================
document.getElementById('year').textContent = new Date().getFullYear();

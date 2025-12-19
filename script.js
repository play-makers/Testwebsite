// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Close mobile menu when clicking a link
document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// Dark Theme Toggle
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector("i");

// Check for saved theme preference or default to light
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  if (theme === "dark") {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  } else {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  }
}

// Navbar background on scroll
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15)";
  } else {
    navbar.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
  }
});

// Certifications Carousel
let currentSlide = 0;
const certTrack = document.querySelector(".cert-track");
const certCards = document.querySelectorAll(".cert-track .cert-card");
const indicators = document.querySelectorAll(".indicator");
const totalSlides = certCards.length;

function getVisibleCards() {
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
}

function getMaxSlide() {
  const cards = document.querySelectorAll(".cert-track .cert-card");
  return Math.max(0, cards.length - getVisibleCards());
}

function updateCarousel() {
  const cards = document.querySelectorAll(".cert-track .cert-card");
  if (!cards.length || !certTrack) return;

  const cardWidth = cards[0].offsetWidth;
  const gap = 30;
  const offset = currentSlide * (cardWidth + gap);

  certTrack.style.transform = `translateX(-${offset}px)`;

  // Update indicators
  const indicators = document.querySelectorAll(".indicator");
  indicators.forEach((ind, index) => {
    ind.classList.toggle("active", index === currentSlide);
  });
}

function moveCertCarousel(direction) {
  const maxSlide = getMaxSlide();
  currentSlide += direction;

  if (currentSlide < 0) currentSlide = maxSlide;
  if (currentSlide > maxSlide) currentSlide = 0;

  updateCarousel();
}

function goToSlide(index) {
  const maxSlide = getMaxSlide();
  currentSlide = Math.min(index, maxSlide);
  updateCarousel();
}

// Auto-play carousel
let carouselInterval = setInterval(() => moveCertCarousel(1), 5000);

// Pause on hover
document
  .querySelector(".cert-carousel-wrapper")
  ?.addEventListener("mouseenter", () => {
    clearInterval(carouselInterval);
  });

document
  .querySelector(".cert-carousel-wrapper")
  ?.addEventListener("mouseleave", () => {
    carouselInterval = setInterval(() => moveCertCarousel(1), 5000);
  });

// Touch/Swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.querySelector(".cert-carousel")?.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
    clearInterval(carouselInterval);
  },
  { passive: true }
);

document.querySelector(".cert-carousel")?.addEventListener(
  "touchend",
  (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    carouselInterval = setInterval(() => moveCertCarousel(1), 5000);
  },
  { passive: true }
);

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      moveCertCarousel(1); // Swipe left - next
    } else {
      moveCertCarousel(-1); // Swipe right - prev
    }
  }
}

// Update carousel on resize
window.addEventListener("resize", () => {
  const maxSlide = getMaxSlide();
  if (currentSlide > maxSlide) {
    currentSlide = maxSlide;
  }
  updateCarousel();
});

// Initialize carousel
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(updateCarousel, 100);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Animate skill bars on scroll
const animateSkillBars = () => {
  const skillBars = document.querySelectorAll(
    ".skill-progress, .language-progress"
  );

  skillBars.forEach((bar) => {
    const progress = bar.getAttribute("data-progress");
    const rect = bar.getBoundingClientRect();

    if (rect.top < window.innerHeight - 100) {
      bar.style.width = progress + "%";
    }
  });
};

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// Add fade-in class to elements
document.addEventListener("DOMContentLoaded", () => {
  // Animate elements on page load
  const animatedElements = document.querySelectorAll(
    ".skills-category, .timeline-item, .cert-card, .education-card, .contact-item, .stat-item"
  );

  animatedElements.forEach((el) => {
    el.classList.add("fade-in");
    observer.observe(el);
  });

  // Initial check for skill bars
  animateSkillBars();
});

// Listen for scroll to animate skill bars
window.addEventListener("scroll", animateSkillBars);

// Toggle Experience Details (Read More/Less)
function toggleExpand(button) {
  const content = button.previousElementSibling;
  const isExpanded = content.classList.contains("expanded");

  if (isExpanded) {
    content.classList.remove("expanded");
    button.classList.remove("expanded");
    button.querySelector("span").textContent = "Read More";
  } else {
    content.classList.add("expanded");
    button.classList.add("expanded");
    button.querySelector("span").textContent = "Show Less";
  }
}

// Active navigation highlight on scroll
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Typing effect for the title (optional enhancement)
const titles = [
  "Microsoft Support Engineer",
  "Cloud Solutions Specialist",
  "Technical Support Expert",
];
let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const titleElement = document.querySelector(".title");

function typeEffect() {
  const currentTitle = titles[titleIndex];

  if (isDeleting) {
    titleElement.textContent = currentTitle.substring(0, charIndex - 1);
    charIndex--;
  } else {
    titleElement.textContent = currentTitle.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === currentTitle.length) {
    setTimeout(() => {
      isDeleting = true;
    }, 2000);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    titleIndex = (titleIndex + 1) % titles.length;
  }

  const typingSpeed = isDeleting ? 50 : 100;
  setTimeout(typeEffect, typingSpeed);
}

// Start typing effect after page loads
setTimeout(typeEffect, 2000);

// Certificate Modal Functions
function openModal(imageSrc, title) {
  const modal = document.getElementById("certModal");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");

  modalImage.src = imageSrc;
  modalImage.alt = title;
  modalTitle.textContent = title;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("certModal");
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

// Close modal on escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

// Close modal on backdrop click
document.getElementById("certModal")?.addEventListener("click", (e) => {
  if (e.target.id === "certModal") {
    closeModal();
  }
});

// Initialize Libraries
document.addEventListener("DOMContentLoaded", () => {
  // Add AOS attributes to timeline items dynamically
  document.querySelectorAll(".timeline-item").forEach((item, index) => {
    item.setAttribute("data-aos", "fade-up");
    item.setAttribute("data-aos-delay", index * 100);
  });

  // Initialize AOS
  AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: true,
    mirror: false,
    offset: 100,
  });

  // Initialize Typed.js
  if (document.getElementById("typed-text")) {
    new Typed("#typed-text", {
      strings: [
        "Microsoft Support Engineer",
        "Cloud Solutions Specialist",
        "M365 Administrator",
        "Tech Problem Solver",
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
    });
  }

  // Initialize Vanilla-Tilt
  VanillaTilt.init(
    document.querySelectorAll(".stat-item, .cert-card, .education-card"),
    {
      max: 10,
      speed: 400,
      glare: true,
      "max-glare": 0.2,
      scale: 1.02,
    }
  );
});

// Console welcome message
console.log(
  "%c Welcome to Khalid Chefi's Portfolio! ",
  "background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; font-size: 16px; padding: 10px; border-radius: 5px;"
);

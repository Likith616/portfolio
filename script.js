const header = document.querySelector(".site-header");
const nav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const menuToggle = document.querySelector(".menu-toggle");
const scrollLine = document.querySelector(".scroll-line");

menuToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const updateScrollLine = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  scrollLine.style.width = `${progress}%`;
};

window.addEventListener("scroll", updateScrollLine, { passive: true });
updateScrollLine();

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
);

sections.forEach((section) => navObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const animateCount = (element) => {
  if (element.dataset.done === "true") return;
  element.dataset.done = "true";

  const target = Number(element.dataset.count || 0);
  const duration = 1000;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.floor(target * eased).toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      element.textContent = target.toLocaleString();
    }
  };

  requestAnimationFrame(tick);
};

document.querySelectorAll(".project-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".project-card");
    const isOpen = card.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
      card.querySelectorAll("[data-count]").forEach(animateCount);
    }
  });
});

if (header) {
  document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
}

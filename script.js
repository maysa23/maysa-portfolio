/* MAYSA HAMED | Portfolio JavaScript */
document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initLanguageToggle();
  initMobileMenu();
  initCurrentYear();
  initSmoothNavigation();
  initActiveNavigation();
});

function initHeader() {
  const header = document.getElementById("header");
  if (!header) return;
  const update = () => header.classList.toggle("scrolled", window.scrollY > 35);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initLanguageToggle() {
  const toggle = document.getElementById("languageToggle");
  const label = document.getElementById("languageLabel");
  if (!toggle) return;

  function setLanguage(language) {
    const arabic = language === "ar";
    document.documentElement.lang = language;
    document.documentElement.dir = arabic ? "rtl" : "ltr";

    document.querySelectorAll("[data-ar][data-en]").forEach((element) => {
      const value = element.getAttribute(arabic ? "data-ar" : "data-en");
      if (value === null) return;
      // All bilingual elements are text-only or have a nested label span.
      const directText = [...element.childNodes].filter(
        node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
      );
      if (directText.length) {
        directText[0].textContent = value;
        directText.slice(1).forEach(node => node.remove());
      } else if (!element.children.length) {
        element.textContent = value;
      } else {
        const nestedLabel = element.querySelector(":scope > .language-text");
        if (nestedLabel) nestedLabel.textContent = value;
      }
    });

    if (label) label.textContent = arabic ? "EN" : "عربي";
    toggle.setAttribute("aria-label", arabic ? "Switch to English" : "التبديل إلى العربية");
    toggle.setAttribute("aria-pressed", String(!arabic));
    document.documentElement.dataset.currentLanguage = language;
  }

  toggle.addEventListener("click", () => {
    const current = document.documentElement.dataset.currentLanguage || document.documentElement.lang || "ar";
    setLanguage(current === "ar" ? "en" : "ar");
  });
  setLanguage(document.documentElement.lang === "en" ? "en" : "ar");
}

function initMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("navLinks");
  if (!toggle || !nav) return;

  function closeMenu() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    const icon = toggle.querySelector("i");
    if (icon) {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
    }
  }

  toggle.addEventListener("click", event => {
    event.stopPropagation();
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    const icon = toggle.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-bars", !open);
      icon.classList.toggle("fa-xmark", open);
    }
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("click", event => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });
}

function initCurrentYear() {
  const year = document.getElementById("currentYear");
  if (year) year.textContent = new Date().getFullYear();
}

function initSmoothNavigation() {
  document.querySelectorAll('.nav-links a[href^="#"], .logo[href^="#"], .footer-logo[href^="#"], .btn[href^="#"], .text-link[href^="#"], .scroll-indicator[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const href = link.getAttribute("href");
      const target = href && href.length > 1 ? document.querySelector(href) : null;
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start"
      });
      if (window.location.hash !== href) history.replaceState(null, "", href);
    });
  });
}

function initActiveNavigation() {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !links.length || !("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-25% 0px -60% 0px", threshold: 0 });
  sections.forEach(section => observer.observe(section));
}

console.log("Maysa Hamed Portfolio is ready.");

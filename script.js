(function () {
  "use strict";

  document.body.classList.add("js-ready");\n  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.getElementById("siteHeader");
  const progress = document.getElementById("scrollProgress");
  const nav = document.getElementById("mainNav");
  const menuToggle = document.getElementById("menuToggle");
  const typedWord = document.getElementById("typedWord");
  const video = document.getElementById("heroVideo");
  const videoControl = document.getElementById("videoControl");

  // Rotating headline: the words change, while the page remains accessible.
  const phrases = ["digital experiences", "useful software", "intelligent tools", "ideas in motion"];
  if (typedWord) {
    if (reduceMotion) {
      typedWord.textContent = phrases[0];
    } else {
      let phraseIndex = 0;
      let letterIndex = phrases[0].length;
      let deleting = true;
      let timer;

      const type = () => {
        const phrase = phrases[phraseIndex];
        if (deleting) {
          letterIndex -= 1;
        } else {
          letterIndex += 1;
        }
        typedWord.textContent = phrase.slice(0, Math.max(0, letterIndex));

        let delay = deleting ? 44 : 78;
        if (!deleting && letterIndex === phrase.length) {
          deleting = true;
          delay = 1500;
        } else if (deleting && letterIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          delay = 260;
        }
        timer = window.setTimeout(type, delay);
      };
      window.setTimeout(() => {
        deleting = true;
        timer = window.setTimeout(type, 1500);
      }, 1800);
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) window.clearTimeout(timer);
      });
    }
  }

  // Fade and rise sections as they enter the viewport.
  const revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -55px 0px" });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // Current section marker in the desktop and mobile navigation.
  const navLinks = Array.from(document.querySelectorAll(".main-nav a"));
  const observedSections = ["about", "work", "stack", "journey", "contact"]
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.getAttribute("href") === "#" + entry.target.id;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-42% 0px -50% 0px" });
    observedSections.forEach(section => sectionObserver.observe(section));
  }

  // Header tint and reading progress.
  let scrollFrame = false;
  const updateScroll = () => {
    if (scrollFrame) return;
    scrollFrame = true;
    window.requestAnimationFrame(() => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      if (progress) progress.style.width = amount + "%";
      if (header) header.classList.toggle("is-scrolled", window.scrollY > 18);
      scrollFrame = false;
    });
  };
  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();

  // Mobile navigation.
  const closeMenu = () => {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  };
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    });
    nav.addEventListener("click", event => {
      if (event.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
    window.matchMedia("(min-width: 801px)").addEventListener("change", event => {
      if (event.matches) closeMenu();
    });
  }

  // Video playback control; the clip stays muted so it can autoplay safely.
  if (video && videoControl) {
    const syncVideoButton = () => {
      const paused = video.paused;
      videoControl.classList.toggle("is-paused", paused);
      videoControl.setAttribute("aria-pressed", String(paused));
      videoControl.setAttribute("aria-label", paused ? "Play background video" : "Pause background video");
    };
    if (reduceMotion) video.pause();
    videoControl.addEventListener("click", () => {
      if (video.paused) {
        const promise = video.play();
        if (promise && typeof promise.catch === "function") promise.catch(() => {});
      } else {
        video.pause();
      }
      syncVideoButton();
    });
    video.addEventListener("play", syncVideoButton);
    video.addEventListener("pause", syncVideoButton);
    syncVideoButton();
  }
})();
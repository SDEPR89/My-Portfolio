window.addEventListener("DOMContentLoaded", () => {
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Only setup mouse tracking if they haven't disabled animations
  if (!prefersReducedMotion) {
    setupLiquidBackground();
  } else {
    // Hide the tracking orb entirely for reduced motion users
    const orb = document.getElementById("cursor-orb");
    if (orb) orb.style.display = "none";
  }

  setupSmartScrollDock();
  setupScrollSpy();
});

/* Optimized Liquid Tracking Motion */
function setupLiquidBackground() {
  const cursorOrb = document.getElementById("cursor-orb");
  if (!cursorOrb) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let isMoving = false;

  // Radius based on typical element size (600px / 2 = 300) to keep mouse centered
  const orbRadius = window.innerWidth < 768 ? 225 : 300;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
      isMoving = true;
      requestAnimationFrame(tick);
    }
  });

  // Use passive listener for touch to improve mobile scroll performance
  window.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        if (!isMoving) {
          isMoving = true;
          requestAnimationFrame(tick);
        }
      }
    },
    { passive: true },
  );

  function tick() {
    const easing = 0.08;
    currentX += (mouseX - currentX) * easing;
    currentY += (mouseY - currentY) * easing;

    // Only update DOM if the movement is significant enough (> 0.5px) to prevent tiny repaints
    if (
      Math.abs(mouseX - currentX) > 0.5 ||
      Math.abs(mouseY - currentY) > 0.5
    ) {
      cursorOrb.style.transform = `translate(${currentX - orbRadius}px, ${currentY - orbRadius}px)`;
      requestAnimationFrame(tick);
    } else {
      isMoving = false; // Sleep until mouse moves again
    }
  }
}

/* Smart Scroll Dock */
function setupSmartScrollDock() {
  const bottomDock = document.getElementById("bottom-dock");
  const topNav = document.getElementById("top-nav");
  if (!bottomDock || !topNav) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  // Throttle scroll events via requestAnimationFrame
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY > 20) {
            topNav.classList.add("backdrop-blur-md");
            topNav.classList.replace("bg-brand-900/80", "bg-brand-900/90");
          } else {
            topNav.classList.remove("backdrop-blur-md");
            topNav.classList.replace("bg-brand-900/90", "bg-brand-900/80");
          }

          if (currentScrollY > lastScrollY && currentScrollY > 150) {
            bottomDock.style.transform = "translateY(150%)";
          } else {
            bottomDock.style.transform = "translateY(0)";
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );
}

/* Intersection Observer based ScrollSpy (Highly Performant) */
function setupScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navMap = {
    about: {
      desktop: document.getElementById("nav-about"),
      mobile: document.getElementById("mob-about"),
    },
    skills: {
      desktop: document.getElementById("nav-skills"),
      mobile: document.getElementById("mob-skills"),
    },
    projects: {
      desktop: document.getElementById("nav-projects"),
      mobile: document.getElementById("mob-projects"),
    },
    contact: {
      desktop: document.getElementById("nav-contact"),
      mobile: document.getElementById("mob-contact"),
    },
  };

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px",
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute("id");

        Object.values(navMap).forEach((target) => {
          if (target.desktop) target.desktop.classList.remove("active");
          if (target.mobile) target.mobile.classList.remove("mobile-active");
        });

        if (navMap[currentId]) {
          if (navMap[currentId].desktop)
            navMap[currentId].desktop.classList.add("active");
          if (navMap[currentId].mobile)
            navMap[currentId].mobile.classList.add("mobile-active");
        }
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    [
      "project-nexus-modal",
      "project-forms-modal",
      "project-hydration-modal",
    ].forEach(closeModal);
  }
});

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "";
  }
}

window.addEventListener("click", (e) => {
  const modals = [
    "project-nexus-modal",
    "project-forms-modal",
    "project-hydration-modal",
  ];
  modals.forEach((id) => {
    const element = document.getElementById(id);
    if (e.target === element) {
      closeModal(id);
    }
  });
});

function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const feedback = document.getElementById("form-feedback");
  const feedbackSpan = feedback.querySelector("span");
  const formData = new FormData(form);

  feedback.classList.remove("hidden");
  feedbackSpan.innerText = "Sending your message...";

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        feedbackSpan.innerText =
          "Message sent successfully! Thanks for getting in touch.";
        form.reset();
      } else {
        feedbackSpan.innerText = "Something went wrong. Please try again.";
      }
    })
    .catch(() => {
      feedbackSpan.innerText =
        "Error sending message. Please check your connection.";
    })
    .finally(() => {
      setTimeout(() => {
        feedback.classList.add("hidden");
      }, 5000);
    });
}

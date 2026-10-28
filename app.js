const track = document.querySelector(".carousel-track");
const cards = [...document.querySelectorAll(".team-card")];
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const counter = document.querySelector(".carousel-count");
const familyProgress = document.querySelector(".carousel-progress span");

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

let activeIndex = 0;

function getVisibleCards() {
  if (window.innerWidth <= 650) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}

function updateCarousel() {
  if (!track || cards.length === 0) return;

  const visibleCards = getVisibleCards();
  const maxIndex = Math.max(0, cards.length - visibleCards);

  activeIndex = Math.min(activeIndex, maxIndex);

  const cardWidth = cards[0].getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  const offset = activeIndex * (cardWidth + gap);

  track.style.transform = `translateX(-${offset}px)`;

  if (prevBtn) prevBtn.disabled = activeIndex === 0;
  if (nextBtn) nextBtn.disabled = activeIndex >= maxIndex;

  if (counter) {
    counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
  }

  if (familyProgress) {
    familyProgress.style.width = `${((activeIndex + 1) / cards.length) * 100}%`;
  }
}

nextBtn?.addEventListener("click", () => {
  const maxIndex = Math.max(0, cards.length - getVisibleCards());

  if (activeIndex < maxIndex) {
    activeIndex++;
    updateCarousel();
  }
});

prevBtn?.addEventListener("click", () => {
  if (activeIndex > 0) {
    activeIndex--;
    updateCarousel();
  }
});

window.addEventListener("resize", updateCarousel);

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks?.classList.toggle("open") ?? false;

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");

    if (menuToggle) {
      menuToggle.textContent = "☰";
    }
  });
});

const contactForm = document.querySelector("#contact-form");
const formMessage = document.querySelector("#form-message");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (formMessage) {
    formMessage.textContent =
      "Forma demo rejimida. Xabar serverga yuborilmadi.";
  }

  contactForm.reset();
});

const groupCarousel = document.querySelector(".group-carousel");

const groupItems = groupCarousel
  ? [...groupCarousel.querySelectorAll(".carousel-item")]
  : [];

let groupProgress = 50;
let groupActive = 0;
let startX = 0;
let isDown = false;

const groupWheelSpeed = 0.035;
const groupDragSpeed = 0.12;

function animateGroup() {
  if (!groupItems.length) return;

  groupProgress = Math.max(0, Math.min(100, groupProgress));

  groupActive = Math.round((groupProgress / 100) * (groupItems.length - 1));

  groupItems.forEach((item, index) => {
    const distance = (index - groupActive) / groupItems.length;
    const distanceFromCenter = Math.abs(index - groupActive);

    const zIndex = groupItems.length - distanceFromCenter;

    item.style.setProperty("--items", groupItems.length);
    item.style.setProperty("--active", distance);
    item.style.setProperty("--zIndex", zIndex);

    item.setAttribute("aria-current", index === groupActive ? "true" : "false");
  });
}
groupItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    groupProgress =
      groupItems.length > 1 ? (index / (groupItems.length - 1)) * 100 : 50;

    animateGroup();
  });
});

groupCarousel?.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();

    groupProgress += event.deltaY * groupWheelSpeed;
    animateGroup();
  },
  { passive: false },
);
groupCarousel?.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse" && event.button !== 0) return;

  isDown = true;
  startX = event.clientX;

  groupCarousel.setPointerCapture(event.pointerId);
});

groupCarousel?.addEventListener("pointermove", (event) => {
  if (!isDown) return;

  const difference = event.clientX - startX;

  groupProgress -= difference * groupDragSpeed;
  startX = event.clientX;

  animateGroup();
});

groupCarousel?.addEventListener("pointerup", () => {
  isDown = false;
});

groupCarousel?.addEventListener("pointercancel", () => {
  isDown = false;
});

animateGroup();

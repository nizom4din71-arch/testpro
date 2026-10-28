const track = document.querySelector(".carousel-track");
const cards = [...document.querySelectorAll(".team-card")];
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const counter = document.querySelector(".carousel-count");
const progress = document.querySelector(".carousel-progress span");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

let activeIndex = 0;

function getVisibleCards() {
  if (window.innerWidth <= 650) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}

function updateCarousel() {
  if (!track || !cards.length) return;

  const visibleCards = getVisibleCards();
  const maxIndex = Math.max(0, cards.length - visibleCards);

  activeIndex = Math.min(activeIndex, maxIndex);

  const cardWidth = cards[0].getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  const offset = activeIndex * (cardWidth + gap);

  track.style.transform = `translateX(-${offset}px)`;

  prevBtn.disabled = activeIndex === 0;
  nextBtn.disabled = activeIndex >= maxIndex;

  counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;

  progress.style.width = `${((activeIndex + 1) / cards.length) * 100}%`;
}

nextBtn.addEventListener("click", () => {
  const maxIndex = Math.max(0, cards.length - getVisibleCards());

  if (activeIndex < maxIndex) {
    activeIndex++;
    updateCarousel();
  }
});

prevBtn.addEventListener("click", () => {
  if (activeIndex > 0) {
    activeIndex--;
    updateCarousel();
  }
});

window.addEventListener("resize", updateCarousel);

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

const contactForm = document.querySelector("#contact-form");
const formMessage = document.querySelector("#form-message");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  formMessage.textContent = "Forma demo rejimida. Xabar serverga yuborilmadi.";

  contactForm.reset();
});

updateCarousel();

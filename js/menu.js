/**
 * menu.js
 *
 * Dynamically renders menu sections from data arrays and manages tab navigation.
 */

import {
  startersArr,
  mainsArr,
  vegetarianArr,
  dessertsArr,
  drinksArr,
} from "../js/imgData.js";

/**
 * Generate HTML string for menu cards from data array
 */
const generateCardContent = (arr) => `
<div class="card-case py-2 py-sm-3 py-md-4 py-lg-5">
  <div class="row row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
    ${arr
      .map(
        (item) => `
      <div class="col">
        <div class="card shadow-sm rounded-2 position-relative card-item" 
             data-id="${item.id}" 
             data-title="${item.title}" 
             data-price="${item.price}" 
             data-url="${item.urls}">
          <img src="${item.urls}" alt="${
          item.title || "Dish"
        }" class="card-img-top rounded-top-2" />
          <div class="card-body pb-4">
            <div class="card-intro">
              <h5 class="card-title fw-bold mb-2">${
                item.title || "Delicious Dish"
              }</h5>
              <p class="card-text text-muted small mb-2">${item.intro || ""}</p>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <div class="text-primary fw-semibold fs-5">${item.price}</div>
            </div>
          </div>
          <button class="custom-btn add-to-cart" title="Add to Cart" type="button">
            <ion-icon name="add" size="medium"></ion-icon>
          </button>
        </div>
      </div>
    `
      )
      .join("")}
  </div>
</div>
`;

/**
 * Section data mapping
 */
const sections = {
  starters: startersArr,
  mains: mainsArr,
  vegetarian: vegetarianArr,
  desserts: dessertsArr,
  drinks: drinksArr,
};

/**
 * Render all sections
 */
Object.entries(sections).forEach(([id, data]) => {
  const container = document.querySelector(`#${id}`);
  if (container) container.innerHTML = generateCardContent(data);
});

/**
 * Tabs functionality
 */
const tabMenu = document.querySelector(".tab-menu");
const tabPages = document.querySelectorAll(".tab-page");
const tabLinks = tabMenu.querySelectorAll("a");

// Show first tab by default
tabPages.forEach((page, index) => {
  page.classList.toggle("show", index === 0);
  page.classList.toggle("hide", index !== 0);
});

tabMenu.addEventListener("click", (e) => {
  const clicked = e.target.closest("a");
  if (!clicked) return;

  tabLinks.forEach((link) => link.classList.remove("active"));
  clicked.classList.add("active");

  tabPages.forEach((page) => {
    const targetId = clicked.getAttribute("href");
    const isTarget = `#${page.id}` === targetId;
    page.classList.toggle("show", isTarget);
    page.classList.toggle("hide", !isTarget);
  });
});

// Scroll highlight
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        tabLinks.forEach((link) => link.classList.remove("active"));
        const id = entry.target.getAttribute("id");
        document
          .querySelector(`.tab-menu a[href="#${id}"]`)
          ?.classList.add("active");
      }
    });
  },
  { threshold: 0.5 }
);

tabPages.forEach((page) => observer.observe(page));

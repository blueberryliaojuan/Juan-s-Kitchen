/**
 * menu.js
 *
 * This script dynamically renders menu sections from imported data arrays,
 * and manages tab navigation for switching between categories.
 *
 * Data sources: startersArr, mainsArr, vegetarianArr, dessertsArr, drinksArr
 * from imgData.js
 */

import {
  startersArr,
  mainsArr,
  vegetarianArr,
  dessertsArr,
  drinksArr,
} from "../js/imgData.js";

/**
 * Generate HTML string for a menu section's cards from data array.
 * @param {Array} arr - Array of menu item objects.
 * @returns {string} HTML string of cards wrapped in carousel cell and Bootstrap grid.
 */
const generateCardContent = (arr) => `
<div class="card-case py-2 py-sm-3 py-md-4 py-lg-5">
  <div class="row row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
    ${arr
      .map(
        (item) => `
      <div class="col">
        <div class="card shadow-sm rounded-4 position-relative" 
             data-url="${item.urls}" 
             data-id="${item.id}" 
             data-title="${item.title}" 
             data-price="${item.price}">
          <img src="${item.urls}" alt="${
          item.title || "Dish"
        }" class="card-img-top rounded-top-4" />
          <div class="card-body pb-4">
           <div class="card-intro">
            <h5 class="card-title fw-bold mb-2">${
              item.title || "Delicious Dish"
            }</h5>
            <p class="card-text text-muted small mb-2">
              ${item.intro}
            </p>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <div class="text-primary fw-semibold fs-5">${item.price}</div>
            </div>
          </div>
          <button class="custom-btn  add-to-cart" title="Add to Cart">
            <ion-icon name="add" ></ion-icon>
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
 * Map section IDs to their corresponding data arrays.
 */
const sections = {
  starters: startersArr,
  mains: mainsArr,
  vegetarian: vegetarianArr,
  desserts: dessertsArr,
  drinks: drinksArr,
};

/**
 * Render menu items into their respective tab content containers.
 */
Object.entries(sections).forEach(([id, data]) => {
  const container = document.querySelector(`#${id}`);
  if (container) {
    container.innerHTML = generateCardContent(data);
  }
});

/**
 * Tab navigation elements
 */
const tabMenu = document.querySelector(".tab-menu");
const tabPages = document.querySelectorAll(".tab-page");
const tabLinks = tabMenu.querySelectorAll("a");

/**
 * Initialize tabs: show the first tab content and hide others.
 */
tabPages.forEach((page, index) => {
  page.classList.toggle("show", index === 0);
  page.classList.toggle("hide", index !== 0);
});

/**
 * Event listener for tab clicks:
 * Switch active tab and show corresponding content.
 */
tabMenu.addEventListener("click", (e) => {
  // Get the closest anchor element if a child element was clicked
  const clicked = e.target.closest("a");
  if (!clicked) return;

  // Remove 'active' class from all tabs and add to the clicked tab
  tabLinks.forEach((link) => link.classList.remove("active"));
  clicked.classList.add("active");

  // Show the related tab content and hide others
  tabPages.forEach((page) => {
    const targetId = clicked.getAttribute("href");
    const isTarget = `#${page.id}` === targetId;
    page.classList.toggle("show", isTarget);
    page.classList.toggle("hide", !isTarget);
  });
});

// Scroll highlight =====
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Remove active state from all tabs
        tabLinks.forEach((link) => link.classList.remove("active"));
        // Add active state to the tab matching the current visible section
        const id = entry.target.getAttribute("id");
        document
          .querySelector(`.tab-menu a[href="#${id}"]`)
          .classList.add("active");
      }
    });
  },
  { threshold: 0.5 } // Trigger when 50% of element is visible in viewport
);

// Observe all tab content sections
tabPages.forEach((page) => observer.observe(page));

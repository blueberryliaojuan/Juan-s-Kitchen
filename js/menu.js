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
  <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
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
            <h5 class="card-title fw-bold mb-2">${
              item.title || "Delicious Dish"
            }</h5>
            <p class="card-text text-muted small mb-3">
              ${item.intro}
            </p>
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
 * Object mapping section IDs to their respective data arrays.
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
 * Initialize tabs: show first tab content, hide others.
 */
tabPages.forEach((page, index) => {
  page.classList.toggle("show", index === 0);
  page.classList.toggle("hide", index !== 0);
});

/**
 * Event listener for tab clicks to switch content and active tab.
 */
tabMenu.addEventListener("click", (e) => {
  // Find the closest anchor element in case child elements inside link are clicked
  const clicked = e.target.closest("a");
  if (!clicked) return;

  // Remove 'active' class from all tab links and add to the clicked one
  tabLinks.forEach((link) => link.classList.remove("active"));
  clicked.classList.add("active");

  // Show the associated tab content, hide others
  tabPages.forEach((page) => {
    const targetId = clicked.getAttribute("href");
    const isTarget = `#${page.id}` === targetId;
    page.classList.toggle("show", isTarget);
    page.classList.toggle("hide", !isTarget);
  });
});

// ===== 新增：滚动高亮 =====
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 找到当前 section 对应的菜单
        tabLinks.forEach((link) => link.classList.remove("active"));
        const id = entry.target.getAttribute("id");
        document
          .querySelector(`.tab-menu a[href="#${id}"]`)
          .classList.add("active");
      }
    });
  },
  { threshold: 0.5 } // 元素 50% 进入视口时触发
);

// 监听所有内容区
tabPages.forEach((page) => observer.observe(page));

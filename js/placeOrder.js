/**
 * File: orderPlacedModal.js
 * Description: Handles opening and closing of the "Order Placed" modal.
 * Author: Juan Liao
 * Created: 2025-08
 */

// ================================
// Get DOM elements
// ================================
const orderPlacedModal = document.getElementById("orderPlacedModal");
const checkoutBtn = document.getElementById("checkoutBtn");
const closeOrderPlacedBtn = document.getElementById("closeOrderPlacedBtn");

// ================================
// Open modal when clicking the checkout button
// ================================
checkoutBtn.addEventListener("click", () => {
  orderPlacedModal.style.display = "flex";
});

// ================================
// Close modal when clicking the close button
// ================================
closeOrderPlacedBtn.addEventListener("click", () => {
  orderPlacedModal.style.display = "none";
});

// ================================
// Close modal when clicking the background overlay
// ================================
orderPlacedModal.addEventListener("click", (e) => {
  if (e.target === orderPlacedModal) {
    orderPlacedModal.style.display = "none";
  }
});

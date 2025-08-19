/**
 * File: callServerModal.js
 * Description: Handles opening and closing of the "Call Server" modal.
 * Author: Juan Liao
 * Created: 2025-08
 */

// ================================
// Get DOM elements
// ================================
const callServerModal = document.getElementById("callServerModal");
const callServerBtn = document.getElementById("callServerBtn");
const closeCallServerBtn = document.getElementById("closeCallServerBtn");

// ================================
// Open modal when clicking the button
// ================================
callServerBtn.addEventListener("click", () => {
  callServerModal.style.display = "flex";
});

// ================================
// Close modal when clicking the close button
// ================================
closeCallServerBtn.addEventListener("click", () => {
  callServerModal.style.display = "none";
});

// ================================
// Close modal when clicking the background overlay
// ================================
callServerModal.addEventListener("click", (e) => {
  if (e.target === callServerModal) {
    callServerModal.style.display = "none";
  }
});

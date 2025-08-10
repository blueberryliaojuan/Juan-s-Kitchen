/**
 * suggestion.js
 *
 * This script manages the UI and interactions for the suggestion feature.
 * It handles opening/closing the suggestion panel, emoji selection,
 * and submission of user feedback with validation and modal display.
 */

/**
 * Open the suggestion panel when clicking the "Suggestion" button.
 * Shows the suggestion page and toggles visibility classes.
 */
document.querySelector("#suggestionBtn").addEventListener("click", () => {
  const suggestionPage = document.querySelector("#suggestionPage");
  suggestionPage.style.display = "block"; // Make visible
  suggestionPage.classList.remove("shut"); // Remove shut (hidden) class
  suggestionPage.classList.add("show"); // Add show (visible) class
});

/**
 * Emoji buttons allow user to select their experience.
 * Only one emoji button can be active at a time.
 * Clicking an emoji button toggles the active state exclusively.
 */
const emojiButtons = document.querySelectorAll(".emoji-btn");
emojiButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active class from all emoji buttons
    emojiButtons.forEach((b) => b.classList.remove("active"));
    // Add active class to clicked button
    btn.classList.add("active");
  });
});

/**
 * Close the suggestion panel when clicking the shutter (close) button.
 * Hides the suggestion page and toggles visibility classes.
 */
document.querySelector("#suggestionShutter").addEventListener("click", () => {
  const suggestionPage = document.querySelector("#suggestionPage");
  suggestionPage.style.display = "none"; // Hide panel
  suggestionPage.classList.remove("show"); // Remove show (visible) class
  suggestionPage.classList.add("shut"); // Add shut (hidden) class
});

// Modal element to display after submitting feedback
const modal = document.getElementById("feedbackModal");
// Close button inside the modal
const closeBtn = document.getElementById("closeModalBtn");

/**
 * Submit feedback suggestion:
 * - Prevent default form submit behavior (if inside a form)
 * - Validate that an emoji is selected
 * - Get user's comment from textarea
 * - Log or process the feedback data (e.g., call API)
 * - Show modal confirmation
 */
document
  .getElementById("submitSuggestion")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default submit if inside a form

    // Find the selected emoji button (with 'active' class)
    const selectedEmojiBtn = document.querySelector(".emoji-btn.active");

    // Get the trimmed comment text from textarea
    const comment = document.getElementById("suggestionComment").value.trim();

    // Validate emoji selection
    if (!selectedEmojiBtn) {
      alert("Please select an experience emoji!");
      return;
    }

    // Get selected emoji's value from data attribute
    const selectedEmojiValue = selectedEmojiBtn.getAttribute("data-value");

    // Process the feedback data as needed (e.g., log or send to server)
    console.log("Selected Emoji:", selectedEmojiValue);
    console.log("User comment:", comment);

    // Show the feedback modal confirmation
    modal.style.display = "flex";
  });

/**
 * Close the feedback modal when clicking the close button inside it.
 */
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

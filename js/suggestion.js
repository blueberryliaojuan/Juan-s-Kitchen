document.querySelector("#suggestionBtn").addEventListener("click", () => {
  document.querySelector("#suggestionPage").style.display = "block";
  document.querySelector("#suggestionPage").classList.remove("shut");
  document.querySelector("#suggestionPage").classList.add("show");
});

// Emoji buttons toggle active state
const emojiButtons = document.querySelectorAll(".emoji-btn");
emojiButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    emojiButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// Close button just hides container for demo
document.querySelector("#suggestionShutter").addEventListener("click", () => {
  document.querySelector("#suggestionPage").style.display = "none";
  document.querySelector("#suggestionPage").classList.remove("show");
  document.querySelector("#suggestionPage").classList.add("shut");
});

const modal = document.getElementById("feedbackModal");
const closeBtn = document.getElementById("closeModalBtn");

document
  .getElementById("submitSuggestion")
  .addEventListener("click", function (event) {
    event.preventDefault(); // 阻止默认提交行为，如果在 form 里

    // 找到被选中的 emoji 按钮，假设通过给选中的按钮加了 active 类标识
    // 先查找所有 emoji-btn 按钮里有 active 类的
    const selectedEmojiBtn = document.querySelector(".emoji-btn.active");

    // 获取 textarea 内容
    const comment = document.getElementById("suggestionComment").value.trim();

    if (!selectedEmojiBtn) {
      alert("Please select an experience emoji!");
      return;
    }

    const selectedEmojiValue = selectedEmojiBtn.getAttribute("data-value");

    // 你想做的处理，比如打印
    console.log("Selected Emoji:", selectedEmojiValue);
    console.log("User comment:", comment);

    // 这里你可以调用 API，或者其他处理
    modal.style.display = "flex";
  });

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

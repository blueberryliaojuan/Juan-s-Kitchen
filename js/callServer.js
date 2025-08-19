// 获取元素
const callServerModal = document.getElementById("callServerModal");
const callServerBtn = document.getElementById("callServerBtn");
const closeCallServerBtn = document.getElementById("closeCallServerBtn");

// 打开 modal
callServerBtn.addEventListener("click", () => {
  callServerModal.style.display = "flex";
});

// 关闭 modal
closeCallServerBtn.addEventListener("click", () => {
  callServerModal.style.display = "none";
});

// 点击背景关闭
callServerModal.addEventListener("click", (e) => {
  if (e.target === callServerModal) {
    callServerModal.style.display = "none";
  }
});

// 获取元素
const modal = document.getElementById("orderPlacedModal");
const checkoutBtn = document.getElementById("checkoutBtn");
const closeBtn = document.getElementById("closeOrderPlacedBtn");

// 打开 modal
checkoutBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// 关闭 modal
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// 可选：点击背景关闭
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

class Cart {
  goods = [];
  taxRate = 0.05;

  constructor() {
    this.goodsNode = document.getElementById("goods");
    this.cartPage = document.querySelector("#cartPage");
    this.cartShutter = document.getElementById("cartShutter");
    this.cartIcon = document.getElementById("cartIcon");
    this.selectAllNode = document.getElementById("selectAll");
    this.delallNode = document.getElementById("delall");
    this.amountNode = document.getElementById("amount");
    this.taxAmount = document.getElementById("taxAmount");
    this.totalAmount = document.getElementById("totalAmount");
    this.cartNum = document.getElementById("cartNum");
    this.couponApply = document.getElementById("couponIcon");
    this.discountNode = document.getElementById("couponDiscountAmount");

    this.couponCodeArr = [
      { code: "HE88T7", discount: 5 },
      { code: "Happy88", discount: 12 },
      { code: "WELCOME95", discount: 5 },
    ];
    this.appliedCoupon = null;

    const savedGoods = localStorage.getItem("goods");
    this.goods = savedGoods ? JSON.parse(savedGoods) : [];

    this.render();
    this.addEventListeners();
  }

  render() {
    let html = "";
    this.goods.forEach((item) => {
      html += `
      <div class="row align-items-center py-2 border-bottom" id="${item.id}">
        <div class="col-1 text-center">
          <input type="checkbox" name="ckboxs" value="${item.id}" ${
        item.checked ? "checked" : ""
      }/>
        </div>
        <div class="col-2 text-center">
          <img src="${item.url}" alt="${
        item.title
      }" class="img-fluid rounded cart-item-img"/>
        </div>
        <div class="col-4 text-truncate" title="${item.title}">${
        item.title
      }</div>
        <div class="col-2 text-end">${item.price}</div>
        <div class="col-2 d-flex justify-content-center align-items-center gap-2">
          <button class="custom-btn quantity-decrease" data-action="decrease">-</button>
          <input type="text" class="form-control form-control-sm text-center" value="${
            item.num
          }" readonly style="width:40px;color:${
        item.num !== 1 ? "#dc3545" : "inherit"
      }"/>
          <button class="custom-btn quantity-increase" data-action="increase">+</button>
        </div>
        <div class="col-1 d-flex justify-content-center align-items-center">
          <button class="custom-btn text-danger delete-item p-0" data-action="delete">
            <ion-icon name="trash" size="small"></ion-icon>
          </button>
        </div>
      </div>`;
    });

    this.goodsNode.innerHTML = html;
    this.calculateTotal();
    localStorage.setItem("goods", JSON.stringify(this.goods));
    this.updateSelectAllCheckbox();
  }

  addEventListeners() {
    // 核心改动：事件委托绑定到 document.body，确保切换 tab 后也能添加
    document.body.addEventListener("click", (e) => {
      const addBtn = e.target.closest(".add-to-cart");
      if (addBtn) {
        const card = addBtn.closest(".card");
        if (!card) return;
        const data = {
          id: card.dataset.id,
          title: card.dataset.title,
          price: card.dataset.price,
          url: card.dataset.url,
        };
        this.saveOrUpdateItem(data);
      }
    });

    this.goodsNode.addEventListener("click", (e) => {
      const row = e.target.closest("[id]");
      if (!row) return;
      const id = row.id;

      if (e.target.dataset.action === "decrease") {
        const item = this.goods.find((i) => i.id === id);
        if (!item) return;
        item.num = Math.max(1, item.num - 1);
        this.render();
      } else if (e.target.dataset.action === "increase") {
        const item = this.goods.find((i) => i.id === id);
        if (!item) return;
        item.num++;
        this.render();
      } else if (e.target.dataset.action === "delete") {
        this.deleteItem(id);
      } else if (e.target.name === "ckboxs") {
        this.editItemProperty(id, "checked", e.target.checked);
      }
    });

    this.selectAllNode.addEventListener("click", (e) =>
      this.selectAllItems(e.target.checked)
    );
    this.delallNode.addEventListener("click", () => {
      this.goods = [];
      this.render();
    });
    this.cartShutter.addEventListener("click", () => {
      this.cartPage.classList.remove("show");
      this.cartPage.classList.add("shut");
    });
    this.cartIcon.addEventListener("click", () => {
      this.cartPage.classList.remove("shut");
      this.cartPage.classList.add("show");
    });
    this.couponApply.addEventListener("click", () => this.applyCoupon());
  }

  saveOrUpdateItem(data) {
    const index = this.goods.findIndex((i) => i.id === data.id);
    if (index !== -1) this.goods[index].num++;
    else this.goods.unshift({ ...data, num: 1, checked: true });
    this.render();
  }

  editItemProperty(id, key, value) {
    const item = this.goods.find((i) => i.id === id);
    if (item) {
      item[key] = value;
      this.render();
    }
  }
  deleteItem(id) {
    this.goods = this.goods.filter((i) => i.id !== id);
    this.render();
  }
  selectAllItems(isSel) {
    this.goods.forEach((i) => (i.checked = isSel));
    this.render();
  }
  updateSelectAllCheckbox() {
    const t = this.goods.length,
      c = this.goods.filter((i) => i.checked).length;
    if (t > 0 && c === t) {
      this.selectAllNode.checked = true;
      this.selectAllNode.indeterminate = false;
    } else if (c > 0) {
      this.selectAllNode.checked = false;
      this.selectAllNode.indeterminate = true;
    } else {
      this.selectAllNode.checked = false;
      this.selectAllNode.indeterminate = false;
    }
  }
  calculateTotal() {
    let q = 0,
      p = 0,
      d = 0;
    this.goods.forEach((i) => {
      if (i.checked) {
        q += i.num;
        p += parseFloat(i.price.slice(1)) * i.num;
      }
    });
    if (this.appliedCoupon) d = p * (this.appliedCoupon.discount / 100);
    const dp = p - d,
      tax = dp * this.taxRate,
      final = dp + tax;
    this.cartNum.textContent = q;
    this.amountNode.textContent = `$${p.toFixed(2)}`;
    this.discountNode.textContent = d > 0 ? `-$${d.toFixed(2)}` : "-$0.00";
    this.discountNode.style.color = d > 0 ? "green" : "inherit";
    this.taxAmount.textContent = `$${tax.toFixed(2)}`;
    this.totalAmount.textContent = `$${final.toFixed(2)}`;
  }
  applyCoupon() {
    const inp = document.querySelector(".coupon-input");
    const code = inp?.value.trim();
    if (!code) {
      this.appliedCoupon = null;
      this.discountNode.style.color = "red";
      this.discountNode.textContent = "Enter code";
      this.calculateTotal();
      return;
    }
    const c = this.couponCodeArr.find((c) => c.code === code);
    if (c) {
      this.appliedCoupon = c;
      this.discountNode.style.color = "green";
      this.discountNode.textContent = `-${c.discount}%`;
    } else {
      this.appliedCoupon = null;
      this.discountNode.style.color = "red";
      this.discountNode.textContent = "Invalid";
    }
    this.calculateTotal();
  }
}

const mycart = new Cart();

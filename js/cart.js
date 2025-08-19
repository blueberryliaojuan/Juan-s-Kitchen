class Cart {
  goods = [];
  taxRate = 0.05;

  goodsNode = document.getElementById("goods");
  cartPage = document.querySelector("#cartPage");
  cartShutter = document.getElementById("cartShutter");
  cartIcon = document.getElementById("cartIcon");
  delallNode = document.getElementById("delall");
  selectAllNode = document.getElementById("selectAll");
  amountNode = document.getElementById("amount");
  taxAmount = document.getElementById("taxAmount");
  totalAmount = document.getElementById("totalAmount");
  cartNum = document.getElementById("cartNum");
  couponApply = document.getElementById("couponIcon");
  discountNode = document.getElementById("couponDiscountAmount");

  couponCodeArr = [
    { code: "HE88T7", discount: 5 },
    { code: "Happy88", discount: 12 },
    { code: "WELCOME95", discount: 5 },
  ];
  appliedCoupon = null;

  constructor() {
    const savedGoods = localStorage.getItem("goods");
    this.goods = savedGoods ? JSON.parse(savedGoods) : [];
    this.render();
    this.addEventListeners();
    this.updateSelectAllCheckbox();
  }

  render() {
    let html = "";
    this.goods.forEach((item) => {
      html += `
      <div class="row align-items-center py-2 border-bottom" id="${item.id}">
        <div class="col-1 text-center">
          <input type="checkbox" name="ckboxs" value="${item.id}" ${
        item.checked ? "checked" : ""
      } />
        </div>
        <div class="col-2 text-center">
          <img src="${item.url}" alt="${
        item.title
      }" class="img-fluid rounded cart-item-img" />
        </div>
        <div class="col-4 text-truncate" title="${item.title}">${
        item.title
      }</div>
        <div class="col-2 text-end">${item.price}</div>
        <div class="col-2 d-flex justify-content-center align-items-center gap-2">
          <button type="button" class="custom-btn quantity-decrease" aria-label="Decrease quantity">
            <ion-icon name="remove" size="medium"></ion-icon>
          </button>
          <input type="text" class="form-control form-control-sm text-center" value="${
            item.num
          }" readonly style="width:40px; color:${
        item.num !== 1 ? "#dc3545" : "inherit"
      }"/>
          <button type="button" class="custom-btn quantity-increase" aria-label="Increase quantity">
            <ion-icon name="add" size="medium"></ion-icon>
          </button>
        </div>
        <div class="col-1 d-flex justify-content-center align-items-center">
          <button type="button" class="custom-btn text-danger delete-item p-0" aria-label="Delete item">
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
    // Event delegation for dynamically generated add-to-cart buttons
    document.body.addEventListener("click", (e) => {
      const btn = e.target.closest(".add-to-cart");
      if (btn) {
        const card = btn.closest(".card-item");
        if (!card) return;
        const { id, title, price, url } = card.dataset;
        this.saveOrUpdateItem({ id, title, price, url });
      }

      // Cart item controls
      const row = e.target.closest("[id]");
      if (!row) return;
      const rowId = row.id;

      if (e.target.name === "ckboxs") {
        this.editItemProperty(rowId, "checked", e.target.checked);
      } else if (e.target.name === "add" || e.target.name === "remove") {
        const item = this.goods.find((g) => g.id === rowId);
        if (!item) return;
        const delta = e.target.name === "add" ? 1 : -1;
        item.num = Math.max(0, item.num + delta);
        this.editItemProperty(rowId, "num", item.num);
      } else if (e.target.name === "trash") {
        this.deleteItem(rowId);
      }
    });

    this.selectAllNode.addEventListener("click", (e) => {
      this.selectAllItems(e.target.checked);
    });

    this.delallNode.addEventListener("click", () => {
      this.goods = [];
      this.render();
    });

    this.cartShutter.addEventListener("click", () => {
      this.cartPage?.classList.remove("show");
      this.cartPage?.classList.add("shut");
    });

    this.cartIcon.addEventListener("click", () => {
      this.cartPage?.classList.remove("shut");
      this.cartPage?.classList.add("show");
    });

    this.couponApply.addEventListener("click", () => {
      this.applyCoupon();
    });
  }

  saveOrUpdateItem(data) {
    const index = this.goods.findIndex((item) => item.id === data.id);
    if (index !== -1) this.goods[index].num++;
    else this.goods.unshift({ ...data, num: 1, checked: true });
    this.render();
  }

  editItemProperty(id, key, value) {
    const item = this.goods.find((item) => item.id === id);
    if (item) {
      item[key] = value;
      this.render();
    }
  }

  deleteItem(id) {
    this.goods = this.goods.filter((item) => item.id !== id);
    this.render();
  }

  selectAllItems(isSelected) {
    this.goods.forEach((item) => (item.checked = isSelected));
    this.render();
  }

  updateSelectAllCheckbox() {
    const total = this.goods.length;
    const checked = this.goods.filter((item) => item.checked).length;
    if (total > 0 && checked === total) {
      this.selectAllNode.checked = true;
      this.selectAllNode.indeterminate = false;
    } else if (checked > 0) {
      this.selectAllNode.checked = false;
      this.selectAllNode.indeterminate = true;
    } else {
      this.selectAllNode.checked = false;
      this.selectAllNode.indeterminate = false;
    }
  }

  calculateTotal() {
    let qty = 0,
      price = 0,
      discountAmount = 0;

    this.goods.forEach((item) => {
      if (item.checked) {
        qty += item.num;
        price += item.num * parseFloat(item.price.slice(1));
      }
    });

    if (this.appliedCoupon)
      discountAmount = price * (this.appliedCoupon.discount / 100);

    const discountedPrice = price - discountAmount;
    const tax = discountedPrice * this.taxRate;
    const finalPrice = discountedPrice + tax;

    this.cartNum.textContent = qty;
    this.amountNode.textContent = `$${price.toFixed(2)}`;
    this.discountNode.textContent =
      discountAmount > 0 ? `-$${discountAmount.toFixed(2)}` : "-$0.00";
    this.discountNode.style.color = discountAmount > 0 ? "green" : "inherit";
    this.taxAmount.textContent = `$${tax.toFixed(2)}`;
    this.totalAmount.textContent = `$${finalPrice.toFixed(2)}`;
  }

  applyCoupon() {
    const couponInput = document.querySelector(".coupon-input");
    const code = couponInput?.value.trim();

    if (!code) {
      this.appliedCoupon = null;
      this.discountNode.style.color = "red";
      this.discountNode.textContent = "Please enter a code";
      this.calculateTotal();
      return;
    }

    const matchedCoupon = this.couponCodeArr.find((c) => c.code === code);
    if (matchedCoupon) {
      this.appliedCoupon = matchedCoupon;
      this.discountNode.style.color = "green";
      this.discountNode.textContent = `-${matchedCoupon.discount}%`;
    } else {
      this.appliedCoupon = null;
      this.discountNode.style.color = "red";
      this.discountNode.textContent = "Invalid";
    }

    this.calculateTotal();
  }
}

const mycart = new Cart();

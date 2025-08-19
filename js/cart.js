/**
 * File: cart.js
 * Description:
 *   This script defines the Cart class to manage the shopping cart functionality.
 *   It handles adding/removing items, quantity adjustments, select all, delete all,
 *   coupon application, total calculation, and UI rendering.
 * Author: Juan Liao
 * Created: 2025-08
 */

class Cart {
  goods = [];
  taxRate = 0.05;

  constructor() {
    // ================================
    // DOM nodes
    // ================================
    this.goodsNode = document.getElementById("goods"); // Container for cart items
    this.cartPage = document.querySelector("#cartPage"); // Cart panel
    this.cartShutter = document.getElementById("cartShutter"); // Close button
    this.cartIcon = document.getElementById("cartIcon"); // Floating cart icon
    this.selectAllNode = document.getElementById("selectAll"); // Select all checkbox
    this.delallNode = document.getElementById("delall"); // Delete all button
    this.amountNode = document.getElementById("amount"); // Subtotal
    this.taxAmount = document.getElementById("taxAmount"); // Tax
    this.totalAmount = document.getElementById("totalAmount"); // Final total
    this.cartNum = document.getElementById("cartNum"); // Cart count badge
    this.couponApply = document.getElementById("couponIcon"); // Apply coupon button
    this.discountNode = document.getElementById("couponDiscountAmount"); // Discount display

    // ================================
    // Available coupon codes
    // ================================
    this.couponCodeArr = [
      { code: "HE88T7", discount: 5 },
      { code: "Happy88", discount: 12 },
      { code: "WELCOME95", discount: 5 },
    ];
    this.appliedCoupon = null;

    // Load saved cart from localStorage
    const savedGoods = localStorage.getItem("goods");
    this.goods = savedGoods ? JSON.parse(savedGoods) : [];

    // Initial render and event listeners
    this.render();
    this.addEventListeners();
  }

  /**
   * Render the cart items and update totals
   */
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

  /**
   * Add event listeners for cart functionality
   */
  addEventListeners() {
    // Event delegation for add-to-cart buttons on menu cards
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

    // Event delegation for quantity, delete, and checkbox changes
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

    // Select all checkbox
    this.selectAllNode.addEventListener("click", (e) =>
      this.selectAllItems(e.target.checked)
    );

    // Delete all items
    this.delallNode.addEventListener("click", () => {
      this.goods = [];
      this.render();
    });

    // Open/close cart panel
    this.cartShutter.addEventListener("click", () => {
      this.cartPage.classList.remove("show");
      this.cartPage.classList.add("shut");
    });
    this.cartIcon.addEventListener("click", () => {
      this.cartPage.classList.remove("shut");
      this.cartPage.classList.add("show");
    });

    // Apply coupon button
    this.couponApply.addEventListener("click", () => this.applyCoupon());
  }

  /**
   * Add new item to cart or increase quantity if it exists
   */
  saveOrUpdateItem(data) {
    const index = this.goods.findIndex((i) => i.id === data.id);
    if (index !== -1) this.goods[index].num++;
    else this.goods.unshift({ ...data, num: 1, checked: true });
    this.render();
  }

  /**
   * Edit a property of a cart item
   */
  editItemProperty(id, key, value) {
    const item = this.goods.find((i) => i.id === id);
    if (item) {
      item[key] = value;
      this.render();
    }
  }

  /**
   * Delete item by id
   */
  deleteItem(id) {
    this.goods = this.goods.filter((i) => i.id !== id);
    this.render();
  }

  /**
   * Select or deselect all items
   */
  selectAllItems(isSel) {
    this.goods.forEach((i) => (i.checked = isSel));
    this.render();
  }

  /**
   * Update the select-all checkbox state
   */
  updateSelectAllCheckbox() {
    const total = this.goods.length;
    const checkedCount = this.goods.filter((i) => i.checked).length;

    if (total > 0 && checkedCount === total) {
      this.selectAllNode.checked = true;
      this.selectAllNode.indeterminate = false;
    } else if (checkedCount > 0) {
      this.selectAllNode.checked = false;
      this.selectAllNode.indeterminate = true;
    } else {
      this.selectAllNode.checked = false;
      this.selectAllNode.indeterminate = false;
    }
  }

  /**
   * Calculate subtotal, discount, tax, and total
   */
  calculateTotal() {
    let quantity = 0,
      subtotal = 0,
      discount = 0;

    this.goods.forEach((i) => {
      if (i.checked) {
        quantity += i.num;
        subtotal += parseFloat(i.price.slice(1)) * i.num;
      }
    });

    if (this.appliedCoupon)
      discount = subtotal * (this.appliedCoupon.discount / 100);
    const discountedPrice = subtotal - discount;
    const tax = discountedPrice * this.taxRate;
    const finalTotal = discountedPrice + tax;

    this.cartNum.textContent = quantity;
    this.amountNode.textContent = `$${subtotal.toFixed(2)}`;
    this.discountNode.textContent =
      discount > 0 ? `-$${discount.toFixed(2)}` : "-$0.00";
    this.discountNode.style.color = discount > 0 ? "green" : "inherit";
    this.taxAmount.textContent = `$${tax.toFixed(2)}`;
    this.totalAmount.textContent = `$${finalTotal.toFixed(2)}`;
  }

  /**
   * Apply coupon code if valid and recalculate total
   */
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

    const coupon = this.couponCodeArr.find((c) => c.code === code);
    if (coupon) {
      this.appliedCoupon = coupon;
      this.discountNode.style.color = "green";
      this.discountNode.textContent = `-${coupon.discount}%`;
    } else {
      this.appliedCoupon = null;
      this.discountNode.style.color = "red";
      this.discountNode.textContent = "Invalid";
    }

    this.calculateTotal();
  }
}

// Initialize the cart instance
const mycart = new Cart();

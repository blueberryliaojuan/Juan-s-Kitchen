class Cart {
  // Array to hold cart items; each item example:
  // {
  //   id: "main001",
  //   title: "Eel Fillet",
  //   price: "$35.00",
  //   url: "../img/MainCourses01s.jpg",
  //   num: 0,
  //   checked: true,
  // }
  goods = [];
  taxRate = 0.05;

  // Cache DOM nodes used in multiple places
  goodsNode = document.getElementById("goods");
  cartPage = document.querySelector("#cartPage");
  addToCartNodes = document.querySelectorAll(".add-to-cart");
  delallNode = document.getElementById("delall");
  selectAllNode = document.getElementById("selectAll");
  amountNode = document.getElementById("amount");
  taxAmount = document.getElementById("taxAmount");
  totalAmount = document.getElementById("totalAmount");
  cartNum = document.getElementById("cartNum");
  cartShutter = document.getElementById("cartShutter");
  cartIcon = document.getElementById("cartIcon");
  couponApply = document.getElementById("couponIcon");
  discountNode = document.getElementById("couponDiscountAmount");

  // Predefined coupon codes with their discount percentages
  couponCodeArr = [
    { code: "HE88T7", discount: 5 },
    { code: "Happy88", discount: 12 },
    { code: "WELCOME95", discount: 5 },
  ];
  appliedCoupon = null; // Currently applied coupon object

  constructor() {
    // Initialize cart goods from localStorage if available; else empty array
    const savedGoods = localStorage.getItem("goods");
    this.goods = savedGoods ? JSON.parse(savedGoods) : [];

    // Render cart UI
    this.render();

    // Setup event listeners for cart interaction
    this.addEventListeners();

    // Update "Select All" checkbox state on initialization
    this.updateSelectAllCheckbox();
  }

  /**
   * Render the cart UI by generating HTML for each cart item
   * Also update totals and save current state to localStorage
   */
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
              <ion-icon name="remove-circle-outline"></ion-icon>
            </button>
            <input
              type="text"
              class="form-control form-control-sm text-center"
              value="${item.num}"
              readonly
              style="width: 40px; color: ${
                item.num !== 1 ? "#dc3545" : "inherit"
              };"
            />
            <button type="button" class="custom-btn quantity-increase" aria-label="Increase quantity">
              <ion-icon name="add-circle-outline"></ion-icon>
            </button>
          </div>
          <div class="col-1 text-center">
            <button type="button" class="custom-btn text-danger delete-item p-0" aria-label="Delete item">
              <ion-icon name="trash-outline"></ion-icon>
            </button>
          </div>
        </div>`;
    });

    this.goodsNode.innerHTML = html;

    // Update totals (count, price, tax, discount)
    this.calculateTotal();

    // Persist the current cart to localStorage
    localStorage.setItem("goods", JSON.stringify(this.goods));

    // Update "Select All" checkbox based on current items' state
    this.updateSelectAllCheckbox();
  }

  /**
   * Add all necessary event listeners to enable cart interactions
   */
  addEventListeners() {
    // Reference to this class instance for use in callbacks
    const self = this;

    // Add to cart button: add or update item quantity
    this.addToCartNodes.forEach((btn) => {
      btn.addEventListener("click", () => {
        self.saveOrUpdateItem(btn.parentNode.dataset);
      });
    });

    // Event delegation for cart item actions (checkbox, quantity buttons, delete)
    this.goodsNode.addEventListener("click", (e) => {
      const rowElement = e.target.closest("[id]");
      if (!rowElement) return; // If no parent row found, ignore

      const id = rowElement.id;

      // Checkbox toggle
      if (e.target.name === "ckboxs") {
        self.editItemProperty(id, "checked", e.target.checked);
      }

      // Quantity buttons (increase or decrease)
      else if (
        e.target.name === "remove-circle-outline" ||
        e.target.name === "add-circle-outline"
      ) {
        const item = self.goods.find((g) => g.id === id);
        if (!item) return;

        // Increase or decrease quantity, but not below 0
        const delta = e.target.name === "add-circle-outline" ? 1 : -1;
        item.num = Math.max(0, item.num + delta);

        self.editItemProperty(id, "num", item.num);
      }

      // Delete item button
      else if (e.target.name === "trash-outline") {
        self.deleteItem(id);
      }
    });

    // Select All checkbox toggle
    this.selectAllNode.addEventListener("click", (e) => {
      self.selectAllItems(e.target.checked);
    });

    // Clear all items from cart
    this.delallNode.addEventListener("click", () => {
      self.goods = [];
      self.render();
    });

    // Close cart panel
    this.cartShutter.addEventListener("click", () => {
      this.cartPage?.classList.remove("show");
      this.cartPage?.classList.add("shut");
    });

    // Open cart panel
    this.cartIcon.addEventListener("click", () => {
      this.cartPage?.classList.remove("shut");
      this.cartPage?.classList.add("show");
    });

    // Apply coupon code
    this.couponApply.addEventListener("click", () => {
      self.applyCoupon();
    });
  }

  /**
   * Add a new item to the cart or increment quantity if it exists
   * @param {Object} data - The item data attributes (id, title, price, url)
   */
  saveOrUpdateItem(data) {
    const index = this.goods.findIndex((item) => item.id === data.id);
    if (index !== -1) {
      // Item exists: increment quantity
      this.goods[index].num++;
    } else {
      // New item: add to start of the goods array, default num=1, checked=true
      this.goods.unshift({ ...data, num: 1, checked: true });
    }
    this.render();
  }

  /**
   * Update a specific property (like 'num' or 'checked') for a cart item by id
   * @param {string} id - The item's unique identifier
   * @param {string} key - Property to update
   * @param {*} value - New value for the property
   */
  editItemProperty(id, key, value) {
    const item = this.goods.find((item) => item.id === id);
    if (item) {
      item[key] = value;
      this.render();
    }
  }

  /**
   * Remove an item from the cart by its id
   * @param {string} id - Item id to remove
   */
  deleteItem(id) {
    this.goods = this.goods.filter((item) => item.id !== id);
    this.render();
  }

  /**
   * Select or deselect all items in the cart
   * @param {boolean} isSelected - true to select all, false to deselect all
   */
  selectAllItems(isSelected) {
    this.goods.forEach((item) => {
      item.checked = isSelected;
    });
    this.render();
  }

  /**
   * Update the state of the "Select All" checkbox based on current item selection
   * Sets checkbox to checked, unchecked, or indeterminate
   */
  updateSelectAllCheckbox() {
    const totalItems = this.goods.length;
    const checkedItems = this.goods.filter((item) => item.checked).length;

    if (totalItems > 0 && checkedItems === totalItems) {
      this.selectAllNode.checked = true;
      this.selectAllNode.indeterminate = false;
    } else if (checkedItems > 0) {
      this.selectAllNode.checked = false;
      this.selectAllNode.indeterminate = true;
    } else {
      this.selectAllNode.checked = false;
      this.selectAllNode.indeterminate = false;
    }
  }

  /**
   * Calculate and update the cart totals: quantity, original price, discount, tax, and final price
   */
  calculateTotal() {
    let totalQuantity = 0;
    let originalPrice = 0;
    let discountAmount = 0;

    // Calculate totals only for checked items
    this.goods.forEach((item) => {
      if (item.checked) {
        totalQuantity += item.num;
        originalPrice += item.num * parseFloat(item.price.slice(1));
      }
    });

    // Calculate discount if a coupon is applied
    if (this.appliedCoupon) {
      const discountRate = parseFloat(this.appliedCoupon.discount) / 100;
      discountAmount = originalPrice * discountRate;
    }

    const discountedPrice = originalPrice - discountAmount;
    const tax = discountedPrice * this.taxRate; // Assume 5% tax
    const finalPrice = discountedPrice + tax;

    // Update UI elements with calculated values
    this.cartNum.textContent = totalQuantity;
    this.amountNode.textContent = `$${originalPrice.toFixed(2)}`;
    this.discountNode.textContent = `-$${discountAmount.toFixed(2)}`;
    this.discountNode.style.color = discountAmount > 0 ? "green" : "inherit";
    this.taxAmount.textContent = `$${tax.toFixed(2)}`;
    this.totalAmount.textContent = `$${finalPrice.toFixed(2)}`;
  }

  /**
   * Validate and apply a coupon code entered by the user
   * Updates the discount and recalculates totals
   */
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

// Instantiate the Cart class and render initial UI
const mycart = new Cart();
// mycart.render();

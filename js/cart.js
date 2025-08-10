class Cart {
  goods = [
    // 示例数据格式：
    // {
    //   id: "main001",
    //   title: "Eel Fillet",
    //   price: "$35.00",
    //   url: "../img/MainCourses01s.jpg",
    //   num: 0,
    //   checked: true,
    // },
  ];

  //constructor 初始化执行
  constructor() {
    // 初始化时，从本地拿去数据
    this.goods = localStorage.getItem("goods")
      ? JSON.parse(localStorage.getItem("goods"))
      : [];
    this.render();
    this.addevent();
    // 全选按钮，也需要初始化
    this.editSelectAll();
  }

  //获取goods节点
  goodsNode = document.getElementById("goods");
  //2、渲染数据
  render(h) {
    var str = "";
    for (var i = 0; i < this.goods.length; i++) {
      str += `
          <div class="row align-items-center py-2 border-bottom" id="${
            this.goods[i].id
          }">
              <div class="col-1 text-center">
                <input type="checkbox" name="ckboxs" value="${
                  this.goods[i].id
                }" ${this.goods[i].checked ? "checked" : ""} />
              </div>
              <div class="col-2 text-center">
                <img src="${this.goods[i].url}" alt="${
        this.goods[i].title
      }" class="img-fluid rounded cart-item-img" />
              </div>
              <div class="col-4 text-truncate" title="${this.goods[i].title}">${
        this.goods[i].title
      }</div>
              <div class="col-2 text-end">${this.goods[i].price}</div>
              <div class="col-2 d-flex justify-content-center align-items-center gap-2">
                <button type="button" class="custom-btn quantity-decrease" aria-label="Decrease quantity">
                  <ion-icon name="remove-circle-outline"></ion-icon>
                </button>
                <input type="text" class="form-control form-control-sm text-center" value="${
                  this.goods[i].num
                }" readonly style="width: 40px; color: ${
        this.goods[i].num != 1 ? "#dc3545" : "inherit"
      };" />
                <button type="button" class="custom-btn quantity-increase" aria-label="Increase quantity">
                  <ion-icon name="add-circle-outline"></ion-icon>
                </button>
              </div>
              <div class="col-1 text-center">
                <button type="button" class="custom-btn text-danger delete-item p-0" aria-label="Delete item">
                  <ion-icon name="trash-outline"></ion-icon>
                </button>
              </div>
          </div>
      `;
    }
    this.goodsNode.innerHTML = str;
    // 调用商品总数量，以及总价格
    this.calculateTotal();
    // 保存数据到本地
    localStorage.setItem("goods", JSON.stringify(this.goods));
    //change checkbox status
    this.editSelectAll();
  }

  //3 targeting doms
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

  //所有监听事件的函数
  addevent() {
    var _this = this;

    // 添加商品按钮事件
    this.addToCartNodes.forEach((item) => {
      item.addEventListener("click", function () {
        _this.saveData(item.parentNode.dataset);
      });
    });

    // 购物车内事件委托
    this.goodsNode.addEventListener("click", function (e) {
      if (e.target.name === "ckboxs") {
        const id = e.target.closest("[id]").id;
        const checked = e.target.checked;
        _this.editData(id, "checked", checked);
      }

      if (
        e.target.name === "remove-circle-outline" ||
        e.target.name === "add-circle-outline"
      ) {
        const id = e.target.closest("[id]").id;
        const item = _this.goods.find((item) => item.id === id);
        if (item) {
          item.num = Math.max(
            0,
            item.num + (e.target.name === "add-circle-outline" ? 1 : -1)
          );
          _this.editData(id, "num", item.num);
        }
      }

      if (e.target.name === "trash-outline") {
        const id = e.target.closest("[id]").id;
        _this.delData(id);
      }
    });

    // 全选按钮
    this.selectAllNode.addEventListener("click", function (e) {
      const isAllChecked = e.target.checked;
      _this.selectAll(isAllChecked);
      _this.editSelectAll();
    });

    // 清空购物车
    this.delallNode.addEventListener("click", function () {
      _this.goods = [];
      _this.render();
    });

    // 关闭购物车面板
    this.cartShutter.addEventListener("click", function () {
      _this.cartPage?.classList.remove("show");
      _this.cartPage?.classList.add("shut");
    });

    // 打开购物车面板
    this.cartIcon.addEventListener("click", function () {
      _this.cartPage?.classList.remove("shut");
      _this.cartPage?.classList.add("show");
    });

    this.couponApply.addEventListener("click", function () {
      _this.applyCoupon();
    });
  }

  // 新增或更新商品数据
  saveData(data) {
    const itemIndex = this.goods.findIndex((item) => item.id === data.id);
    if (itemIndex !== -1) {
      this.goods[itemIndex].num++;
    } else {
      this.goods.unshift({ ...data, num: 1, checked: true });
    }
    this.render();
  }

  // 修改商品属性
  editData(id, key, value) {
    for (let i = 0; i < this.goods.length; i++) {
      if (this.goods[i].id === id) {
        this.goods[i][key] = value;
      }
    }
    this.render();
  }

  // 删除商品
  delData(id) {
    this.goods = this.goods.filter((item) => item.id !== id);
    this.render();
  }

  // 全选或反选
  selectAll(isAllChecked) {
    this.goods.forEach((item) => {
      item.checked = isAllChecked;
    });
    this.render();
  }

  // 更新全选按钮状态
  editSelectAll() {
    const total = this.goods.length;
    const checkedCount = this.goods.filter((item) => item.checked).length;

    if (total > 0 && checkedCount === total) {
      // 全选
      this.selectAllNode.checked = true;
      this.selectAllNode.indeterminate = false;
    } else if (checkedCount > 0) {
      // 半选
      this.selectAllNode.checked = false;
      this.selectAllNode.indeterminate = true;
    } else {
      // 全不选
      this.selectAllNode.checked = false;
      this.selectAllNode.indeterminate = false;
    }
  }

  // 计算总价、税费、数量
  calculateTotal() {
    let count = 0;
    let originalAmount = 0; // 折扣前金额
    let discountAmount = 0;
    let discountedAmount = 0;
    let taxAmount = 0;
    let totalAmount = 0;

    this.goods.forEach((item) => {
      if (item.checked) {
        count += item.num;
        originalAmount += item.num * parseFloat(item.price.slice(1));
      }
    });

    if (this.appliedCoupon) {
      const discountValue = parseFloat(this.appliedCoupon.discount) / 100;
      discountAmount = originalAmount * discountValue;
    }

    discountedAmount = originalAmount - discountAmount;
    taxAmount = discountedAmount * 0.05;
    totalAmount = discountedAmount + taxAmount;

    // 更新显示
    this.cartNum.textContent = count;

    // 这里amountNode显示原价（折扣前）
    this.amountNode.textContent = `$${originalAmount.toFixed(2)}`;

    // 优惠金额
    this.discountNode.textContent = `-$${discountAmount.toFixed(2)}`;

    // 税额
    this.taxAmount.textContent = `$${taxAmount.toFixed(2)}`;

    // 最终总价（折扣+税）
    this.totalAmount.textContent = `$${totalAmount.toFixed(2)}`;
  }

  //coupon
  couponCodeArr = [
    { code: "HE88T7", discount: 5 },
    { code: "Happy88", discount: 12 },
    { code: "WELCOME95", discount: 5 },
  ];
  appliedCoupon = null;
  applyCoupon() {
    const couponInput = document.querySelector(".coupon-input");
    const code = couponInput.value.trim();

    const foundCoupon = this.couponCodeArr.find((c) => c.code === code);

    if (foundCoupon) {
      this.appliedCoupon = foundCoupon;
      this.discountNode.style.color = "green";
      this.discountNode.textContent = `-${foundCoupon.discount}%`;
      // couponInput.value = "";
      // alert("Coupon applied!");
    } else {
      this.appliedCoupon = null;
      this.discountNode.style.color = "red";
      this.discountNode.textContent = "Invalid";
    }

    this.calculateTotal();
  }
}

const mycart = new Cart();
mycart.render();

class Cart {
  goods = [
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
          <div class="tr" id="${this.goods[i].id}">
              <div>
                <input type="checkbox" name="ckboxs" value="${
                  this.goods[i].id
                }" ${this.goods[i].checked ? "checked" : ""}/>
              </div>
              <div>
                <img
                  src="${this.goods[i].url}"
                  alt=""
                  class="cart-item-img"
                />
              </div>
              <div>${this.goods[i].title}</div>
              <div>${this.goods[i].price}</div>
              <div>
                <ion-icon
                    name="remove-circle-outline"
                    class="quantity-change"
                  ></ion-icon
                >
               <input type="text" value=${this.goods[i].num} readonly="" />
            <ion-icon
                    name="add-circle-outline"
                    class="quantity-change"
                  ></ion-icon
                >
              </div>
              <div>
              <ion-icon name="trash-outline" class="trash-outline"></ion-icon>
              </div>
            </div>
      `;
    }
    this.goodsNode.innerHTML = str;
    // 调用商品总数量，以及总价格
    this.calculateTotal();
    // 保存数据到本地
    localStorage.setItem("goods", JSON.stringify(this.goods));
  }

  //3 targeting doms
  cartPage = document.querySelector("#cartPage");
  addcartNode = document.getElementById("addcart");
  addToCartNodes = document.querySelectorAll(".add-to-cart");
  titleNode = document.getElementById("title");
  priceNode = document.getElementById("price");
  delallNode = document.getElementById("delall");
  selectAllNode = document.getElementById("selectAll");
  countNode = document.getElementById("count");
  amountNode = document.getElementById("amount");
  taxAmount = document.getElementById("taxAmount");
  totalAmount = document.getElementById("totalAmount");
  cartNum = document.getElementById("cartNum");
  cartShutter = document.getElementById("cartShutter");
  cartIcon = document.getElementById("cartIcon");

  //所有监听事件的函数
  addevent() {
    // 3.3 保存当前实例的this
    var _this = this;
    // 3.2 addcart添加购物车按钮的点击事件
    this.addToCartNodes.forEach((item) => {
      item.addEventListener("click", function () {
        //3.5获取用户输入的商品名以及价格，传递给保存数据函数
        _this.saveData(item.parentNode.dataset);
      });
    });

    // 4、监听复选框状态，采用事件委托，监听goodsNode
    this.goodsNode.addEventListener("click", function (e) {
      // console.log(" e", e.target.name);
      //4.1 e.target.name 获取目标对象身上的name属性，用来标识点击对象的不同，从而有不同的处理逻辑
      if (e.target.name == "ckboxs") {
        // 4.2 获取点击按钮的id，以及状态，传递给修改函数，进行数据的修改
        var id = e.target.parentNode.parentNode.id;
        var checked = e.target.checked;
        // console.log(id, checked);
        _this.editData(id, "checked", checked);
      }

      //5. handleQuantityChange
      if (
        ["remove-circle-outline", "add-circle-outline"].includes(e.target.name)
      ) {
        // console.log("Quantity modification triggered");
        // Retrieve the ID of the item to modify
        const id = e.target.closest("[id]").id;
        // console.log("id", id);
        // Find the item in the goods array
        const item = _this.goods.find((item) => item.id === id);
        if (item) {
          // Adjust the quantity based on the button clicked, ensuring it remains zero or above
          item.num = Math.max(
            0,
            item.num + (e.target.name === "add-circle-outline" ? 1 : -1)
          );
          // Update the data using the editData function
          _this.editData(id, "num", item.num);
        }
      }

      //delete the item from the list
      if (e.target.name == "trash-outline") {
        //6.2 获取点击删除按钮的id
        var id = e.target.parentNode.closest("[id]").id;
        //6.3 将准备好的id传递给删除函数
        _this.delData(id);
      }
    });

    // 7、全选按钮
    this.selectAllNode.addEventListener("click", function (e) {
      //7.2 获取全选按钮的状态，全选按钮的状态跟每个商品的状态一直
      var isAllChecked = e.target.checked;
      //7.3 传递全选状态给处理函数
      _this.selectAll(isAllChecked);
      // 8.1、监听复选框状态，如果全部为true，则全选按钮为true
      _this.editSelectAll();
    });

    // 9、清空购物车
    this.delallNode.addEventListener("click", function () {
      _this.goods = [];
      _this.render();
    });

    //cartShutter
    this.cartShutter.addEventListener("click", function (e) {
      console.log("e", e);
      console.log("this.cartPage", _this.cartPage);
      _this.cartPage?.classList.add("shut");
    });

    //open the cart
    this.cartIcon.addEventListener("click", function (e) {
      console.log("e", e);
      _this.cartPage?.classList.remove("shut");
      _this.cartPage?.classList.add("show");
    });
  }

  //3.6 saveData
  saveData(data) {
    // Find the item in the goods array with the matching ID
    const itemIndex = this.goods.findIndex((item) => item.id === data.id);
    if (itemIndex !== -1) {
      // If found, increment the `num` property
      this.goods[itemIndex].num++;
    } else {
      // If not found, add the new item to the beginning of the goods array
      this.goods.unshift({ ...data, num: 1, checked: true });
    }
    // console.log("Updated goods:", this.goods);
    // Call the render function to refresh the UI
    this.render();
  }
  //  4.3 、修改数据函数,修改哪个id，哪个属性，哪个值
  editData(id, key, value) {
    // 4.4遍历数据，筛选出，要修改哪条数据，然后把对应属性以及属性值修改了
    for (let index = 0; index < this.goods.length; index++) {
      if (this.goods[index].id == id) {
        this.goods[index][key] = value;
      }
    }
    // 4.4 修改后，需要重新渲染
    this.render();
  }

  //6、删除数据函数  id，删除哪个数据
  delData(id) {
    this.goods = this.goods.filter(function (item) {
      return item.id != id;
    });
    this.render();
  }

  //7.4、全选与反全选
  selectAll(isAllChecked) {
    for (let index = 0; index < this.goods.length; index++) {
      this.goods[index].checked = isAllChecked;
    }
    this.render();
  }

  // 8.2、处理单选与全选交互
  editSelectAll() {
    var goodCheck = 0;
    for (let index = 0; index < this.goods.length; index++) {
      if (this.goods[index].checked) {
        goodCheck += 1;
      }
    }
    if (this.goods.length == goodCheck) {
      this.selectAllNode.checked = true;
    } else {
      this.selectAllNode.checked = false;
    }
  }

  //10、calculate the total price and dish amount
  calculateTotal() {
    let count = 0;
    let amount = 0;
    let taxAmount = 0;
    let totalAmount = 0;

    this.goods.forEach((item) => {
      if (item.checked) {
        count += item.num;
        amount += item.num * parseFloat(item.price.slice(1));
      }
    });

    taxAmount = amount * 0.05; // Example tax rate of 5%
    totalAmount = amount + taxAmount;

    // Update DOM elements
    this.countNode.textContent = count;
    this.cartNum.textContent = count;
    this.amountNode.textContent = `$${amount.toFixed(2)}`;
    this.taxAmount.textContent = `$${taxAmount.toFixed(2)}`;
    this.totalAmount.textContent = `$${totalAmount.toFixed(2)}`;
  }
}

var mycart = new Cart();
mycart.render();

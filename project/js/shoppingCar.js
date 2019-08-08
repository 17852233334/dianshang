; (
    function () {
        "use strict"
        class ShoppingCar {
            constructor() {
                this.goodsData = [];
                this.publicUrl = "http://localhost/myfile/project/html/public.html";
                this.goodsUrl = "http://localhost/myfile/project/datas/goodsList.json";
                this.init();
            }
            init() {
                require.config({
                    baseUrl: "../modules",
                    paths: {
                        jQuery: "../src/jquery",
                        ajaxPost: "ajaxPost",
                        publicJS: "../js/public"
                    }
                });
                require(["jQuery", "ajaxPost","publicJS"], (_, ajaxPost) => {
                    this.ajaxPost = ajaxPost;
                    $("header").load(this.publicUrl + " #headerWrap");
                    $("footer").load(this.publicUrl + " #footerWrap");
                    this.getData();
                });
            }
            getData() {
                this.purchasedData = JSON.parse(localStorage.getItem("purchasedGoods"));
                this.ajaxPost(this.goodsUrl, (res) => {
                    this.res = JSON.parse(res);
                    if (this.purchasedData) {
                        this.display();
                    } else {
                        $("tbody").html('<tr><td colspan="8">当前没有加入购物车中的商品...</td></tr>');
                    }
                })
            }
            display() {
                let str = "";
                for (let i = 0; i < this.purchasedData.length; i++) {
                    for (let j = 0; j < this.res.length; j++) {
                        if (this.purchasedData[i].sku === this.res[j].sku) {
                            str += `
                                <tr goodsId="${this.purchasedData[i].sku}">
                                    <td><input type="checkBox" class="check"></td>
                                    <td><img src="${this.res[j].src}"></td>
                                    <td>${this.res[j].goodsInfo}</td>
                                    <td>$ ${this.res[j].price}</td>
                                    <td>
                                        <button class="minus">-</button>
                                        <span class="amount">${this.purchasedData[i].amount}</span>
                                        <button class="plus">+</button>
                                    </td>
                                    <td>$ ${(this.res[j].price * this.purchasedData[i].amount).toFixed(2)}</td>
                                    <td><button class="delete">DELETE</button></td>
                                </tr>`;
                        }
                    }
                }
                $("tbody").html(str);
                this.bindEvent();
            }
            bindEvent() {
                let that = this;
                setTimeout(()=>{
                    $(".category").on({
                        mouseover: function(){
                            $(".list").show();
                        },
                        mouseout: function(){
                            $(".list").hide();
                        }
                    });
                },0)
                $("table").click(function (event) {
                    that.target = $(event.target);
                    that.goodsId = that.target.parent().parent().attr("goodsId");
                    switch (event.target.className) {
                        case "minus": that.minus(); break;
                        case "plus": that.plus(); break;
                        case "delete": that.delete(); break;
                        case "clearAll": that.clearAll(); break;
                        case "settle": that.settle();
                    }
                })
                $("#checkAll").click(() => {
                    this.ifCheckAll();
                })
            }
            minus() {
                this.purchasedData
                if (this.target.next().html() < 0) {
                    this.delete();
                } else {
                    this.amount = this.target.next().html() - 1;
                    this.target.next().html(this.amount);
                    this.totalPrice = this.target.parent().prev().html().substr(1) * this.amount;
                    this.target.parent().next().html("$ " + this.totalPrice.toFixed(2));
                }
                this.setAmount();
            }
            plus() {
                this.amount = parseInt(this.target.prev().html()) + 1;
                this.target.prev().html(this.amount);
                this.totalPrice = this.target.parent().prev().html().substr(1) * this.amount;
                this.target.parent().next().html("$ " + this.totalPrice.toFixed(2));
                this.setAmount();
            }
            delete() {
                for (let i = 0; i < this.purchasedData.length; i++) {
                    if (this.goodsId === this.purchasedData[i].sku) {
                        this.purchasedData.splice(i, 1);
                    }
                }
                if (this.purchasedData) {
                    localStorage.setItem("purchasedGoods", JSON.stringify(this.purchasedData));
                }
                this.target.parent().parent().remove();
                if (!$("tbody").children().length) {
                    $("tbody").html('<tr><td colspan="8">当前没有加入购物车中的商品...</td></tr>')
                }
            }
            clearAll() {
                $("tbody").html('<tr><td colspan="8">当前没有加入购物车中的商品...</td></tr>');
                this.purchasedData = "";
                localStorage.setItem("purchasedGoods", JSON.stringify(this.purchasedData));
            }
            settle() {
                let sumPrice = 0;
                if ($("#checkAll").get(0).checked) {
                    for (let i = 0; i < $("tbody tr").length; i++) {
                        sumPrice += parseFloat($("tbody tr").eq(i).find("td").eq(5).html().substr(1));
                        this.target.parent().next().html("$ " + sumPrice.toFixed(2));
                        let res = confirm("购买所有商品,您需要支付$ " + sumPrice);
                        if (res) {
                            this.purchasedData = "";
                            localStorage.setItem("purchasedGoods", JSON.stringify(this.purchasedData));
                            $("tbody").html('<tr><td colspan="8">当前没有加入购物车中的商品...</td></tr>');
                            this.target.parent().next().html("");
                            $("#checkAll").get(0).checked = false;
                        }
                    }
                } else {
                    for (let i = 0; i < $("tbody tr").length; i++) {
                        if ($("tbody .check").get(i).checked) {
                            sumPrice += parseFloat($("tbody tr").eq(i).find("td").eq(5).html().substr(1));
                            this.target.parent().next().html("$ " + sumPrice.toFixed(2));
                            setTimeout(() => {
                                let res = confirm("购买所有商品,您需要支付$ " + sumPrice);
                                if (res) {
                                    this.purchasedData.splice(i, 1);
                                    localStorage.setItem("purchasedGoods", JSON.stringify(this.purchasedData));
                                    $("tbody tr").eq(i).remove();
                                    this.target.parent().next().html("");
                                }
                            }, 0);
                        }
                    }
                    if (!$("tbody").find("tr").length) {
                        $("tbody").html('<tr><td>当前没有添加任何商品....</td></tr>');
                    }
                }
            }
            ifCheckAll() {
                if ($("#checkAll").get(0).checked) {
                    for (let i = 0; i < $(".check").length; i++) {
                        $(".check").get(i).checked = true;
                    }
                } else {
                    for (let i = 0; i < $(".check").length; i++) {
                        $(".check").get(i).checked = false;
                    }
                }
            }
            setAmount() {
                for (let i = 0; i < this.purchasedData.length; i++) {
                    if (this.purchasedData[i].sku === this.goodsId) {
                        this.purchasedData[i].amount = this.amount;
                    }
                }
                localStorage.setItem("purchasedGoods", JSON.stringify(this.purchasedData));
            }
        }
        new ShoppingCar();
    }
)();
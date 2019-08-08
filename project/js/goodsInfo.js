; (function () {
    class GoodsList {
        constructor() {
            this.publicUrl = "http://localhost/myfile/project/html/public.html";
            this.goodsUrl = "http://localhost/myfile/project/datas/goodsList.json"
            this.init();
        }
        init() {
            require.config({
                baseUrl: "../modules",
                paths: {
                    jQuery: "../src/jquery",
                    ajaxPost: "ajaxPost",
                    publicJS: "../js/public",
                    Magnifier: "magnifier"
                }
            });
            require(["jQuery", "ajaxPost", "publicJS", "Magnifier"], (_, ajaxPost, n, Magnifier) => {
                this.ajaxPost = ajaxPost;
                $("header").load(this.publicUrl + " #headerWrap");
                $("footer").load(this.publicUrl + " #footerWrap");
                $("#sideMenuWrap").load(this.publicUrl + " #sideMenu");
                this.getGoodsData();
                this.Magnifier = Magnifier;
            });
        }
        getGoodsData() {
            this.purchasedGoods = JSON.parse(localStorage.getItem("purchasedGoods"));
            this.ajaxPost(this.goodsUrl, (res) => {
                this.res = JSON.parse(res);
                this.display();
            })
        }
        display() {
            let goodsHref = location.search;
            this.goodsId = goodsHref.slice(1, goodsHref.length).split("=")[1];
            this.amount = 0;
            if(this.purchasedGoods){
                for(let s = 0; s < this.purchasedGoods.length; s++){
                    this.amount += this.purchasedGoods[s].amount;
                }
            }
            let str = "";
            for (let i = 0; i < this.res.length; i++) {
                if (this.res[i].sku === this.goodsId) {
                    $("title").html(this.res[i].goodsInfo);
                    var stock = this.res[i].stock !== 0 ? this.res[i].stock : 0,
                        sail = this.res[i].sail !== 0 ? this.res[i].sail : 0;
                    str += `
                    <section class="goods">
                        <div class="goodsImg">
                            <div class="smImg">
                                <img src="${this.res[i].src}" alt="" ondragstart="return false">
                                <span class="move"></span>
                            </div>
                            <div class="bigImg">
                                <img src="${this.res[i].src}" alt="">
                            </div>
                        </div>
                        <div class="options">
                            <h3 class="goodsInfo">${this.res[i].goodsInfo}</h3>
                            <p class="price">价格 <span>$ ${this.res[i].price}</span></p>
                            <p class="sku">SKU: <span>${this.res[i].sku}</span><em></em></p>
                            <p class="stockAddSailAmount">
                                <span class="stock">库存：${stock}</span>
                                <span class="sail">销量：${sail}</span>
                            </p>
                            <p class="adjustAmount">
                                数量：<button class="minus">-</button>
                                <span class="amount">${this.amount}</span>
                                <button class="add">+</button>
                            </p>
                            <p class="buy">
                                <span class="buyNow">立即购买</span>
                                <span class="addCar">加入购物清单</span>
                            </p>
                        </div>
                    </section>`;
                }
            }
            $("main").html(str);
            new this.Magnifier();
            this.addToCar();
            this.adjustAmount();
            this.categoryShowOrHide();
        }
        categoryShowOrHide() {
            $("header .category").on({
                "mouseover": function () {
                    $(this).find(".list").show();
                },
                "mouseout": function () {
                    $(this).find(".list").hide();
                }
            })
        }
        addToCar() {
            let that = this;
            let status = "new";
            $(".addCar").click(function () {
                if (that.purchasedGoods) {
                    for (let i = 0; i < that.purchasedGoods.length; i++) {
                        if (that.goodsId === that.purchasedGoods[i].sku) {
                            that.purchasedGoods[i].amount++;
                            status = "old";
                            break;
                        }
                    }
                    if (status === "new") {
                        that.purchasedGoods.push({
                            "sku": that.goodsId,
                            "amount": 1
                        })
                    }
                } else {
                    that.purchasedGoods = [{
                        "sku": that.goodsId,
                        "amount": 1
                    }]
                }
                localStorage.setItem("purchasedGoods",JSON.stringify(that.purchasedGoods));
                that.amount++;
                $("#sideMenu .menu").find("li").eq(0).find("span").html(that.amount);
                $("header .car .amount").html(that.amount);
                $(".amount").html(that.amount);
            });
        }
        adjustAmount() {
            let that = this;
            $(".minus").click(function(){
                if(that.purchasedGoods){
                    for(let i = 0; i < that.purchasedGoods.length; i++){
                        if(that.purchasedGoods[i].sku === that.goodsId){
                            if(that.purchasedGoods[i].amount < 0){
                                that.purchasedGoods[i].amount = 0;
                            }else{
                                that.purchasedGoods[i].amount--;
                            }
                        }
                    }
                    localStorage.setItem("purchasedGoods",JSON.stringify(that.purchasedGoods));
                }
                if(that.amount <= 0){
                    that.amount = 0;
                }else{
                    that.amount--;
                }
                $("#sideMenu .menu").find("li").eq(0).find("span").html(that.amount);
                $("header .car .amount").html(that.amount);
                $(".amount").html(that.amount);
            });
            $(".add").click(function(){
                if(that.purchasedGoods){
                    for(let i = 0; i < that.purchasedGoods.length; i++){
                        if(that.purchasedGoods[i].sku === that.goodsId){
                            that.purchasedGoods[i].amount++;
                        }
                    }
                    localStorage.setItem("purchasedGoods",JSON.stringify(that.purchasedGoods));
                    that.amount++;
                }
                $("#sideMenu .menu").find("li").eq(0).find("span").html(that.amount);
                $("header .car .amount").html(that.amount);
                $(".amount").html(that.amount);
            });
        }
        
    }
    new GoodsList();
})();
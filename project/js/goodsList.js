;(function(){
    class GoodsList{
        constructor(){
            this.maxNum = 4;
            this.pageIndex = 0;
            this.publicUrl = "http://localhost/myfile/project/html/public.html";
            this.goodsUrl = "http://localhost/myfile/project/datas/goodsList.json"
            this.init();
        }
        init(){
            let goods = JSON.parse(localStorage.getItem("purchasedGoods"));
            this.totalAmount = 0;
            if(goods){
                for(let i = 0; i < goods.length; i++){
                    this.totalAmount += goods[i].amount
                }
            }
            require.config({
                baseUrl: "../modules",
                paths: {
                    jQuery: "../src/jquery",
                    ajaxPOst: "ajaxPost",
                    publicJS: "../js/public"
                }
            });
            require(["jQuery","ajaxPost","publicJS"],(_,ajaxPost)=>{
                this.ajaxPost = ajaxPost;
                $("header").load(this.publicUrl + " #headerWrap");
                $("footer").load(this.publicUrl + " #footerWrap");
                $("#sideMenuWrap").load(this.publicUrl + " #sideMenu");
                this.account = JSON.parse(localStorage.getItem("accountInfo"));
                setTimeout(()=>{
                    $("#sideMenu .menu").find("li").eq(0).find("span").html(this.totalAmount);
                    $("header .car .amount").html(this.totalAmount);
                },0)
                this.getGoodsData();
                this.bindEvent();
            });
        }
        getGoodsData(){
            this.ajaxPost(this.goodsUrl,(res)=>{
                this.res = JSON.parse(res);
                this.display();
                this.createPage();
            })
        }
        createPage(){
            this.pageNum = Math.ceil(this.res.length/this.maxNum);
            let str = "";
            for(let i = 0; i < this.pageNum; i++){
                str += `<li>${i+1}</li>`;
            }
            $(".pageList").html(str);
            this.setActivePage();
            this.switchPage();
        }
        switchPage(){
            var that = this;
            $(".page").on("click",function(event){
                switch(event.target.className){
                    case "prevBtn": that.changePageIndex(-1);break;
                    case "nextBtn": that.changePageIndex(1);break;
                    case "": {
                        that.pageIndex = $(event.target).index();
                    };break;
                }
                that.setActivePage();
                that.display();
            })
        }
        changePageIndex(direction){
            if(direction === -1){
                if(this.pageIndex === 0){
                    this.pageIndex = 0;
                }else{
                    this.pageIndex--;
                }
            }else{
                if(this.pageIndex === $(".pageList li").length-1){
                    this.pageIndex = $(".pageList li").length-1;
                }else{
                    this.pageIndex++;
                }
            }
        }
        setActivePage(){
            $(".pageList").find("li").css({
                background: "",
                color: "#000"
            }).eq(this.pageIndex).css({
                background: "#030303",
                color: "#fff"
            });
        }
        display(){
            let str = "";
            for(let i = this.maxNum * this.pageIndex; i < (this.pageIndex+1)*this.maxNum; i++){
                if(i > this.res.length-1)break;
                var stock = this.res[i].stock !== 0 ? this.res[i].stock : 0,
                    sail = this.res[i].sail !== 0 ? this.res[i].sail : 0,
                    generation = this.res[i].generation ? generation : "",
                    stockBook = this.res[i].stockBook ? stockBook : "";
                str += `
                        <div class="product">
                        <a href="../html/goodsInfo.html?goosId=${this.res[i].sku}" class="goodsImg">
                            <img src="${this.res[i].src}" alt="">
                        </a>
                        <p class="goodsInfo">${this.res[i].goodsInfo}</p>
                        <p class="priceAddSupport">
                            <span class="price">$ ${Number(this.res[i].price).toFixed(2)}</span>
                            <em href="#" class="${generation}"></em>
                            <em href="#" class="${stockBook}"></em>
                        </p>
                        <p class="sku">SKU: <span>${this.res[i].sku}</span><em></em></p>
                        <p class="stockAddSailAmount">
                            <span class="stock">库存：${stock}</span>
                            <span class="sail">销量：${sail}</span>
                        </p>
                        <p class="addCar">加入购买清单</p>
                    </div>`;
            }
            $("main .itemsWrap").html(str);
            this.categoryShowOrHide();
        }
        categoryShowOrHide(){
            $("header .category").on({
                "mouseover": function(){
                    $(this).find(".list").show();
                },
                "mouseout": function(){
                    $(this).find(".list").hide();
                }
            })
        }
        bindEvent(){
            $("#sideMenuWrap").on("click",(event)=>{
                if(event.target.className === "backToTop"){
                    $("html").scrollTop(0);
                }
            })
            $("main .itemsWrap").on("click",(event)=>{
                if(event.target.className === "addCar"){
                    this.sku = $(event.target).parent().find(".sku").find("span").html();
                    this.storageGoodsData();
                }
            })
        }
        storageGoodsData(){
            let status = "new";
            this.purchasedGoods = JSON.parse(localStorage.getItem("purchasedGoods"));
            if(this.purchasedGoods){
                for(let i = 0; i < this.purchasedGoods.length; i++){
                    if(this.sku === this.purchasedGoods[i].sku){
                        this.purchasedGoods[i].amount++;
                        status = "old";
                        break;
                    }
                }
                if(status === "new"){
                    this.purchasedGoods.push({
                        "sku": this.sku,
                        "amount": 1
                    })
                }
            }else{
                this.purchasedGoods = [{
                    "sku": this.sku,
                    "amount": 1
                }]
            }
            localStorage.setItem("purchasedGoods",JSON.stringify(this.purchasedGoods));
            this.totalAmount++;
            $("#sideMenu .menu").find("li").eq(0).find("span").html(this.totalAmount);
            $("header .car .amount").html(this.totalAmount);
        }
    }
    new GoodsList();
})();
;(
    function(){
        "use strict"
        class Public{
            constructor(){
                this.init();
            }
            init(){
                require.config({
                    baseUrl: "../modules",
                    paths: {
                        jQuery: "../src/jquery",
                        ajaxPost: "ajaxPost",
                        category: "category"
                    }
                });
                require(["jQuery","ajaxPost","category"],(_,ajaxPost,Category)=>{
                    setTimeout(() => {
                        new Category({
                            wrap: $(".category .list"),
                            ajaxPost: ajaxPost
                        });
                    }, 0);
                    this.account = JSON.parse(localStorage.getItem("accountInfo"));
                    this.bindEvent();
                    this.setPurchasedAmount()
                });
            }
            setPurchasedAmount(){
                let goods = JSON.parse(localStorage.getItem("purchasedGoods"));
                this.totalAmount = 0;
                if(goods){
                    for(let i = 0; i < goods.length; i++){
                        this.totalAmount += goods[i].amount
                    }
                }
                setTimeout(()=>{
                    $("header .car .amount").html(this.totalAmount);
                    $("#sideMenu .menu").find("li").eq(0).find("span").html(this.totalAmount);
                },0)
            }
            bindEvent(){
                $(".car").click(()=>{
                    for(let i = 0; i < this.account.length; i++){
                        if(this.account[i].loginStatus){
                            $(".car").attr("href","../html/shoppingCar.html");
                        }
                    }
                })
            }
        }
        new Public();
    }
)();
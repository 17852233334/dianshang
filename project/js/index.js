;(
    function(){
        "use strict"
        class Main{
            constructor(){
                this.publicUrl = "http://localhost/myfile/project/html/public.html";
                this.goodsUrl = "http://localhost/myfile/project/datas/goodsList.json";
                this.init();
            }
            init(){
                require.config({
                    baseUrl: "../modules",
                    paths: {
                        jQuery: "../src/jquery",
                        banner: "banner",
                        publicJS: "../js/public",
                        ajaxPost: "ajaxPost",
                        Floor: "floor"
                    }
                });
                require(["jQuery","banner","ajaxPost","Floor","publicJS"],(_,banner,ajaxPost,Floor)=>{
                    ajaxPost(this.goodsUrl,(res)=>{
                        this.res = JSON.parse(res);
                    });
                    $("header").load(this.publicUrl + " #headerWrap");
                    $("footer").load(this.publicUrl + " #footerWrap");
                    $("#sideMenuWrap").load(this.publicUrl + " #sideMenu");
                    $("#floorWrap").load(this.publicUrl + " #floor");
                    this.bindEvent();
                    new Floor();
                    new banner.fn({
                        images: $("#banner a"), // 必传参数
                        switchMode: "BOTH",    // 可选参数，LRB: 左右按钮切换；DOT: 点击下方小圆点切换；BOTH: LRB 和 DOT 二者都可切                        换，默认为 LRB
                        autoPlayStatus: true, // 可选参数，true： 开启自动切换；false: 关闭自动切换；默认为true
                        intervals: 2000,      // 可选参数，传递时间毫秒值，自动切换间隔时间，当自动切换状态为false，该参数无效，默认                          为2000ms自动切换一次
                        transitionTime: 1000   //可选参数，传递时间毫秒值，每次切换图片完成时间，默认为1000ms
                    });
                });
            }
            bindEvent(){
                $("#sideMenuWrap").on("click",function(event){
                    if(event.target.className === "backToTop"){
                        $("html").scrollTop(0);
                    }
                });
                $(".overseas .topWrap .rightWrap li").find("span").click(function(){
                    $(".overseas .topWrap .rightWrap li").find(".list").css({
                        display: "none"
                    });
                    $(this).next(".list").css({
                        display: "block"
                    });
                })
            }
        }
        new Main();
    }
    )()
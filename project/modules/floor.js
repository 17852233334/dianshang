"use strict"
define(function(){
    class Floor{
        constructor(){
            this.index = 0;
            this.activeArr = ["-666","-506","-346","-786","-906","-306"];
            this.basisArr = ["-706","-626","-386","-266","-586","-546"];
            this.showOrHide();
        }
        showOrHide(){
            var that = this;
            document.onscroll = function(){
                if($("html").scrollTop() > $(".platForm").offset().top-200){
                    $("#floor").show();
                    that.setActive();
                    that.bindEvent();
                }else{
                    $("#floor").hide();
                }
                 for(let i = 0; i < that.basisArr.length; i++){
                    if($("html").scrollTop >= that.basisArr[i] && $("html").scrollTop <= that.basisArr[i+1]){
                        $("#floor ul em").eq(i).css({
                            backgroundPosition: -that.activeArr[i] + "px -796px"
                        })
                    }
                }
            }
        }
        bindEvent(){
            var that = this;
            $("#floor ul").find("li").click(function(){
                that.index = $(this).index();
                that.setActive($(this).index);
                if($(this).index() === $("#floor ul").find("li").length-1){
                    $("html").scrollTop(0);
                }else{
                    $("html").scrollTop($("main .layout>div").eq($(this).index()+1).offset().top);
                }
            });
        }
        setActive(){
            for(let i = 0; i < $("#floor ul").find("li").length; i++){
                $("#floor ul").find("em").eq(i).css({
                    backgroundPosition: this.basisArr[i] + "px -796px"
                })
            }
            $("#floor ul").find("em").eq(this.index).css({
                backgroundPosition: this.activeArr[this.index] + "px -796px"
            })
        }
    }
    return Floor;
});
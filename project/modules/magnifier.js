"use strict"
define(function(){
    class Magnifier{
        constructor(){
            this.moveSpan();
        }
        moveSpan(){
            let that = this;
            let smImg = $(".goodsImg .smImg");
            let bigImg = $(".goodsImg .bigImg");
            let move = $(".smImg .move");
            smImg.on("mousedown",(event)=>{
                let x = event.offsetX;
                let y = event.offsetY;
                move.css({
                    left: x + "px",
                    top: y + "px"
                })
                move.show();
                $("html").on({
                    mousemove: function(event){
                        let l = event.screenX - smImg.offset().left - move.width()/2;
                        let t = event.screenY - smImg.offset().top;
                        if(l < 0) l = 0;
                        if(t < 0) t = 0;
                        if(l > smImg.width() - move.width()){
                            l = smImg.width() - move.width();
                        };
                        if(t > smImg.height() - move.height()){
                            t = smImg.height() - move.height();
                        };
                        move.css({
                            left: l + "px",
                            top: t + "px"
                        })
                        bigImg.show();
                        that.moveBigImg(l,t);
                        $("html").click((event)=>{
                            event.preventDefault();
                        })
                    },
                    mouseup: function(){
                        move.hide();
                        bigImg.hide();
                        $("html").off("mousemove");
                        $("html").off("mouseup");
                    }
                })
            })
        }
        moveBigImg(l,t){
            let x = l / $(".smImg").width() * ($(".bigImg img").width() - $(".bigImg").width());
            let y = t / $(".smImg").height() * ($(".bigImg .img").height() - $(".bigImg").height());
            $(".bigImg img").css({
                left: -l + "px",
                top: -t + "px"
            })
        }
    }
    return Magnifier;
});
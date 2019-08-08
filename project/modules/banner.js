define(function () {
    class Banner {
        constructor(options) {
            this.images = options.images;
            this.switchMode = options.switchMode ? options.switchMode : "LRB";
            this.autoPlayStatus = options.autoPlayStatus === false ? false : true;
            this.transitionTime = options.transitionTime ? options.transitionTime : 1000;
            if (this.autoPlayStatus) {
                this.intervals = options.intervals ? options.intervals : 2000;
            }
            this.bannerBox = this.images.parent().parent();
            this.currentIndex = 0;
            this.w = this.images.eq(0).width();
            this.len = this.images.length;
            this.init();
        }
        init() {
            this.images.css({
                left: this.w + "px"
            }).eq(0).css({
                left: 0
            });
            this.autoPlay();
            switch (this.switchMode) {
                case "LRB": {
                    this.setLRBStyle();
                }; break;
                case "DOT": {
                    this.setDOTStyle();
                }; break;
                case "BOTH": {
                    this.setBOTHStyle();
                }; break;
            }
        }
        setLRBStyle() {
            let tabBtnBox = $("<div class='tabBtnBox'></div>");
            tabBtnBox.css({
                display: "none",
                position: "absolute",
                height: "40px",
                left: 0,
                right: 0,
                top: "50%",
                marginTop: "-20px"
            }).append($("<button class='prev'>&lt;&lt;&lt;</button><button class='next'>&gt;&gt;&gt;</button>"))
                .children().css({
                    border: "none",
                    background: "rgba(0,0,0,.6)",
                    width: "60px",
                    height: "40px",
                    padding: 0,
                    margin: 0,
                    font: "20px/2 ''",
                    color: "#ccc",
                    outline: "none"
                }).end().find(".prev").css({
                    float: "left"
                }).end().find(".next").css({
                    float: "right"
                });
            this.bannerBox.append(tabBtnBox);
            this.showOrHide(tabBtnBox);
            this.switchByLRB();
        }
        switchByLRB() {
            var that = this;
            // 上一张
            $(".tabBtnBox .prev").on("click", function (event) {
                clearInterval(that.timer);
                that.changeIndex(-1);
            });
            // 下一张
            $(".tabBtnBox .next").on("click", function () {
                clearInterval(that.timer);
                that.changeIndex(1);
            });
        }
        setDOTStyle() {
            let tabDotBox = $('<div class="tabDotBox"></div>');
            let str = "";
            for (var i = 0; i < this.len; i++) {
                str += `<span>${i + 1}</span>`;
            }
            tabDotBox.html(str).css({
                position: "absolute",
                width: "80%",
                display: "flex",
                justifyContent: "center",
                bottom: "10px",
                left: 0,
                right: 0,
                margin: "auto",
                font: '15px/2 ""',
                color: "#fff"
            }).children().css({
                width: "30px",
                height: "30px",
                margin: "0 5px",
                background: "rgba(6,6,6,.6)",
                textAlign: "center",
                cursor: "default",
                borderRadius: "50%"
            });
            this.bannerBox.append(tabDotBox);
            $(".tabDotBox span").eq(this.currentIndex).css({
                background: "rgba(255,0,255,.6)"
            });
            this.showOrHide(tabDotBox);
            this.switchByDOT(tabDotBox);
        }
        switchByDOT(obj) {
            obj.on("click",(event)=>{
                var targetIndex = $(event.target).index();
                if(targetIndex > this.currentIndex){
                    this.moveImg(targetIndex,1);
                }else if(targetIndex !== this.currentIndex){
                    this.moveImg(targetIndex,-1);
                }
                this.currentIndex = targetIndex;
                this.setActive();
            });
        }
        setBOTHStyle() {
            this.setLRBStyle();
            this.setDOTStyle();
        }
        showOrHide(obj) {
            obj.hide();
            this.bannerBox.on({
                mouseover: function () {
                    obj.show();
                },
                mouseout: function () {
                    obj.hide();
                }
            })
        }
        changeIndex(direction) {
            // 上一张
            if (direction === -1) {
                if (this.currentIndex === 0) {
                    this.currentIndex = this.len - 1;
                    this.awayIndex = 0;
                } else {
                    this.currentIndex--;
                    this.awayIndex = this.currentIndex + 1;
                }
            } else {
                // 下一张
                if (this.currentIndex === this.len - 1) {
                    this.currentIndex = 0;
                    this.awayIndex = this.len - 1;
                } else {
                    this.currentIndex++;
                    this.awayIndex = this.currentIndex - 1;
                }
            }
            this.display(direction);
            this.setActive();
        }
        display(direction) {
            this.images.eq(this.awayIndex).css({
                left: 0
            }).stop().animate({
                left: -this.w * direction
            }, this.transitionTime)
                .end()
                .eq(this.currentIndex).css({
                    left: this.w * direction
                }).stop().animate({
                    left: 0
                }, this.transitionTime);
        }
        moveImg(targetIndex,direction){
            this.images.eq(this.currentIndex).css({
                left: 0
            }).stop().animate({
                left: -this.w * direction
            },this.transitionTime)
            .end()
            .eq(targetIndex).css({
                left: this.w * direction
            }).stop().animate({
                left: 0
            },this.transitionTime);
        }
        autoPlay(){
            var that = this;
            if(!this.autoPlayStatus)return;
            this.timer = null;
            this.timer = setInterval(() => {
                that.changeIndex(1);
            }, that.intervals);
            this.bannerBox.hover(()=>{
                clearInterval(that.timer);
            },()=>{
                this.timer = setInterval(()=>{
                    that.changeIndex(1);
                },that.intervals);
            })
        }
        setActive(){
            $(".tabDotBox span").css({
                background: "rgba(6,6,6,.6)"
            }).eq(this.currentIndex).css({
                background: "rgba(255,0,255,.6)"
            });
        }
    }
    return {
        fn: Banner
    };
});
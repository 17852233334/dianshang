"use strict"
define(function(){
    class Category{
        constructor(options){
            this.wrap = options.wrap;
            this.ajaxPost = options.ajaxPost;
            this.categoryUrl = "http://localhost/myfile/project/datas/category.json";
            this.getData();
        }
        getData(){
            this.ajaxPost(this.categoryUrl,(res)=>{
                this.res = JSON.parse(res);
                this.display();
            });
        }
        display(){
            let first = this.res[0].first;
            let second = this.res[1].second;
            let str = "";
           for(let f = 0; f < first.length; f++){ 
                let secondStr = "";
                for(let i in second[f]){
                    let thirdStr = "";
                    for(let g = 0; g < second[f][i].length; g++){
                        thirdStr += `
                                <li><a href="../html/goodsList.html">${second[f][i][g]}</a></li>`;
                    }
                    secondStr += `
                                <dd>
                                    <a href= "../html/goodsList.html" lass="secondCont">${i}</a>
                                    <ul class="third">${thirdStr}</ul>
                                </dd>
                                `;
                }
                str += `<li class="first">
                            <a href="../html/goodsList.html" class="firstCont">${first[f]}</a>
                            <dl class="second">${secondStr}</dl>
                        </li>`;
            }
            this.wrap.html(str);
            this.showOrHide();
        }
        showOrHide(){
            $(".list .first").on({
                "mouseover": function(){
                    $(".first .second").hide();
                    $(this).find(".second").show();
                },
                "mouseout": function(){
                    $(this).find(".second").hide();
                }
            });
            $(".second dd").on({
                "mouseover": function(){
                    $(".second .third").hide();
                    $(this).find(".third").show().css({
                        display: "flex"
                    });
                },
                "mouseout": function(){
                    $(this).find(".third").hide();
                }
            })
        }
    }
    return Category;
});
let gulp = require("gulp");
let proxy = require("http-proxy-middleware");
let connect = require("gulp-connect");
let concat = require("gulp-concat");
let uglify = require("gulp-uglify");
let rename = require("gulp-rename");
let babel = require("gulp-babel");
let sass = require("gulp-sass");
// 文件转存，将开发环境下的代码，转存到上线环境中
gulp.task("saveTo",()=>{
    gulp.src(["./myFile/off-line/project/**/*","!./myFile/off-line/project/{sass,sass/**}","!./myFile/off-line/project/{js,js/**}"])
    .pipe(gulp.dest("./myFile/on-line/project"))
    .pipe(connect.reload());
});
// 实时监测线下文件的动向，更新线上文件
gulp.task("listen",()=>{
    gulp.watch(["./myFile/off-line/project/**/*"],["saveTo","SassToCSS","es6Toes5"]);
})
// gulp-connect插件的使用，开启服务器，实现自动转存，并且浏览器自动刷新，开启服务器，同时自动刷新浏览器
gulp.task("openServer",()=>{
    // 引入gulp-connect插件的配置代码
    connect.server({
        root: "./myFile/on-line/project",
        port: 8888,
        livereload: true
    });
})

// 解决跨域的三种常用方式：jsonp,cors,服务器代理
// 服务器代理的原理：通过自己搭建一个代理服务器，利用服务器与服务器之间的通信不存在跨域的特性，获取数据，再通过请求代理服务器的数据即可
gulp.task("proxyServer",()=>{
    connect.server({
        root: "./myFile/on-line/project",
        port: 8800,
        middleware: function(connect, opt) {
            return [
                proxy('/api',  {
                    target: 'https://api.douban.com/v2',    //代理的目标地址
                    changeOrigin:true,
                    pathRewrite:{    //路径重写规则
                        '^/api':''
                    }
                })
            ]
        }
    });
});
// 合并
gulp.task("concat-min-rename-file",()=>{
    gulp.src("./myFile/off-line/project/js/*.js")
    // 合并
    .pipe(concat("index.js"))
    .pipe(gulp.dest("./myFile/on-line/project/js"))
    // 压缩
    .pipe(uglify())
    // 改名
    .pipe(rename("index.min.js"))
    .pipe(gulp.dest("./myFile/on-line/project/js"));
})
// ES6转ES5 
gulp.task("es6Toes5",()=>{
    gulp.src("./myFile/off-line/project/js/*.js")
    .pipe(babel())
    .pipe(gulp.dest("./myFile/on-line/project/js"));
})
// sass转css
gulp.task("SassToCSS",()=>{
    gulp.src("./myFile/off-line/project/sass/*.scss")
    .pipe(sass().on("error",sass.logError))
    .pipe(gulp.dest("./myFile/on-line/project/css")).pipe(connect.reload());
})
// 同时执行多个指令
gulp.task("default",["openServer","listen"]);
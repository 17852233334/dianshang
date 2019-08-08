; (
    function () {
        "use strict"
        class Login {
            constructor() {
                this.init();
            }
            init() {
                require.config({
                    baseUrl: "../modules",
                    paths: {
                        jQuery: "../src/jquery"
                    }
                });
                require(["jQuery"], () => {
                    this.bindEvent();
                });
            }
            bindEvent() {
                var that = this;
                $("#login .loginBtn").click(function () {
                    that.user = $("#login .user").val();
                    that.pwd = $("#login .pwd").val();
                    that.account = JSON.parse(localStorage.getItem("accountInfo"));
                    if(!that.account){
                        let res = confirm("当前用户信息不存在，是否需要注册...");
                        if(res){
                            $("#login").hide();
                             $("#register").show();
                            new Register();
                            return;
                        }
                    }else{
                        that.verify();
                    }
                })
                setTimeout(()=>{
                    $("#login .user").on("blur",()=>{
                        this.user = $("#login .user").val();
                        if(!this.user){
                            $("#login .user").next().html("用户名未输入，请输入...");
                        }else{
                            $("#login .user").next().html("");
                        }
                    })
                    $("#login .pwd").on("blur",()=>{
                        this.pwd = $("#login .pwd").val();
                        if(!this.pwd){
                            $("#login .pwd").next().html("密码未输入，请输入...");
                        }else{
                            $("#login .pwd").next().html("");
                        }
                    })
                },0)
                $("#login #reg").click(() => {
                    $("#login").hide();
                    this.clearRegister();
                    $("#register").show();
                    new Register();
                })
                $("header button").click(() => {
                    $("#login").hide();
                    this.clearRegister();
                    $("#register").show();
                    new Register();
                })
            }
            verify(){
                let a = false;
                let b = false;
                for(let i = 0; i < this.account.length; i++){
                    if(this.user === this.account[i].user && this.pwd === this.account[i].pwd){
                        this.account[i].loginStatus = true;
                        localStorage.setItem("accountInfo",JSON.stringify(this.account));
                        location.href = "../html/index.html";
                        return;
                    }else{

                    }
                }
                for(let j = 0; j < this.account.length; j++){
                    if(this.user === this.account[j].user){
                        a = true;
                    }
                }
                if(!a){
                    $("#login .user").next().html("当前用户不存在或输入有误...");
                }

                for(let j = 0; j < this.account.length; j++){
                    if(this.pwd === this.account[j].pwd){
                        b = true;
                    }
                }
                if(!b){
                    $("#login .pwd").next().html("密码输入错误...")
                }
            }
            clearRegister(){
                $("#register .user").val("");
                $("#register .pwd").val("");
                $("#register .tel").val("");
                $("#register #confirmPwd").val("");
                $("#register .wrap span").html("");
            }
        }
        class Register{
            constructor(){
                this.bindEvent();
            }
            bindEvent(){
                $("#register .regBtn").click(()=>{
                    this.verify();
                })
                $("#register #goLogin").click(() => {
                    this.clearLogin();
                    $("#login").show();
                    $("#register").hide();
                    new Login();
                })
                setTimeout(()=>{
                    $("#register .user").on("blur",()=>{
                        this.user = $("#register .user").val();
                        if(!this.user){
                            $("#register .user").next().html("用户名未输入，请输入...");
                        }else{
                            $("#register .user").next().html("");
                        }
                    })
                    $("#register .tel").on("blur",()=>{
                        this.tel = $("#register .tel").val();
                        if(!this.tel){
                            $("#register .tel").next().html("用户名未输入，请输入...");
                        }else{
                            $("#register .tel").next().html("");
                        }
                    })
                    $("#register .pwd").on("blur",()=>{
                        this.pwd = $("#register .pwd").val();
                        if(!this.pwd){
                            $("#register .pwd").next().html("密码未输入，请输入...");
                        }else{
                            $("#register .pwd").next().html("");
                        }
                    })
                    $("#register #confirmPwd").on("blur",()=>{
                        this.confirmPwd = $("#register #confirmPwd").val();
                        if(!this.confirmPwd){
                            $("#register #confirmPwd").next().html("请再次输入密码...");
                        }else{
                            $("#register #confirmPwd").next().html("");
                        }
                    })
                },0)
            }
            verify(){
                let a = false;
                let b = false;
                this.account = JSON.parse(localStorage.getItem("accountInfo"));
                if(this.account){
                    for(let i = 0; i < this.account.length; i++){
                        if(this.user !== this.account[i].user){
                            a = true;
                        }
                    }
                }else{
                    a = true;
                }
                if(!a){
                    $("#register .user").next().html("当前账户已存在，请前往登录...");
                }
                if(this.confirmPwd !== this.pwd){
                    $("#register #confirmPwd").next().html("密码确认失败...");
                }else{
                    b = true;
                }
                if(a && b){
                    this.commit();
                }
            }
            commit(){
                let userInfo = {
                    "user": this.user,
                    "pwd": this.pwd,
                    "tel": this.tel,
                    "loginStatus": false
                }
                if(this.account){
                    this.account.push(userInfo);
                }else{
                    this.account = [{
                        "user": this.user,
                        "pwd": this.pwd,
                        "tel": this.tel,
                        "loginStatus": false
                    }]
                }
                localStorage.setItem("accountInfo",JSON.stringify(this.account));
                let res = confirm("注册成功，请前往登录...");
                if(res){
                    this.clearLogin();
                    $("#login").show();
                    $("#register").hide();
                    new Login();
                }
            }
            clearLogin(){
                $("#login .user").val("");
                $("#login .pwd").val("");
                $("#login .wrap span").html("");
            }
        }
        new Login();
    }
)();
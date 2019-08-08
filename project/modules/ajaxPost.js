define(() => {
    function ajaxPost(url,callback,data){
        data = data ? data : {};
        let str = "";
        for(let i in data){
            str += `${i}=${data[i]}&`;
        }
        str = str.slice(0,str.length);
        let ajax = new XMLHttpRequest();
        ajax.open("post",url,true);
        ajax.onreadystatechange = function(){
            if(ajax.readyState === 4 && ajax.status === 200){
                callback(ajax.responseText);
            }
        }
        ajax.send(str);
    }
    return ajaxPost;
});

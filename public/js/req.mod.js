const request = {
    get: function(url, success){
        let xhr = request.creatHTTP(success);
        xhr.open("GET", url);
        xhr.send();
    },
    post: function(url, success){
    
    },
    delete: function(url, success){
    
    },
    creatHTTP: function(cbFn){
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && this.status == 200)
            cbFn(xhr.responseText);
        
        }
        return xhr;
    }
}
export {request};
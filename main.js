const http = require('http');
const fs = require('fs');
const path = require('path');
const MIME = {
    js: "text/javascript",
    json: "application/json",
    html: "text/html",
    css: "text/css",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    svg: "image/svg+xml",
    csv: "text/csv",
    txt: "text/plain",
    ico: "image/x-icon",
    type: function(ext){
        return MIME[ext] != undefined ? MIME[ext] : MIME.txt;
    }
}
http.createServer((request, response)=>{
    switch(true){
        case request.method == "GET" && request.url == "/":
            fs.readFile(__dirname+'/public/index.html', function(err, fileContent){
                response.writeHead(200, {'Content-type':'text/html; charset=utf8'});
                response.write(fileContent);
                response.end();
            });
            break;

        case request.method == "GET" && request.url == "/times":
            fs.readFile(__dirname+'/times.json', function(err, resText){
                response.writeHead(200, {'Content-type':'application/json; charset=utf8'});
                response.write(resText);
                response.end();
            });
            break;
        
        default:
            let ext = path.extname(request.url).slice(1);
            let mimetype = MIME.type(ext);
            fs.readFile(path.join(__dirname, "public", request.url), function(err, fileContent){
                if (err){
                    response.writeHead(200, {'Content-type': MIME.type("txt") });
                    response.write("A kért oldal nem található");
                    response.end();
                }else{
                    response.writeHead(200, {'Content-type': mimetype });
                    response.write(fileContent);
                    response.end();
                }
            })
    }
}).listen(3001);
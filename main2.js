const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.use(
    express.static(path.join(__dirname, 'public'))
);
//Read
app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, body) => {
        res.writeHead(200, {
            "content-length": Buffer.byteLength(body),
            "content-type": "text/html"
        })
        .end(body)
    })
});

app.get('/times', (req, res) => {
    fs.readFile(path.join(__dirname, 'times.json'), (err, fileContent) => {
        res.json(JSON.parse(fileContent));
    });
});
app.use( express.json() );
//Creat
app.post('/times', (req, res) => {
    const newTime = req.body;
    //newTime.id = new Date().getTime();

    fs.readFile(__dirname + '/foglalasok.json', function(err, resText){
                    
        const SELTIME = JSON.parse(resText);
        SELTIME.push(newTime);            
            fs.writeFile(__dirname + '/foglalasok.json', JSON.stringify(SELTIME), function(err){
                    res.json({message: "OK"}); 
                });
    });
});
//Edit
app.post('/edittimes', (req, res) => {
    const editedTimes = req.body;
    fs.readFile(__dirname + '/times.json', function(err, resText){
                    
        const TIME = JSON.parse(resText);
        //let tim = editedTimes.id;//TIME.find(t => t.id == editedTimes.id);
        //let tim; 
            for(let i = 0; i < TIME.length; i++){
                for(let j = 0; j < TIME[i].length; j++){
                    if(TIME[i][j].id === editedTimes.id){
                        TIME[i][j].booked = true;
                    }
                }
            }
            //tim.booked = editedTimes.booked;
            //tim.booked = true;
            fs.writeFile(__dirname + '/times.json', JSON.stringify(TIME), function(err){
                    res.json({message: "OK"}); 
                });
             
    });
});
//Delet
/*app.delete('/product/:id', (req, res) => {
    const deletedId = req.params.id;
    fs.readFile(__dirname + '/termekek.json', function(err, resText){
                    
        const PRODUCTS = JSON.parse(resText);
        const deletedIndex = PRODUCTS.findIndex(p => p.id == deletedId);

        PRODUCTS.splice(deletedIndex, 1);        

        fs.writeFile(__dirname + '/termekek.json', JSON.stringify(PRODUCTS), function(err){
            res.json({message: "A termék sikeresen törölve"});
        });
    });
});*/
app.listen(3001);
const fs = require('fs');
const path = require('path');
const express = require("express");
const app = express();
const mongodb = require('mongodb');
const { request } = require('http');
const { response } = require('express');
const MongoClient = mongodb.MongoClient;

function dbConnect(callBack){
    const uri = "mongodb+srv://Greg:Bajcsizsm2016@jsvizsga.w5tdxnt.mongodb.net/test";

    const client = new MongoClient(uri, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    });
    
    client.connect().then(res => {
        let collection = client.db('jsvizsga').collection('times');
        callBack(client, collection);
    });
}
app.use(
    express.static(path.join(__dirname, 'public'))
);
app.get('/', (request, response) => {
    dbConnect((cli, coll) =>{
        coll.find()
            .toArray()
            .then(res => {
                response.json(res);
                cli.close();
            });
    });
});
app.listen(3000);
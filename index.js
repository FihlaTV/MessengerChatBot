"use strict";

var express= require("express");
var bodyParser= require("body-parser");
var request= require("request");

var app= express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Routes
app.get('/', function (req, res) {
    res.send("I am a chatbot");
});

//Facebook
app.get('/webhook/', function (req, res) {
    if(req.query['hub.verify_token'] === 'password'){
        res.send(req.query['hub.challenge']);
    }
    res.send("Wrong  Token");
});

app.listen(5000, function (req, res) {
    console.log("Server listening on port 5000");
});
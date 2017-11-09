"use strict";

var express= require("express");
var bodyParser= require("body-parser");
var request= require("request");
var secret= require("./secret.json");

var app= express();

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var token = secret.app_token;
var password= secret.app_secret;

//Routes
app.get('/', function (req, res) {
    res.send("I am a chatbot");
});

//Facebook
app.get('/webhook/', function(req, res) {
    if (req.query['hub.verify_token'] === password) {
        return res.send(req.query['hub.challenge']);
    }else{
        res.send("Wrong token");
    }
});

app.post('/webhook/', function(req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = messaging_events[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
            sendText(sender, "Text echo: " + text.substring(0, 100));
        }
    }
    res.sendStatus(200);
});

function sendText(sender, text) {
    let messageData = {text: text}
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs : {access_token: token},
        method: "POST",
        json: {
            recipient: {id: sender},
            message : messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log("sending error");
        } else if (response.body.error) {
            console.log("response body error");
        }
    });
}

app.listen(app.get('port'), function (req, res) {
    console.log("Server listening on port 5000");
});
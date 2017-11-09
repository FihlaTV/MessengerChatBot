"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var secret = require("./secret.json");

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var token = secret.app_token;
var password = secret.app_secret;

//Routes
app.get('/', function (req, res) {
    res.send("I am a chatbot");
});

//Facebook
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === password) {
        return res.send(req.query['hub.challenge']);
    } else {
        res.send("Wrong token");
    }
});

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = messaging_events[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text;
            decideMessage(sender, text);
        }
    }
    res.sendStatus(200);
});

function decideMessage(sender, text1) {
    let text = text1.toLowerCase();
    if (text.includes('download')) {
        console.log("Download button sent");
        sendButtonMessage(sender);
    } else if (text.includes('problem') || text.includes('bad')) {
        console.log("bad sent");
        sendText(sender,"Hi i am a bot, We are sorry for your bad expirience. A member of our team will respond soon.");
    } else {
        console.log("Default case sent");
        sendText(sender,"Hi i am a bot, A member from our team will get back to you shortly");
    }
}

function sendButtonMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                    "text": "Download our app from here",
                "buttons": [
                    {
                        "type": "web_url",
                        "url": "https://play.google.com/store/apps/details?id=com.zcorp.game.othello&hl=en",
                        "title": "Othello",
                        "webview_height_ratio": "full",
                        "messenger_extensions": true,
                    },
                ]
            }
        }
    };
    sendRequest(sender,messageData);
}

function sendText(sender, text) {
    let messageData = {text: text};
    sendRequest(sender, messageData);
}

function sendRequest(sender, messageData) {
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token: token},
        method: "POST",
        json: {
            recipient: {id: sender},
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log("sending error: "+ JSON.stringify(error));
        } else if (response.body.error) {
            console.log("response body error: "+JSON.stringify(response.body.error));
            console.log("body: "+ JSON.stringify(body));
        }
    });
}

app.listen(app.get('port'), function (req, res) {
    console.log("Server listening on port 5000");
});
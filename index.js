"use strict";

var express= require("express");
var bodyParser= require("body-parser");
var request= require("request");

var app= express();

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var token = "EAAdZAZBb0GkLsBAMJUny0cOZBMN6ZBLryZAWWIbQcACz708Gv5fY1Di8qHWDkF6F3mitjMaEJBkgJK2XZCZCTGXlpHYWlNW8ZCO6MVsCZBw0P4E342Eqrr2E5zehVoBvPwLicZCGF0YjPOVjKzUvjRn3xleK3ZAvfZAX21K7vuLZCXKAl6gZDZD";

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

app.post('/webhook/', function (req, res) {
    var messaging_events= req.body.entry[0].messaging;
    for(var i=0;i<messaging_events.length;i++){
        var event= messaging_events[i];
        var sender= event.sender.id;
        if(event.message && event.message.text){
            var text= event.message.text;
            sendText(sender,"Text echo:" + text.substring(0,100));
        }
    }

    res.sendStatus(200);
});

function sendText(sender, text) {
    var messageData={text:text};
    request({
        url:"https://graph.facebook.com/v2.6/me/messages",
        qs:{access_token: token},
        method: "POST",
        json:{
            recipient:{id: sender},
            message:messageData
        }
    }, function (error, response, body) {
        if(error){
            console.log("sending error");
        }else if(response.body.error){
            console.log("response body error");
        }
    });
}

app.listen(app.get('port'), function (req, res) {
    console.log("Server listening on port 5000");
});
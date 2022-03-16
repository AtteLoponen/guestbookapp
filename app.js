var express = require('express');
var fs = require("fs");
var app = express();
app.use(express.static("./public"));



app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
    console.log("Path: " + __dirname)
});




app.get('/guestbook', function (req, res) {
    res.sendFile(__dirname + '/public/guestbooktable.html');
});



app.get('/newmessage', function (req, res) {
    res.sendFile(__dirname + '/public/newmessage.html');
});


var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); 





app.post("/newmessage", function (req, res) {
    
    var data = require(__dirname + "/public/data.json");
 

    data.push({
        "username": req.body.username,
        "country": req.body.country,
        "date": Date(),
        "message": req.body.message
    });

    
    var jsonStr = JSON.stringify(data);

    
    fs.writeFile('./public/data.json', jsonStr, (err) => {
        if (err) throw err;
        console.log('It\'s saved!')
    });

});

app.get("/ajaxmessage", function (request, response) {
    response.sendFile(__dirname + '/public/ajax.html');
});

app.post("/savemessage", function (request, response) {
    var data = require(__dirname + "/public/data.json");
    let newMessage = {
        username: request.body.username,
        country: request.body.country,
        date: Date(),
        message: request.body.message,
    }
    console.log(newMessage);
    data.push(newMessage);
    
    var jsonStr = JSON.stringify(data);

    
    fs.writeFile('./public/data.json', jsonStr, (err) => {
        if (err) throw err;
        console.log('New ajax message is saved!')
    });

    
    var results = '<table border="1">'
    for (var i = 0; i < data.length; i++) {
        results +=
            '<tr>' +
            '<td>' + data[i].username + '</td>' +
            '<td>' + data[i].country + '</td>' +
            '<td>' + data[i].date + '</td>' +
            '<td>' + data[i].message + '</td>' +
            '</tr>';
    };
    response.send(results);
});



app.get('*', function (req, res) {
    res.status(404).send("Cannot find the requested page");
});

app.listen(process.env.PORT || 3000, function () {
    console.log('App listening on port 3000');
});

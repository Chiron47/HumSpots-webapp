const express = require("express");
var path = require('path');
const app = express();

app.use('/public', express.static('public'));

app.get("/", function(req, res){
    const events = [
    {title: "Event1", date: "Apr 19th", summary: "Event1 summary"},
    {title: "Event2", date: "May 10th", summary: "Event2 summary"}
    ]

    res.render("Events.ejs", {
        events: events
    });
});

app.get("/Trails", function(req, res){
    const trails = [
        {title: "Trail1", distance: "Apr 19th", summary: "Event1 summary"},
        {title: "Trail2", distance: "Map 10th", summary: "Event2 summary"}
    ]

    res.render("Trails.ejs", {
        trails: trails
    });
});

app.get("/Google_Maps", function(req, res){
    res.render("Google_Maps.ejs");
});

app.get("/Login", function(req, res){
    res.render("Login.ejs");
});

app.get("*", function(req, res){
    res.send("Error, that route does not exist.");
});


app.listen(3000, function(){
    console.log("If you see this, Node.js is running on 3000");
});
var express = require("express"),
    app     = express(),
    bodyParser = require("body-parser");
    
app.use(express.static("public"));
    
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

var boardSize = 3;

app.get("/", function(req, res){
   res.render("home"); 
});

app.get("/about", function(req, res){
    res.render("about");
});

app.get("/tic_tac", function(req, res){
    res.render("tic_tac", {
        boardSize: boardSize
    });
});

app.get("/tic_tac", function(req, res){
    res.render("tic_tac");
});

app.get("/maze", function(req, res){
    res.render("maze");
});

app.get("/sort", function(req, res){
    res.render("sort");
});

app.get("/idea", function(req, res){
    res.render("ideaSource");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
});
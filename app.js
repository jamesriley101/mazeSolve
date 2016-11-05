var express = require("express"),
    app     = express(),
    bodyParser = require("body-parser");

app.use(express.static("public"));
    
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

var boardSize = 3;

app.get("/", function(req, res){
   res.render("maze"); 
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

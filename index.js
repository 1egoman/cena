var express = require('express'),
    fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio'),
    querystring = require("querystring"),
    bodyParser = require('body-parser'),
    _ = require("underscore"),
    fs = require("fs"),
    app = express();

// allow CORS
app.use(bodyParser.json());
app.use(express.static(__dirname+'/frontend'));
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

require("./app/routes")(app);



app.listen(process.env.PORT || 8100);

console.log(' * Bound to port :'+(process.env.PORT || 8100));

exports = module.exports = app;

var express = require('express'),
    fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio'),
    querystring = require("querystring"),
    app = express();

// initialize store
weg = require("./stores/wegmans");
weg.setStoreId(10052);

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// get a product's id
app.get('/store/product/id/:pid', function(req, res){

  // get product by id
  weg.getProductById(req.params.pid, function(product) {
    res.send( product || "NONE" );
  })

})

// get a product's url
app.get('/store/product/url', function(req, res){
  // get product by name
  name = querystring.unescape(req.param("url")) || res.send("FAIL")
  weg.getProductByUrl(name, function(product) {
    res.send( product || "NONE" );
  })


})


app.listen('8100')

console.log(' * Bound to port :8100');

exports = module.exports = app;

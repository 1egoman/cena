var express = require('express'),
    fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio'),
    querystring = require("querystring"),
    bodyParser = require('body-parser'),
    _ = require("underscore"),
    fs = require("fs"),
    app = express();

// initialize store
weg = require("./stores/wegmans");
weg.setStoreId(10052);
weg.getKnownProducts()

var list = [];

// allow CORS
app.use(bodyParser.json());
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

});

// get a product's url
app.get('/store/product/url', function(req, res){
  // get product by name
  name = querystring.unescape(req.param("url")) || res.send("FAIL")
  weg.getProductByUrl(name, function(product) {
    res.send( product || "NONE" );
  })

});


// get the list
app.get('/list', function(req, res){
  fs.readFile(__dirname + "/persistant/list.json", function(err, data) {
    if (!err) {
      list = JSON.parse(data);
      res.send({list: list});
    }
  });
});

// set the list
app.post('/list', function(req, res) {
  if (req.body.list) {
    list = req.body.list;

    // set all prices in the known items
    _.each(list, function(item) {
      weg.setProductPrice(item.id, item.price);
    });

    fs.writeFile(__dirname + "/persistant/list.json", JSON.stringify(list, null, 2));

    res.send("OK")
  }
});


app.listen('8100')

console.log(' * Bound to port :8100');

exports = module.exports = app;

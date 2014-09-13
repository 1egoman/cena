var express = require('express'),
    fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio'),
    app = express();

// initialize store
weg = require("./stores/wegmans");
weg.setStoreId(10052);

// get a product's id
app.get('/store/product/:pid', function(req, res){

  // get product by id
  weg.getProductById(req.params.pid, function(product) {
    res.send( product || "NONE" );
  })

  // search by name
  // weg.searchByName(req.params.pid, function(product) {
  //   res.send( product || "NONE" );
  // })
})

app.listen('8100')

console.log(' * Bound to port :8100');

exports = module.exports = app;

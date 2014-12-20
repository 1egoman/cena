var fs = require("fs");
var querystring = require("querystring");
var _ = require("underscore");
var path = require("path");

// initialize store
stores = require("../stores");
stores.byName("Wegmans").setStoreId(10052);
stores.byName("Wegmans").getKnownProducts()
var list = [];

module.exports = function(app) {


  // get a product's id
  app.get('/store/:name/product/id/:pid', function(req, res){

    // get product by id
    console.log( stores.byName(req.params.name) )
    stores.byName(req.params.name).getProductById(req.params.pid, function(product) {
      res.send( product || "NONE" );
    })

  });

  // get a product's url
  app.get('/store/product/url', function(req, res){
    // get product by name
    name = querystring.unescape(req.param("url")) || res.send("FAIL")
    stores.byUrl(name).getProductByUrl(name, function(product) {
      res.send( product || "NONE" );
    })

  });


  // get the list
  app.get('/list', function(req, res){
    fs.readFile(path.join(__dirname, '..', "persistant", "list.json"), function(err, data) {
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
        store = stores.byName(item.storeName);
        if (store.setProductPrice) store.setProductPrice(item.id, item.price);
      });

      fs.writeFile(path.join(__dirname, '..', "persistant", "list.json"), JSON.stringify(list, null, 2));

      res.send("OK")
    }
  });


  // the recipes
  app.get("/recipe", function(req, res) {
    fs.readFile(path.join(__dirname, '..', "persistant", "recipes.json"), function(err, data) {
      if (!err) {
        list = JSON.parse(data);
        res.send({recipes: list});
      }
    });
  });

  app.post('/recipe', function(req, res) {
    if (req.body.recipe) {
      recipe = req.body.recipe;

      fs.writeFile(path.join(__dirname, '..', "persistant", "recipes.json"), JSON.stringify(recipe, null, 2));
      res.send("OK")
    }
  });

}

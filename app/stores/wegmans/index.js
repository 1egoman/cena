var request = require('request'),
    cheerio = require('cheerio'),
    urlParser = require('url'),
    _ = require("underscore"),
    fs = require("fs");
    path = require("path");

module.exports = {

  /**
  Get the name of the store
  */
  getStoreName: function() {
    return "Wegmans";
  },


  knownProducts: {},

  setStoreId: function(id) {
    this.storeId = id;
  },

  getStoreUrlMatch: function() {
    return /wegmans\.com/gi
  },

  /**
  Get product by id
  @param id product id
  */
  getProductById: function(id, callback) {

    // get the product url
    url = 'http://www.wegmans.com/webapp/wcs/stores/servlet/ProductDisplay?storeId=' + this.storeId + '&productId=' + id;
    this.getProductByUrl(url, callback);
  },

  /**
  Search product by name
  @param url product url
  */
  getProductByUrl: function(url, callback) {
    var root = this;

    // parse the url
    parsedUrl = urlParser.parse(url, true);

    // prepend http if needed
    if (url.indexOf("http") === -1) url = "http://" + url;

    // do the request
    request(url, function(error, response, html) {
        console.log(error)
      if(!error) {


        // load html to be scraped
        var $ = cheerio.load(html);


        // test for a known product, if so just send its previous data
        var id = parseInt(parsedUrl.query.productId);
        if ( id > 0 && root.knownProducts[id.toString()]) {
          callback(root.knownProducts[id]);
          return;
        }

        // initialize variables
        var response = {
          name: "",
          imageUrl: "",
          id: id,
          storeName: "Wegmans",
          price: null
        };

        // start the scraping
        var productBody = $("body div#content-primary div.prodHead");

        // item name
        response.name = productBody.find("h1").text();

        // the image
        response.imageUrl = $("link[rel=image_src]").attr("href");

        // add to the known products
        index = root.knownProducts.indexOf(_.find(root.knownProducts, function(a) {
          return a.id == response.id
        }));
        root.knownProducts[index] = response;
        root.saveKnownProducts();

        // return the response
        callback(response);

      }
    });

  },

  setProductPrice: function(id, price) {
    if (this.knownProducts[id]) {
      this.knownProducts[id].price = price;
    } else {
      this.knownProducts[id] = {price: price}
    }

    this.saveKnownProducts()
  },

  saveKnownProducts: function() {
    v = _.uniq(_.filter(this.knownProducts, function(i) {
      return i && i.id > 0;
    }));
    fs.writeFile(path.join(__dirname, "known.json"), JSON.stringify({knownProducts: v}, null, 2));
  },

  getKnownProducts: function(callback) {
    var root = this;
    fs.readFile(path.join(__dirname, "known.json"), function(err, data) {
      if (!err) {
        if (data.length) {
          root.knownProducts = JSON.parse(data.toString()).knownProducts || {};
        } else {
          root.knownProducts = {};
        }
      }
    });
  }

}

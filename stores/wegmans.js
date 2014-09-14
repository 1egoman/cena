var request = require('request'),
    cheerio = require('cheerio'),
    urlParser = require('url'),
    fs = require("fs");

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

    // do the request
    request(url, function(error, response, html) {
      if(!error) {

        // load html to be scraped
        var $ = cheerio.load(html);

        // test for a known product, if so just send its previous data
        var id = parseInt(parsedUrl.query.productId);
        // root.getKnownProducts(function(err, data) {
        //   if (!err) {
        //     root.knownProducts = data.knownProducts || {};
        //   }
        // })
        if (root.knownProducts[id]) {
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
        root.knownProducts[response.id] = response;
        // root.saveKnownProducts();

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
  },

  saveKnownProducts: function() {
    fs.writeFile(__dirname + "/persistant/known.json", {knownProducts: root.knownProducts});
  },

  getKnownProducts: function(callback) {
    fs.readFile(__dirname + "/persistant/known.json", callback);
  }

}

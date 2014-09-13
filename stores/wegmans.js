var request = require('request'),
    cheerio = require('cheerio'),
    urlParser = require('url');

module.exports = {

  /**
  Get the name of the store
  */
  getStoreName: function() {
    return "Wegmans";
  },


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
    // parse the url
    parsedUrl = urlParser.parse(url, true);

    // do the request
    request(url, function(error, response, html) {
      if(!error) {

        // load html to be scraped
        var $ = cheerio.load(html);

        // initialize variables
        var title, release, rating;
        var response = {
          name: "",
          imageUrl: "",
          id: parseInt(parsedUrl.query.productId)
        };
        // start the scraping
        var productBody = $("body div#content-primary div.prodHead");

        // item name
        response.name = productBody.find("h1").text();

        // the image
        response.imageUrl = $("link[rel=image_src]").attr("href");

        // return the response
        callback(response);

      }
    });

  }

}

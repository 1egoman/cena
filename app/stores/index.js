var stores = [
  require('./wegmans')
]

module.exports = {


  // get a store by its url
  byUrl: function(url) {
    stores.forEach(function(s) {
      if ( s.getStoreUrlMatch().test(url) ) {
        cb = s;
        return;
      }
    });

    return cb;
  },

  // or, search for it by name
  byName: function(name) {
    cb = null;

    stores.forEach(function(s) {
      if ( s.getStoreName().toLowerCase() == name.toLowerCase() ) {
        cb = s;
        return;
      }
    });

    return cb || {};
  }
}

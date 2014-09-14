var host = "http://127.0.0.1:8100/";
var list = new Backbone.Collection();


// view
listView = Backbone.View.extend({
  initialize: function(){
      this.render();
  },

  // render the view
  render: function() {
    var that = this;

    // clear out all the old
    that.$el.html("");

    // for each item, compile the template
    console.log(list.models)
    list.each(function(item) {
      var variables = { item_name: item.get("name"), item_img: item.get("imageUrl"), item_vendor: "Wegmans" };
      var template = _.template( $("#list_item").html() )(variables);

      // and append to the container
      that.$el.append( template );
    });
  },

  events: {
      "click input[type=button]": "doSearch"
  },
  doSearch: function( event ){
      // Button clicked, you can access the element that was clicked with event.currentTarget
      alert( "Search for " + $("#search_input").val() );
  }
});

var list_view = new listView({
  el: $(".list-group.list")
});






// list model: contains a list item
listItem = Backbone.Model.extend({

  defaults: {
    name: "Unknown",
    id: -1,
    imageUrl: null
  },

  initialize: function(){

  },

  // load product url
  addFromUrl: function(url) {
    var that = this;
    $.get(host + "store/product/url?url=" + encodeURIComponent(url), function(data) {
      that.set(data);
      list_view.render()
    });
  }


});

// container to hold all the list models
var listContainer = Backbone.Collection.extend({
  model: listItem
});





// temporary code to populate list
item = new listItem();
item.addFromUrl("http://www.wegmans.com/webapp/wcs/stores/servlet/ProductDisplay?productId=377796&storeId=10052&langId=-1#productTabs-1")

item2 = new listItem();
item2.addFromUrl("http://www.wegmans.com/webapp/wcs/stores/servlet/ProductDisplay?productId=387796&storeId=10052&langId=-1#productTabs-1")

var list = new listContainer();
list.push(item);
list.push(item2);

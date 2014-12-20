var app = angular.module("Cena", []);
var HOST = "http://127.0.0.1:8100";

var showRecipies = function() {
  $("body > div.container").hide();
  $("body > div.container.recipes").show();
  $("li.l-item").removeClass("active");
  $("li.r-item").addClass("active");
}

var showList = function() {
  $("body > div.container").hide();
  $("body > div.container.list").show();
  $("li.r-item").removeClass("active");
  $("li.l-item").addClass("active");
}
showList();

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});


app.controller("listCtrl", function($scope, $http, $timeout) {

  var root = this;

  this.items = [];
  $scope.listSearchString = "";
  this.newFoodItem = "";

  this.outputSortOrder = []

  // add an item to the list, providing a url to the item
  this.addItemFromUrl = function(url) {
    $http({
      method: "get",
      url: HOST+"/store/product/url",
      params: {
        url: encodeURIComponent(url)
      }
    }).success(function(data) {
      if (data == "FAIL") return;
      data.shown = true;
      data.quantity = 1;
      root.items.push(data);
      root.pushList();
    });
  }

  // try to add the item from the textbox
  this.delayAddItem = function() {
    $timeout(function() {

      // get textbox contents
      var text = $('input.addto-list').val();

      // make sure we have a url
      if (/(https?:\/\/)?www\./gi.test(text)) {
        root.addItemFromUrl( text );
        $("input.addto-list").val("");
      }
    }, 100);
  }

  this.tryAddFood = function(evt) {
    if (evt.keyCode == 13) {
      root.items.push({
        "name": this.newFoodItem,
        "imageUrl": null,
        "id": -1,
        "storeName": "Custom",
        "price": null,
        "shown": true,
        "quantity": 1,
        "order": 0
      });
      root.pushList();
      $("input.addto-list").val("");
    }
  }

  // remove item from grocery list
  this.removeItem = function(index) {
    root.items.splice(index, 1);
    root.pushList();
  }

  // do the search on all the items
  this.doSearch = function(s) {
    re = new RegExp(s, "gi");
    _.each(root.items, function(item) {
      item.shown = re.test(item.name);
    });
  }

  // push the local list information to the server
  this.pushList = function() {

    // round prices (gets rid of some really shifty rounding errors)
    _.each(this.items, function(item) {
      item.price = Math.round(item.price*100, 3)*.01;
    });

    $http({
      method: "post",
      url: HOST+"/list",
      data: {list: this.items}
    }).success(function(data) {
      if (data == "FAIL") return;

      root.getItemsBySortOrder();
    });

    // update the subtotal
    $("span.final-price").html( "$" + this.updateSubTotal() );
  }

  // pull the server's information to the local list
  this.pullList = function() {
    $http({
      method: "get",
      url: HOST+"/list",
      data: {list: this.items}
    }).success(function(data) {
      if (data == "FAIL") return;
      root.items = data.list;
      // update the subtotal
      $("span.final-price").html( "$" + root.updateSubTotal() );
      root.getItemsBySortOrder();
    });

  }

  // update the subtotal of all the items
  this.updateSubTotal = function() {
    itemPrices = _.map(root.items, function(i) {
      return i.price * i.quantity;
    })
    n = _.reduce(itemPrices, function(memo, num){ return memo + num; }, 0);
    return n.toFixed(2);
  }

  // get the current date
  this.getDate = function() {
    return (new Date()).toLocaleString("en-US");
  }

  // return the items in their sort order
  this.getItemsBySortOrder = function() {
    this.outputSortOrder = []
    all_orders = _.uniq(_.map(this.items, function(i) {
      return parseInt(i.order) || 0;
    })).reverse();
    _.each(all_orders, function(odr) {
      f = _.filter(root.items, function(i) {
        return (i.order || 0) == odr;
      })
      root.outputSortOrder.push(f);
    });
    console.log(this.outputSortOrder)
    return this.outputSortOrder;
  }

  // update the search
  $scope.$watch("listSearchString", function(newValue, oldValue) {
    root.doSearch(newValue);
  });

  this.pullList();
})


app.controller("recipeCtrl", function($scope, $http, $timeout) {
  var root = this;

  this.recipeName = "";

  this.items = [{
    name: "Tacos",
    shown: true,
    ingredients: [
      {
        "name": "Romaine Lettuce",
        "imageUrl": "http://www.wegmans.com/prodimg/004/200/204640000004.jpg",
        "id": 383085,
        "storeName": "Wegmans",
        "price": 1.69,
        "shown": true,
        "quantity": 2
      }
    ]
  }];

  this.addRecipe = function(lC, name) {
    this.items.push({
      name: name,
      shown: true,
      ingredients: lC.items
    });
    lC.items = [];
    lC.pushList();

    console.log(this.items);
    this.pushList();
  }

  this.addRecipeToList = function(lC, index) {
    items = this.items[index];
    _.each(items.ingredients, function(i, ct) {
      i.fromRecipe = items.name;
      lC.items.push(i);
    });
    lC.pushList();
    showList();
  }

  // remove item from recipe list
  this.removeItem = function(index) {
    root.items.splice(index, 1);
    root.pushList();
  }


  // push the local list information to the server
  this.pushList = function() {
    $http({
      method: "post",
      url: HOST+"/recipe",
      data: {recipe: this.items}
    }).success(function(data) {
      if (data == "FAIL") return;
    });
  }

  // pull the server's information to the local list
  this.pullList = function() {
    $http({
      method: "get",
      url: HOST+"/recipe"
    }).success(function(data) {
      if (data == "FAIL") return;
      root.items = data.recipes;
    });

  }

  this.pullList();


});

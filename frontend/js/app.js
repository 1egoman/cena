var app = angular.module("Cena", []);
var HOST = "http://192.168.1.14:8100";

app.controller("listCtrl", function($scope, $http, $timeout) {

  var root = this;

  this.items = [];
  $scope.listSearchString = "";
  this.newFoodItem = "";

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
        "quantity": 1
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
    $http({
      method: "post",
      url: HOST+"/list",
      data: {list: this.items}
    }).success(function(data) {
      if (data == "FAIL") return;
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
    });

  }

  // update the subtotal of all the items
  this.updateSubTotal = function() {
    itemPrices = _.map(root.items, function(i) {
      return i.price * i.quantity;
    })
    return _.reduce(itemPrices, function(memo, num){ return memo + num; }, 0);
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
  }

  this.addRecipeToList = function(lC, index) {
    items = this.items[index];
    _.each(items.ingredients, function(i, ct) {
      i.fromRecipe = items.name;
      lC.items.push(i);
    });
    lC.pushList();
  }

});

var app = angular.module("Cena", []);

app.controller("listCtrl", function($scope, $http) {

  var root = this;

  this.items = [];
  $scope.listSearchString = "";

  // add an item to the list, providing a url to the item
  this.addItemFromUrl = function(url) {
    $http({
      method: "get",
      url: "http://localhost:8100/store/product/url",
      params: {
        url: encodeURIComponent(url || $("input.addto-list").val())
      }
    }).success(function(data) {
      data.shown = true;
      root.items.push(data);
      url && $("input.addto-list").val("");
    });
  }

  // remove item from grocery list
  this.removeItem = function(index) {
    root.items.splice(index, 1);
  }

  // do the search on all the items
  this.doSearch = function(s) {
    re = new RegExp(s, "gi");
    _.each(root.items, function(item) {
      item.shown = re.test(item.name);
    });
  }

  // update the search
  $scope.$watch("listSearchString", function(newValue, oldValue) {
    root.doSearch(newValue);
  });

  // add a few items
  this.addItemFromUrl("http://www.wegmans.com/webapp/wcs/stores/servlet/ProductDisplay?productId=387796&storeId=10052&langId=-1");
  this.addItemFromUrl("http://www.wegmans.com/webapp/wcs/stores/servlet/ProductDisplay?productId=377796&storeId=10052&langId=-1");

})

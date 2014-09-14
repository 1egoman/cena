var app = angular.module("Cena", []);

app.controller("listCtrl", function($scope, $http, $timeout) {

  var root = this;

  this.items = [];
  $scope.listSearchString = "";

  // add an item to the list, providing a url to the item
  this.addItemFromUrl = function(url) {
    $http({
      method: "get",
      url: "http://localhost:8100/store/product/url",
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
      url: "http://localhost:8100/list",
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
      url: "http://localhost:8100/list",
      data: {list: this.items}
    }).success(function(data) {
      if (data == "FAIL") return;
      root.items = data.list;
    });

    // update the subtotal
    $("span.final-price").html( "$" + this.updateSubTotal() );
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

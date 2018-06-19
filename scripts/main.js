angular.module('priceEntry')
  .controller('MainCtrl', function ($scope,$http,$loadingOverlay) {
  console.log("Main CTRL");
  $scope.gst_rate_list = [5,12,18,28]
  var math_api_url = "http://api.mathjs.org/v4/?expr="
  var template = "<div style='display:flex;flex-direction:column;align-items:center;justify-content:center;'><div class='loader'>Loading...<span>Please wait...<span></div></div>"

    var getExistingData = function(){
    $http.get("/api/products")
    .then(function(data){
      console.log("Success", data);
      $scope.table_data = data.data
      drawPieChart($scope.table_data)
    }, function(err){
      console.log("err", err);
    })
  }
  getExistingData();
  var isValid = function(data){
    if (data === undefined || data === null || data === '')
      return false
    return true
  }

  $scope.rateChange = function(){
    if (isValid($scope.productPrice)){
      var exp = $scope.productPrice.toString() +  "+" + "((" + $scope.gstRate.toString() + "/100)*" + $scope.productPrice.toString() + ")"
      console.log("Expression is ", exp);
      var expr = {
        "expr": exp
      }
      $loadingOverlay.show(template, 'rgba(0, 0, 0, 0.7)', '#fff');
      $http.post(math_api_url,expr)
      .then(function(data){
        $loadingOverlay.hide();
        console.log("Success", data.data.result);
        $scope.finalPrice = data.data.result
      },
      function(err){
        $loadingOverlay.hide();
        console.log("err", err);
      })
    }
  }
  $scope.submitData = function(){
    console.log("Name ", $scope.productName);
    console.log("Price ", $scope.productPrice);
    console.log("gst Rate ", $scope.gstRate);
    if (isValid($scope.productName) && isValid($scope.productPrice) && isValid($scope.gstRate)){
      console.log("Call API");
      var data = {
        'productName': $scope.productName,
        'productPrice': parseInt($scope.productPrice),
        'gstRate': parseInt($scope.gstRate),
        'finalPrice': parseInt($scope.finalPrice)
        }
      console.log("Data is ", data);
      $loadingOverlay.show(template, 'rgba(0, 0, 0, 0.7)', '#fff');
      $http.post("/api/products",data)
      .then(function(data){
        $loadingOverlay.hide();
        console.log("Success", data);
        getExistingData();
      },
      function(err){
        $loadingOverlay.hide();
        console.log("Err", err);
      })
      // var exp = $scope.productPrice + ((str($scope.gstRate)/"100")*$scope.productPrice)
    }
    else {
      console.log("Show error. Form Incomplete");
    }
  }

  var drawPieChart = function(table_data){
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

      var rate_count = {}
      for (var i = 0; i < table_data.length; i++) {
        if (rate_count[table_data[i].gstRate]){
          // If the object key exists
          rate_count[table_data[i].gstRate] += 1
        }
        else {
          rate_count[table_data[i].gstRate] = 1
        }
      }
      console.log("Final data for chart is ", rate_count);
      var chart_data = [['Task', 'Hours per Day']]
      for(var key in rate_count){
        console.log("Key is ", rate_count[key]);
        chart_data.push([key + "% GST",rate_count[key]])
      }
      console.log("Chart data is ", chart_data);

       var data = google.visualization.arrayToDataTable(chart_data);

       var options = {
         title: 'GST rates v/s number of products'
       };

       var chart = new google.visualization.PieChart(document.getElementById('piechart'));

       chart.draw(data, options);
     }
  }

})

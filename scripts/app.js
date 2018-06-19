angular
  .module('priceEntry', [
                        'ngMaterial',
                        'ngMessages',
                        'ngRoute',
                        'ngLoadingOverlay'
                            ])
  .config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            controllerAs: 'main'
        })
        .otherwise({
            redirectTo: '/'
        });
  });

var app = angular.module("Atms", [
    'ui.router',
    'LocalStorageModule',
    'AtmsNearbyModule'
]);

//-------------------------------------------------
//routing


app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('');

    $urlRouterProvider.when('', '/index');

    $stateProvider
        .state('index', {
            url: '/index',
            controller: 'MainController',
            templateUrl: 'views/main.view.html',

        })


}]);
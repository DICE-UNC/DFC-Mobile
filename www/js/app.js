'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  //'myApp/home',
  'myApp.login' 

]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/login'}); //Was '/login'
}]).config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
}]);
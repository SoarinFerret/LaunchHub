// script.js
// create the module and name it app
var app = angular.module('app', ['ngRoute', 'ngAnimate']);

// configure our routes
app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '../home.html',
            controller: 'Home_Controller'
        })
        .otherwise({ redirectTo: '/' })
});
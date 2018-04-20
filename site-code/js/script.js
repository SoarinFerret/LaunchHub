// script.js
// create the module and name it app
var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngMaterial', 'ngMessages']);

app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('orange');
});

// configure our routes
app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '../home.html',
            controller: 'Home_Controller'
        })
        .otherwise({
            redirectTo: '/'
        })
});

app.controller('Home_Controller', function ($scope) {
    $('.top-arrow').hide();
    $(document).ready(setTimeout(function () {
        $.ajax({
            async: true,
            type: "GET",
            url: "https://launchlibrary.net/1.3/launch/next/10",
            success: callback()
        });

        function callback() {
            return function (data, textStatus, jqXHR) {
                $scope.launches = data.launches;
                $scope.$applyAsync();
                $('#loader').fadeOut(300);
            }
        }
    }, 500));
});
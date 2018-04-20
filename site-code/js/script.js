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
        .when('/about', {
            templateUrl: '../about.html'
        })
        .otherwise({
            redirectTo: '/'
        })
});

app.controller('Home_Controller', function ($scope) {

    // For testing
    $(document).ready(setTimeout(function () {
        $.ajax({
            async: true,
            type: "GET",
            url: "https://launchlibrary.net/1.3/launch/next/10",
            success: callback()
        });

        // this function is called right after the ajax request is complete
        function callback() {
            return function (data, textStatus, jqXHR) {
                
                // "data" variable is returned by ajax request

                // use the $scope variable to link variables between here and the HTML
                // $scope.launches would be accessible inside HTML as the "launches" variable (an array in this example)
                $scope.launches = data.launches;

                // Get weather data here
                for (var i = 0; i < $scope.launches.length; i++) {
                    
                    // Parse currentLaunch JSON object to find location

                    // Get weather data based on location (maybe based on lat/long)

                    // launches[i].weather = ajaxreturn weather object
                }


<<<<<<< HEAD
=======
                // Not sure what this does, but it fixed an issue I was having
>>>>>>> Daniel
                $scope.$applyAsync();

                // Fades out the progress ring that appears when loading the page
                $('#loader').fadeOut(300);
            }
        }
    }, 500));

});
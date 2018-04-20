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
        .when('/launchdetail', {
            templateUrl: '../launchdetail.html',
            controller: 'Launch_Detail_Controller'
        })
        .otherwise({
            redirectTo: '/'
        })
});

app.controller('Home_Controller', function ($scope, $location, Data_Transfer_Service) {

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

                // Not sure what this does, but it fixed an issue I was having
                $scope.$applyAsync();

                // This function is called when a "View Details" button is pressed, the launch JSON object is passed as parameter
                $scope.ViewDetails = function (launch) {
                    // Store the launch in our service
                    Data_Transfer_Service.set(launch);
                    // Nagivate to details page
                    $location.path("launchdetail");
                    // Scroll to Top of Page
                    $(window).scrollTo(195, 200);
                };

                // Get weather data here
                for (var i = 0; i < $scope.launches.length; i++) {

                    // Parse currentLaunch JSON object to find location

                    // Get weather data based on location (maybe based on lat/long)

                    // launches[i].weather = ajaxreturn weather object
                }

                // Fades out the progress ring that appears when loading the page
                $('#loader').fadeOut(300);
            }
        }
    }, 500));
});

app.controller('Launch_Detail_Controller', function ($scope, Data_Transfer_Service, $location) {
    //Get the launch we stored in the service
    $scope.launch = Data_Transfer_Service.get();
    if ($scope.launch.name == null) $location.path('home');
});

app.factory('Data_Transfer_Service', function () {
    var savedData = {}

    function set(data) {
        savedData = data;
    }

    function get() {
        return savedData;
    }

    return {
        set: set,
        get: get
    }

});
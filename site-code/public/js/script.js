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
            templateUrl: '../about.html',
            controller: 'About_Controller'
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
    $(window).scrollTo(0, 200);
    // For testing
    $(document).ready(setTimeout(function () {
        $.ajax({
            async: true,
            type: "GET",
            url: "https://launchlibrary.net/1.3/launch/next/20",
            success: callback()
        });

        // this function is called right after the ajax request is complete
        function callback() {
            return function (data, textStatus, jqXHR) {
                $scope.launches = data.launches;

                for (var i = 0; i < $scope.launches.length; i++) {
                    var s = $scope.launches[i].name;
                    $scope.launches[i].name = s.substring(s.indexOf('|') + 2).trim();

                    if ($scope.launches[i].missions[0] == null || $scope.launches[i].missions[0].agencies == null) continue;
                    for (var j = 0; j < $scope.launches[i].missions[0].agencies.length; j++) {
                        if ($scope.launches[i].missions[0].agencies[j].countryCode.includes(",")) {
                            var splitCodesArray = $scope.launches[i].missions[0].agencies[j].countryCode.split(",");
                            $scope.launches[i].missions[0].agencies[j].countryCode = splitCodesArray[0].trim() + " & " + (+splitCodesArray.length - 1) + " more";
                        }
                    }
                    if ($scope.launches[i].location.pads[0] == null || $scope.launches[i].location.pads[0].agencies == null) continue;
                    for (var j = 0; j < $scope.launches[i].location.pads[0].agencies.length; j++) {
                        if ($scope.launches[i].location.pads[0].agencies[j].countryCode.includes(",")) {
                            var splitCodesArray = $scope.launches[i].location.pads[0].agencies[j].countryCode.split(",");
                            $scope.launches[i].location.pads[0].agencies[j].countryCode = splitCodesArray[0].trim() + " & " + (+splitCodesArray.length - 1) + " more";
                        }
                    }
                    if ($scope.launches[i].rocket == null || $scope.launches[i].rocket.agencies == null) continue;
                    for (var j = 0; j < $scope.launches[i].rocket.agencies.length; j++) {
                        if ($scope.launches[i].rocket.agencies[j].countryCode.includes(",")) {
                            var splitCodesArray = $scope.launches[i].rocket.agencies[j].countryCode.split(",");
                            $scope.launches[i].rocket.agencies[j].countryCode = splitCodesArray[0].trim() + " & " + (+splitCodesArray.length - 1) + " more";
                        }
                    }
                }
                // Not sure what this does, but it fixed an issue I was having
                $scope.$applyAsync();

                // "data" variable is returned by ajax request

                // Get weather data here
                for (var i = 0; i < $scope.launches.length; i++) {

                    // Parse currentLaunch JSON object to find location

                    // Get weather data based on location (maybe based on lat/long)

                    // data.launches[i].weather = ajaxreturn weather object
                }
                //setTimeout(generateMaps($scope.launches), 500);

                // use the $scope variable to link variables between here and the HTML
                // $scope.launches would be accessible inside HTML as the "launches" variable (an array in this example)

                // Fades out the progress ring that appears when loading the page
                $('#loader').fadeOut(300, function () {
                    for (var i = 0; i < $scope.launches.length; i++) {
                        createMap($scope.launches[i], 'map' + i);
                    }
                });

                // This function is called when a "View Details" button is pressed, the launch JSON object is passed as parameter
                $scope.ViewDetails = function (launch) {
                    // Store the launch in our service
                    Data_Transfer_Service.set(launch);
                    // Nagivate to details page
                    $location.path("launchdetail");
                };
            }
        }
    }, 500));
});

app.controller('About_Controller', function () {
    $(window).scrollTo(0, 200);
});

app.controller('Launch_Detail_Controller', function ($scope, Data_Transfer_Service, $location) {
    //$(window).scrollTo(195, 200);
    //Get the launch we stored in the service
    $scope.launch = Data_Transfer_Service.get();
    if ($scope.launch.name == null) $location.path('home');
    createMap($scope.launch, 'detailsMap');
    animateDetailsPage();
    $(window).scrollTo(195, 200);
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

function animateDetailsPage() {
    $('#launch-overview-icon').removeClass("launch-overview-animation");
    $('#launch-overview-icon').addClass("launch-overview-animation");

    $('#weather-icon').removeClass("weather-animation");
    $('#weather-icon').addClass("weather-animation");

    $('#mission-icon').removeClass("mission-animation");
    $('#mission-icon').addClass("mission-animation");

    $('#launch-pad-icon').removeClass("launch-pad-animation");
    $('#launch-pad-icon').addClass("launch-pad-animation");

    $('#map-icon').removeClass("map-animation");
    $('#map-icon').addClass("map-animation");
}

function createMap(launch, id) {
    var latLong = {
        lat: launch.location.pads[0].latitude,
        lng: launch.location.pads[0].longitude
    };
    var map = new google.maps.Map(document.getElementById(id), {
        center: latLong,
        zoom: 8,
        styles: googleMapsStyle
    });
    var marker = new google.maps.Marker({
        position: latLong,
        map: map,
        title: launch.location.pads[0].name
    });
}

var googleMapsStyle = [{
        elementType: 'geometry',
        stylers: [{
            color: '#D4D4D4'
        }]
    },
    {
        elementType: 'labels.text.stroke',
        stylers: [{
            color: '#D4D4D4'
        }]
    },
    {
        elementType: 'labels.text.fill',
        stylers: [{
            color: '#746855'
        }]
    },
    {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{
            color: '#b54d00'
        }]
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{
            color: '#b54d00'
        }]
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{
            color: '#5d6d60'
        }]
    },
    {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{
            color: '#2c4c33'
        }]
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{
            color: '#8f8f99'
        }]
    },
    {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{
            color: '#212a37'
        }]
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{
            color: '#9ca5b3'
        }]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{
            color: '#7b7b82'
        }]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
            color: '#1f2835'
        }]
    },
    {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{
            color: '#f3d19c'
        }]
    },
    {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{
            color: '#2f3948'
        }]
    },
    {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{
            color: '#d59563'
        }]
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{
            color: '#22333d'
        }]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{
            color: '#515c6d'
        }]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{
            color: '#17263c'
        }]
    }
];
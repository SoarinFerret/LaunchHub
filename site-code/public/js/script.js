// script.js
// create the module and name it app
var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngMaterial', 'ngMessages']);

// Set Color scheme for buttons and other elements
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
            url: "/api/launch?",
            contentType: "application/json",
            dataType: "json",
            success: callback()
        });

        // this function is called right after the ajax request is complete
        function callback() {
            return function (data, textStatus, jqXHR) {
                // The $scope variable is used to link variables between here and the HTML DOM. 
                // "data" variable is returned by ajax request
                $scope.launches = data.launches;

                for (var i = 0; i < $scope.launches.length; i++) {
                    var s = $scope.launches[i].name;
                    $scope.launches[i].name = s.substring(s.indexOf('|') + 2).trim();

                    if ($scope.launches[i].rocket.imageURL == null || $scope.launches[i].rocket.imageURL.includes('placeholder')) $scope.launches[i].rocket.imageURL = "";

                    if (!($scope.launches[i].missions[0] == null || $scope.launches[i].missions[0].agencies == null)) {
                        for (var j = 0; j < $scope.launches[i].missions[0].agencies.length; j++) {
                            if ($scope.launches[i].missions[0].agencies[j].countryCode.includes(",")) {
                                var splitCodesArray = $scope.launches[i].missions[0].agencies[j].countryCode.split(",");
                                $scope.launches[i].missions[0].agencies[j].countryCode = splitCodesArray[0].trim() + " & " + (+splitCodesArray.length - 1) + " more";
                            }
                        }
                    }
                    if (!($scope.launches[i].location.pads[0] == null || $scope.launches[i].location.pads[0].agencies == null)) {
                        for (var j = 0; j < $scope.launches[i].location.pads[0].agencies.length; j++) {
                            if ($scope.launches[i].location.pads[0].agencies[j].countryCode.includes(",")) {
                                var splitCodesArray = $scope.launches[i].location.pads[0].agencies[j].countryCode.split(",");
                                $scope.launches[i].location.pads[0].agencies[j].countryCode = splitCodesArray[0].trim() + " & " + (+splitCodesArray.length - 1) + " more";
                            }
                        }
                    }
                    if (!($scope.launches[i].rocket == null || $scope.launches[i].rocket.agencies == null)) {
                        for (var j = 0; j < $scope.launches[i].rocket.agencies.length; j++) {
                            if ($scope.launches[i].rocket.agencies[j].countryCode.includes(",")) {
                                var splitCodesArray = $scope.launches[i].rocket.agencies[j].countryCode.split(",");
                                $scope.launches[i].rocket.agencies[j].countryCode = splitCodesArray[0].trim() + " & " + (+splitCodesArray.length - 1) + " more";
                            }
                        }
                    }
                }
                // Not sure what this does, but it fixed an issue I was having
                $scope.$applyAsync();


                // Get weather data here
                for (var i = 0; i < $scope.launches.length; i++) {

                    // Parse currentLaunch JSON object to find location

                    // Get weather data based on location (maybe based on lat/long)

                    // data.launches[i].weather = ajaxreturn weather object
                }

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

app.controller('Launch_Detail_Controller', function ($scope, Data_Transfer_Service, $location, $http) {
    //$(window).scrollTo(195, 200);
    //Get the launch we stored in the service
    $scope.launch = Data_Transfer_Service.get();
    //If the Launch Detail page is navigated to prematurely, redirect to home
    if ($scope.launch.name == null) $location.path('home');
    //Creates the map element for the details page
    createMap($scope.launch, 'detailsMap');
    //CSS animations
    animateDetailsPage();
    //Scroll page
    $(window).scrollTo(195, 200);

    setTimeout(function () {
        var leftColumnHeight = $('#launch-overview-card').height() + $('#rocket-card').height() + $('#weather-card').height();
        var rightColumnHeight = $('#mission-card').height() + $('#launch-pad-card').height();
        if (leftColumnHeight > rightColumnHeight) {
            $('#launch-pad-card').height($('#launch-pad-card').height() + leftColumnHeight - rightColumnHeight + 60);
            $('#launch-pad-agencies-div').css('padding-bottom', 45);
        } else if (rightColumnHeight > leftColumnHeight) {
            var increaseValue = rightColumnHeight - leftColumnHeight - 60;
            $('#weather-card').height($('#weather-card').height() + increaseValue);
            $('#weather-div').css('max-height', 450 + increaseValue);
        }
    }, 500);
    if ($scope.launch.location == null) return;
    $http.get("https://api.openweathermap.org/data/2.5/weather?lat=" + $scope.launch.location.pads[0].latitude + "&lon=" + $scope.launch.location.pads[0].longitude + "&appid=c929e331bf4c9085ccbbabacd4efe680&units=Imperial").then(function(response){
        $scope.launch.weather = response.data;
    }).catch(function(err){});
});

//This service is used to transfer JSON objects between pages.
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

// Applies some small CSS animations to the details page when loaded.
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

// Creates a Google map object based on a Launch JSON object and places it in a DOM object clarified by the "id" parameter passed
function createMap(launch, id) {
    if (launch.location == null) return;
    var latLong = {
        lat: launch.location.pads[0].latitude,
        lng: launch.location.pads[0].longitude
    };
    var map = new google.maps.Map(document.getElementById(id), {
        center: latLong,
        zoom: 14,
        //styles: googleMapsStyle,
        mapTypeId: google.maps.MapTypeId.HYBRID
    });
    var marker = new google.maps.Marker({
        position: latLong,
        map: map,
        title: launch.location.pads[0].name
    });
}

// The styles for the Google Map. Not currently in use, but keeping here just in case.
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
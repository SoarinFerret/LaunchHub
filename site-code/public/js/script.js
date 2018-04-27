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
            controller: 'Upcoming_Controller'
        })
        .when('/recentlaunches', {
            templateUrl: '../recentlaunches.html',
            controller: 'Recent_Controller'
        })
        .when('/about', {
            templateUrl: '../about.html',
            controller: 'About_Controller'
        })
        .when('/contributors', {
            templateUrl: '../contributors.html',
            controller: 'Contributors_Controller'
        })
        .when('/launchdetail', {
            templateUrl: '../launchdetail.html',
            controller: 'Launch_Detail_Controller'
        })
        .otherwise({
            redirectTo: '/'
        })
});

app.controller('Upcoming_Controller', function ($scope, $location, Data_Transfer_Service) {
    if (Cookies.get('previouslyVisited') == 'true') $('#welcomeCard').hide();
    $('#footer').hide();
    $(window).scrollTo(0, 200);
    $(document).ready(setTimeout(function () {
        ajaxRequest($scope, $location, Data_Transfer_Service, true);
    }, 500));
});

app.controller('Recent_Controller', function ($scope, $location, Data_Transfer_Service) {
    $('#footer').hide();
    $(window).scrollTo(0, 200);
    $(document).ready(setTimeout(function () {
        ajaxRequest($scope, $location, Data_Transfer_Service, false);
    }, 500));
});

function ajaxRequest($scope, $location, Data_Transfer_Service, future) {
    var url = (future ? "futurelaunches" : "pastlaunches");
    $.ajax({
        async: true,
        type: "GET",
        url: "/api/" + url,
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

            //for (var i = $scope.launches.length-1; i > -1; i--) {
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

            // use the $scope variable to link variables between here and the HTML
            // $scope.launches would be accessible inside HTML as the "launches" variable (an array in this example)

            // Fades out the progress ring that appears when loading the page
            angular.element(document).ready(function () {
                for (var i = 0; i < $scope.launches.length; i++) {
                    createMap($scope.launches[i], 'map' + i);
                }
                $('#loader').fadeOut(300);
            });
            $('#footer').fadeIn();

            // This function is called when a "View Details" button is pressed, the launch JSON object is passed as parameter
            $scope.ViewDetails = function (launch) {
                // Store the launch in our service
                Data_Transfer_Service.set(launch);
                // Nagivate to details page
                $location.path("launchdetail");
            };
        }
    }
}

app.controller('About_Controller', function ($scope) {
    $(window).scrollTo(195, 200);

    $scope.title = "LaunchHub";
    $scope.description = "LaunchHub is a centralized source to receive information on future rocket launches all around the world, aggregating location and weather data for each.";

    $scope.apis = [];
    $scope.apis.push({
        name: "Launch Library API",
        link: "http://launchlibrary.net/docs/1.4/api.html",
        description: "Serving as the core API of our application, we are pulling information about launches all over the world."
    }, {
        name: "backendless Country Flag API",
        link: "https://backendless.com/",
        description: "This is used to pull flag data for different agency affiliations."
    }, {
        name: "Google Maps API",
        link: "https://developers.google.com/maps/",
        description: "Using longitude and latitude provided by Launch Library, we are showing satellite view of the surrounding area."
    }, {
        name: "DarkSky API",
        link: "https://darksky.net/dev/docs",
        description: "Again, using longitude and latitude provided by Launch Library, we are providing current weather information about the site. This API has a strict limit of 1000 calls per day for free accounts, so our caching using redis is quite useful."
    });

    $scope.technologies = [];
    $scope.technologies.push({
        type: "Front-end Language",
        name: "Angular 5",
        link: "https://angular.io/docs",
        description: "Angular provides a number of benefits. Besides being easy to use and implement, it has some awesome features like AngularSPA (single page app), which allows our webapp to flow a bit better."
    }, {
        type: "Styling Framework(1)",
        name: "Material Design",
        link: "https://material.io/",
        description: "A style sheet by Google, it allows for beautifully created web sites following their design language."
    }, {
        type: "Styling Framework(2)",
        name: "Angular Material",
        link: "https://material.angularjs.org/",
        description: "A slightly less involved and easier to use version of Google's Material Design style sheet."
    }, {
        type: "Server-side Language",
        name: "Node.js",
        link: "https://nodejs.org/en/docs/",
        description: "Node.js has the benefit of just being easy to use JavaScript, without the extra bloat needed with Django. Plus, Django just has a lot of nice, but unnecessary functionality for this specific application."
    }, {
        type: "Webserver",
        name: "Nginx",
        link: "https://docs.nginx.com/",
        description: "Node.js has the benefit of just being easy to use JavaScript, without the extra bloat needed with Django. Plus, Django just has a lot of nice, but unnecessary functionality for this specific application."
    }, {
        type: "Backend Datastore",
        name: "Redis",
        link: "https://redis.io/documentation",
        description: "Recommended by many all over, redis is being used as a caching componet so we don't have to constantly hit the APIs we are querying."
    }, {
        type: "Deployment Technology",
        name: "Docker Compose",
        link: "https://docs.docker.com/compose/",
        description: "What now seems to be the defacto deployment method, docker-compose allows us to build scalable, cross-platform, and easily replicated environments for both production and development purposes."
    });
});
app.controller('Contributors_Controller', function ($scope) {
    $(window).scrollTo(0, 200);
    $scope.devs = [];
    $scope.devs.push({
        name: "Collin Buus",
        description: `TODO`,
        githubUsername: "",
    }, {
        name: "Cody Ernesti",
        description: `TODO`,
        githubUsername: "SoarinFerret",
    }, {
        name: "Daniel Goudie",
        description: `Daniel is a senior at the University of Nebraska at 
        Omaha studying cybersecurity and computer science. He works at 
        Union Pacific Railroad as a junior software developer.`,
        githubUsername: "dgoudie",
    }, {
        name: "Yuqi Kang",
        description: `TODO`,
        githubUsername: "",
    });
});
app.controller('Launch_Detail_Controller', function ($scope, Data_Transfer_Service, $location, $http) {
    //Get the launch we stored in the service
    $scope.launch = Data_Transfer_Service.get();
    //If the Launch Detail page is navigated to prematurely, redirect to home
    if ($scope.launch.name == null) $location.path('home');
    //Creates the map element for the details page
    createMap($scope.launch, 'detailsMap');
    //Scroll page
    $(window).scrollTo(195, 200);

    var loopCounter = 0;
    var interval = setInterval(function () {
        var leftColumnHeight = $('#launch-overview-card').height() + $('#rocket-card').height() + $('#weather-card').height();
        var rightColumnHeight = $('#mission-card').height() + $('#launch-pad-card').height();
        if (leftColumnHeight > rightColumnHeight) {
            $('#launch-pad-card').height($('#launch-pad-card').height() + leftColumnHeight - rightColumnHeight + 20);
            $('#launch-pad-agencies-div').css('padding-bottom', 45);
        } else if (rightColumnHeight > leftColumnHeight) {
            var increaseValue = rightColumnHeight - leftColumnHeight - 93;
            $('#weather-div').height($('#weather-card').height() + increaseValue);
        }
        if (++loopCounter == 50) clearInterval(interval);
    }, 100)
    if ($scope.launch.location == null) return;
    $http.get("/api/weather?loc=" + $scope.launch.location.pads[0].latitude + "," + $scope.launch.location.pads[0].longitude).then(function (response) {

        $scope.launch.weather = response.data;
        $('#weather-div').css('background-image', 'url(images/weather-backgrounds/' + $scope.launch.weather.currently.icon + '.jpg)');

        if ($scope.launch.weather.currently.windSpeed > 0) {
            var wd = "N";
            var wb = $scope.launch.weather.currently.windBearing;
            if (wb > 11.25) wd = "NNE";
            if (wb > 33.75) wd = "NE";
            if (wb > 56.25) wd = "ENE";
            if (wb > 78.75) wd = "E";
            if (wb > 101.25) wd = "ESE";
            if (wb > 123.75) wd = "SE";
            if (wb > 146.25) wd = "SSE";
            if (wb > 168.75) wd = "S";
            if (wb > 191.25) wd = "SSW";
            if (wb > 213.75) wd = "SW";
            if (wb > 236.25) wd = "WSW";
            if (wb > 258.75) wd = "W";
            if (wb > 281.25) wd = "WNW";
            if (wb > 303.75) wd = "NW";
            if (wb > 326.25) wd = "NNW";
            if (wb > 348.75) wd = "N";
            $scope.launch.weather.currently.windDirection = wd;
        }
        $scope.launch.weather.currently.localTime = new Date($scope.launch.weather.currently.time * 1000);

        var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        for (var i = 0; i < $scope.launch.weather.daily.data.length; i++) {
            $scope.launch.weather.daily.data[i].timeObject = new Date($scope.launch.weather.daily.data[i].time * 1000);
            $scope.launch.weather.daily.data[i].dayOfWeek = daysOfWeek[$scope.launch.weather.daily.data[i].timeObject.getDay()];
            if ($scope.launch.weather.daily.data[i].timeObject.getDate() == new Date().getDate()) {
                $scope.launch.weather.daily.data.shift();
                i--;
            }
        }

        $scope.$applyAsync();
    }).catch(function (err) {});
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
        mapTypeId: google.maps.MapTypeId.HYBRID
    });
    var marker = new google.maps.Marker({
        position: latLong,
        map: map,
        title: launch.location.pads[0].name
    });
}

// Reverse order of Recent Launches
app.filter('reverse', function () {
    return function (items) {
        return items.slice().reverse();
    };
});
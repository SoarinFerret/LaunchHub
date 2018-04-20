// script.js
// create the module and name it app
var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngMaterial', 'ngMessages']);

// app.config(function ($mdThemingProvider) {

//     $mdThemingProvider.definePalette('launchHubPalette', {
//         '50': '547c92',
//         '100': '4a6e82',
//         '200': '416071',
//         '300': '385361',
//         '400': '2f4551',
//         '500': '293d48',
//         '600': '253741',
//         '700': '1c2931',
//         '800': '131c20',
//         '900': '090e10',
//         'A100': 'ff8566',
//         'A200': 'ff5c33',
//         'A400': 'ff3300',
//         'A700': 'b32400',
//         'contrastDefaultColor': 'light', // whether, by default, text (contrast)
//         // on this palette should be dark or light

//         'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
//             '200', '300', '400', 'A100'
//         ]
//     });

//     $mdThemingProvider.theme('default')
//         .primaryPalette('launchHubPalette')

// });

app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('deep-orange');
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
            }
        }
    }, 500));
});
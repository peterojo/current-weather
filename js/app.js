angular.module('weatherApp', ['wa.controllers','wa.services','ngRoute','ngAnimate','ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/permission', {
		templateUrl: 'templates/permission.html',
		controller: 'getPermissionCtrl'
	}).
	when('/where', {
		templateUrl: 'templates/where.html',
		controller: 'getLocationCtrl'
	}).
	when('/weatherByCoords/:long/:lat', {
		templateUrl: 'templates/show.html',
		controller: 'getWeatherCtrl'
	}).
	when('/weatherByCity/:city', {
		templateUrl: 'templates/show.html',
		controller: 'getWeatherCtrl'
	}).
	otherwise({
		redirectTo: '/permission'
	});
}])

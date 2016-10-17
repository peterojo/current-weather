angular.module('wa.controllers', [])

.controller('getModalCtrl', ["$uibModalInstance","LocationService","$rootScope","$scope","$uibModal","$location","$timeout", function($uibModalInstance,LocationService,$rootScope,$scope,$uibModal,$location,$timeout) {
	$scope.city = "";
	$scope.permLabel = "Yeah, sure!";
	$scope.detect = function() {
		$scope.permLabel = "Finding location ..."
		LocationService.locationAllowed = true;

		var coords = LocationService.getLocation();
		setTimeout(function () {
			$uibModalInstance.close();
			$scope.permLabel = "Yeah, sure!";
		}, 5000);
	}

	$scope.locate = function() {
		$uibModalInstance.close();
		$location.path('/weatherByCity/'+$scope.city);
	}

	$scope.cancel = function() {
		$location.path("/where");
		$uibModalInstance.dismiss('cancel');
	}
}])

.controller('getLocationCtrl', ["$scope","LocationService","$uibModal", function($scope,LocationService,$uibModal) {
	$scope.openLocationModal = LocationService.openLocationModal();
}])
.controller('getPermissionCtrl', ["$scope","LocationService","$uibModal", function($scope,LocationService,$uibModal) {
	$scope.openPermissionModal = LocationService.openPermissionModal();
}])
.controller('getWeatherCtrl', ["$scope","$http","LocationService","WeatherService","$routeParams", function($scope,$http,LocationService,WeatherService,$routeParams) {
	if($routeParams.city!=null) {
		// by city
		$scope.city = $routeParams.city;
		WeatherService.getWeatherByCity($scope.city).then(function(data) {
			$scope.weatherData = data.data;
			WeatherService.prepareWeatherData($scope.weatherData);
			$scope.weatherLoaded = true;
			console.log(data.data);
		});
	} else if($routeParams.long!=null) {
		// by coord
		$scope.weatherLoaded = false;
		$scope.coords = {
			longitude: $routeParams.long,
			latitude: $routeParams.lat
		};
		console.log($scope.coords);
		WeatherService.getWeatherByCoords($scope.coords).then(function(data) {
			$scope.weatherData = data.data;
			WeatherService.prepareWeatherData($scope.weatherData);
			$scope.weatherLoaded = true;
			console.log(data.data);
		});
	}
}])
angular.module('wa.controllers', [])

.controller('getModalCtrl', ["$uibModalInstance","LocationService","$scope","$location", function($uibModalInstance,LocationService,$scope,$location) {
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

.controller('getLocationCtrl', ["$scope","LocationService", function($scope,LocationService,$uibModal) {
	$scope.openLocationModal = LocationService.openLocationModal();
}])
.controller('getPermissionCtrl', ["$scope","LocationService", function($scope,LocationService,$uibModal) {
	$scope.openPermissionModal = LocationService.openPermissionModal();
}])
.controller('getWeatherCtrl', ["$scope","$http","WeatherService","$routeParams","$location", function($scope,$http,WeatherService,$routeParams,$location) {
	if($routeParams.city!=null) {
		// by city
		$scope.city = $routeParams.city;
		WeatherService.getWeatherByCity($scope.city).then(function(data) {
			$scope.weatherData = data.data;
			WeatherService.prepareWeatherData($scope.weatherData);
			$scope.weatherLoaded = true;
			console.log(data.data);
		}, function(error) {
			// query fails so try again
			$location.path("/where");
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
		}, function(error) {
			// query fails so try again
			$location.path("/where");
		});
	}
}])

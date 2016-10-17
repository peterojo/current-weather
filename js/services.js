angular.module('wa.services',[])

.service('LocationService', ["$rootScope","$location","$uibModal", function($rootScope,$location,$uibModal) {
	this.locationAllowed = false;
	this.coords = {};
	this.openPermissionModal = function() {
		$uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'templates/modals/getPerm.html',
			controller: 'getModalCtrl'
		});
	};

	this.openLocationModal = function() {
		$uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'templates/modals/getLoc.html',
			controller: 'getModalCtrl'
		});
	}

	this.getLocation = function() {
		if(this.locationAllowed) {
			if (navigator.geolocation) {
			    navigator.geolocation.getCurrentPosition(function(position){
					console.log(position.coords);
					$rootScope.$apply(function(){
						this.coords = position.coords;
					});
					$location.path("/weatherByCoords/"+this.coords.longitude+"/"+this.coords.latitude);

			    }, function(error) {
					$location.path("/where");
				}, {
					enableHighAccuracy: true,
					timeout: 5000,
					maximumAge:0
				});
			} else {
				console.log("browser does not support geolocation");
				this.coords = null;
			}
		} else {
			this.coords = null;
		}
		return this.coords;
	}

	return this;
}])

.service('WeatherService', ["$http", function($http) {
	this.weatherData = {};
	this.APPID = "c814253f8861f2607bcffb28d8356729";
	this.weatherLoaded = false;

	this.getWeatherByCoords = function(coords) {
		return $http.get("http://api.openweathermap.org/data/2.5/weather?lat="+coords.latitude+"&lon="+coords.longitude+"&APPID="+this.APPID);
	}

	this.getWeatherByCity = function(city) {
		return $http.get("http://api.openweathermap.org/data/2.5/weather?q="+city+"&APPID="+this.APPID);
	}

	this.prepareWeatherData = function(weatherData) {
		// convert temperatures to celsius
		if(weatherData.main.temp!=null)
		{
			weatherData.main.temp = Math.round((weatherData.main.temp - 273.15) * 10) / 10;
			weatherData.main.temp_max = Math.round((weatherData.main.temp_max - 273.15) * 10) / 10;
			weatherData.main.temp_min = Math.round((weatherData.main.temp_min - 273.15) * 10) / 10;
		}
		// re-format date
		if(weatherData.dt!=null)
		{
			var d = new Date();
			weatherData.dt = d.getHours()+":"+d.getMinutes()+", "+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
		}

		return weatherData;
	}

	return this;
}])

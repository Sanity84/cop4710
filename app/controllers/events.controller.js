(function() {
	var app = angular.module('App.Events.Controller', []);

	app.controller('EventsController', ['$scope', 'Event', 'University', 'authorized', function($scope, Event, University, authorized) {
		if(authorized) {
			// Do login require loads here!
		}

		$scope.filter = {};
		$scope.events = [];
		University.resource.query(function(response) {
			// console.log(response);
			$scope.universities = response;
			$scope.filter.university = $scope.universities[0];
		});
		
		Event.query(function(response) {
			$scope.events = response;
		});
	}]);

	app.directive('googleMaps', [function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/events/googleMaps.html',
			controller: function($scope) {

				navigator.geolocation.getCurrentPosition(function(position) {
					// LOCATION SPOOFING TODO: REMOVE IN FINAL!!!
					// var local_lat = position.coords.latitude,
					// local_lng = position.coords.longitude;
					// console.log('lat: ' + local_lat + ' :long ' + local_lng);
					// 28.602432, -81.200264
					var local_lat = 28.602432,
					local_lng = -81.200264;

					// Do google map initialization here
					var mapOptions = {
				        zoom: 15,
				        center: new google.maps.LatLng(local_lat, local_lng),
				        mapTypeId: google.maps.MapTypeId.ROADMAP
				    };

				    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

				    // Create markers for nearby events
				    var addMarker = function(event) { 
				    	var lat = event.location_lat, lng = event.location_lng;
				    	console.log(event.name);
				    	var marker = new google.maps.Marker({
				    		map: $scope.map,
				    		position: new google.maps.LatLng(lat, lng),
				    		title: event.name
				    	});

				    	var infoWindow = new google.maps.InfoWindow();

				    	google.maps.event.addListener(marker, 'click', function(){
				            infoWindow.setContent('<h4>' + marker.title + '</h4>');
				            infoWindow.open($scope.map, marker);
			        	});
					};

				    var i, eventsLength = $scope.events.length;
					for(i = 0; i < eventsLength; i++) {
						addMarker($scope.events[i]);
					}
				});
			}
		};
	}]);
})();
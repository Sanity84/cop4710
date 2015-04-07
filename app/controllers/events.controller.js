(function() {
	var app = angular.module('App.Events.Controller', []);

	app.controller('EventsController', ['$scope', 'Event', 'University', 'authorized', function($scope, Event, University, authorized) {
		if(authorized) {
			// Do login require loads here!
		}

		$scope.filter = {};
		University.query(function(response) {
			// console.log(response);
			$scope.universities = response;
			$scope.filter.university = $scope.universities[0];
		});
		$scope.events = [];
		Event.query(function(response) {
			$scope.events = response;
		});
		// UCFPublicEvents.query(function(response) {
		// 	$scope.events = response;
		// });
	}]);

	app.directive('googleMaps', [function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/events/googleMaps.html',
			controller: function($scope) {

				// Test data
				var cities = [
				    {
				        city : 'Toronto',
				        desc : 'This is the best city in the world!',
				        lat : 43.7000,
				        long : -79.4000
				    },
				    {
				        city : 'New York',
				        desc : 'This city is aiiiiite!',
				        lat : 40.6700,
				        long : -73.9400
				    },
				    {
				        city : 'Chicago',
				        desc : 'This is the second best city in the world!',
				        lat : 41.8819,
				        long : -87.6278
				    },
				    {
				        city : 'Los Angeles',
				        desc : 'This city is live!',
				        lat : 34.0500,
				        long : -118.2500
				    },
				    {
				        city : 'Las Vegas',
				        desc : 'Sin City...\'nuff said!',
				        lat : 36.0800,
				        long : -115.1522
				    }
				];
				var userLocation;

				function showPosition(position) {
					lat = position.coords.latitude;
					lon = position.coords.longitude;
					userLocation = new google.maps.LatLng(lat, lon);
				}

				if (navigator.geolocation) {
				    navigator.geolocation.getCurrentPosition(showPosition, showError);
				} else { 
				    x.innerHTML = "Geolocation is not supported by this browser.";
				}


				function showError() {
					console.log('no auth');
				}
				
				var mapOptions = {
			        zoom: 4,
			        // center: new google.maps.LatLng(40.0000, -98.0000),
			        center: new google.maps.LatLng(40.0000, -98.0000),
			        mapTypeId: google.maps.MapTypeId.TERRAIN
			    };

			    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

			    $scope.markers = [];
			    
			    var infoWindow = new google.maps.InfoWindow();
			    
			    var createMarker = function (info){
			        
			        var marker = new google.maps.Marker({
			            map: $scope.map,
			            position: new google.maps.LatLng(info.lat, info.long),
			            title: info.city
			        });
			        marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
			        
			        google.maps.event.addListener(marker, 'click', function(){
			            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
			            infoWindow.open($scope.map, marker);
			        });
			        
			        $scope.markers.push(marker);
			        
			    };
			    
			    for (i = 0; i < cities.length; i++){
			        createMarker(cities[i]);
			    }

			    $scope.openInfoWindow = function(e, selectedMarker){
			        e.preventDefault();
			        google.maps.event.trigger(selectedMarker, 'click');
			    };
			}
		};
	}]);
})();
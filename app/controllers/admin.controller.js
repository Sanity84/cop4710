(function(){
	var app = angular.module('App.Admin.Controller', []);

	app.controller('AdminHomepageController', ['$scope', 'UserUniversity', 'authorized', 'RsoRequest', '$q', function($scope, UserUniversity, authorized, RsoRequest, $q) {
		
		if(authorized) {
			var deferred = $q.defer();
			// This just notifies the user if they have created a school profile, if not let them create one
			$scope.noProfile = true;
			var get_university = function() {
				UserUniversity.get(function(response) {
					if(response.status == 200) {
						deferred.resolve();
						$scope.noProfile = false;
						// $scope.university = response.data.university;
					}else{
						deferred.reject();
					}
				});
				return deferred.promise;
			};

			var get_rsorequests = function() {
				RsoRequest.get(function(response) {
					// sloppy but easier than rewrite
					if(response.status == 200 && response.data != 'No new requests') {
						console.log(response);
						$scope.rsorequests = response.data;
					}else{
						// Reject something
					}
				});
			};
			// Get rso requests!
			var promise = get_university();
			promise.then(function(success) {
				get_rsorequests();
			}, function(failure) {
				// Nothing gets called because parent failed
			});

		}
		
	}]);

	app.directive('rsorequests', [function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/admin/rsorequests.html',
			controller: function($scope, Rso) {
				$scope.accept = function(id) {
					Rso.save({id: id}, function(response) {
						console.log(response);
					});
					console.log('accepted ' + id);
				};
				$scope.reject = function(id) {
					console.log('rejected ' + id);
				};
			}
		};
	}]);

	// TODO: Ensure this is working properly
	app.directive('createProfile', [function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/admin/createProfile.html',
			controller: function($scope, University) {

				$scope.createProfile = function(school) {
					University.save(school, function(response) {
						if(response.status == 200) {
							$scope.noProfile = false;
							// populate university
							$scope.university = response.data;
							$scope.school = {}; // clear out
							$scope.errorMessage = false;
							// show success
						}else{
							// show error message
							$scope.errorMessage = response.data.message;
						}
					});
				};
			}
		};
	}]);
})();
(function(){
	var app = angular.module('App.Admin.Controller', []);

	app.controller('AdminHomepageController', ['$scope', 'UserUniversity', 'authorized', function($scope, UserUniversity, authorized) {
		
		if(authorized) {
			// Load school profile here!
			$scope.noProfile = true;
			UserUniversity.get(function(response) {
				if(response.status == 200) {
					$scope.noProfile = false;
					$scope.university = response.data.university;
				}
			});
		}
		
	}]);


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
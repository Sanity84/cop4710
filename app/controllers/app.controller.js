(function(){
	var app = angular.module('App.Controller', ['App.Services']);

	app.controller('AppController', ['$rootScope', '$scope', 'SessionAPI', 'Session', '$location', function($rootScope, $scope, SessionAPI, Session, $location) {
		$rootScope.loggedin = null;
		$rootScope.firstname = null;
		$rootScope.homepage = null;
		$rootScope.isCollapsed = true;
		$scope.logout = function() {
			SessionAPI.remove({}, function(data) {
				Session.destroy();
				// $rootScope.loggedin = false;
				// $rootScope.isCollapsed = true;
				$location.url('/university');
			});
		};
	}]);

	app.directive('navigation', [function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/app/navigation.html',
			controller: function() {

			}
		};
	}]);

	app.directive('login', [function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/app/login.html',
			controller: function($rootScope, $scope, User, Session, $location) {
				$scope.login = function(loginUser) {
					User.resource(loginUser.username, loginUser.password).login({}, function(data) {
						if(data.status == 200) {

							Session.destroy(); // Clear out any old data
							Session.create(data.data);
							$scope.loginUser = {};
							$scope.errorMessage_login = false;
							$rootScope.isCollapsed = true;

							// Redirect user to respective page
							switch(Session.role) {
								case 'admin': $location.url('/adminHomepage'); break;
								case 'leader': $location.url('/leaderHomepage'); break;
								case 'student': $location.url('/studentHomepage'); break;
								default: $location.url('/events'); break;
							}
						}else{
							$scope.loggedin = false;
							$scope.errorMessage_login = data.data.message;
						}
					});
				};
			}
		};
	}]);

	app.directive('createAccount', [function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/app/create.html',
			controller: function($rootScope, $scope, User, Session, $location, University) {
				// Initialize
				$scope.universities = [];
				$scope.register = {};
				$scope.register.role = 'student'; // default

				University.resource.query(function(response) {
					$scope.universities = response;
					$scope.register.school = $scope.universities[0];
				});

				$scope.create = function(user) {
					var email = (user.role == 'student') ? user.studentemail + user.school.email_domain : user.adminemail;
					user.email = email; // create new email assocation within user object
					if(user.role == 'student')
						user.universityid = user.school.id; // ensure there is a universityid for students

					User.resource(null, null).save(user, function(response) {
						console.log(response);
						if(response.status == 200) {

							Session.destroy(); // Clear out any old data / sessions
							Session.create(response.data); // create new session (auto log in user)

							// General clean up and reset form
							$scope.errorMessage_create = false;
							$scope.register = {};
							$scope.register.school = $scope.universities[0];
							$scope.register.role = 'student';

							// Redirect newly created user to their homepage
							switch(Session.role) {
								case 'admin': $location.url('/adminHomepage'); break;
								case 'leader': $location.url('/leaderHomepage'); break;
								case 'student': $location.url('/studentHomepage'); break;
								default: $location.url('/events'); break;
							}
						}else{
							$scope.errorMessage_create = response.data.message;
							$scope.create.submitted = true;
						}
					});
				};
			}
		};
	}]);

	app.controller('ListUsersController', ['$scope', 'GetAllUsers', 'authorized', function($scope, GetAllUsers, authorized) {
		if(authorized) {
			
		}
		GetAllUsers.get(function(response) {
			// will always success because I said so!
			$scope.admins = response.data.admins;
			$scope.leaders = response.data.leaders;
			$scope.students = response.data.students;
		});
	}]);

})();
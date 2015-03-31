(function(){
	var app = angular.module('cnt4710.controllers', ['cnt4710.services']);

	app.controller('AppController', ['$scope', 'User', 'Session', 'SessionAPI', 'Cookie', '$location', '$sessionStorage', function($scope, User, Session, SessionAPI, Cookie, $location, $sessionStorage) {
		
		// Enables dynamic homepage button depending on user role
		switch($sessionStorage.role) {
			case 'admin': $scope.homepage = 'adminHomepage'; break;
			case 'student': $scope.homepage = 'studentHomepage'; break;
			default: break;
		}

		// Check for cookies and stuff here, this view is only loaded once
		var sessionKey = Cookie.get('session');
		if(!Session.role) { // Not logged in currently
			if(sessionKey) {
				SessionAPI.get({}, function(data) {
					if(data.status == 200) {
						Session.create(data.data);
						Cookie.put('session', Session.session, null);
						$scope.firstname = Session.firstname;
						$scope.loggedin = true;
					}else{
						Session.destroy();
					}
				});
			}
		}

		// New User 
		$scope.create = function() {
			User.resource().save($scope.register, function(data) {
				if(data.status == 200) {
					$scope.createError = false;
					Session.create(data.data);
					Cookie.put('Session', Session.session, null);
					$scope.loggedin = true;
					// Longer beacuse bug with register = {} for select input
					$scope.register.firstname = '';
					$scope.register.lastname = '';
					$scope.register.username = '';
					$scope.register.password = '';
					switch(Session.role) {
						case 'admin': $scope.homepage = 'adminHomepage'; $location.url('/adminHomepage'); break;
						case 'student': $scope.homepage = 'studentHomepage'; $location.url('/studentHomepage'); break;
						default: $location.url('/university'); break;
					}
				}else{
					$scope.createError = true;
					$scope.errorMessage = data.data.message;
					// Get back a session key and log user in right away! If a student ask them to join a uni
				}
			});
		};

		// Login
		$scope.login = function() {
			User.resource($scope.l.username, $scope.l.password).login({}, function(data) {
				if(data.status == 200) {
					$scope.loginError = false;
					$scope.loggedin = true;
					Session.create(data.data);
					Cookie.put('session', Session.session, null); // Only session as long as user doesn't close browser
					$scope.l = {};
					$scope.firstname = Session.firstname;
					// Redirect user to respective page
					switch(Session.role) {
						case 'admin': $scope.homepage = 'adminHomepage'; $location.url('/adminHomepage'); break;
						case 'student': $scope.homepage = 'studentHomepage'; $location.url('/studentHomepage'); break;
						default: $location.url('/university'); break;
					}
				}else{
					$scope.loggedin = false;
					$scope.loginError = true;
					$scope.errorMessage = data.data.message;
				}
			});
		};

		$scope.logout = function() {
			SessionAPI.remove({}, function(data) {
				Session.destroy();
				$scope.loggedin = false;
				$location.url('/university');
			});
		};
	}]);

	app.controller('UniversityController', ['$scope', 'Session', function($scope, Session) {
		
	}]);

	app.controller('RsoController', ['$scope', function($scope) {

	}]);

	app.controller('EventController', ['$scope', function($scope) {

	}]);

	app.controller('AdminHomepageController', ['$scope', 'Session', 'UserUniversity', 'University', function($scope, Session, UserUniversity, University) {
		UserUniversity.get({}, function(data) {
			if(data.status == 200) {
				$scope.university = data.data.university;
				$scope.images = data.data.images;
				$scope.haveUniversity = true;
			}else{
				$scope.haveUniversity = false;
				$scope.university = {};
			}
		});

		$scope.create = function() {
			University.save($scope.university, function(data) {
				console.log(data);
				if(data.status == 200) {
					$scope.haveUniversity = true;
					$scope.haveError = false;
				}else{
					$scope.haveUniversity = false;
					$scope.haveError = true;
					$scope.errorMessage = data.data.message;
				}
			});
		};
	}]);

	app.controller('StudentHomepageController', ['$scope', 'Test', function($scope, Test) {
		$scope.test = function() {
			Test.get({}, function(data) {
				$scope.result = data;
			});
		};
	}]);

})();
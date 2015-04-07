(function(){
	var app = angular.module('App.Services', ['ngResource', 'base64', 'ngStorage']);

	app.service('Session', ['$rootScope', '$sessionStorage', 'Cookie', 'SessionAPI', function($rootScope, $sessionStorage, Cookie, SessionAPI) {
		this.create = function(data) {
			$rootScope.loggedin = true;
			$rootScope.firstname = data.firstname;
			Cookie.put('session', data.session, null); // Only session as long as user doesn't close browser
			// $sessionStorage.role = data.role;
			this.session = data.session;
			this.role = data.role;
			this.firstname = data.firstname;
			switch(data.role) {
				case 'admin': $rootScope.homepage = 'adminHomepage'; break;
				case 'leader': $rootScope.homepage = 'leaderHomepage'; break;
				case 'student': $rootScope.homepage = 'studentHomepage'; break;
				default: break;
			}
		};

		this.destroy = function() {
			$rootScope.loggedin = false;
			$rootScope.firstname = false;
			// delete $sessionStorage.role;
			this.session = null;
			this.role = null;
			this.firstname = null;
			Cookie.put('session', '', -1); // Kill cookie
		};

	}]);


	app.factory('User', ['$resource', '$base64', function($resource, $base64) {
		return {
			resource: function(username, password) {
				return $resource('api/user', {}, {
					login: {
						method: 'GET',
						headers: {
							'Authorization': 'Basic ' + $base64.encode(username + ':' + password)
						}
					}
				});
			}
		};
	}]);

	app.factory('SessionAPI', ['$resource', function($resource) {
		return $resource('api/session');
	}]);

	app.factory('Test', ['$resource', function($resource) {
		return $resource('api/test');
	}]);

	app.factory('UserUniversity', ['$resource', function($resource) {
		return $resource('api/user/university');
	}]);

	app.factory('University', ['$resource', function($resource) {
		return $resource('api/university/:id');
	}]);

	app.factory('UCFPublicEvents', ['$resource', function($resource) {
		return $resource('http://events.ucf.edu/feed.json');
	}]);

	app.factory('GetAllUsers', ['$resource', function($resource) {
		return $resource('api/getAllUsers');
	}]);

	app.factory('RsoRequest', ['$resource', function($resource) {
		return $resource('api/rsorequest');
	}]);

	app.factory('Rso', ['$resource', function($resource) {
		return $resource('api/rso');
	}]);

	app.factory('Event', ['$resource', function($resource) {
		return $resource('api/event');
	}]);

	app.service('Cookie', function() {
		this.put = function (cname, cvalue, exdays) {
			if(exdays !== null) {
				var d = new Date();
				d.setTime(d.getTime() + (exdays*24*60*60*1000));
				var expires = "expires="+d.toUTCString();
				document.cookie = cname + "=" + cvalue + "; " + expires;
			}else{
				// Short session (not remember me)
				document.cookie = cname + "=" + cvalue;
			}
		};

		this.get = function (cname) {
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for(var i=0; i<ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1);
				if (c.indexOf(name) === 0) 
					return c.substring(name.length,c.length);
			}
			return "";
		};
	});

	app.filter('unsafe', function($sce) {
		return function(val) {
			return $sce.trustAsHtml(val);
		};
	});

	// Fix for bootstrap nav collapse in mobile when link is clicked
	// Introducues bug with logout because of a link
	// app.directive('navCollapse', function () {
	// 	return {
	// 		restrict: 'A',
	// 		link: function (scope, element, attrs) {
	// 			var visible = false;

	// 			element.on('show.bs.collapse', function () {
	// 				visible = true;
	// 			});

	// 			element.on("hide.bs.collapse", function () {
	// 				visible = false;
	// 			});

	// 			element.on('click', function(event) {
	// 				if (visible && 'auto' == element.css('overflow-y')) {
	// 					element.collapse('hide');
	// 				}
	// 			});
	// 		}
	// 	};
	// });
})();
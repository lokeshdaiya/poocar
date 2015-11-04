// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('poocar', ['ionic', 'poocar.controllers', 'ngCordova',"ionic.utils"])
.filter('range', function(){
    return function(n) {
      var res = [];
      for (var i = 0; i < n; i++) {
        res.push(i);
      }
      return res;
    };
  })

.run(function ($ionicPlatform, $rootScope, $timeout,$localstorage,$state,$location,$ionicLoading) {
	
	$ionicPlatform.ready(function () {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
		$rootScope.baseurl='http://loksa.uphero.com/services/';

	});
	$rootScope.$on('loading:show', function() {
    $ionicLoading.show({template: 'loading...'})
	})

	  $rootScope.$on('loading:hide', function() {
		$ionicLoading.hide()
	  })
	if(angular.isUndefined($localstorage.getObject('user'))){
		$state.go("app.Login",{}, { reload: true });
		
	}else{
		$rootScope.globals=$localstorage.getObject('user');
		console.log($rootScope.globals);
		//$rootScope.email=$localstorage.get('email');
		//$state.go("app.Home");
	}
})

.config(function ($provide, $stateProvider, $urlRouterProvider,$httpProvider,$ionicConfigProvider) {
	$ionicConfigProvider.backButton.previousTitleText(false);	
   $httpProvider.interceptors.push(function($rootScope) {
    return {
      request: function(config) {
        $rootScope.$broadcast('loading:show')
        return config
      },
      response: function(response) {
        $rootScope.$broadcast('loading:hide')
        return response
      }
    }
  })

	$stateProvider.state('app', {
		url: "/app",
		abstract: true,
		templateUrl: "templates/menu.html",
		controller: 'AppCtrl'
	})

	.state('app.Home', {
		url: "/Home",
		views: {
			'menuContent': {
				templateUrl: "templates/Home.html",
				controller: "HomeCtrl"
			}
		}
	})
	.state('app.Sider', {
		url: "/Slider",
		views: {
			'menuContent': {
				templateUrl: "templates/Slider.html",
				controller: "SliderCtrl"
			}
		}
	})
  .state('app.Login', {
	  url: "/Login",
	  views: {
		  'menuContent': {
			  templateUrl: "templates/Login.html",
			  controller: "LoginController"
		  }
	  }
  })

  .state('app.Signup', {
	  url: "/Signup",
	  views: {
		  'menuContent': {
			  templateUrl: "templates/Signup.html",
			  controller: "SignUpCtrl"
		  }
	  }
  })
  .state('app.PostRide', {
	  url: "/PostRide",
	  views: {
		  'menuContent': {
			  templateUrl: "templates/PostRide.html",
			  controller: "PostRideCtrl"
		  }
	  }
  })

  .state('app.Rides', {
	  url: "/Rides",
	  views: {
		  'menuContent': {
			  templateUrl: "templates/Rides.html",
			  controller: "RidesCtrl"
		  }
	  }
  })
  .state('app.RideDetails', {
	  url: "/Rides/{id}",
	  views: {
		  'menuContent': {
			  templateUrl: "templates/RideDetails.html",
			  controller: "RideDetailsCtrl"
		  }
	  }
  })
  .state('app.UserDetails', {
      url: "/UserDetails/{id}",
      views: {
          'menuContent': {
              templateUrl: "templates/UserDetails.html",
              controller: "UserCtrl"
          }
      }
  })
	;
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/Home');
});

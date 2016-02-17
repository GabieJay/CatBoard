'use strict'

//Define an angular module for our app
var myApp = angular.module('myApp', ['ngRoute']);
//Define Routing for the application

myApp.run(function($rootScope) {
    $rootScope.loggedIn = false;
	$rootScope.account = {};
})

myApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl : 'partials/home.html',
                controller  : 'mainController'
            })

            .when('/login', {
                templateUrl : 'partials/login.html',
                controller  : 'loginController'
            })

            .when('/list', {
                templateUrl : 'partials/list.html',
                controller  : 'listController'
            }).
			when('/register', {
                templateUrl : 'partials/register.html',
                controller  : 'registerController'
            }).
			when('/search', {
                templateUrl : 'partials/search.html',
                controller  : 'searchController'
            }).
			when('/game', {
                templateUrl : 'partials/game.html',
                controller  : 'gameController'
            }).
			when('/user', {
                templateUrl : 'partials/user.html',
                controller  : 'userController'
            }).
			when('/addGame', {
                templateUrl : 'partials/addGame.html',
                controller  : 'addGameController'
            }).
			otherwise({
				redirectTo: '/home'
			});
			
			
}]);

// create the controller and inject Angular's $scope
	myApp.controller('mainController', ['$scope','$http', function($scope,$http) {
		 $http.get('php/Home.php').success(function (data) 
		{
			$scope.reviews = data[0];
			$scope.games = data[1];
		});
	}]);
	
	myApp.controller('loginController', ['$scope', '$rootScope','$http', function($scope,$rootScope,$http) 
	{
		$scope.login = function() 
		{
			$http.post('php/Login.php', {'user_name': $scope.user, 'pass_word':$scope.password}).success(function (data) {
				$rootScope.account = data;
			});
		};
	}]);
	
	 
	myApp.controller('listController', ['$scope','$http', '$routeParams', function($scope,$http, $routeParams) {
		
		$scope.listId = $routeParams.listId;
		$http.post('php/List.php', {'list_id': $scope.listId}).success(function (data) {
			$scope.user = data[0].USERNAME;
			$scope.games = data[1];
		});
	}]);
	
	myApp.controller('registerController', ['$scope','$http', function($scope,$http) {
		$scope.register = function() 
		{
			$http.post('php/Register.php', {'user': $scope.user, 'password': $scope.password}).success(function (data) {
			
			});
		};
	}]);

	myApp.controller('searchController', ['$scope','$http', '$routeParams', function($scope,$http, $routeParams) {
      
	  $scope.filter = "all";
	  $scope.games;
	  
	  if($routeParams.filter != null){
		  $scope.filter = $routeParams.filter;
	  }
	  
	  $http.post('php/Search.php', {'filter': $scope.filter}).success(function (data) {
			$scope.games = data;
		});
	  
	}]);
	
	 myApp.controller('gameController', ['$scope', '$rootScope','$http', '$routeParams', function($scope,$rootScope,$http, $routeParams) {
      
	  $scope.description = "No description available";
	  $scope.image = "http://cumbrianrun.co.uk/wp-content/uploads/2014/02/default-placeholder-300x300.png";
	  $scope.gameId = $routeParams.gameId;
	  $http.post('php/Game.php', {'game_id': $scope.gameId}).success(function (data) {
			$scope.gameName = data[0].GAMENAME;
			$scope.description = data[0].DESCRIPTION;
			$scope.image = data[0].IMAGEURL;
		});
	
		$scope.checkLogin = function() 
		{
			if(!$rootScope.loggedIn){
				alert("You must be logged in to perform this action");
			}
		}
		
	}]);
	
	myApp.controller('userController', ['$scope','$http', '$routeParams', function($scope,$http, $routeParams) {
		$scope.about = "Not available";
		$scope.image = "http://cumbrianrun.co.uk/wp-content/uploads/2014/02/default-placeholder-300x300.png";
		
		$scope.userId = $routeParams.userId;
		$http.post('php/User.php', {'user_id': $scope.userId}).success(function (data) {
			$scope.userName = data[0].USERNAME;
			$scope.image = data[0].IMAGEURL;
			$scope.listId = data[0].LISTID;
		});
	}]);
	
	myApp.controller('addGameController', ['$scope','$http', '$routeParams', '$location', function($scope,$http, $routeParams, $location) {
		
		$scope.image = "http://cumbrianrun.co.uk/wp-content/uploads/2014/02/default-placeholder-300x300.png";
		
		$http.get("php/Platforms.php").success(function (data) {
			$scope.platforms = data;
			$scope.selectedPlatform = data[0];
		});
		
		$scope.add = function() 
		{
			$http.post('php/AddGame.php', 
			{'game_name': $scope.name, 'image_url': $scope.image, 'game_description':$scope.description, 'game_pid': $scope.selectedPlatform.PLATFORMID})
			.success(function (data) 
			{
				$location.path('/game').search({gameId: data});;
			});
		};
		
		$scope.cancel = function(){
			$location.path('/search');
		};
	}]);
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
/*global angular  */

/* we 'inject' the ngRoute module into our app. This makes the routing functionality to be available to our app. */
//NB: ngRoute module for routing and deeplinking services and directives
var myApp = angular.module('myApp', ['ngRoute'])


myApp.config( ['$routeProvider', function($routeProvider) {
  $routeProvider
		 .when('/search', {
      templateUrl: 'templates/search.html',
      controller: 'searchController'
    })
    .when('/new_releases', {
      templateUrl: 'templates/new_releases.html',
      controller: 'new_releasesController'
    })
		.when('/detail/:id', {
      templateUrl: 'templates/detail.html',
      controller: 'detailController'
    })
   .when('/top', {
      templateUrl: 'templates/top.html',
      controller: 'topController'
    })
    .when('/favourites', {
		  templateUrl: 'templates/favourites.html',
      controller: 'favouritesController'
		})
		.otherwise({
		  redirectTo: 'search'
		})
	}])

//SEARCH CONTROLLER
myApp.controller('searchController', function($scope, $http) {
  $scope.message = 'This is the home screen'
	$scope.reqPost = function(req, res){

	  	var url = 'https://cde305-reubentan.c9users.io/movies'
	  	console.log('POST ' +url)
	  	$http.post(url).success(function(response) {
	      console.log(response)
	  	})
	  }

  $scope.search = function($event) {
    console.log('search()')
    if ($event.which == 13 || $event.which == 113) {
      var searchTerm = $scope.searchTerm
      var url = ''
      if ($event.which == 13)
      	url = 'https://api.themoviedb.org/3/search/movie?api_key=788b5abe0b390210cb65c826ce6ae321&language=en-US&page=1&include_adult=false&query='+searchTerm
      else if($event.which == 113)
      	url = 'https://cde305-reubentan.c9users.io/movies?q='+searchTerm

      console.log(url)
      $http.get(url).success(function(resp) {
        console.log(resp)
        if (resp.data)
        	$scope.movies = resp.data
        else if (resp.results)
        	$scope.movies = resp.results
          $scope.searchTerm = ''
      })
    }
  }
})

//DETAILS CONTROLLER
myApp.controller('detailController', function($scope,  $routeParams, $http, $window, $sce) {
  $scope.message = 'This is the detail screen'
  $scope.id = $routeParams.id

  var url = 'https://cde305-reubentan.c9users.io/movies/find/' +  $scope.id
  $http.get(url).success(function(rspMovie) {
  	if (rspMovie.code == 200){
	    console.log("Details " + $scope.id)
    $scope.movie = {}
    $scope.movie.id = rspMovie.data.id
    $scope.movie.title = rspMovie.data.title
    $scope.movie.overview = rspMovie.data.overview
    $scope.movie.poster_path = 'http://image.tmdb.org/t/p/w154'+rspMovie.data.poster_path
    $scope.movie.release_date = rspMovie.data.release_date
    $scope.movie.vote_average = rspMovie.data.vote_average
    $scope.movie.genres = rspMovie.data.genres
    $scope.movie.videos = $sce.trustAsResourceUrl('https://www.youtube.com/embed/'+rspMovie.data.videos.results[0].key)
    $scope.movie.budget = rspMovie.data.budget
    $scope.movie.status = rspMovie.data.status
    $scope.movie.homepage = rspMovie.data.homepage
  	}
  	else
  		$window.alert("Details")
  })

  $scope.addToFavourites = function(id, title) {
  	alert(title + " has been added to your favourites!");
    console.log('adding: '+id+' to favourites.')
    localStorage.setItem(id, title)
  }
});

//NEW RELEASES CONTROLLER
myApp.controller('new_releasesController', function($scope, $http) {
  $scope.message = 'Here are the new movies out today!'
  console.log('myAPI GET /search')
  var url ='https://cde305-reubentan.c9users.io/movies/now_playing'
  $http.get(url).success(function(resp) {
	  console.log(resp.message);
	  $scope.movies = resp.data;
	  $scope.nowTerm=''
  })
})

//TOP RATED CONTROLLER
myApp.controller('topController', function($scope, $http) {
  $scope.message = 'Check these major blockbusters and see how great they are!'
  console.log('myAPI GET /search')
  var url ='https://cde305-reubentan.c9users.io/movies/top_rated'
  $http.get(url).success(function(resp) {
	  console.log(resp.message);
	  $scope.movies = resp.data;
	  $scope.topTerm=''
  })
})

//FAVOURITES CONTROLLER
myApp.controller('favouritesController', function($scope) {
  console.log('fav controller')
  $scope.message = 'This is the favourites screen'
  var init = function() {
    console.log('getting movies')
    var items = new Array();
    //for (var key in localStorage) {
    for(var i = 0; i < localStorage.length; i++) {
    	var key = localStorage.key(i);
    	var obj = {};
    	items.push({id: key, title:localStorage.getItem(key)})
    }
    console.log(items)
    $scope.movies = items
  }
  init()

  $scope.kill = function(id) {
  	localStorage.removeItem(id);  init();
  	alert(id + " has been cleared!");
    console.log('deleting id '+id)
  }
  $scope.deleteAll = function(title){
  	localStorage.clear(); init();
  	alert("Your favourites have been cleared!");
  }
})











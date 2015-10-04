///////////////////////////////////////////////////////////////////////////////////
//
// This is my third draft of this project.
// This project uses Angular.
// It has been refactored to use a custom service, camperNews.
// It has been refactored to use a
// directive for displaying the news article tiles

/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// placed inside iife so we don't mess with global namespace
(function() {

  // defining a service - revealing module design pattern - provides an api

  
var app = angular.module("app", []);
  
  
app.controller("MainController", function($scope, $interval) {
  
  $scope.art = {
    link: "http://sixrevisions.com/javascript/free-javascript-books/",
    image: "http://cdn.sixrevisions.com/0544-01-book-cover-eloquent-javascript.png",
    author_picture: "https://s3.amazonaws.com/freecodecamp/camper-image-placeholder.png",
    current_headline: "10 Free Javascript Books",
    headline: "10 Free Javascript Books",
    discussion: "http://www.freecodecamp.com/news/10-free-javascript-books",
    upvotes: "3"
    
  }
  
  $scope.callme = function(msg) {
    console.log("You gave me: "+msg)
  }

  var headline_max_characters = 0; // used to turn off $interval
  


  /*
  var startCountup = function() {
    $interval(incrementHeadlines, 100, headline_max_characters)
    
  }*/
  
  
});

  
app.directive('pomodoro', function() {
  return {
    replace:   false, //true,
    restrict: 'E',
    scope: {
      article: '=',
      localFunc: '&'
    },
    templateUrl: "pomodoro.html",
    controller: function($scope) {
      console.log("inside pomodoro controller")
      $scope.mydata = "message"
      $scope.newTask = function() {
        console.log("New task called")
      }
    }
  }
})  
  

// i got this off of SO. need to review how the following works
// http://stackoverflow.com/questions/16310298/if-a-ngsrc-path-resolves-to-a-404-is-there-a-way-to-fallback-to-a-default
app.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
});  
  
  /*
  angular.module('myApp.services', [])
  .factory('githubService', ['$http', function($http) {

    var doRequest = function(username, path) {
      return $http({
        method: 'JSONP',
        url: 'https://api.github.com/users/' + username + '/' + path + '?callback=JSON_CALLBACK'
      });
    }
    return {
      events: function(username) { return doRequest(username, 'events'); },
    };
  }]);
  */
  
}());
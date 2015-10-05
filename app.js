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
    replace:   false,
    restrict: 'E',
    scope: {
      article: '=',
      localFunc: '&'
    },
    templateUrl: "pomodoro.html",
    controller: function($scope) {
      console.log("inside pomodoro controller")

     
//Task    Subject   Tomatoes  Priority  Detail
//Work through  AngularJS *****   ***   http://.....
      $scope.tasks = [
        {id: 0, name: "name1", subject: "subject", tomatoes: "1", priority: "10", detail: "details goes here"},
        {id: 1, name: "name2", subject: "subject", tomatoes: "1", priority: "10", detail: "details goes here"},
        {id: 2, name: "name3", subject: "subject", tomatoes: "1", priority: "10", detail: "details goes here"},
        {id: 3, name: "name4", subject: "subject", tomatoes: "1", priority: "10", detail: "details goes here"},
        {id: 4, name: "name5", subject: "subject", tomatoes: "1", priority: "10", detail: "details goes here"},
        {id: 5, name: "name6", subject: "subject", tomatoes: "1", priority: "10", detail: "details goes here"},
        {id: 6, name: "name7", subject: "subject", tomatoes: "1", priority: "10", detail: "details goes here"},
        {id: 7, name: "name8", subject: "subject", tomatoes: "1", priority: "10", detail: "details goes here"},
        {id: 8, name: "name9", subject: "subject", tomatoes: "1", priority: "10", detail: "details goes here"},
        {id: 9, name: "name10", subject: "subject", tomatoes: "1", priority: "10", detail: "details goes here"}
      ]
// dont think i need id as an attribute, since tasks is an array, maybe if there is a server backend

      $scope.new_id = 10; // to be used later to add more tasks
      $scope.displayControl = false
      $scope.displaySettings = false
      $scope.childWindowIsActive = false

      $scope.mydata = "message" // testing


      $scope.newTask = function() {
        console.log("New task called")
        //
        //
        $scope.new_id += 1; // used later
      }

      $scope.rowClick = function(index) {
        console.log("rowClick() invoked with "+index)
        if (!$scope.childWindowIsActive) $scope.activeRow = index
      }

      $scope.controlDisplay = function() {
        console.log("controlDisplay() invoked")
        $scope.displayControl = true
      }

      $scope.controlHide = function() {
        console.log("controlHide() invoked")
        if (!$scope.childWindowIsActive) $scope.displayControl = false
      }

      $scope.settingsDisplay = function() {
        console.log("settingsDisplay() invoked")
        $scope.displaySettings = true
        $scope.childWindowIsActive = true
      }

      $scope.settingsHide = function() {
        console.log("settingsHide() invoked")
        $scope.displaySettings = false
        $scope.childWindowIsActive = true
      }



    }
  }
})  
  

  
  /*
  angular.module('myApp.services', [])
  .factory('taskService', ['$http', function($http) {

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
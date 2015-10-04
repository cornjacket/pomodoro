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
      article: '='
    },
    template: "<div id='pomodoro_tile'>"+
              "  <div id='pomodoro_header'>"+
              "    <img src='pomodoro.png' width='20px'>"+
              "    <a href='#'><span class='pull-right'>X</span></a>"+               
              "    <a href='#'><span class='pull-right'>_</span></a>"+                         
              "  </div>"+               
              "  <div id='pomodoro_body'>"+  

                    "<!-- Static navbar -->"+
                    "<nav class='navbar navbar-default'>"+
                      "<div class='container'>"+
                        "<div id='navbar' class='navbar-collapse collapse'>"+
                          "<ul class='nav navbar-nav'>"+
                            "<li><a href='#'><div><span class='glyphicon glyphicon-plus text-center' aria-hidden='true'></span></div><div class='button-caption text-center'>New Task</div></a></li>"+
                            "<li><a href='#'><div><span class='glyphicon glyphicon-ok text-center' aria-hidden='true'></span></div><div class='button-caption text-center'>Complete</div></a></li>"+
                            "<li><a href='#'><div><span class='glyphicon glyphicon-time text-center' aria-hidden='true'></span></div><div class='button-caption text-center'>Start</div></a></li>"+
                            "<li><a href='#'><div><span class='glyphicon glyphicon-play text-center' aria-hidden='true'></span></div><div class='button-caption text-center'>Continue</div></a></li>"+
                            "<li><a href='#'><div><span class='glyphicon glyphicon-pause text-center' aria-hidden='true'></span></div><div class='button-caption text-center'>Pause</div></a></li>"+
                            "<li><a href='#'><div><span class='glyphicon glyphicon-wrench text-center' aria-hidden='true'></span></div><div class='button-caption text-center'>Settings</div></a></li>"+
                          "</ul>"+
                        "</div><!--/.nav-collapse -->"+
                      "</div><!--/.container-fluid -->"+
                    "</nav>"+


               "  </div>"+
               "</div>"+
      
              "<div id='tomato'>"+
              "  <a href='#' title='Work on Pomodoro zipline, 23.7 minutes remaining'>"+
              "    <div class='tomato_container'>"+
              "      <div class='countdown'><strong>24</strong></div>"+
              "      <img src='pomodoro.png'>"+
              "    </div>"+
              "  </a>"+
              "</div>"
    
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
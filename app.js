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
    controller: function($scope, $interval) {
      console.log("inside pomodoro controller")

     
//Task    Subject   Tomatoes  Priority  Detail
//Work through  AngularJS *****   ***   http://.....
      $scope.tasks = [
        {id: 0, name: "pomodoro", subject: "zipline", tomatoes: "4", priority: "10", detail: "work on basic functionality"},
        {id: 1, name: "tic tac toe", subject: "zipline", tomatoes: "1", priority: "2", detail: "still one way to beat game"},
        {id: 2, name: "calculalor", subject: "zipline", tomatoes: "5", priority: "7", detail: "leverage pomodoro"},
        {id: 3, name: "wikipedia viewer", subject: "zipline", tomatoes: "4", priority: "6", detail: "leverage pomodoro"},
        {id: 4, name: "study Angular", subject: "study", tomatoes: "6", priority: "5", detail: "watch videos while working out"},
        {id: 5, name: "simon game", subject: "zipline", tomatoes: "4", priority: "6", detail: ""},
        {id: 6, name: "gmail clone", subject: "personal", tomatoes: "3", priority: "3", detail: ""},
        {id: 7, name: "portfolio website", subject: "zipline", tomatoes: "1", priority: "5", detail: ""},
        {id: 8, name: "blog", subject: "personal", tomatoes: "1", priority: "5", detail: "1 blog per project"}
      ]
// dont think i need id as an attribute, since tasks is an array, maybe if there is a server backend

      var workTimer  = 25  // keep track of value updated by user
      var restTimer = 5
      var alwaysOnTop   = true
      var alarmWhenTimerExpires = true
      var currentTaskIndex = -1

      $scope.activeRow = -1

      $scope.new_id = 10; // to be used later to add more tasks
      $scope.controlDisplay  = false
      $scope.settingsDisplay = false
      $scope.newTaskDisplay  = false //true

      $scope.settingsWorkTimer = 25 // timer value used by settings window
      $scope.settingsRestTimer = 5
      $scope.settingsAlwaysOnTop = true
      $scope.settingsAlarmWhenTimerExpires = true

      var taskIsRunning = false
      var currentTask = {}
      var currentWorkTimerMin = 25 // real time
      var currentWorkTimerSeconds = 0
      var currentRestTimerMin = 5
      var currentRestTimerSeconds = 0
      var currentlyWorking = false; //true // start off as working - if false, then resting

      $scope.tomatoWorkTimeMin  = ''  // actual value that is displayed on red tomato
      $scope.tomatoRestTimeMin  = ''  // actual value that is displayed on green tomato
      $scope.hoverMessage       = ''

      $scope.mydata = "message" // testing

      // downcounting the seonds
      $interval(function(){

        if (taskIsRunning) { 
          if (currentWorkTimerSeconds === 0) {
            // now change the tomato minute count only when minute count does not equal the
            // starting minute timer. this will have a trailing effect for the tomato
            if (currentWorkTimerMin !== workTimer) $scope.tomatoWorkTimeMin -= 1
            currentWorkTimerMin -= 1
            currentWorkTimerSeconds = 59            
          } else {
            currentWorkTimerSeconds = (currentWorkTimerSeconds -1)%60
          }          
          $scope.hoverMessage = (currentlyWorking) 
            ? currentTask.name +', '+currentWorkTimerMin+' minutes and '+currentWorkTimerSeconds+' seconds'
            : currentTask.name +', '+currentRestTimerMin+' minutes and '+currentRestTimerSeconds+' seconds'
      
        } // otherwise it has already been set to ''
        console.log(currentWorkTimerSeconds)
      }, 1000);       

      $scope.newTask = function() {
        if (!childWindowIsActive()) {
          console.log("New task called")
          $scope.new_id += 1; // used later
          $scope.task = ''
          $scope.subject = ''
          $scope.tomatoes = ''
          $scope.priority = ''
          $scope.detail = ''          
          $scope.newTaskDisplay = true
        }
      }

      $scope.cancelNewTask = function() {
          console.log("cancelNewTask() invoked")
          $scope.newTaskDisplay = false
      }

      $scope.updateNewTask = function() {
          console.log("updateNewTask() invoked")
          var new_task = {
            id: $scope.new_id, 
            name: $scope.task, 
            subject: $scope.subject, 
            tomatoes: $scope.tomatoes, 
            priority: $scope.priority, 
            detail: $scope.priority
            /* do not create currentMinutes or currentSeconds until task is first run */
          }
          $scope.tasks.push(new_task)
          $scope.newTaskDisplay = false
      }      

      $scope.completeTask = function() {
        taskIsRunning = false
        if ($scope.activeRow !== -1) {
          $scope.tasks.splice($scope.activeRow,$scope.activeRow+1)
          console.log("currentTaskIndex = "+currentTaskIndex)
          console.log("$scope.activeRow = "+$scope.activeRow)
          if (currentTaskIndex === $scope.activeRow) {
            // marking current tomato as complete
            $scope.tomatoWorkTimeMin = '' // display nothing on the tomato
            $scope.tomatoRestTimeMin = ''
            $scope.hoverMessage      = ''
          }
          $scope.activeRow = -1
        } // otherwise we can give a message, maybe give a confirm message box too
      }

      $scope.startTask = function() {
        if ($scope.activeRow !== -1) {
          currentTaskIndex = $scope.activeRow
          currentTask = $scope.tasks[currentTaskIndex]
          $scope.tomatoWorkTimeMin = workTimer
          $scope.tomatoRestTimeMin = restTimer
          $scope.hoverMessage = currentTask.name +', '+currentWorkTimerMin+' minutes and '+currentWorkTimerSeconds+' seconds'
          taskIsRunning = true
        }
      }

      $scope.rowClick = function(index) {
        if (!childWindowIsActive()) {
          console.log("rowClick() invoked with "+index)
          $scope.activeRow = index
        }
      }

      $scope.displayControl = function() {
        console.log("displayControl() invoked")
        $scope.controlDisplay = true
      }

      $scope.cancelControl = function() {
        if (!childWindowIsActive()) {
          console.log("cancelControl() invoked")
          $scope.controlDisplay = false
        }
      }

      $scope.displaySettings = function() {
        if (!childWindowIsActive()) {
          console.log("displaySettings() invoked")
          $scope.settingsDisplay = true
        }
      }


      $scope.updateSettings = function() {
        $scope.settingsDisplay = false
        
        workTimer = $scope.settingsWorkTimer
        restTimer = $scope.settingsRestTimer
        alwaysOnTop = $scope.settingsAlwaysOnTop
        alarmWhenTimerExpires = $scope.settingsAlarmWhenTimerExpires

      }

      $scope.cancelSettings = function() {
        console.log("settingsHide() invoked")        
        $scope.settingsDisplay = false

        // get back old values for next time user enters Settings
        $scope.settingsWorkTimer = workTimer
        $scope.settingsRestTimer = resttTimer
        $scope.settingsAlwaysOnTop = alwaysOnTop
        $scope.settingsAlarmWhenTimerExpires = alarmWhenTimerExpires
      }

      function childWindowIsActive() {
        return ($scope.settingsDisplay || $scope.newTaskDisplay)
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
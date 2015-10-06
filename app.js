///////////////////////////////////////////////////////////////////////////////////
//
// This is the first draft of this project.
// This project uses Angular.

/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// placed inside iife so we don't pollute with global namespace
(function() {

  
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

      // local storage of tasks. later this could be grabbed from a server
      $scope.tasks = [
        {id: 0, name: "pomodoro", subject: "zipline", tomatoes: "4", priority: "10", detail: "work on basic functionality"},
        {id: 1, name: "tic tac toe", subject: "zipline", tomatoes: "1", priority: "2", detail: "still one way to beat game"},
        {id: 2, name: "calculalor", subject: "zipline", tomatoes: "5", priority: "7", detail: "leverage pomodoro"},
        {id: 3, name: "wikipedia viewer", subject: "zipline", tomatoes: "4", priority: "6", detail: "leverage pomodoro"},
        {id: 4, name: "study Angular", subject: "study", tomatoes: "6", priority: "5", detail: "watch videos while working out"},
        {id: 5, name: "simon game", subject: "zipline", tomatoes: "4", priority: "6", detail: ""},
        {id: 6, name: "portfolio website", subject: "zipline", tomatoes: "1", priority: "5", detail: ""},
        {id: 7, name: "blog", subject: "personal", tomatoes: "1", priority: "5", detail: "1 blog per project"}
      ]

      var workTimer  = 25  // keep track of value updated by user
      var restTimer = 5
      var timer            // combined master timer
      var alwaysOnTop   = true
      var alarmWhenTimerExpires = true
      var currentTaskIndex = -1

      $scope.activeRow = -1

      $scope.new_id = 9; // to be used later to add more tasks
      $scope.controlDisplay  = false
      $scope.settingsDisplay = false
      $scope.newTaskDisplay  = false //true

      $scope.settingsWorkTimer = 25 // timer value used by settings window
      $scope.settingsRestTimer = 5
      $scope.settingsAlwaysOnTop = true
      $scope.settingsAlarmWhenTimerExpires = true

      $scope.currentlyWorking = false // used to determine if task or rest
      //var currentTask = {}
      var currentTimerMin = 25 // real time
      var currentTimerSeconds = 0
      var taskIsComplete = true 
      var taskInProgress = false
      
      //http://www.salamisound.com/6525146-alarm-clock-ringing-pitch
      // this is not supposed to be on the web
      // need to find another file available on web
      var audio = new Audio('assets/alarm-clock.mp3');      

      $scope.currentlyWorking = true // start off as working - if false, then resting
      $scope.tomatoTimeMin  = ''  // actual value that is displayed on tomato
      $scope.hoverMessage   = 'Click Me!'

      // downcounting the seonds
      $interval(function(){

        if (!taskIsComplete) {
          if (currentTimerSeconds === 0) {
            if (currentTimerMin !== 0) { // just counted down a minute, ie seconds === 0, but minutes !== 0                            
              // now change the tomato minute count only when minute count does not equal the
              // starting minute timer. this will have a trailing effect for the tomato
              if (currentTimerMin !== timer) $scope.tomatoTimeMin -= 1
              currentTimerMin -= 1 
              currentTimerSeconds = 10 //59
            } else {  // end of work or rest period, ie minutes and seconds both === 0                          
                if ($scope.settingsAlarmWhenTimerExpires) audio.play();            
                if ($scope.currentlyWorking) { // the end of a working period so set up the next rest period                              
                  $scope.currentlyWorking   = false
                  timer                     = restTimer
                  currentTimerMin           = timer 
                }
                else { // the end of a resting period and maybe the end of a task                  
                  // at this point instead of ending the task we should check the number
                  // of tomatoes and decrement, if it is zero then we should go ahead and
                  // end the task, otherwise we should change currently 
                  // working to true again
                  $scope.tomatoTimeMin    = ""
                  taskIsComplete          = true

                  // make the tomato red again regardless if there is anothr work period
                  $scope.currentlyWorking = true
                }
              }            
          } else {            
              currentTimerSeconds = (currentTimerSeconds -1)%60
          }

          if (taskIsComplete) {
            $scope.hoverMessage = tasks[currentTaskIndex].name +' has finished.'
            // maybe mark the row in a different color
          }
          else $scope.hoverMessage = tasks[currentTaskIndex].name +', '+currentTimerMin+' minutes and '+currentTimerSeconds+' seconds'
          }  // task is complete

          console.log(currentTimerSeconds)
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
        if (!childWindowIsActive()) {
          $scope.currentlyWorking = false
          if ($scope.activeRow !== -1) {
            $scope.tasks.splice($scope.activeRow,$scope.activeRow+1)
            console.log("currentTaskIndex = "+currentTaskIndex)
            console.log("$scope.activeRow = "+$scope.activeRow)
            if (currentTaskIndex === $scope.activeRow) {
              // marking current tomato as complete
              $scope.tomatoTimeMin = '' // display nothing on the tomato
              $scope.hoverMessage  = ''
            }
            $scope.activeRow = -1
          } // otherwise we can give a message, maybe give a confirm message box too
        }
      }

      $scope.startTask = function() {
        if (!childWindowIsActive() && $scope.activeRow !== -1) {
          currentTaskIndex = $scope.activeRow
          //currentTask = $scope.tasks[currentTaskIndex]
          timer                    = workTimer
          $scope.tomatoTimeMin     = workTimer
          currentTimerMin          = workTimer
          currentTimerSeconds      = 0
          $scope.currentlyWorking  = true
          taskIsComplete           = false
          taskInProgress           = true
        }
      }

      $scope.pauseTask = function() {
        if (!childWindowIsActive()) {
          taskInProgress = false
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
        $scope.settingsRestTimer = restTimer
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
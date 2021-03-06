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
  

  var messages = [
        "Click the tomato.",
        "Excellent!! Now click on Settings.",
        "Very Good. Now set both timers to 1 minute and click Update. And be quick about it.",
        "Most impressive. Now select a task to run and click Start.",
        "Excellent Choice!! Click Pause and hover over the tomato. Then click Continue.",    
        "While we're waiting for the timer, select New Task.",
        "Fill out the fields and click Update. And don't dilly dally!!",
        "Very good. Scroll down to see it has been added. Now close the dashboard.",
        "Very well done. The tomato is fully operational. And so we wait.",        
        "The green tomato means 'take a break'. Click the tomato and play around with it.",
        "The task has finished and your training is complete."
      ]

  var current_state = 0
  $scope.message = messages[0]

      $interval(function(){       
        if (current_state <= 10) {          
          $scope.message = messages[current_state] // this line here causes an inherit one second pause which feels more normal
          if ($scope.event === current_state + 1) current_state+=1
        }
        //if ($scope.event == "REST PERIOD HAS BEGUN") $scope.message = "The green tomato means 'take a break'. Click the tomato and play around with it."
        //if ($scope.event == "TASK HAS FINISHED") $scope.message = "The task has finished and your training is complete." 
        console.log(current_state)
      }, 1000);       

});



  
app.factory('tasks', function() {

  var task_list = [
    {id: 0, name: "tps report", priority: "10", detail: "emperor has been asking about this"},
    {id: 1, name: "get cape pressed", priority: "2", detail: "bounty hunter meeting @ 1400 hours"},
    {id: 2, name: "saber practice", priority: "7", detail: "find new partner. last one dead."}, // need to clip strings that are too long
    {id: 3, name: "new death star", priority: "6", detail: "make sure all vents are sealable in new design"}
  ]

  var get_tasks = function() {
    return task_list
  }
  
  return {
    get: function() { return get_tasks() }
  };

});


app.directive('pomodoro', function(tasks) {
  return {
    replace:   false,
    restrict: 'E',
    scope: {
      event: '='
    },
    templateUrl: "pomodoro.html",
    controller: function($scope, $interval,tasks) {
      console.log("inside pomodoro controller")

      $scope.tasks = tasks.get()


      $scope.truncate = function(str, num) {
      // Clear out that junk in your trunk
        if (str.length <= num) {
          return str;
        }
        // else
        var trunc_str = str.slice(0,num-3) + "...";
        return trunc_str;
      }


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

      var currentTimerMin     = 25 // real time
      var currentTimerSeconds = 0
      var taskIsComplete      = true 
      var taskInProgress      = false
      var turnOffTask         = false
      var taskHasBeenPaused   = false


      //http://www.salamisound.com/6525146-alarm-clock-ringing-pitch
      // this is not supposed to be on the web
      // need to find another file available on web
      var audio = new Audio('assets/alarm-clock.mp3');      

      $scope.currentlyWorking = true // start off as working - if false, then resting
      $scope.tomatoTime     = ''  // actual value that is displayed on tomato - will be minutes or seconds for final minute
      $scope.hoverMessage   = 'Click Me!'


      // downcounting the seconds
      $interval(function(){

        //console.log("DRT taskInProgress ="+taskInProgress)
        //console.log("DRT currentlyWorking ="+$scope.currentlyWorking)

        if (turnOffTask) { // flag from completeTask to this handler to stop counting. 
            // Due to the asynchronous nature of completeTask(), there may be a remote chance
            // that changing a variable in that routine can have an unpredictable result
            // inside this routine. There fore instead of changing the variable in there, we
            // send a message to change the variables here
            $scope.currentlyWorking = true  // turn tomato red
            taskInProgress = false
            taskIsComplete = true
            turnOffTask    = false
        }

        if (!taskIsComplete && taskInProgress) {
          if (currentTimerSeconds === 0) {
            if (currentTimerMin !== 0) { // just counted down a minute, ie seconds === 0, but minutes !== 0                            
              // now change the tomato minute count only when minute count does not equal the
              // starting minute timer. this will have a trailing effect for the tomato
              if (currentTimerMin !== timer) $scope.tomatoTime -= 1
              currentTimerMin -= 1 
              currentTimerSeconds = 60              
            } else {  // end of work or rest period, ie minutes and seconds both === 0                          
                if ($scope.settingsAlarmWhenTimerExpires) audio.play();            
                if ($scope.currentlyWorking) { // the end of a working period so set up the next rest period

                  $scope.currentlyWorking   = false // change to rest, display green tomato
                  timer                     = restTimer
                  currentTimerMin           = timer 
                  $scope.tomatoTime         = currentTimerMin
                  $scope.event              = 9 //REST PERIOD HAS BEGUN
                }
                else { // the end of a resting period and maybe the end of a task                  
                  // at this point instead of ending the task we should check the number
                  // of tomatoes and decrement, if it is zero then we should go ahead and
                  // end the task, otherwise we should change currently 
                  // working to true again
                  $scope.tomatoTime       = ""
                  taskIsComplete          = true
                  taskInProgress          = false

                  // make the tomato red again regardless if there is anothr work period
                  $scope.currentlyWorking = true
                }
              }            
          } else {            
              currentTimerSeconds = currentTimerSeconds -1
              if (currentTimerMin === 0) {
                $scope.tomatoTime = currentTimerSeconds; // display final countdown in seconds
                //$scope.event      = "LAST MINUTE"
              }
          }

          if (taskIsComplete) {
            $scope.hoverMessage = $scope.tasks[currentTaskIndex].name +' has finished.'
            $scope.event        = 10 //TASK HAS FINISHED
            // maybe mark the row in a different color
          }
          else $scope.hoverMessage = $scope.tasks[currentTaskIndex].name +', '+currentTimerMin+' minutes and '+currentTimerSeconds+' seconds'
          }  // task is complete

          $scope.singleCountdown = ($scope.tomatoTime < 10) ? true : false // used in template to add class
        //console.log(currentTimerSeconds)
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
          $scope.event = 6

        }
      }

      $scope.cancelNewTask = function() {
          console.log("cancelNewTask() invoked")
          $scope.newTaskDisplay = false
          $scope.event = 12
      }

      $scope.updateNewTask = function() {
          console.log("updateNewTask() invoked")
          var new_task = {
            id: $scope.new_id, 
            name: $scope.task, 
            subject: $scope.subject, 
            tomatoes: $scope.tomatoes, 
            priority: $scope.priority, 
            detail: $scope.detail
            /* do not create currentMinutes or currentSeconds until task is first run */
          }
          $scope.tasks.push(new_task)
          $scope.newTaskDisplay = false
          $scope.event = 7
      }      

      $scope.completeTask = function() {
        if (!childWindowIsActive()) {
          //console.log("activeRow = "+$scope.activeRow)
          //console.log("currentTaskIndex = "+currentTaskIndex)
          if ($scope.activeRow != -1) {
            console.log("A")
            $scope.hoverMessage =  $scope.tasks[$scope.activeRow].name+' has been completed.' 
            if (currentTaskIndex == $scope.activeRow) { // removing a task that is active
              console.log("B")
              turnOffTask    = true // send message to setinterval to turn things off
              $scope.tomatoTime = '' // display nothing on the tomato
            }                    
            $scope.tasks.splice($scope.activeRow,1) // THIS CODE IS NOT WORKING
            console.log("currentTaskIndex = "+currentTaskIndex)
            console.log("$scope.activeRow = "+$scope.activeRow)
            $scope.activeRow = -1
            $scope.event = 13
          } else {
            console.log("completeTask: no task selected")
          }
        } // otherwise we can give a message, maybe give a confirm message box too
      }

      $scope.startTask = function() {
        if (!childWindowIsActive()) { 
          if ($scope.activeRow !== -1) {
            if (!taskInProgress) {
              currentTaskIndex         = $scope.activeRow
              timer                    = workTimer
              $scope.tomatoTime        = workTimer
              currentTimerMin          = workTimer
              currentTimerSeconds      = 0
              $scope.currentlyWorking  = true
              taskIsComplete           = false
              taskInProgress           = true
              $scope.event             = 4
            } else {
              console.log("startTask: task is already in progress")
            }
          } else {
            console.log("startTask: No row selected")
          }
        }
      }

      // there could be some async issues with this function
      $scope.pauseTask = function() {
        if (!childWindowIsActive()) {
          if (taskInProgress) {
            taskHasBeenPaused = true
            taskInProgress    = false
            $scope.event      = 14
            // I believe all the necessary run time info should be saved within the tasks list
            // actually time info needs to be stored in tasks
            $scope.hoverMessage = $scope.tasks[currentTaskIndex].name + " has been paused" 
          } else {
            console.log('pauseTask: no task in progress')
          }
        }
      }

      // there could be some async issues with this function
      $scope.continueTask = function() {
        if (!childWindowIsActive()) {
          if (taskHasBeenPaused) {
            taskHasBeenPaused = false
            taskInProgress    = true
            $scope.event      = 5
            // I believe all the necessary run time info should be saved within the tasks list
            // actually time info needs to be stored in tasks
            $scope.hoverMessage = $scope.tasks[currentTaskIndex].name + " has been continued" 
          } else {
          console.log("continueTask: Unable to continue since no task has been paused")
          }
        } 
      }

      $scope.rowClick = function(index) {
        if (!childWindowIsActive()) {
          console.log("rowClick() invoked with "+index)
          $scope.activeRow = index
          $scope.event     = 15
        }
      }

      $scope.displayControl = function() {
        console.log("displayControl() invoked")
        $scope.controlDisplay = true
        $scope.event          = 1
        $scope.hoverMessage   = 'Use the dashboard to start a task'
      }

      $scope.cancelControl = function() {
        if (!childWindowIsActive()) {
          console.log("cancelControl() invoked")
          $scope.controlDisplay = false
          $scope.event          = 8
          $scope.hoverMessage   = 'Click Me!'
        }
      }

      $scope.displaySettings = function() {
        if (!childWindowIsActive()) {
          console.log("displaySettings() invoked")
          $scope.settingsDisplay = true
          $scope.event           = 2
        }
      }

      $scope.updateSettings = function() {
        $scope.settingsDisplay = false
        
        $scope.settingsWorkTimer = ($scope.settingsWorkTimer < 1) ? 1 : $scope.settingsWorkTimer
        $scope.settingsRestTimer = ($scope.settingsRestTimer < 1) ? 1 : $scope.settingsRestTimer
        workTimer             = $scope.settingsWorkTimer
        restTimer             = $scope.settingsRestTimer
        alwaysOnTop           = $scope.settingsAlwaysOnTop
        alarmWhenTimerExpires = $scope.settingsAlarmWhenTimerExpires
        $scope.event          = 3
      }

      $scope.cancelSettings = function() {
        console.log("settingsHide() invoked")        
        $scope.settingsDisplay = false

        // get back old values for next time user enters Settings
        $scope.settingsWorkTimer = workTimer
        $scope.settingsRestTimer = restTimer
        $scope.settingsAlwaysOnTop = alwaysOnTop
        $scope.settingsAlarmWhenTimerExpires = alarmWhenTimerExpires
        $scope.event = 16
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
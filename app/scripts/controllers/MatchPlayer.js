'use strict';

angular.module('TickeyApp')
  .controller('MatchplayerCtrl', function ($scope, angularFire, $location, $rootScope) {
   $scope.waitingRoom = {}; 
   var waitingRoomRef = new Firebase('https://tictactoezam.firebaseio.com/waitingRoom');
   $scope.promise = angularFire(waitingRoomRef, $scope, "waitingRoom");

   $rootScope.IsOnLineGame = false;
   
	function generateGameBoardNumber() {
		return Math.floor(Math.random() * 123444456).toString(16);	
	}
	

	$scope.promise.then( function() {
		if ($scope.waitingRoom.xJoined == true) {
			$scope.joinWaitingRoom();
		} else {
			$scope.createWaitingRoom();
		}
	});

	$scope.createWaitingRoom = function() {
		$scope.waitingRoom = {xJoined: true, gameBoardNumber: generateGameBoardNumber()};
		$scope.noticeMessage = "You are x, waiting for opponent";

		waitingRoomRef.on('child_removed', function(snapshot) {
			// TO DO should check if the I am paired
			//"http://localhost:9000/#/game_board/abcde1234/x"
		
		$location.path('game_board/' + $scope.waitingRoom.gameBoardNumber + '/x');
		});

	};

	$scope.joinWaitingRoom = function () {
		var gameBoardNumber = $scope.waitingRoom.gameBoardNumber;
		console.log("gameboard number : "+gameBoardNumber)
		$scope.waitingRoom = {};
		$rootScope.IsOnLineGame = true;

		$location.path('game_board/' + gameBoardNumber + '/o');
	}
  

  });

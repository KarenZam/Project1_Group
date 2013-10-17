'use strict';

angular.module('TickeyApp')
	.controller('GameBoardCtrl', 
		function ($scope, $rootScope, $timeout, localStorageService, angularFire, $routeParams) {


///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////     PLAY WITH FIREBASE     ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
  
  /************     VERY USEFULL     ********************
  $scope.gameBoardId = $routeParams.id;
  $scope.mySymbol = $routeParams.mySymbol;
  console.log("route param id : " + $scope.gameBoardId);
  console.log("symbol : " + $scope.mySymbol);
  *************     VERY USEFULL     *********************/

  $scope.gameBoardId = $routeParams.id;
  $scope.mySymbol = $routeParams.mySymbol;
  $scope.oponentSymbol;
  $scope.cell = [];
  $scope.cellChanged;
  $rootScope.IsOnLineGame;
  $scope.room = { board: ["", "", "", "", "", "", "", "", "",""]};
  $scope.currentPlayer;
  $scope.IsOnLineGameWaitingOponnentMove = false;

  var gameBoardRef = new Firebase('https://tictactoezam.firebaseio.com/room'+ $routeParams.id);
  $scope.promise = angularFire(gameBoardRef, $scope, 'room');

  $scope.promise.then (function () {
    
    console.log("inside promise"); ///////////////////////////////////////
    console.log("route param id : "+$routeParams.id); //////////////////////////////

    if (!$routeParams.id) {
      $rootScope.IsOnLineGame = false;
    } else {
      $rootScope.IsOnLineGame = true;
      $scope.cleanBoard();
      $scope.cellChanged = 0;
      $scope.room = { board: ["", "", "", "", "", "", "", "", "",""]};
    }

    console.log("IsOnLineGame : "+$rootScope.IsOnLineGame);

    if ($scope.cellChanged == 0 && $rootScope.IsOnLineGame == true) {
      if ($routeParams.mySymbol == 'x') {
        console.log ("I am the first move : "+ $routeParams.mySymbol);
        $scope.currentPlayer = $routeParams.mySymbol;
        // $scope.makeMyMove();
      } else {

        console.log ("I am second Move symbol : "+ $routeParams.mySymbol);
        
        $scope.IsOnLineGameWaitingOponnentMove = true;
        $timeout($scope.waitForOpponentToMove, 5000);
      }
    }
  }); 

  $scope.onLinePlayerIs = function() {
      $scope.currentPlayer = $scope.mySymbol;  
  }

  $scope.OnlineMakeNextMoveAt = function(objEvent) { /////////////
    var location;
    $scope.cellObj = objEvent;  
    location = $scope.cellObj.target.id;
    
    if ($scope.IsOnLineGameWaitingOponnentMove) {
      alert("It's not your turn yet!");
      return;
    }
    
    if (!$scope.currentSquareClickedAlready(location)) {
      $scope.onLineMarkSquareAsOccupiedAt(location);
      $scope.onLinePlayerIs();
      if ($scope.isMeaWinner()) {
        $scope.onLineGameOver();
        return;
      }
      if ($scope.isDraw()) {
        $scope.onLineGameOver();
        return;
      }
      $scope.IsOnLineGameWaitingOponnentMove = true;
      $timeout($scope.waitForOpponentToMove, 5000); 
    }
  };

  $scope.onLineMarkSquareAsOccupiedAt = function(location) {
        $scope.cell[location] = $scope.mySymbol;
        $scope.cellChanged++;
        $scope.room.board[location] = $scope.mySymbol;  //Symbol in Firebase
        console.log("the cell has been marked");
    };
  

  $scope.waitForOpponentToMove = function() {
    console.log("inside wait for opponent!");
  
    gameBoardRef.once('child_changed', function(snapshot) {
      console.log("opponent moved");
      $scope.IsOnLineGameWaitingOponnentMove = false;
      $scope.onLinePrintBoard(snapshot.val());
      $scope.onLineIsMeALoser();
      if ($scope.isDraw()) {
        $scope.onLineGameOver();
      }
    });   

  };

  $scope.onLinePrintBoard = function(newBoardData) {
    console.log("onLinePrintBoard");
    for (var i=1; i<=$scope.totalCellNumber; i++) {
      console.log("i : "+i+" "+ newBoardData[i]+" "+$scope.cell[i]);
      if (newBoardData[i] != $scope.cell[i]) {
        $scope.cell[i] = newBoardData[i];
        $scope.cellChanged ++;
        console.log("location changed : "+i);
      }
    }
    console.log("number of cells marked : "+$scope.cellChanged);
  };

  $scope.onLineIsMeALoser = function() {
    if ($scope.mySymbol == "x") {
      $scope.oponentSymbol = "o";
    }
    else {
      $scope.oponentSymbol = "x"; 
    }
    $scope.currentPlayer = $scope.oponentSymbol;
  
    if ($scope.IsOneLineCrossed() || $scope.IsOneColumnCrossed() 
      || $scope.IsDiagonalCrossed()) {
      bootbox.alert("You lost! Try again!")
      $scope.onLineGameOver();
    }
  };

  $scope.onLineGameOver = function() {
    $scope.room = {};
    $scope.cleanBoard();
    console.log("Game Over!");
  };
  
///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////    DISPLAY WITH FIREBASE   ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
  $scope.leaderData = {users: {}}; 
  var leaderDataRef = new Firebase('https://tictactoezam.firebaseio.com/');
  $scope.p = angularFire(leaderDataRef, $scope, "leaderData"); // p for promise
        // implicit 

  $scope.userCreatedInFirebase = false; // by default


  $scope.getName = function() {
    $scope.userName = prompt ("What's your user name ?");
    if ($scope.leaderData.users.hasOwnProperty($scope.userName)) {    
      alert($scope.userName+", your previous score is : "+$scope.leaderData.users[$scope.userName]);
    }
    else {
      $scope.p.then( function() {
        $scope.leaderData.users[$scope.userName] = 0;
      });
    }
    $scope.userCreatedInFirebase = true;     //////////////////////////////////////////////
  };

  $scope.displayWinnerAgainComputerFireBase = function() {
    if ($scope.userCreatedInFirebase == true) {
      $scope.leaderData.users[$scope.userName]++;  
    }
  };
  // $scope.addWinToLeaderBoard = function() {
  //   if ($scope.leaderData.name.hasOwnProperty($scope.userName)) {    
  //     $scope.leaderData.name[$scope.userName]++;  
  //   }
  // };

  // $scope.deletePlayer = function() {
  //   delete $scope.leaderData.name[$scope.userName];
  // }

///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////    DISPLAY WITH LOCALSTORAGE   ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

		localStorageService.clearAll();
    $scope.nbWin1 = 0;
    $scope.nbWin2 = 0;
    $scope.nbWinComputer = 0;

    
    localStorageService.add('player2',$scope.nbWin2);
    localStorageService.add('computer',$scope.nbWinComputer);
    localStorageService.add('player1',$scope.nbWin1);
	
///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////               TIMER            ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
      	
		  $scope.minutes = "00";
    	$scope.seconds = "05";
    	$scope.currentNumberOfSeconds = 5;
    	$scope.intervalCallback;
      $scope.timerRunning = false;

    	$scope.increment = function() {
      		$scope.currentNumberOfSeconds--;

      		if ($scope.currentNumberOfSeconds>0) {
      			$scope.seconds = $scope.formatZeroPadding($scope.currentNumberOfSeconds % 60);
      		} 
      		else {
      			$scope.seconds=0;
      			$timeout.cancel($scope.intervalCallback);
            $scope.stopTimer();
            return;
      		}
      		$scope.intervalCallback = $timeout($scope.increment, 1000);
    	}

    	$scope.startTimer = function() {
          $scope.timerRunning = true;
      		$scope.intervalCallback = $timeout($scope.increment, 1000);
    	}

    	$scope.stopTimer = function() {
        $scope.cleanTimer();
        bootbox.alert("Time's up, try again!");
        $timeout($scope.cleanBoard, 1500);
    	}

      $scope.cleanTimer = function() {
        $scope.timerRunning = false;
        $timeout.cancel($scope.intervalCallback);
        $scope.currentNumberOfSeconds=5;
        $scope.seconds = "05";
      }

    	$scope.formatZeroPadding = function(integer) {
      		if (integer < 10) {
      			return "0" + integer;
      		} else {
      			return integer;
      		}
    	}

///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////        WHICH PAGE !!!          ///////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


    $rootScope.is_how_to_page = false;
    $rootScope.is_game_board_page_small_button = true;
    $rootScope.is_home_page = false;

///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////        COMPUTER / 2 PLAYERS MOD        ///////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


		$scope.playComputer = true;
    $scope.currentPlayer = "start";
		$scope.totalLine = 3;
		$scope.totalColumn = 3;
		$scope.totalCellbyLine = $scope.totalColumn;
		$scope.totalCellbyColumn = $scope.totalLine;
		$scope.lineBoard = []; 
		$scope.totalCellNumber = $scope.totalLine * $scope.totalColumn;
		$scope.playerIs = "start";
		$scope.cellObj;
		// $scope.cell = [];
		// $scope.cellChanged;
    $scope.levelComputer = 0; // 0 - 1 - 2
    $scope.computerModeDescription = [];
    $scope.computerModeDescription[0] = "Baby mode... sure you can win!";
    $scope.computerModeDescription[1] = "Ninja mode... Not that easy!";
    $scope.computerModeDescription[2] = "Guru mode... do your best!";

		$scope.switchPlayersMode = function() {
			if ($scope.currentPlayer == "start") {
        $scope.nbWin1 = 0;
				if($scope.playComputer)	{
          $scope.nbWin2 = 0;
          $scope.playComputer=false;
        }
    			else {
            $scope.nbWinComputer = 0;
            $scope.playComputer=true;
          }	
			}
    }

    $scope.switchLevelMode = function() {
      if ($scope.currentPlayer == "start") {
        $scope.levelComputer++;
        $scope.levelComputer = $scope.levelComputer%3;
      }
    }

		$scope.makeNextMoveAt = function(objEvent) {
			var location;
			$scope.cellObj = objEvent;	

      // window.eventObj = objEvent;   // debug only, not for production!

  		location = $scope.cellObj.target.id;

      if ($rootScope.IsOnLineGame == true) {
        $scope.OnlineMakeNextMoveAt(objEvent);
      }
      else {
  			if ($scope.currentPlayer=="start") { 
  				$scope.initializePlayer(); 
  			};
  			if (!$scope.currentSquareClickedAlready(location)) {
  			 $scope.markSquareAsOccupiedAt(location);
    			if (!$scope.isMeaWinner() && !$scope.isDraw()) {
            $scope.swapCurrentPlayerToOpponent();
    				if ($scope.playComputer == true) {
              $timeout($scope.computerPlay, 400);
    				}
    			}
  			}
      }
		};

		$scope.initializePlayer = function() {
  			$scope.cleanBoard();
  			$scope.cellChanged = 0;
  			if (Math.floor((Math.random()*2)+1)== 1) { 
    			$scope.currentPlayer = "x";
  			}
  			else {
    			$scope.currentPlayer="o";
  			}
  			$scope.playerIs = $scope.currentPlayer;
		}

		$scope.cleanBoard = function() {
			for (var i=1; i<=$scope.totalCellNumber; i++) {
				$scope.cell[i]="";
			}
		}	

		$scope.currentSquareClickedAlready = function(location) { 
  			// if the cell is empty return false
  			if ($scope.cell[location]!="") {
    			return true;
  			} 
  			return false;
		}

		$scope.markSquareAsOccupiedAt = function(location) {
  			$scope.cell[location] = $scope.currentPlayer;
  			$scope.cellChanged++;
		};

		$scope.swapCurrentPlayerToOpponent = function() {
  			if ($scope.currentPlayer == "x") {
  				$scope.currentPlayer = "o";
  			} 
  			else {
  				$scope.currentPlayer = "x";
  			}	
		};	

    $scope.computerPlay = function() {
      if ($scope.levelComputer != 0) {
        if ($scope.levelComputer == 1)
        $scope.computerLevel1();
        else {
          $scope.computerLevel2();
        }
      }
      else {
        $scope.computerChooseCell();
      }
      $scope.isMeaWinner();
      $scope.isDraw();
      $scope.swapCurrentPlayerToOpponent();
    }

		$scope.computerChooseCell = function() {
			var locationComputer;
			locationComputer = Math.floor((Math.random()*9)+1);
			if ($scope.cell[locationComputer] == "") { 
				$scope.markSquareAsOccupiedAt(locationComputer);
    			}
			else {
				$scope.computerChooseCell();
			}
		}

		$scope.isDraw = function() {
  			if ($scope.cellChanged == $scope.totalCellNumber) {
            if ($scope.timerRunning) {
              $scope.cleanTimer();
            }
        		bootbox.alert("It's a draw, try again!");
        		$scope.endOfGame();
            $timeout($scope.cleanBoard, 2000);
  				return true;
      		}
      		return false;
  		}

		$scope.isMeaWinner = function() {
      console.log("inside isMeaWinner");
  			if ($scope.IsOneLineCrossed() || $scope.IsOneColumnCrossed() || $scope.IsDiagonalCrossed()) {
    			if ($scope.timerRunning) {
            $scope.cleanTimer();
          }
          if ($rootScope.IsOnLineGame) {
            bootbox.alert("You won!");
          }
          else {
            $scope.displayWinner();  
          }
    			return true;
  			}
  			return false;
		}

		$scope.IsOneLineCrossed = function() { 
			for (var i=0; i<3; i++) {
  				if ($scope.cell[1+(i*3)]==$scope.currentPlayer && $scope.cell[2+(i*3)]==$scope.currentPlayer 
  						&& $scope.cell[3+(i*3)]==$scope.currentPlayer) {
  					return true;
				}
			}
			return false;
		}

		$scope.IsOneColumnCrossed = function() {
			for (var i=0; i<=3; i++) {
  				if ($scope.cell[1+i]==$scope.currentPlayer && $scope.cell[4+i]==$scope.currentPlayer 
  						&& $scope.cell[7+i]==$scope.currentPlayer) {
					return true;
				}
			}
			return false;
		}

		$scope.IsDiagonalCrossed = function() {
  			if (($scope.cell[1]==$scope.currentPlayer && $scope.cell[5]==$scope.currentPlayer 
  						&& $scope.cell[9]==$scope.currentPlayer) ||
  					($scope.cell[3]==$scope.currentPlayer && $scope.cell[5]==$scope.currentPlayer 
  						&& $scope.cell[7]==$scope.currentPlayer)) {
				return true;
			}
			return false;
		}

    //////////////////////////////////////////////////

    $scope.addingScore = function () {
      if ($scope.currentPlayer == $scope.playerIs) {
        $scope.nbWin1++;
        return;
      } 
      if ($scope.playComputer) {
        $scope.nbWinComputer ++;
      }
      else {
        $scope.nbWin2 ++;
      }
    }

    ///////////////////////////////////////////////////

		$scope.displayWinner = function() {
      $scope.addingScore();
			if(!$scope.playComputer) {
				if ($scope.currentPlayer=="x") {
    			bootbox.alert("x wins! Bravo");
  				}
  				else {
    				bootbox.alert("o wins! Bravo"); 
  				}	
			}
			else {
				if ($scope.currentPlayer == $scope.playerIs) {
					bootbox.alert("You beat the computer! Bravo");
                             ////////////// adding to firebase! //////////////
          $scope.displayWinnerAgainComputerFireBase();
				}
				else {
					bootbox.alert("You lost! Try again!");
				}
			}
  			// $rootScope.gameEndShowButton = true;
  		$scope.endOfGame();
      $timeout($scope.cleanBoard, 2000);
		};

    $scope.endOfGame = function() {
      $scope.currentPlayer = "start";
      $scope.cellChanged = 0;
    };

    $scope.AddClassToCell = function(location) {
      if ($scope.cell[location] != "") {
        return $scope.cell[location];
      }
    };

///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////             COMPUTER / LEVEL 1         ///////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

    $scope.computerCheck3cells = function (location1, location2, location3, player) {
      if ( ($scope.cell[location1] == player) && ($scope.cell[location2] == player) ){
        if (!$scope.currentSquareClickedAlready(location3)) {
              $scope.markSquareAsOccupiedAt(location3);
              return true;
            }
      }
      if ( ($scope.cell[location1] == player) && ($scope.cell[location3] == player) ){
        if (!$scope.currentSquareClickedAlready(location2)) {
              $scope.markSquareAsOccupiedAt(location2);
              return true;
            }
      }
      if ( ($scope.cell[location2] == player) && ($scope.cell[location3] == player) ){
        if (!$scope.currentSquareClickedAlready(location1)) {
              $scope.markSquareAsOccupiedAt(location1);
              return true;
            }
      }
      return false;
    }

    $scope.computerCheckLine = function(playerToCHeck) {
      for (var i=1; i<=7; i=i+3) {
        if ($scope.computerCheck3cells(i,i+1,i+2,playerToCHeck)) {
          return true;
        }
      }
      return false;
    }

    $scope.computerCheckColumn = function(playerToCHeck) {
      for (var i=1; i<=3; i++) {
        if ($scope.computerCheck3cells(i,i+3,i+6,playerToCHeck)) {
          return true;
        }
      }
      return false;
    }

    $scope.computerCheckDiagonal = function(playerToCHeck) {
      if ($scope.computerCheck3cells(1,5,9,playerToCHeck)) {
          return true;
        }
      if ($scope.computerCheck3cells(3,5,7,$scope.playerIs)) {
          return true;
        }
    }


///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////             COMPUTER / LEVEL 3         ///////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

  $scope.computerLevel1 = function() {
    if (!$scope.computerCheckLine($scope.playerIs)) {
          if (!$scope.computerCheckColumn($scope.playerIs)) {
            if (!$scope.computerCheckDiagonal($scope.playerIs)) {
              $scope.computerChooseCell();    
            }
          }
        }   
  }

  $scope.computerLevel2 = function() {
    var computerPlayer = "x";
    if ($scope.playerIs == "x")
      {
        computerPlayer = "o";
      }
      console.log("computer player : "+computerPlayer);
    if (!$scope.computerCheckLine(computerPlayer)) {
          if (!$scope.computerCheckColumn(computerPlayer)) {
            if (!$scope.computerCheckDiagonal(computerPlayer)) {
              $scope.computerLevel1();    
            }
          }
        }   
  }


})




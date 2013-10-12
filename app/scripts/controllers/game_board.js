'use strict';

angular.module('TickeyApp')
	.controller('GameBoardCtrl', 
		function ($scope, $rootScope, $timeout, localStorageService) {
    
		// localStorageService.clearAll();
  //   	localStorageService.add('Favorite Sport','Ultimate Frisbee');
  //   	localStorageService.add("names",["name1","name2","name3"]);

  //   	console.log(localStorageService.get('names'));
   

  //   	$rootScope.is_how_to_page = false;
  //   	$rootScope.is_game_board_page_small_button = true;
  //   	$rootScope.is_home_page = false;

	
	// --------- timer  ------------- //
      	
		  $scope.minutes = "00";
    	$scope.seconds = "05";
    	$scope.currentNumberOfSeconds = 5;
    	$scope.intervalCallback;

    	$scope.increment = function() {
      		$scope.currentNumberOfSeconds--;

      		if ($scope.currentNumberOfSeconds>0) {
      		// $scope.minutes = $scope.formatZeroPadding(Math.floor($scope.currentNumberOfSeconds / 60));
      			$scope.seconds = $scope.formatZeroPadding($scope.currentNumberOfSeconds % 60);
      		} 
      		else {
      			$scope.seconds=0;
      			$timeout.cancel($scope.intervalCallback);	
      		}
      		$scope.intervalCallback = $timeout($scope.increment, 1000);
    	}

    	$scope.startTimer = function() {
      		$scope.intervalCallback = $timeout($scope.increment, 1000);
    	}

    	$scope.stopTimer = function() {
    		$timeout.cancel($scope.intervalCallback);
    	}

    	$scope.formatZeroPadding = function(integer) {
      		if (integer < 10) {
      			return "0" + integer;
      		} else {
      			return integer;
      		}
    	}

	// --------- end timer  ------------- //

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
		$scope.cell = [];
		$scope.cellChanged;
    $scope.levelComputer = 0; // 0 - 1 - 2
    $scope.computerModeDescription = [];
    $scope.computerModeDescription[0] = "I am sure you can do better! try one level up!";
    $scope.computerModeDescription[1] = "Not that easy!";
    $scope.computerModeDescription[2] = "Whaouuuu! Can you win ?";

		$scope.switchPlayersMode = function() {
			if ($scope.currentPlayer == "start") {
				if($scope.playComputer)	{$scope.playComputer=false}
    			else {$scope.playComputer=true}	
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

      window.eventObj = objEvent;   // debug only, not for production!

  			location = $scope.cellObj.target.id;
        // console.log("id : "+$scope.cellObj.target.id);
        // console.log("class name : "+$scope.cellObj.target.className);

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
  			if ($scope.playComputer == true) {
  				$scope.playerIs = $scope.currentPlayer;
  			}
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
        		bootbox.alert("It's a draw, try again!");
        		$timeout($scope.cleanBoard, 3000);
            $scope.endOfGame();
  				return true;
      		}
      		return false;
  		}

		$scope.isMeaWinner = function() {
  			if ($scope.IsOneLineCrossed() || $scope.IsOneColumnCrossed() || $scope.IsDiagonalCrossed()) {
    			$scope.displayWinner();
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

		$scope.displayWinner = function() {
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
				}
				else {
					bootbox.alert("You lost! Try again!");	
				}
			}
  			// $rootScope.gameEndShowButton = true;
  		$scope.endOfGame();
      $timeout($scope.cleanBoard, 3000);
		};

    $scope.endOfGame = function() {
      $scope.currentPlayer = "start";
      $scope.cellChanged = 0;
    }

    ///////////////////////// level 2 ///////////////////

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



///////////////////////// level 3 ///////////////////

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




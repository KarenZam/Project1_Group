



// app declaration with []
angular.module('LocalStorageModule').value('prefix', 'myDatabaseNewName');
angular.module('TickeyApp',['LocalStorageModule'])
  .config(function ($routeProvider){
      $routeProvider
        .when('/game_board', {
          templateUrl: 'views/game_board.html',
          controller:'GameBoardCtrl'
        })
        .when('/how_to', {
          templateUrl: 'views/how_to.html',
          controller:'howToCtrl'
        })
        .when('/', {
          templateUrl: 'views/index.html',
          controller:'indexCtrl'
        })
        .otherwise({
          redirection: '/'
        })
  });





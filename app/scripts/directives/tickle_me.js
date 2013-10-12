
angular.module('TickeyApp')
     .directive("tickleMe", function() {
          return {
               restrict: 'A',      // E or EA
               link: function (scope, element, attrs) {
                    element.bind('click', function() {
                         alert("Don't tickle me!");
                    });
               }
          }
     })
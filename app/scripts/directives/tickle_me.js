
angular.module('TickeyApp')
     .directive("tickleMe", function() {
          return {
               restrict: 'A',      // E or EA
               link: function (scope, element, attrs) {
                    
                    // console.log(scope);
                    // console.log(elements);
                    // console.log(attrs);

                    console.log(attrs.color);
                    console.log(attrs.tickleMe);

                    console.log(scope.minutes);

                    element.bind('click', function() {
                         alert("don't tickle me");
                    });
               }
          }
     })

angular.module('TickeyApp')
     .directive("changeColor", function() {
          return {
               restrict: 'A',      // E or EA
               link: function (scope, element, attrs) {
                    

                    element.bind('mouseenter', function(objEvent) {
                         window.eventObj = objEvent;
                         objEvent.target.className += ' changeColorGreen';
                    });
                    element.bind('mouseleave', function(objEvent) {
                         objEvent.target.classList.remove('changeColorGreen');
                         // alert("mouse leaves");
                         console.log("mouse leaves, color back to normal!");
                    });
               }
          }
     })

     
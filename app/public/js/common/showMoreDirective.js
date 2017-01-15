app.directive('textCollapse', ['$compile', function ($compile) {

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {

      var maxHeight = attrs.textMaxHeight;

      scope.collapsed = true;

      scope.toggle = function () {
        scope.collapsed = !scope.collapsed;
        element.css('height', (scope.collapsed) ? maxHeight : 'auto');
      };

      attrs.$observe('textToCollapse', function (text) {
        element.html(text);

        if (element.clientHeight > maxHeight) {
          var toggleButton = $compile('<button class="button show_more" ng-click="toggle()">{{collapsed ? "Show more" : "Show less"}}</button>')(scope);

          element.css({ 'height': maxHeight, 'overflow': 'hidden', 'text-overflow': 'elipsis' });
          element.after(toggleButton);
        }
      });
    }
  };
}]);
'use strict';

app.filter('isEmpty', function () {
   return function(value, yes, no) {
        return value ? yes : no;
   };
});
'use strict';

app.filter('round', function() {
    return function(number) {

        if (number < 1000) {
            return number
        } else if (number < 1000000 ) {
            return Math.floor(number/1000) + 'K';
        } else {
            return Math.floor(number/1000000) + 'M';
        }

    }

});
'use strict';

app.controller('FollowersCtrl', function ($scope, SCapiService, $rootScope, $log) {
    $scope.title = 'Followers';
    $scope.data = '';
    $scope.busy = false;

    SCapiService.getFollowing('followers')
        .then(function(data) {
            $scope.data = data.collection.sort( sortBy("username") );
        }, function(error) {
            console.log('error', error);
        }).finally(function() {
            $rootScope.isLoading = false;
        });

    $scope.loadMore = function() {
        if ( $scope.busy ) {
            return;
        }
        $scope.busy = true;

        SCapiService.getNextPage()
            .then(function(data) {
                for ( var i = 0; i < data.collection.length; i++ ) {
                    $scope.data.push( data.collection[i] )
                }
            }, function(error) {
                console.log('error', error);
            }).finally(function(){
                $scope.busy = false;
                $rootScope.isLoading = false;
            });
    };

    function sortBy(prop){
        return function(a,b){
            if( a[prop] > b[prop]){
                return 1;
            }else if( a[prop] < b[prop] ){
                return -1;
            }
            return 0;
        }
    }


});
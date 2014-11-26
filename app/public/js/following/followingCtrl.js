'use strict';

app.controller('FollowingCtrl', function ($scope, SCapiService, $rootScope, $log) {
    $scope.title = 'Following:';
    $scope.data = '';
    $scope.busy = false;

    SCapiService.getFollowing()
        .then(function(data) {
            $scope.data = data.collection.sort( sortBy("username") );
        }, function(error) {
            console.log('error', error);
        }).finally(function() {
            $rootScope.isLoading = false;
        });

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
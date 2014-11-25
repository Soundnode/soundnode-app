/**
 * Created by Johannes Sjöberg on 11/11/2014.
 */
'use strict'

app.controller('ProfileCtrl', function ($scope, SCapiService, $rootScope, $stateParams) {

    //ctrl variables
    var userId = $stateParams.id;

    //scope variables
    $scope.profileData = '';
    $scope.followers_count = '';
    $scope.userData = '';
    $scope.busy = false;
    //tracks
    $scope.data = '';


    SCapiService.getProfile(userId)
        .then(function(data) {
            $scope.profileData = data;
            $scope.followers_count = numberWithCommas(data.followers_count);
        }, function(error) {
            console.log('error', error);
        }).finally(function() {
            $rootScope.isLoading = false;
        });

    SCapiService.getProfileTracks(userId)
        .then(function(data) {
            $scope.data = data.collection;
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

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

});
'use strict';

app.controller('DiscoverCtrl', function (
    $scope,
    $filter,
    $rootScope,
    SCapiService,
    SC2apiService,
    utilsService
) {
    $scope.title = 'Discover';
    $scope.data = '';
    $scope.busy = false;


    SC2apiService.getDiscover()
        .then(function (data) {
            $scope.data = data.collection;
        })
        .catch(function (error) {
            console.log('error', error);
        })
        .finally(function () {
            $scope.data.forEach(function (listing) {
                addStreamUrl(listing.recommended);
                utilsService.updateTracksLikes(listing.recommended);
                utilsService.updateTracksReposts(listing.recommended);
            });
            $rootScope.isLoading = false;
        });

    $scope.loadMore = function() {
        if ( $scope.busy ) {
            return;
        }
        $scope.busy = true;

        SC2apiService.getNextPage()
            .then(function (data) {
                $scope.data = $scope.data.concat(data.collection);
                data.collection.forEach(function (listing) {
                    addStreamUrl(listing.recommended);
                    utilsService.updateTracksLikes(listing.recommended);
                    utilsService.updateTracksReposts(listing.recommended);
                });
            }, function (error) {
                console.log('error', error);
            }).finally(function () {
            $scope.busy = false;
            $rootScope.isLoading = false;
        });
    };

    function addStreamUrl (collection) {
        for (var i = 0; i < collection.length; i++) collection[i].stream_url = collection[i].uri + '/stream';
    }

});

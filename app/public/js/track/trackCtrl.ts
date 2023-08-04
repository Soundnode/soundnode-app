'use strict';

app.controller('TrackCtrl', function (
    $scope: ng.IScope,
    SCapiService: any,
    $rootScope: ng.IRootScopeService,
    $stateParams: any,
    utilsService: any
) {
    const songId: string = $stateParams.id;
    $scope.hover = false;

    $scope.track = '';
    $scope.busy = false;

    SCapiService.get('tracks/' + songId)
        .then(function(data: any) {
            data.description = data.description.replace(/\n/g, '<br>');

            data.created_at = data.created_at.replace(' +0000', '');

            if (data.tag_list.length > 0) {
                data.tag_list = data.tag_list.match(/"[^"]*"|[^\s"]+/g);

                for (let i = 0; i < data.tag_list.length; ++i) {
                    data.tag_list[i] = data.tag_list[i].replace(/"/g, '');
                }
            } else {
                data.tag_list = [];
            }

            data.tag_list.unshift(data.genre);

            $scope.track = data;
        }, function(error: any) {
            console.log('error', error);
        }).finally(function() {
            $rootScope.isLoading = false;
            utilsService.setCurrent();
        });

    SCapiService.get('tracks/' + songId + '/comments', 'linked_partitioning=1&limit=30')
        .then(function(data: any) {
            $scope.comments = data.collection;
        }, function(error: any) {
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
            .then(function(data: any) {
                for ( let i = 0; i < data.collection.length; i++ ) {
                    $scope.comments.push( data.collection[i] )
                }
            }, function(error: any) {
                console.log('error', error);
            }).finally(function(){
                $scope.busy = false;
                $rootScope.isLoading = false;
                utilsService.setCurrent();
            });
    };

});
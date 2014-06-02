'use strict'

app.controller('UserCtrl', function ($scope, SCapiService) {
    var endpoint = 'me';

    $scope.name = '';
    $scope.userThumb = '';
    $scope.userThumbWidth = '50px';
    $scope.userThumbHeight = '50px';

    SCapiService.get(endpoint)
                .then(function(data) {
                    $scope.name = data.username;
                    $scope.userThumb = data.avatar_url;
                }, function(error) {
                    console.log('error', error);
                });

    $scope.logOut = function() {
        SC.disconnect();
        console.log('User connected:', SC.isConnected() );
    }
    
});
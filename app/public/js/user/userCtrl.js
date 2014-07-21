'use strict'

app.controller('UserCtrl', function ($rootScope, $scope, SCapiService) {
    var endpoint = 'me'
        , params = '';

    $rootScope.userId = '';
    $scope.name = '';
    $scope.userThumb = '';
    $scope.userThumbWidth = '50px';
    $scope.userThumbHeight = '50px';

    SCapiService.get(endpoint, params)
                .then(function(data) {
                    $rootScope.userId = data.id;
                    $scope.name = data.username;
                    $scope.userThumb = data.avatar_url;
                }, function(error) {
                    console.log('error', error);
                });

    $scope.logOut = function() {
        SC.disconnect();
        console.log('User connected:', SC.isConnected() );
        appGUI.close();
    }

});

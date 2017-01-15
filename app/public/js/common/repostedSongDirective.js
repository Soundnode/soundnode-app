'use strict';

app.directive('repostedSong', function (
  $rootScope,
  SCapiService,
  notificationFactory
) {
  return {
    restrict: 'A',
    scope: {
      reposted: '='
    },
    link: function ($scope, elem, attrs) {
      var songId;

      elem.bind('click', function () {
        songId = attrs.songId;

        if (this.classList.contains('reposted')) {

          SCapiService.deleteRepost(songId)
            .then(function (status) {
              if (angular.isObject(status)) {
                notificationFactory.warn('Song removed from reposts!');
                $scope.reposted = false;
              }
            })
            .catch(function () {
              notificationFactory.error('Something went wrong!');
            });

        } else {

          SCapiService.createRepost(songId)
            .then(function (status) {
              if (angular.isObject(status)) {
                notificationFactory.success('Song added to reposts!');
                $scope.reposted = true;
              }
            })
            .catch(function () {
              notificationFactory.error('Something went wrong!');
            });

        }

      });

    }
  };
});
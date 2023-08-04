"use strict";

app.directive('favoriteSong', function (
  $rootScope: ng.IRootScopeService,
  SCapiService: any,
  notificationFactory: any
) {
  return {
    restrict: 'A',
    scope: {
      favorite: "=",
      count: "="
    },
    link: function ($scope: ng.IScope, elem: JQuery, attrs: any) {
      let userId: string, songId: string;

      elem.bind('click', function () {
        userId = $rootScope.userId;
        songId = attrs.songId;

        if (this.classList.contains('liked')) {

          SCapiService.deleteFavorite(userId, songId)
            .then(function (status: any) {
              if (typeof status == "object") {
                notificationFactory.warn("Song removed from likes!");
                $scope.favorite = false;
                $scope.count -= 1;
                $rootScope.$broadcast("track::unfavorited", songId);
              }
            }, function () {
              notificationFactory.error("Something went wrong!");
            })
        } else {
          SCapiService.saveFavorite(userId, songId)
            .then(function (status: any) {
              if (typeof status == "object") {
                notificationFactory.success("Song added to likes!");
                $scope.favorite = true;
                $scope.count += 1;
                $rootScope.$broadcast("track::favorited", songId);
              }
            }, function () {
              notificationFactory.error("Something went wrong!");
            });
        }

      });
    }
  }
});
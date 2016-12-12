/**
 * Created by Johannes Sjöberg on 11/11/2014.
 */

'use strict';

app.controller('ProfileCtrl', function (
  $scope,
  $rootScope,
  $stateParams,
  SCapiService,
  utilsService
) {

  //ctrl variables
  var userId = $stateParams.id;
  $scope.isFollowing = false;

  //scope variables
  $scope.profile_data = '';
  $scope.followers_count = '';
  $scope.busy = false;
  //tracks
  $scope.data = '';
  $scope.isLoggedInUser = userId == $rootScope.userId;
  $scope.follow_button_text = '';


  SCapiService.getProfile(userId)
    .then(function (data) {
      $scope.profile_data = data;
      $scope.profile_data.description = (data.description) ? data.description.replace(/\n/g, '<br>') : '';
      $scope.followers_count = numberWithCommas(data.followers_count);
    }, function (error) {
      console.log('error', error);
    }).finally(function () {
      $rootScope.isLoading = false;
    });

  SCapiService.getProfileTracks(userId)
    .then(function (data) {
      $scope.data = data.collection;
    }, function (error) {
      console.log('error', error);
    }).finally(function () {
      utilsService.updateTracksReposts($scope.data);
      $rootScope.isLoading = false;
      utilsService.setCurrent();
    });

  SCapiService.isFollowing(userId)
    .then(function (data) {
      $scope.isFollowing = data != 404;
      $scope.setFollowButtonText();
    }, function (error) {
      console.log('error', error);
    }).finally(function () {
      $rootScope.isLoading = false;
    });

  $scope.loadMore = function () {
    if ($scope.busy) {
      return;
    }
    $scope.busy = true;

    SCapiService.getNextPage()
      .then(function (data) {
        for (var i = 0; i < data.collection.length; i++) {
          $scope.data.push(data.collection[i]);
        }
        utilsService.updateTracksReposts(data.collection, true);
      }, function (error) {
        if (error != 'No next page URL') { // not a real error
          console.log('error', error);
        }
      }).finally(function () {
        $scope.busy = false;
        $rootScope.isLoading = false;
        utilsService.setCurrent();
      });
  };

  $scope.setFollowButtonText = function () {
    if ($scope.isLoggedInUser) {
      $scope.follow_button_text = 'Logged In';
    } else if ($scope.isFollowing) {
      $scope.follow_button_text = 'Following';
    } else {
      $scope.follow_button_text = 'Follow';
    }
  };

  $scope.hoverIn = function () {
    if ($scope.isFollowing && !$scope.isLoggedInUser) {
      $scope.follow_button_text = 'Unfollow';
    }
  };

  $scope.changeFollowing = function () {
    if ($scope.isLoggedInUser) {
      return // nothing to do
    }
    if ($scope.isFollowing) {
      $scope.isFollowing = false;
      SCapiService.unfollowUser(userId)
        .then(function () { },
        function (errorResponse) {
          $scope.isFollowing = true;
          handlerFollowOrUnfollowError(errorResponse);
        }).finally(function () {
          $scope.setFollowButtonText();
          $rootScope.isLoading = false;
        });
    } else {
      $scope.isFollowing = true;
      SCapiService.followUser(userId)
        .then(function () { },
        function (errorResponse) {
          $scope.isFollowing = false;
          handlerFollowOrUnfollowError(errorResponse)
        }).finally(function () {
          $scope.setFollowButtonText();
          $rootScope.isLoading = false;
        });
    }
    $scope.setFollowButtonText();
  };

  function handlerFollowOrUnfollowError(errorResponse) {
    console.log('error', errorResponse);
    if (errorResponse.status == 429) {
      alertBlockedFollowingFunctionality(errorResponse);
    }
  }

  function alertBlockedFollowingFunctionality(errorResponse) {
    errorResponse.data.errors.forEach(function (error) {
      if (error.reason_phrase == "warn: too many followings") {
        alert(getErrorText(error.release_at));
      }
    });
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function getErrorText(releasedAt) {
    var date = new Date(releasedAt);
    return "Hello, \n\nyour follow/unfollow functionality have been temporarily blocked because your account has previously gotten this warning many times." +
      "\n\nAs mentioned in SoundCloud Terms of Use, a high volume of similar actions from an account" +
      " in a short period of time will be considered a violation of the anti-spam policies. " +
      "As these actions aim to unfairly boost popularity within the community, they are forbidden on the SoundCloud platform." +
      "\n\nIt will be possible to follow/unfollow again at " + date.toLocaleString() + ".";
  }


});
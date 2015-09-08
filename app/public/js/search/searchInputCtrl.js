'use strict';

app.controller('SearchInputCtrl', function ($scope, $http, $state, $window, SCapiService) {
    $scope.title = 'Search results';

    $scope.onSubmit = function(keyword) {
        $state.go('search', {q: keyword}, {reload: true});
        $scope.blurTypeahead();
    }

    $scope.typeahead = function(keyword) {
        var dropdown = document.getElementById('searchDropDown');
            dropdown.innerHTML = '';


        // search for artists
        SCapiService.search('users', 4, keyword)
                    .then(function(data) {

                        if (data.collection.length < 1) {
                            var error = document.createElement('div');
                            error.innerHTML = '<h4 class="dropdown-title">Unable to find any songs or Users named ' + keyword + '</h4>';
                            dropdown.appendChild(error);
                            return false;
                        }

                        var artists = document.createElement('div');
                        artists.className = 'artist-container';
                        var title = document.createElement('h3');
                        title.className = 'dropdown-title';
                        title.innerHTML = 'Artists';
                        artists.appendChild(title);

                        for(var i = 0; i < 4; i++) {
                            var child = document.createElement('div');
                            child.className = 'dropdown-item';
                            child.id = data.collection[i].id;

                            child.addEventListener("mousedown", function(){
                                $state.go('profile', {id: this.id});

                            });

                            child.innerHTML = '<img src="' + data.collection[i].avatar_url + '" class="user_thumb"> <h4>' + data.collection[i].username +'</h4>';
                            artists.appendChild(child);
                        }

                        dropdown.appendChild(artists);
                    })
                    .catch(function(err) {
                        console.error(err);
                    });

        // search for tracks
        SCapiService.search('tracks', 4, keyword)
                    .then(function(data) {
                        if (data.collection.length < 1) {
                            return false;
                        }
                        var tracks = document.createElement('div');
                        tracks.className = 'tracks-container';
                        var title = document.createElement('h3');
                        title.className = 'dropdown-title';
                        title.innerHTML = 'Tracks';
                        tracks.appendChild(title);

                        for(var i = 0; i < 4; i++) {
                            var child = document.createElement('div');
                            child.className = 'dropdown-item';
                            child.id = data.collection[i].id;

                            child.innerHTML = '<img src="' + data.collection[i].artwork_url + '" class="user_thumb"> <h4>' + data.collection[i].title +'</h4>';
                            child.addEventListener("mousedown", function(){
                                $state.go('search', {q: keyword}, {reload: true});
                            });
                            tracks.appendChild(child);
                        }

                        var showAll = document.createElement('h3');
                        showAll.className = 'show-all';
                        showAll.innerHTML = 'Show All';
                        showAll.addEventListener("mousedown", function(){
                            $state.go('search', {q: keyword}, {reload: true});
                        });

                        dropdown.appendChild(tracks);
                        dropdown.appendChild(showAll);
                    })
                    .then(function(){
                        dropdown.style.display = 'block';
                    })
                    .catch(function(err) {
                        console.error(err);
                    });
    }

    $scope.blurTypeahead = function() {
        var dropdown = window.document.getElementById('searchDropDown');
        dropdown.style.display = 'none';
    }

    $scope.refocusTypehead = function(keyword) {
        if(keyword) {
            $scope.typeahead(keyword);
        }
    }
});

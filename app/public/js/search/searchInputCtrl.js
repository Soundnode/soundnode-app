'use strict';

app.controller('SearchInputCtrl', function ($scope, $http, $state, $window, SCapiService) {
    $scope.title = 'Search results';

    $scope.onSubmit = function(keyword) {
        $state.go('search', {q: keyword}, {reload: true});
    }

    $scope.typeahead = function(keyword) {
        var dropdown = window.document.getElementById('searchDropDown');
        var hr = document.createElement('hr');
        dropdown.innerHTML = '';

        if(keyword.length < 1) {
            dropdown.style.display = 'none';
            return false;
        }

        SCapiService.searchUsers(4, keyword)
                    .then(function(data) {
                        if (data.collection.length < 1) {
                            var error = document.createElement('div');
                            error.innerHTML = '<h4 class="dropdown-title">Unable to find any songs or Users named ' + keyword + '</h4>';
                            dropdown.appendChild(error);
                            return false;
                        }
                        var artists = document.createElement('div');
                        var title = document.createElement('div');
                        title.innerHTML = '<h3 class="dropdown-title">Artists</h3>';
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
                    .then(function() {
                        SCapiService.searchTracks(4, keyword)
                                    .then(function(data) {
                                        if (data.collection.length < 1) {
                                            return false;
                                        }
                                        dropdown.appendChild(hr);
                                        var tracks = document.createElement('div');
                                        var title = document.createElement('div');
                                        title.innerHTML = '<h3 class="dropdown-title">Tracks</h3>';
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

                                        var showAll = document.createElement('div');
                                        showAll.innerHTML = '<h4 class="show-all">Show All</h4>';
                                        showAll.addEventListener("mousedown", function(){
                                            $state.go('search', {q: keyword}, {reload: true});
                                        });

                                        dropdown.appendChild(tracks);
                                        dropdown.appendChild(showAll);
                                    })
                                    .then(function(){
                                        dropdown.style.display = 'block';
                                    });
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

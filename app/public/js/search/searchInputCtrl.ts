'use strict';

app.controller('SearchInputCtrl', function ($scope, $http, $state, $window, SCapiService) {
    $scope.title = 'Search results';

    let isTypeaheadAborted = false;

    $scope.onSubmit = function(keyword: string) {
        if (keyword == void 0 || keyword.length == 0) return;
        $state.go('search', {q: keyword}, {reload: true});
        $scope.blurTypeahead();
        isTypeaheadAborted = true;
    };

    $scope.typeahead = function(keyword: string) {
        if (keyword.length == 0) {
            $scope.blurTypeahead();
            return
        }
        const dropdown = document.getElementById('searchDropDown');
        dropdown.innerHTML = '';

        isTypeaheadAborted = false;

        // search for artists
        SCapiService.search('users', 4, keyword)
                    .then(function(data) {
                        if (isTypeaheadAborted) {
                            $scope.blurTypeahead();
                            return false;
                        }
                        if (data.collection.length < 1) {
                            const error = document.createElement('div');
                            error.innerHTML = '<h4 class="dropdown-title">Unable to find any songs or Users named ' + keyword + '</h4>';
                            dropdown.appendChild(error);
                            return false;
                        }

                        const artists = document.createElement('div');
                        artists.className = 'artist-container';
                        const title = document.createElement('h3');
                        title.className = 'dropdown-title';
                        title.innerHTML = 'Artists';
                        artists.appendChild(title);

                        // May not actually be 4 tracks long
                        for(let i = 0; i < data.collection.length; i++) {
                            const child = document.createElement('div');
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
                        if (isTypeaheadAborted) {
                            $scope.blurTypeahead();
                            return false;
                        }
                        if (data.collection.length < 1) {
                            return false;
                        }
                        const tracks = document.createElement('div');
                        tracks.className = 'tracks-container';
                        const title = document.createElement('h3');
                        title.className = 'dropdown-title';
                        title.innerHTML = 'Tracks';
                        tracks.appendChild(title);

                        // May not actually be 4 tracks long
                        for(let i = 0; i < data.collection.length; i++) {
                            const child = document.createElement('div');
                            const image = data.collection[i].artwork_url || 'public/img/song-placeholder.png';
                            child.className = 'dropdown-item';
                            child.id = data.collection[i].id;

                            child.innerHTML = '<img src="' + image + '" class="user_thumb"> <h4>' + data.collection[i].title +'</h4>';
                            child.addEventListener("mousedown", function(){
                                $state.go('search', {q: keyword}, {reload: true});
                            });
                            tracks.appendChild(child);
                        }

                        const showAll = document.createElement('h3');
                        showAll.className = 'show-all';
                        showAll.innerHTML = 'Show All';
                        showAll.addEventListener("mousedown", function(){
                            $state.go('search', {q: keyword}, {reload: true});
                        });

                        dropdown.appendChild(tracks);
                        dropdown.appendChild(showAll);
                    })
                    .then(function(){
                        if (isTypeaheadAborted) {
                            $scope.blurTypeahead();
                            return false;
                        }
                        dropdown.style.display = 'block';
                    })
                    .catch(function(err) {
                        console.error(err);
                    });
    };

    $scope.blurTypeahead = function() {
        const dropdown = window.document.getElementById('searchDropDown');
        dropdown.style.display = 'none';
    };

    $scope.refocusTypehead = function(keyword: string) {
        if(keyword) {
            $scope.typeahead(keyword);
        }
    }
});
'use strict';

app.factory('queueService', function() {
    /**
     * @class Queue
     */
    var Queue = {};

    /**
     * Store all tracks from the current view
     * where the track is playing
     * item track format below
     * {
	 * 		title: 'track title',
	 * 		published_by: 'john doe',
	 * 		track_thumb: 'path/to/thumb'
	 * 		track_url: 'path/to/track'
	 * }
     *
     * @type {Array}
     */
    Queue.list = [];

    /**
     * Return queue size
     * @method size
     * @return {Number} [number of items in the list]
     */
    Queue.size = function() {
        return this.list.length;
    };

    /**
     * Clean Queue and reset currentPosition to 0
     * @method clear
     */
    Queue.clear = function() {
        this.list.length = this.currentPosition = 0;
    };

    /**
     * Store currentPosition in the list
     * @propriety currentPosition
     */
    Queue.currentPosition = 0;

    /**
     * Push tracks from array to Queue list
     * {
	 * 		title: 'track title',
	 * 		published_by: 'john doe',
	 * 		track_thumb: 'path/to/thumb'
	 * 		track_url: 'path/to/track'
	 * }
     * @method push
     */
    Queue.push = function(tracks) {
        for ( var i = 0; i < tracks.length; i++ ) {
            this.list.push(tracks[i]);
        }
    };

    /**
     * Insert single track to Queue list
     * {
	 * 		title: 'track title',
	 * 		published_by: 'john doe',
	 * 		track_thumb: 'path/to/thumb'
	 * 		track_url: 'path/to/track'
	 * }
     * @param  currentElData [track obj]
     * @method insert
     */
    Queue.insert = function(currentElData) {
        if ( this.isEmpty() ) {
            this.list.splice(0, 0, currentElData);
            return;
        }

        var addAt = this.currentPosition + 1;
        this.list.splice(addAt, 0, currentElData);
    };

    /**
     * Check if Queue list is empty
     * @method isEmpty
     * @return {Boolean} [false if list isn't empty and true for when list is empty]
     */
    Queue.isEmpty = function() {
        return this.size() < 1;
    };

    /**
     * Decrease (by 1) currentPosition in the list
     * if not empty
     * @method prev
     */
    Queue.prev = function() {
        if ( this.currentPosition !== 0 ) {
            --this.currentPosition;
        }
    };

    /**
     * Increase (by 1) currentPosition in the list
     * if currentPosition not equal to list size
     * @method next
     */
    Queue.next = function() {
        if ( this.currentPosition !== this.size() ) {
            ++this.currentPosition;
        }
    };

    /**
     * Get item in the list with current position
     * @method getTrack
     * @return {[type]} [return track at current position specified]
     */
    Queue.getTrack = function() {
        if ( !this.isEmpty() ) {
            return this.list[this.currentPosition];
        }
    };

    /**
     * Get all items in Queue list
     * @method getAll
     * @returns {Array} [All items in list]
     */
    Queue.getAll = function() {
        return this.list;
    };

    /**
     * Get track id and find it
     * in the queue list
     * if track is in the list return track position
     * otherwise return false
     * @param id [track containing the track id]
     * @method find
     * @returns {id} or {false}
     */
    Queue.find = function(id) {

        if ( this.isEmpty() ) {
            return false;
        }

        for ( var i = 0; i < this.list.length; i++ ) {
            if ( this.list[i].songId === id ) {
                return i;
            }
        }
    };

    /**
     * Remove song from the Queue list by track id
     * @param position [track id]
     * @method remove
     * @returns {false} or {true}
     */
    Queue.remove = function(position) {
        if ( this.isEmpty() ) {
            return false;
        }

        this.list.splice(position, 1);

        // keep current playing track in the same position
        // after a track removed from the list
        if ( this.currentPosition > position ) {
            this.currentPosition = --this.currentPosition;
        } else if ( this.currentPosition < position ) {
            this.currentPosition = this.currentPosition++;
        }
    };

    // expose Queue for debugging ONLY
    window.Queue = Queue;

    // Make Queue obj accessible
    return Queue;
});
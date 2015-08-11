'use strict';

app.factory('queueService', function($rootScope, $log) {
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
     * Clean Queue and reset currentPosition to 0
     * @method clear
     */
    Queue.clear = function() {
        this.list.size = this.currentPosition = 0;
    };

    /**
     * Store currentPosition in the list
     * @propriety currentPosition
     */
    Queue.currentPosition = 0;

    /**
     * Add track to the current Queue list
     * {
	 * 		title: 'track title',
	 * 		published_by: 'john doe',
	 * 		track_thumb: 'path/to/thumb'
	 * 		track_url: 'path/to/track'
	 * }
     * @param  {[type]} track [track obj format]
     * @method push
     */
    Queue.push = function(track) {
        this.list.push(track);
    };

    /**
     * Return queue size
     * @method size
     * @return {Number} [number of items in the list]
     */
    Queue.size = function() {
        return this.list.length;
    };

    /**
     * Check if Queue list is empty
     * @method isEmpty
     * @return {Boolean} [false if list isn't empty and true for when list is empty]
     */
    Queue.isEmpty = function() {
        return this.list.size < 1;
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
        if ( this.currentPosition !== this.list.size ) {
            ++this.currentPosition;
        }
    };

    /**
     * Get current position in the list
     * and return current track
     * @method getTrack
     * @return {[type]} [description]
     */
    Queue.getTrack = function() {
        if ( !this.isEmpty ) {
            return this.list[this.currentPosition];
        }
    };

    // Make Queue obj accessible
    return Queue;
});
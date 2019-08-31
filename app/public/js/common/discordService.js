/**
 * Discord RPC integration
 * 
 * Based on the work of Zyplos;
 * https://github.com/Zyplos/soundnode-app/commit/6fdd8f718192bac5b6e57ac988b0c78b5b67ebe8
 */

"use strict";

class DiscordService {
    static $inject = ["$rootScope"];

    constructor ($rootScope) {
        this.$rootScope = $rootScope;
    }

    resetPresence = () => {
        this.$rootScope.rpcClient.clearActivity();
    }

    updatePresence = (user, songName, details = {}) => {
        this.$rootScope.rpcClient.setActivity({
            details: songName,
            state: "From " + user + "'s profile",
            largeImageKey: "soundcloud_icon",
            largeImageText: "SoundCloud",
            smallImageKey: "play_icon",
            smallImageText: "Playing",
            instance: false,
            startTimestamp: details.currentTime,
            endTimestamp: details.duration,
        });
    }
}

app.service('discordService', DiscordService);
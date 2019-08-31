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

    updatePresence = (user, songName) => {
        this.$rootScope.rpcClient.setActivity({
            details: songName,
            state: "From " + user + "'s profile",
            largeImageKey: "soundnode",
            largeImageText: "Soundnode",
            smallImageKey: "play",
            smallImageText: "Playing",
            instance: false,
            startTimestamp: Date.now(),
        });
    }
}

app.service('discordService', DiscordService);
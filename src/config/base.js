'use strict';

// Settings configured here will be merged into the final config object.
let appManifest = require('../manifest.json')

export default {
    get iTunesAppId() { return appManifest.related_applications == undefined ? document.querySelector('meta[name="apple-itunes-app"]').content.split(',').shift().trim().split('=').pop().trim() : appManifest.related_applications[0].id; },
    get GooglePlayAppId() { return appManifest.related_applications == undefined ? document.querySelector('meta[name="google-play-app"]').content.split('=').pop() : appManifest.related_applications[1].id; },
    favicon: 'assets/favicon.ico',
    manifest: 'assets/manifest.json'
}

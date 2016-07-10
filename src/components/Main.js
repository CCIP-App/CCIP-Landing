require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import AppBadge from './AppBadge';

const parameters = location.search.split('?').pop().split('&').map(p => {
    var ps = p.split('=');
    var o = {};
    o[ps.shift()] = ps.join('=');
    return o;
}).reduce((a, b) => {
    var o = a;
    for(var k in b) {
        o[k] = b[k];
    }
    return o;
});
const appUrl = {
    get iOS() {
        return {
            login: `ccip://login/?token=${(parameters.token || '')}`,
            store: `itms-apps://itunes.apple.com/app/id${document.querySelector('meta[name="apple-itunes-app"]').content.split('=').pop()}`,
            webStore: `https://itunes.apple.com/app/id${document.querySelector('meta[name="apple-itunes-app"]').content.split('=').pop()}`
        }
    },
    get Android() {
        return {
            login: `https://ccip.cprteam.org/?token=${(parameters.token || '')}`,
            store: `market://details?id=${document.querySelector('meta[name="google-play-app"]').content.split('=').pop()}`,
            webStore: `https://play.google.com/store/apps/details?id=${document.querySelector('meta[name="google-play-app"]').content.split('=').pop()}`
        };
    }
};
const appBadge = {
    get appStore() {
        return {
            id: 'appStore',
            url: 'https://devimages.apple.com.edgekey.net/app-store/marketing/guidelines/images/badge-download-on-the-app-store-zh-tw.svg',
            margin: 0,
            width: 135,
            height: 40,
            store: appUrl.iOS.store,
            webStore: appUrl.iOS.webStore
        };
    },
    get googlePlay() {
        return {
            id: 'googlePlay',
            url: 'https://play.google.com/intl/en_us/badges/images/generic/zh-tw_badge_web_generic.png',
            margin: -10,
            width: 155,
            height: 60,
            store: appUrl.Android.store,
            webStore: appUrl.Android.webStore
        };
    }
};
const mobile = {
    get iOS() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    get Android() {
        return navigator.userAgent.match(/Android/i) ? true : false;
    }
};

class AppMainComponent extends React.Component {
    loginApp() {
        if (mobile.iOS) {
            window.location = appUrl.iOS.login;
        } else if (mobile.Android) {
            window.location = appUrl.Android.login;
        } else {
            alert('Not support for your platform');
        }
    }
    render() {
        let storeBadge = [];
        let browserType = '';
        let accessToken = parameters.token || '';
        if (mobile.iOS) {
            browserType = 'iOS';
            storeBadge.push(appBadge.appStore);
        } else if (mobile.Android) {
            browserType = 'Android';
            storeBadge.push(appBadge.googlePlay);
        } else {
            browserType = 'WebBrowser';
            storeBadge.push(appBadge.googlePlay);
            storeBadge.push(appBadge.appStore);
        }
        if ((parameters.autoLogin || 'false').toLowerCase() == 'true') {
            this.loginApp();
        }
        var badges = [];
        for(var i = 0; i < storeBadge.length; i++) {
            var sb = storeBadge[i];
            var desktopBrowser = browserType == 'WebBrowser';
            var store = desktopBrowser ? sb.webStore : sb.store;
            var badge = (
                <AppBadge key={i} id={sb.id} url={sb.url} store={store} desktop={desktopBrowser} margin={sb.margin} width={sb.width} height={sb.height} />
            );
            badges.push(badge);
        }
        return (
            <div className="index">
                Browser: <span id="browser">{browserType}</span>
                <br />
                Token: <span id="token">{accessToken}</span>
                <br /><br />
                Step 1 - Install App: <span id="store">{badges}</span>
                <br /><br />
                Step 2 - Login App: <button id="login" onClick={this.loginApp}>Login</button>
            </div>
        );
    }
}

AppMainComponent.defaultProps = {
};

export default AppMainComponent;

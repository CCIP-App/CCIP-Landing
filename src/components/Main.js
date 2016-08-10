require('normalize.css/normalize.css');
require('highlight.js/styles/monokai-sublime.css');
require('styles/App.css');

import 'whatwg-fetch';
import React from 'react';
import AppBadge from './AppBadge';
import config from '../config/base';
import parameters from './parameters'

let parameter = parameters();

let hljs = require('highlight.js')
let moment = require('moment');

let background = require('../images/bkg3.png');
let coscup = require('../images/coscup.svg');

let faviconFile = require('../favicon.ico');
let manifestFile = require('../manifest.json');
let versionFile = require('../../dist/assets/version.json');
let appIcon = require('../images/Icon.svg');

const appUrl = {
    get iOS() {
        return {
            login: 'ccip://login/?token=',
            store: `itms-apps://itunes.apple.com/app/id${document.querySelector('meta[name="apple-itunes-app"]').content.split('=').pop()}`,
            webStore: `https://itunes.apple.com/app/id${document.querySelector('meta[name="apple-itunes-app"]').content.split('=').pop()}`
        }
    },
    get Android() {
        return {
            login: 'https://gb8p5.app.goo.gl/?apn=org.coscup.ccip&ibi=org.coscup.CCIP-iOS&link=https://coscup.cprteam.org/?autoLogin=true%26token=',
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
const BrowserTypes = {
    get iOS() { return 'iOS'; },
    get Android() { return 'Android'; },
    get WebBrowser() { return 'WebBrowser'; }
};

class AppMainComponent extends React.Component {
    loginApp() {
        if (this.state.accessToken.length == 0 && (parameter.debug || '').toLowerCase() != 'true') {
            return;
        }
        let url = null;
        if (mobile.iOS) {
            url = `${appUrl.iOS.login}${this.state.accessToken}`;
        } else if (mobile.Android) {
            url = `${appUrl.Android.login}${this.state.accessToken}`;
        }
        if (url == null) {
            let msg = `Not support for your platform\nToken: ${this.state.accessToken}`;
            alert(msg);
        } else {
            window.location.href = url;
        }
    }
    constructor() {
        super();
        this.state = {
          manifest: 'Loading...',
          versions: {},
          accessToken: '',
          isAccessTokenValid: false
        }
    }
    componentWillMount() {
        fetch(manifestFile)
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({manifest: responseData});
            });
        fetch(versionFile)
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({versions: responseData});
            });
        this.changeToken(parameter.token || '');
    }
    changeToken(token) {
        if ((token || '').length == 0) {
            if ((parameter.debug || '').toLowerCase() == 'true') {
                // if debug, accessToken always valid, empty token either
                this.setState({ isAccessTokenValid: true });
            }
            return;
        } else {
            return new Promise((resolve, reject) => {
                fetch(`https://coscup.cprteam.org/status?token=${token}`)
                    .then((response) => response.json())
                    .then((responseData) => {
                        if (!!!responseData.message && responseData.token == token) {
                            resolve(responseData);
                        }
                    });
            }).then(status => {
                this.setState({ status: status, isAccessTokenValid: true });
                return status.token;
            }).then(token => {
                this.setState({ accessToken: token });
                document.querySelector('#token').innerHTML = token;
                if ((parameter.autoLogin || 'false').toLowerCase() == 'true' || (parameter['test-auto'] || 'false').toLowerCase() == 'true') {
                    this.loginApp();
                }
            });
        }
    }
    render() {
        let storeBadge = [];
        let browserType = '';
        if (mobile.iOS) {
            browserType = BrowserTypes.iOS;
            storeBadge.push(appBadge.appStore);
        } else if (mobile.Android) {
            browserType = BrowserTypes.Android;
            storeBadge.push(appBadge.googlePlay);
        } else {
            browserType = BrowserTypes.WebBrowser;
            storeBadge.push(appBadge.googlePlay);
            storeBadge.push(appBadge.appStore);
        }
        var badges = [];
        for(var i = 0; i < storeBadge.length; i++) {
            var sb = storeBadge[i];
            var desktopBrowser = browserType == BrowserTypes.WebBrowser;
            var store = desktopBrowser ? sb.webStore : sb.store;
            var badge = (
                <AppBadge key={i} id={sb.id} url={sb.url} store={store} desktop={desktopBrowser}
                    margin={sb.margin} width={sb.width} height={sb.height} padding={5} />
            );
            badges.push(badge);
        }
        let testList = [];
        let testListTokens = [
            '7679f08f7eaeef5e9a65a1738ae2840e',
            'ee33c408df4ffad0c55eaf6ec2420717',
            'fccfc8bfa07643a1ca8015cbe74f5f17',
            '93dc46e553ac602b0d6c6d7307e523f1',
            '2f574789271d26a0c569779e8348ab68',
            '1a04f8728ffc11a4cdb9bc7dc79caac0',
            'd2ec0f1f28db8a4c1483c370953b9f0c',
            '6520d6fa2fee26045104db0364a092e9',
            '50ecac11d697bf76092bccde23607b27',
            '125384b0058f0ce2d5aae8e80d94c5d7',
            '087e78bb1460e7ddbafd6a3e004f095e',
            'd38c9001982e5601f2d37a0401528754',
            '5d765c2e8c5243c0adc3af8495841f5d',
            '16e1dc90555abf7b5bf5781882982755',
            '1aadcabf9f47e932ea6245cfd51c02e8',
            'f1349e8156d2b05e23cf72d83a63c0f3',
            'bb0d74e19d0ce01d63af2bd6d44f06df',
            '8c654d02c35a8040228c3fef4b25e9d4',
            '17bcb36a975e125f9cbea503a54603f0',
            '0c4facff3bc9879061b4eddb631339fe',
            '78e30e2397f1d8fda75eb930dd3dcf87',
            '6a487514a78c67098054e07d1440c391',
            '8a580a71b3c80199e6c7438618b4f030',
            'c7847acc730ad24412b68f5c9f5da851',
            'aba94b39687829edef692a384dd698aa',
            '4ae0249680951e256954b0b67fddbcc1',
            'e9b4c7c9995d63993007a211b817ef68',
            '222449320f2c14d54398f21bdbf253a2',
            '6edd6937afcabef71c0917d148811d54',
            '84b1701a3964056eb4bb85daee801522',
            '307b11ad88ae3897aadd6af42ba78d2d',
            'a4f07c20edb3ca71ba1457f2d79d90b7',
            '99a3afda0f76109b04ae157c38f9fcb6',
            '8145928fa6eb669cc201afd6b52a7f98',
            '85e13879cd70ee72532dc8823dbb503f',
            '48403a8ade71205cf92c1820deb7a962',
            'e041d7afabeb71d69ad6bdac96d95575',
            'de0881a5824b9dba0925e5fdf15bf6bd',
            '4aa7cdc891898e1c74a810448f59102c',
            'ce41ae89b2ad073c6321bce05d563885',
            '2d4acd203b335e400ef36ed4d34ee2e2',
            'e7f64b31340199985ee6803f8ab3b39e',
            '18eac5a3946862b8cd34e2d37c229b3d',
            '5382f8e7718f94736d850482e7ae8316',
            'e64d153fa408cb4e74ea0bff3a7b4d2e',
            'fc9db41221ac1b7403d185d58a44888e',
            'b7edc7b7341bb77e611d8f1d0a643819',
            'c4f9bde7cdb2099961cce496a2f7b0a8',
            'c33c66ae4a39134b348dc4b619dc66e4',
            '1c75cd1c124e2ede9aefb8b45a89adee',
            'df779a8bb35387d8792c8823b30ce9ce',
            '36186f7d89d81e4961742ebeaa669314',
            '9b7391abcc2384f7836f47bde388a961',
            '3eb973079e7416b20a852ef96ebca612',
            '9d869b8db3b79add3092642f2262f22a',
            '3f828284bb06d720cc8fede98db56bc6',
            'd56eabaf6b0709ff718cd5977b787a8b',
            '069b6e3c73e749684a7c34be84ecc547'
        ];
        if ((parameter['test-list'] || 'false').toLowerCase() == 'true') {
            testListTokens.map(t => {
                testList.push(
                    <li key={t} style={{marginBottom: '10px'}}>
                        <button onClick={this.changeToken.bind(this, t)}>
                            Use token: <span style={{fontFamily: '"Lucida Console", Monaco, monospace', fontSize: '12pt'}}>{t}</span>
                        </button>
                    </li>
                );
            });
        }
        let testListResult = '';
        if (testList.length > 0) {
            testListResult = (<ol className="prefix0 reversed">{testList}</ol>);
        }
        let greetings = '';
        if (!!((this.state.status || '').user_id)) {
            greetings = `${this.state.status.user_id} 您好，`
        }
        return (
            <div className="index">
                <div id="debug" style={{ display: (parameter.debug || '').toLowerCase() == 'true' ? 'block' : 'none' }}>
                    <h3>{this.state.versions.name} Landing Page</h3>
                    <h5>v{this.state.versions.version} ({moment(this.state.versions.buildDate).format('X~YYYY-MM-DD HH:mm:ss Z')})</h5>
                    Browser: <span id="browser">{browserType}</span>
                    <br />
                    <div>iOS Banner for <span style={{color: 'red'}}>id{config.iTunesAppId}</span></div>
                    <div>Google Play Banner for <span style={{color: 'red'}}>{config.GooglePlayAppId}</span></div>
                    <div id="output"></div>
                    <br />
                    Token: <span id="token" style={{color: 'red'}}>{this.state.accessToken}</span><br />
                    User: <span id="username" style={{color: 'red'}}>{(this.state.status || '').user_id}</span><br />
                    UserStatus: |
                    <pre className="hljs" style={{ width: '450px', marginLeft: '50px' }}
                        dangerouslySetInnerHTML={{ __html: hljs.highlight('json', JSON.stringify(this.state.status || '', null, 2).replace(/^"|"$/gi, '')).value }}></pre>
                    manifest: |
                    <pre className="hljs" style={{ width: '450px', marginLeft: '50px' }}
                        dangerouslySetInnerHTML={{ __html: hljs.highlight('json', JSON.stringify(this.state.manifest, null, 2).replace(/^"|"$/gi, '')).value }}></pre>
                    <div className="test-list">{testListResult}</div>
                </div>
                <div id="appBox">
                    <div id="appBackground"></div>
                    <img id="appIcon" src="/assets/Icon.svg" />
                    <div style={{ color: '#4a4a4a', fontSize: '20px', textAlign: 'center', fontWeight: '500', position: 'fixed', top: '38%', width: '100%' }}>COSCUP PASS</div>
                    <div style={{ color: '#4a4a4a', fontSize: '15px', textAlign: 'center', position: 'fixed', top: '50%', width: '100%' }}>{greetings}下載應用程式後登入即可使用。</div>
                    <div id="store" style={{ textAlign: 'center', position: 'fixed', top: '70%', width: '100%' }}>{badges}</div>
                </div>
                <span id="login" onClick={this.loginApp.bind(this)}
                    disabled={browserType == BrowserTypes.WebBrowser}
                    style={{ display: this.state.isAccessTokenValid ? 'block' : 'none', opacity: this.state.isAccessTokenValid ? '1' : '0' }}>
                        登入{browserType == BrowserTypes.WebBrowser ? ' (不支援的裝置)' : ''}{this.state.accessToken.length == 0 ? '(清空token模式)' : ''}
                </span>
            </div>
        );
    }
}

AppMainComponent.defaultProps = {
};

export default AppMainComponent;

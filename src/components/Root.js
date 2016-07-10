import React from 'react'
import config from '../config/base';

class Root extends React.Component {
  render () {
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>CCIP App</title>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
          <meta name="description" content="" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <meta name="apple-itunes-app" content={`app-id=${config.iTunesAppId}`} />
          <meta name="google-play-app" content={`app-id=${config.GooglePlayAppId}`} />
          <link rel="shortcut icon" href={config.favicon} />
          <link rel="manifest" href={config.manifest} />
        </head>
        <body>
          <div id="app"></div>

          <script>__REACT_DEVTOOLS_GLOBAL_HOOK__ = parent.__REACT_DEVTOOLS_GLOBAL_HOOK__</script>
          <script type="text/javascript" src="/assets/app.js"></script>
          <script type="text/javascript" dangerouslySetInnerHTML={{__html: `
            window.addEventListener('beforeinstallprompt', function(e) {
              var outputElement = document.querySelector('#output');
              outputElement.textContent = 'beforeinstallprompt Event fired';
            });
          `}}></script>
        </body>
      </html>
    )
  }
}

export default Root
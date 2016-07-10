require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

class AppBadgeComponent extends React.Component {
    clickEvent(props) {
        /* eslint-disable no-console */
        console.log(props.store);
        /* eslint-enable no-console */
        if (props.desktop == true) {
            window.open(props.store, 'ccip_store');
        } else {
            window.location = props.store;
        }
    }
    render() {
        var styles = {
            backgroundImage: 'url(' + this.props.url + ')',
            backgroundPosition: this.props.margin + 'px ' + this.props.margin + 'px',
            backgroundSize: this.props.width + 'px ' + this.props.height + 'px',
            backgroundRepeat: 'no-repeat',
            display: 'inline-block',
            width: '135px',
            height: '40px',
            cursor: 'pointer'
        };
        return (
          <span id={this.props.id} style={styles} onClick={this.clickEvent.bind(this, this.props)}></span>
        );
    }
}

AppBadgeComponent.defaultProps = {
};

export default AppBadgeComponent;

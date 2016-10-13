import React, { Component } from 'react';

class SettingsButton extends Component {
    render () {
        return (
            <a onClick={this.props.onClick} className="subNav_button"><i className="fa fa-cog"></i></a>
        )
    }
}

class SettingsList extends Component {
    render () {
        return (
            <ul className="subNav_nav" data-isvisible={this.props.isVisible} onClick={this.props.onClick}>
                <li className="subNav_nav_item" data-ng-controller="AboutCtrl">
                    <a data-ng-click="openModal()">About</a>
                </li>
                <li className="subNav_nav_item">
                    <a data-ui-sref="settings">Settings</a>
                </li>
                <li className="subNav_nav_item">
                    <a data-ui-sref="news">News</a>
                </li>
                <li className="subNav_nav_item">
                    <a>Shortcuts (shift + ?)</a>
                </li>
            </ul>
        )
    }
}

class SettingsApp extends Component {
    constructor (props) {
        super(props);

        this.state = {
            isVisible: false,
            isMouseIn: false
        };

        //Close when we click on the UI
        window.addEventListener('click', this.closeOut.bind(this), false);
    }

    stopClose (e) {
        e.stopPropagation();
    };

    closeOut () {
        this.setState({
            isVisible: false
        });
    };

    toggleSettings () {
        this.setState({
            isVisible: !this.state.isVisible
        });
    };

    stopEventsAndToggleSettings (e) {
      this.stopClose(e);
      this.toggleSettings();
    };

    render () {
        return (
            <div>
                <SettingsButton onClick={this.stopEventsAndToggleSettings.bind(this)} />
                <SettingsList onClick={this.stopClose.bind(this)} isVisible={this.state.isVisible} />
            </div>
        )
    }
}

export default SettingsApp;
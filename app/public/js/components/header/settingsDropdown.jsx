import React, { Component } from "react";

class SettingsDropdown extends Component {
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

export default SettingsDropdown;
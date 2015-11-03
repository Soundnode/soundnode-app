"use strict";

import React, { Component } from 'react';

const SettingsButton = React.createClass({
    render () {
        return (
            <a onClick={this.props.onClick} className="subNav_button"><i className="fa fa-cog"></i></a>
        )
    }
});

const SettingsList = React.createClass({
    render () {
        return (
            <ul className="subNav_nav" data-isvisible={this.props.isVisible}>
                <li className="subNav_nav_item" data-ng-controller="AboutCtrl">
                    <a data-ng-click="openModal()">About</a>
                </li>
                <li className="subNav_nav_item">
                    <a data-ui-sref="settings">Settings</a>
                </li>
                <li className="subNav_nav_item">
                    <a data-ui-sref="news">News</a>
                </li>
            </ul>
        )
    }
});

const SettingsApp = React.createClass({
    getInitialState () {
        return {
            isVisible: false
        }
    },

    toggleSettings () {
        if ( this.state.isVisible ) {
            this.setState({
                isVisible: false
            });
        } else {
            this.setState({
                isVisible: true
            });
        }
    },

    render () {
        return (
            <div>
                <SettingsButton onClick={this.toggleSettings} />
                <SettingsList isVisible={this.state.isVisible} />
            </div>
        )
    }
});

export default SettingsApp;
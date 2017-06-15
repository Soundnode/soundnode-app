import React, { Component } from 'react';
import SettingsDropdown from "./settingsDropdown"

class SettingsButton extends Component {
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
                <a onClick={this.stopEventsAndToggleSettings.bind(this)} className="subNav_button"><i className="fa fa-cog"></i></a>
                <SettingsDropdown onClick={this.stopClose.bind(this)} isVisible={this.state.isVisible} />
            </div>
        )
    }
}

export default SettingsButton;
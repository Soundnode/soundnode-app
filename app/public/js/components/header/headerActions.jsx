import React, { Component } from 'react';

class BackForwardActions extends Component {
   render () {
       return (
           <ul className="windowAction">
               <li className="windowAction_item navigationButton goBack" data-ng-click="goBack()">
                   <i className="fa fa-chevron-left"></i>
               </li>
               <li className="windowAction_item navigationButton goForward" data-ng-click="goForward()">
                   <i className="fa fa-chevron-right"></i>
               </li>
           </ul>
       )
   }
}

class WindowActions extends Component {

    closeApp () {
        guiConfig.close();
    }

    minimizeApp () {
        guiConfig.minimize();
    }

    maximizeApp () {
        guiConfig.maximize();
    }

    render () {

        if ( window.process.platform == 'linux32'
            || window.process.platform == 'linux64'
            || window.process.platform == 'linux'
            || window.process.platform == 'darwin' ) {
            return (
                <ul className="windowAction macActionButtons">
                    <li className="windowAction_item" onClick={this.closeApp} id="closeApp">
                        <i className="fa fa-times"></i>
                    </li>
                    <li className="windowAction_item" onClick={this.minimizeApp} id="minimizeApp">
                        <i className="fa fa-minus"></i>
                    </li>
                    <li className="windowAction_item" onClick={this.maximizeApp} id="expandApp">
                        <i className="fa fa-plus"></i>
                    </li>
                </ul>
            )
        } else if ( window.process.platform == 'win32' ) {
            return (
                <ul className="windowAction windowsActionButtons">
                    <li className="windowAction_item" onClick={this.minimizeApp} id="minimizeApp">
                        <i className="fa fa-minus"></i>
                    </li>
                    <li className="windowAction_item" onClick={this.maximizeApp} id="expandApp">
                        <i className="fa fa-square-o"></i>
                    </li>
                    <li className="windowAction_item" onClick={this.closeApp} id="closeApp">
                        <i className="fa fa-times"></i>
                    </li>
                </ul>
            )
        }
    }
}

class HeaderActions extends Component {
    render () {
        return (
            <div>
                <WindowActions />
                <BackForwardActions />
            </div>
        )
    }
}

export default HeaderActions;
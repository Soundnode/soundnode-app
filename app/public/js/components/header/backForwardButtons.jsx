import React, { Component } from 'react';

class BackForwardActions extends Component {
  render() {
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

export default BackForwardActions;
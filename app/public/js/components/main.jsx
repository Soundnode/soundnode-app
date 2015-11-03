"use strict";

import React from 'react';
import ReactDOM from 'react-dom';

import WindowActions from './header/windowActions.jsx';
import SettingsNav from './header/settingsNav.jsx';

// because of https://github.com/babel/babel/issues/2700
// writing components using ES2015 classes won't work
// when trying to set state as class property
// so for now use React.createClass

// While migration is happening
// for every component group
// we will need to render them separately
// once a group is done e.g every component in header
// should combined into one component composing all header
// components

ReactDOM.render(
    <WindowActions />,
    document.querySelector('.windowActionsApp')
);

ReactDOM.render(
    <SettingsNav />,
    document.querySelector('.settingsApp')
);
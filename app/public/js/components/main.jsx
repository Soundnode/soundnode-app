"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import SettingsNav from './header/settingsNav.jsx'

// because of https://github.com/babel/babel/issues/2700
// writing components using ES2015 classes won't work
// when trying to set state as class property
// so for now use React.createClass

ReactDOM.render(
    <SettingsNav />,
    document.querySelector('.settingsApp')
);
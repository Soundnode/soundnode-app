import React from 'react';
import ReactDOM from 'react-dom';

import HeaderActions from './header/headerActions.jsx';
import SettingsNav from './header/settingsNav.jsx';

// because of https://github.com/babel/babel/issues/2700
// writing components using ES2015 class won't work
// when trying to set state as the class property
// when not in the constructor

// While migration is happening
// for every component group
// we will need to render them separately
// once a group is done e.g every component in header
// should combined into one component composing all header
// components

ReactDOM.render(
    <HeaderActions />,
    document.querySelector('.headerActionsApp')
);

ReactDOM.render(
    <SettingsNav />,
    document.querySelector('.settingsApp')
);
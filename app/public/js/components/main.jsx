import React from "react";
import ReactDOM from "react-dom";

import HeaderActions from "./header/headerActions";
import SettingsButton from "./header/settingsButton";

// While migration is happening
// for every component group
// we will need to render them separately
// once a group is done e.g every component in header
// should combined into one component composing all header
// components

ReactDOM.render(
    <HeaderActions />,
    document.querySelector(".headerActionsApp")
);

ReactDOM.render(
    <SettingsButton />,
    document.querySelector(".settingsApp")
);
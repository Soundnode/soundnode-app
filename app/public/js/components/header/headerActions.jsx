import React, { Component } from "react";
import BackForwardActions from "./backForwardbuttons";
import WindowActions from "./windowActions";

class HeaderActions extends Component {
  render() {
    return (
      <div>
        <WindowActions />
        <BackForwardActions />
      </div>
    )
  }
}

export default HeaderActions;
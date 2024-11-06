import React from "react";
import {Link} from "react-router-dom";

import {openPicsDirectory} from "../sdk/stasis.js";

export default class MainMenu extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleOpenDirectory = this.handleOpenDirectory.bind(this);
  }

  static handleOpenDirectory = () => {
    openPicsDirectory();
  };

  render = () => (
    <div>
      <div>You want to:</div>
      <Link to="/camera">Start the app</Link>
      <br />
      <a onClick={MainMenu.handleOpenDirectory}>Open the picture directory</a>
    </div>
  );
}

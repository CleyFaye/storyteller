import React from "react";
import {Link} from "react-router-dom";
import {openPicsDirectory} from "../sdk/stasis";

export default class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handleOpenDirectory = this.handleOpenDirectory.bind(this);
  }

  handleOpenDirectory() {
    openPicsDirectory();
  }

  render() {
    return <div>
      <div>You want to:</div>
      <Link to="/camera">Start the app</Link>
      <br />
      <a onClick={this.handleOpenDirectory}>Open the picture directory</a>
    </div>;
  }
}

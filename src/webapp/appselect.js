import React from "react";
import {Link} from "react-router-dom";

export default class AppSelect extends React.PureComponent {
  render = () => (
    <>
      <div>Select app:</div>
      <ul>
        <li>
          <Link to="/story">Storyteller</Link>
        </li>
        <li>
          <Link to="/stasis">Photobooth</Link>
        </li>
      </ul>
    </>
  );
}

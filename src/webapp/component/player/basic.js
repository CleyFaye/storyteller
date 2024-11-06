/* eslint-disable no-magic-numbers */
import PropTypes from "prop-types";
import React from "react";

import ProjectCtx from "../../context/project.js";

import {getAll} from "../../service/setting.js";
import {loadCSS} from "../../util.js";

import BigDigit from "./bigdigit.js";

class Basic extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selections: this.randomSelection(),
    };
    this._styleSheet = null;
  }

  componentDidMount = () => {
    (async () => {
      const {theme, uiScale} = await getAll();
      this._styleSheet = loadCSS(`/themes/${theme}/base.css`);
      document.documentElement.style.setProperty("--ui-scale", uiScale / 10);
      // eslint-disable-next-line promise/prefer-await-to-then
    })().catch(() => {});
  };

  componentWillUnmount = () => {
    if (this._styleSheet) {
      this._styleSheet.remove();
      this._styleSheet = null;
    }
  };

  randomSelection = () => this.props.projectCtx.parts.map(() => Math.floor(Math.random() * 10));

  randomizeSelection = () => {
    this.setState({
      selections: this.randomSelection(),
    });
  };

  handlePrintStory = () => {
    (async () => {
      await this.props.projectCtx.printVariant({
        selections: this.getChapterSelection(),
      });
      this.randomizeSelection();
      // eslint-disable-next-line promise/prefer-await-to-then
    })().catch(() => {});
  };

  getChapterSelection = () =>
    this.state.selections.map(
      (selection, chapterId) => selection % this.props.projectCtx.parts[chapterId].variants.length,
    );

  updateSelection = (id, value) => {
    this.setState((oldState) => {
      const selections = oldState.selections.slice();
      selections[id] = value;
      return {selections};
    });
  };

  render = () => (
    <div className="player">
      <div className="butts">
        {this.state.selections.map((value, id) => (
          <BigDigit
            className={`bigButt butt-${id}`}
            // eslint-disable-next-line react/no-array-index-key
            key={id}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={(v) => this.updateSelection(id, v)}
            value={value}
          />
        ))}
      </div>
      <div className="generateButt" onClick={this.handlePrintStory} />
    </div>
  );
}
Basic.propTypes = {
  projectCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(Basic);

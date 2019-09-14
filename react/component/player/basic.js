import React from "react";
import PropTypes from "prop-types";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";
import ProjectCtx from "../../context/project";
import BigDigit from "./bigdigit";

class Basic extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {
      selections: this.randomSelection(),
    });
  }

  randomSelection() {
    return this.props.projectCtx.parts.map(
      () => Math.floor(Math.random() * 10)
    );
  }

  randomizeSelection() {
    this.updateState({
      selections: this.randomSelection(),
    });
  }

  printStory() {
    this.props.projectCtx.printVariant({
      selections: this.getChapterSelection(),
    }).then(() => this.randomizeSelection());
  }

  getChapterSelection() {
    return this.state.selections.map((selection, chapterId) =>
      selection % this.props.projectCtx.parts[chapterId].variants.length
    );
  }

  updateSelection(id, value) {
    const selections = this.state.selections.slice();
    selections[id] = value;
    this.updateState({selections});
  }

  render() {
    return <React.Fragment>
      <div className="player">
        <div className="butts">
          {this.state.selections.map((value, id) =>
            <BigDigit
              key={id}
              className={`bigButt butt-${id}`}
              value={value}
              onChange={v => this.updateSelection(id, v)} />)}
        </div>
        <div className="generateButt" onClick={() => this.printStory()} />
      </div>
    </React.Fragment>;
  }
}
Basic.propTypes = {
  projectCtx: PropTypes.object,
};

export default ProjectCtx.withCtx(Basic);
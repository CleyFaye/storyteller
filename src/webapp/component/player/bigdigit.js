import React from "react";
import PropTypes from "prop-types";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";
import cb from "@cley_faye/react-utils/lib/mixin/cb";

class BigDigit extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {
      displayedNumber: this.props.value,
    });
    cb(this);
    this._cycleTimer = null;
  }

  goHigher() {
    const newValue = this.props.value + 1;
    this.cb(this.props.onChange, newValue == 10 ? 0 : newValue);
  }

  goLower() {
    const newValue = this.props.value - 1;
    this.cb(this.props.onChange, newValue == -1 ? 9 : newValue);
  }

  goForward() {
    const offset = this.props.value - this.state.displayedNumber;
    const naturalForward = offset > 0;
    return (Math.abs(offset) > 5)
      ? !naturalForward
      : naturalForward;
  }

  getNumberClass() {
    if (this.state.displayedNumber != this.props.value) {
      const direction = this.goForward()
        ? "forward"
        : "backward";
      return `from-${this.state.displayedNumber}-${direction}`;
    }
    return `fixed-${this.state.displayedNumber}`;
  }

  updateCycle() {
    this._cycleTimer = null;
    let newValue = this.goForward()
      ? this.state.displayedNumber + 1
      : this.state.displayedNumber - 1;
    if (newValue < 0) {
      newValue = 9;
    }
    if (newValue > 9) {
      newValue = 0;
    }
    this.updateState({displayedNumber: newValue})
      .then(() => this.triggerCycle());
  }

  triggerCycle() {
    if (this._cycleTimer) {
      return;
    }
    if (this.state.displayedNumber == this.props.value) {
      return;
    }
    this._cycleTimer = setTimeout(() => this.updateCycle(), 500);
  }

  componentWillUnmount() {
    if (this._cycleTimer) {
      clearTimeout(this._cycleTimer);
    }
  }

  componentDidUpdate() {
    this.triggerCycle();
  }

  render() {
    const numberClass = this.getNumberClass();
    return <div className={this.props.className}>
      <div
        className="upButton"
        onClick={() => this.goHigher()} />
      <div
        className={`digit ${numberClass}`} />
      <div
        className="downButton"
        onClick={() => this.goLower()} />
    </div>;
  }
}
BigDigit.propTypes = {
  className: PropTypes.string,
  value: PropTypes.number,
  onChange: PropTypes.func,
};

export default BigDigit;
/* eslint-disable no-magic-numbers */
import PropTypes from "prop-types";
import React from "react";

class BigDigit extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      displayedNumber: this.props.value,
      numberClass: this.getNumberClass(this.props.value),
    };
    this._cycleTimer = null;
  }

  componentDidUpdate = (oldProps, oldState) => {
    if (
      oldState.displayedNumber !== this.state.displayedNumber ||
      oldProps.value !== this.props.value
    ) {
      this.setState((oldState2) => ({numberClass: this.getNumberClass(oldState2.displayedNumber)}));
      if (this.state.displayedNumber !== this.props.value) this.triggerCycle();
    }
  };

  componentWillUnmount = () => {
    if (this._cycleTimer !== null) clearTimeout(this._cycleTimer);
  };

  handleGoHigher = () => {
    const newValue = this.props.value + 1;
    this.props.onChange?.(newValue === 10 ? 0 : newValue);
  };

  handleGoLower = () => {
    const newValue = this.props.value - 1;
    this.props.onChange?.(newValue === -1 ? 9 : newValue);
  };

  goForward = () => {
    const offset = this.props.value - this.state.displayedNumber;
    const naturalForward = offset > 0;
    return Math.abs(offset) > 5 ? !naturalForward : naturalForward;
  };

  getNumberClass = (displayedNumber) => {
    if (displayedNumber !== this.props.value) {
      const direction = this.goForward() ? "forward" : "backward";
      return `from-${displayedNumber}-${direction}`;
    }
    return `fixed-${displayedNumber}`;
  };

  updateCycle = () => {
    this._cycleTimer = null;
    this.setState((oldState) => {
      let newValue = this.goForward() ? oldState.displayedNumber + 1 : oldState.displayedNumber - 1;
      if (newValue < 0) {
        newValue = 9;
      }
      if (newValue > 9) {
        newValue = 0;
      }
      return {displayedNumber: newValue};
    });
  };

  triggerCycle = () => {
    if (this._cycleTimer) {
      return;
    }
    if (this.state.displayedNumber === this.props.value) {
      return;
    }
    this._cycleTimer = setTimeout(() => this.updateCycle(), 500);
  };

  render = () => (
    <div className={this.props.className}>
      <div className="upButton" onClick={this.handleGoHigher} />
      <div className={`digit ${this.state.numberClass}`} />
      <div className="downButton" onClick={this.handleGoLower} />
    </div>
  );
}
BigDigit.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.number,
};

export default BigDigit;

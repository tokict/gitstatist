import _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Progress } from "semantic-ui-react";

export default class ProgressBarComponent extends Component {
  constructor(props) {
    super(props);
    this.calculateRemainingTime = _.throttle(this.calculateRemaining, 10000, {
      leading: true
    });
  }
  calculateRemaining = (total, current, timing) => {
    let remaining = (total - current) * timing / 1000 / 60;
    remaining = remaining < 1 ? 1 : Math.round(remaining);

    return remaining;
  };

  render() {
    const { current, total, timing, type, title } = this.props;
    const remaining = this.calculateRemainingTime(total, current, timing);
    return current > 0 && current < total ? (
      <Progress
        value={current}
        total={total}
        indicating
        autoSuccess
        progress={type}
      >
        {title} -
        {remaining > 1 ? " about" : " less than"} {remaining} minute/s remaining
      </Progress>
    ) : null;
  }
}

ProgressBarComponent.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  timing: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

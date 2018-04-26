import React, { Component } from "react";
import { Chart } from "chart.js";

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = { chart: null };
  }

  componentDidMount() {
    let chartCanvas = this.refs.chart;

    let myChart = new Chart(chartCanvas, {
      type: "line",
      options: {},
      data: this.props.data
    });

    this.setState({ chart: myChart });
  }

  componentDidUpdate() {
    let chart = this.state.chart;
    let data = this.props.data;

    data.datasets.forEach(
      (dataset, i) => (chart.data.datasets[i].data = dataset.data)
    );

    chart.data.labels = data.labels;
    chart.update();
  }

  render() {
    return (
      <canvas id="chart" height="60" ref="chart" style={{ marginTop: 50 }} />
    );
  }
}

export default Graph;

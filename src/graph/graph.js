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
      type: this.props.type,
      options: this.props.options || {},
      data: this.props.data
    });

    this.setState({ chart: myChart });
  }

  componentDidUpdate() {
    let chart = this.state.chart;
    let data = this.props.data;

    data.datasets.forEach((dataset, i) => {
      if (!chart.data.datasets[i]) {
        chart.data.datasets.push(dataset);
      } else {
        if (data) return (chart.data.datasets[i].data = dataset.data);
      }
    });

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

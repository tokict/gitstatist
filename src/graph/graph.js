import React, { Component } from "react";
import { Chart } from "chart.js";
import * as commitsLineDatasetGenerator from "./commitsLineDatasetGenerator";

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = { charts: null, chartNr: 1 };
  }

  componentWillReceiveProps(nextProps) {
    //Generate new charts
    if (nextProps.active != this.props.active && this.state.charts) {
      switch (this.props.active) {
        case "commits":
          this.setState({ chartNr: 1 });

          break;
        case "refactoring":
          this.setState({ chartNr: 1 });

          break;
        case "newCode":
          this.setState({ chartNr: 1 });

          break;
        case "comments":
          this.setState({ chartNr: 1 });

          break;
        case "mergeRequests":
          this.setState({ chartNr: 1 });

          break;
        case "tests":
          this.setState({ chartNr: 1 });

          break;
      }
      this.generateCharts();
    } else {
      this.state.charts.forEach((c, i) => {
        let data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        data.datasets.forEach((dataset, i) => {
          if (!c.data.datasets[i]) {
            c.data.datasets.push(dataset);
          } else {
            if (data) return (c.data.datasets[i].data = dataset.data);
          }
        });

        c.data.labels = data.labels;
        c.update();
      });
    }
  }

  componentDidMount() {
    this.generateCharts();
  }

  generateCharts() {
    //Fill canvases rendered with graphs
    const charts = [];
    switch (this.props.active) {
      case "commits":
        let data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        charts.push(
          new Chart(this.refs.chart1, {
            type: this.props.type,
            options: this.props.options || {},
            data
          })
        );

        break;

      case "refactoring":
        charts.push(
          new Chart(this.refs.chart1, {
            type: this.props.type,
            options: this.props.options || {},
            data: this.props.data
          })
        );

        break;

      case "newCode":
        charts.push(
          new Chart(this.refs.chart1, {
            type: this.props.type,
            options: this.props.options || {},
            data: this.props.data
          })
        );

        break;

      case "comments":
        charts.push(
          new Chart(this.refs.chart1, {
            type: this.props.type,
            options: this.props.options || {},
            data: this.props.data
          })
        );

        break;

      case "mergeRequests":
        charts.push(
          new Chart(this.refs.chart1, {
            type: this.props.type,
            options: this.props.options || {},
            data: this.props.data
          })
        );

        break;

      case "tests":
        charts.push(
          new Chart(this.refs.chart1, {
            type: this.props.type,
            options: this.props.options || {},
            data: this.props.data
          })
        );

        break;
    }

    this.setState({ charts: charts });
  }

  render() {
    const charts = [];
    //Render canvases
    for (let i = 1; i <= this.state.chartNr; i++) {
      charts.push(
        <canvas
          key={i}
          id={"chart" + i}
          height="60"
          ref={"chart" + i}
          style={{ marginTop: 50 }}
        />
      );
    }
    return charts;
  }
}

export default Graph;

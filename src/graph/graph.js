import React, { Component } from "react";
import { Chart } from "chart.js";
import * as commitsLineDatasetGenerator from "./commits/commitsLineDatasetGenerator";
import * as refactoringLineDatasetGenerator from "./refactoring/refactoringLineDatasetGenerator";

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = { charts: null };
  }

  componentWillReceiveProps(nextProps) {
    //Generate new charts
    if (nextProps.active != this.props.active) {
      this.generateCharts(nextProps.active);
    } else {
      this.state.charts.forEach((c, i) => {
        let data = c.generator.generate(
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
    this.generateCharts(this.props.active);
  }

  generateCharts(active) {
    //Fill canvases rendered with graphs
    const charts = [];
    let c;
    let data;

    switch (active) {
      case "commits":
        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart1, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              fontSize: 16,
              text: "Commits over time"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart2, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Most common commit hours"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart3, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Most common commit days"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart4, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Top projects by commits"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart5, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Top project branches by commits"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart6, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "When do users commit most"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        break;

      case "refactoring":
        data = refactoringLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart1, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Refactoring over time"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart2, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Most active refactoring projects"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart3, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Most active refactoring branches"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart4, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "When do users refactor most"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        break;

      case "newCode":
        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart1, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "New code over time"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart2, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Most active new code projects"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart3, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Most active new code branches"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart4, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "When do users add new code"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        break;

      case "comments":
        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart1, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              fontSize: 16,
              text: "Comments over time"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart2, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              fontSize: 16,
              text: "Most commented projects"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart3, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Most commented branches"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        break;

      case "mergeRequests":
        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart1, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              fontSize: 16,
              text: "Merge requests over time"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart2, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              text: "Most active merge requests projects"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart3, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              fontSize: 16,
              text: "Most active merge request branches"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart4, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              text: "When do users make most merge requests"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        break;

      case "tests":
        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart1, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              fontSize: 16,
              text: "Failed tests over time"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart2, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              fontSize: 16,
              text: "Days with most failed tests"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart3, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              fontSize: 16,
              fontSize: 16,
              text: "Hours with most failed tests"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);

        data = commitsLineDatasetGenerator.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart4, {
          type: this.props.type,
          options: {
            title: {
              display: true,
              text: "What days does users code fail most"
            }
          },
          data
        });
        c.generator = commitsLineDatasetGenerator;
        charts.push(c);
        break;
    }

    this.setState({ charts: charts });
  }

  render() {
    const charts = [];
    //Render canvases
    for (let i = 1; i <= 6; i++) {
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

    return <div>{charts}</div>;
  }
}

export default Graph;

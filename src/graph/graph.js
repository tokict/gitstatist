import React, { Component } from "react";
import { Chart } from "chart.js";
import * as commitsTimeline from "./commits/timeline";
import * as commitsHours from "./commits/hours";
import * as commitsDays from "./commits/days";
import * as projectsBar from "./commits/projects";
import * as branchesBar from "./commits/branches";
import * as refactoringTimeline from "./refactoring/timeline";

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = { charts: null, nrGraphs: 5 };
  }

  componentWillReceiveProps(nextProps) {
    //Generate new charts
    if (nextProps.active != this.props.active && this.props.Users.data) {
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
    if (this.props.Users.data) {
      this.generateCharts(this.props.active);
    }
  }

  generateCharts(active) {
    //Fill canvases rendered with graphs
    const charts = [];
    let c;
    let data;
    let nrGraphs;
    if (this.state.charts) {
      this.state.charts.forEach((c, i) => {
        c.destroy();
      });
    }

    switch (active) {
      case "commits":
        data = commitsTimeline.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart1, {
          type: "line",
          options: {
            title: {
              display: true,
              fontSize: 16,
              text: "Commits over time"
            }
          },
          data
        });
        c.generator = commitsTimeline;
        charts.push(c);

        data = commitsHours.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart2, {
          type: "bar",
          options: {
            title: {
              display: true,
              fontSize: 16,
              text: "Most common commit hours"
            },
            legend: {
              display: false
            }
          },
          data
        });
        c.generator = commitsHours;
        charts.push(c);

        data = commitsDays.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart3, {
          type: "bar",
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Most common commit days"
            },
            legend: {
              display: false
            }
          },
          data
        });
        c.generator = commitsDays;
        charts.push(c);

        data = projectsBar.generate(
          {
            projects: this.props.Projects.data,
            commits: this.props.Commits
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart4, {
          type: "bar",
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Top projects by commits"
            },
            legend: {
              display: false
            }
          },
          data
        });
        c.generator = projectsBar;
        charts.push(c);

        data = branchesBar.generate(
          {
            projects: this.props.Projects.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart5, {
          type: "bar",
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Top project branches by commits"
            },
            legend: {
              display: false
            }
          },
          data
        });
        c.generator = branchesBar;
        charts.push(c);
        nrGraphs = 5;
        break;

      case "refactoring":
        data = refactoringTimeline.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart1, {
          type: "line",
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Refactoring over time"
            }
          },
          data
        });
        c.generator = commitsTimeline;
        charts.push(c);

        data = commitsTimeline.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart2, {
          type: "line",
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Most active refactoring projects"
            }
          },
          data
        });
        c.generator = commitsTimeline;
        charts.push(c);

        data = commitsTimeline.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart3, {
          type: "line",
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Most active refactoring branches"
            }
          },
          data
        });
        c.generator = commitsTimeline;
        charts.push(c);
        nrGraphs = 3;
        break;

      case "newCode":
        data = commitsTimeline.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart1, {
          type: "line",
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "New code over time"
            }
          },
          data
        });
        c.generator = commitsTimeline;
        charts.push(c);

        data = commitsTimeline.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart2, {
          type: "line",
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Most active new code projects"
            }
          },
          data
        });
        c.generator = commitsTimeline;
        charts.push(c);

        data = commitsTimeline.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart3, {
          type: "line",
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Most active new code branches"
            }
          },
          data
        });
        c.generator = commitsTimeline;
        charts.push(c);
        nrGraphs = 3;
        break;

      case "comments":
        data = commitsTimeline.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart1, {
          type: "line",
          options: {
            title: {
              display: true,
              fontSize: 16,
              text: "Comments over time"
            }
          },
          data
        });
        c.generator = commitsTimeline;
        charts.push(c);

        data = commitsTimeline.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart2, {
          type: "line",
          options: {
            title: {
              display: true,
              fontSize: 16,
              text: "Most commented projects"
            }
          },
          data
        });
        c.generator = commitsTimeline;
        charts.push(c);
        nrGraphs = 2;
        break;

      case "mergeRequests":
        data = commitsTimeline.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart1, {
          type: "line",
          options: {
            title: {
              display: true,
              fontSize: 16,
              text: "Merge requests over time"
            }
          },
          data
        });
        c.generator = commitsTimeline;
        charts.push(c);

        data = commitsTimeline.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart2, {
          type: "line",
          options: {
            title: {
              display: true,
              text: "Most active merge requests projects"
            }
          },
          data
        });
        c.generator = commitsTimeline;
        charts.push(c);

        data = commitsTimeline.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart3, {
          type: "line",
          options: {
            title: {
              display: true,
              fontSize: 16,
              text: "Most active merge request branches"
            }
          },
          data
        });
        c.generator = commitsTimeline;
        charts.push(c);
        nrGraphs = 3;
        break;

      case "tests":
        data = commitsTimeline.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart1, {
          type: "line",
          options: {
            title: {
              display: true,
              fontSize: 16,
              text: "Failed tests over time"
            }
          },
          data
        });
        c.generator = commitsTimeline;
        charts.push(c);

        data = commitsTimeline.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart2, {
          type: "line",
          options: {
            title: {
              display: true,
              fontSize: 16,
              text: "Days with most failed tests"
            }
          },
          data
        });
        c.generator = commitsTimeline;
        charts.push(c);

        data = commitsTimeline.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart3, {
          type: "line",
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
        c.generator = commitsTimeline;
        charts.push(c);
        nrGraphs = 3;
        break;
    }

    this.setState({ charts: charts, nrGraphs });
  }

  render() {
    const charts = [];
    //Render canvases

    for (let i = 1; i <= 5; i++) {
      charts.push(
        <canvas
          key={i}
          id={"chart" + i}
          height="60"
          ref={"chart" + i}
          style={{
            marginTop: 50
          }}
        />
      );
    }

    return <div>{charts}</div>;
  }
}

export default Graph;

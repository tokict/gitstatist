import React, { Component } from "react";
import { Chart } from "chart.js";
import * as commitsTimeline from "./commits/timeline";
import * as commitsHours from "./commits/hours";
import * as commitsDays from "./commits/days";
import * as commitsProjectsBar from "./commits/projects";
import * as commitsBranchesBar from "./commits/branches";
import * as refactoringProjectsBar from "./refactoring/projects";
import * as refactoringBranchesBar from "./refactoring/branches";
import * as refactoringTimeline from "./refactoring/timeline";
import * as newCodeProjectsBar from "./newCode/projects";
import * as newCodeBranchesBar from "./newCode/branches";
import * as newCodeTimeline from "./newCode/timeline";
import * as commentsTimeline from "./comments/timeline";
import * as commentsHours from "./comments/hours";
import * as commentsDays from "./comments/days";
import * as commentsProjectsBar from "./comments/projects";
import * as commentsBranchesBar from "./comments/branches";
import * as mergeRequestsProjectsBar from "./mergeRequests/projects";
import * as mergeRequestsBranchesBar from "./mergeRequests/branches";
import * as mergeRequestsTimeline from "./mergeRequests/timeline";

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
            commits: this.props.Commits.data,
            projects: this.props.Projects.data,
            mergeRequests: this.props.MergeRequests
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

        data = commitsProjectsBar.generate(
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
        c.generator = commitsProjectsBar;
        charts.push(c);

        data = commitsBranchesBar.generate(
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
        c.generator = commitsBranchesBar;
        charts.push(c);
        nrGraphs = 5;
        break;

      case "refactoring":
        data = refactoringTimeline.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits
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
        c.generator = refactoringTimeline;
        charts.push(c);

        data = refactoringProjectsBar.generate(
          {
            projects: this.props.Projects.data,
            commits: this.props.Commits
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart2, {
          type: "bar",
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Most refactored projects"
            },
            legend: {
              display: false
            }
          },
          data
        });
        c.generator = refactoringProjectsBar;
        charts.push(c);

        data = refactoringBranchesBar.generate(
          {
            projects: this.props.Projects.data,
            commits: this.props.Commits
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart3, {
          type: "bar",
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Most refactored branches"
            },
            legend: {
              display: false
            }
          },
          data
        });
        c.generator = refactoringBranchesBar;
        charts.push(c);
        nrGraphs = 3;
        break;

      case "newCode":
        data = newCodeTimeline.generate(
          {
            users: this.props.Users.data,
            commits: this.props.Commits
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
        c.generator = newCodeTimeline;
        charts.push(c);

        data = newCodeProjectsBar.generate(
          {
            projects: this.props.Projects.data,
            commits: this.props.Commits
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart2, {
          type: "bar",
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Most active new code projects"
            },
            legend: {
              display: false
            }
          },
          data
        });
        c.generator = newCodeProjectsBar;
        charts.push(c);

        data = newCodeBranchesBar.generate(
          {
            projects: this.props.Projects.data,
            commits: this.props.Commits
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart3, {
          type: "bar",
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Most active new code branches"
            },
            legend: {
              display: false
            }
          },
          data
        });
        c.generator = newCodeBranchesBar;
        charts.push(c);
        nrGraphs = 3;
        break;

      case "comments":
        data = commentsTimeline.generate(
          {
            users: this.props.Users.data,
            comments: this.props.Comments.data
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

        data = commentsHours.generate(
          {
            comments: this.props.Comments.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart2, {
          type: "bar",
          options: {
            title: {
              display: true,
              fontSize: 16,
              text: "Most common commenting hours"
            },
            legend: {
              display: false
            }
          },
          data
        });
        c.generator = commitsHours;
        charts.push(c);

        data = commentsDays.generate(
          {
            comments: this.props.Comments.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart3, {
          type: "bar",
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Most common commenting days"
            },
            legend: {
              display: false
            }
          },
          data
        });
        c.generator = commentsDays;
        charts.push(c);

        data = commentsProjectsBar.generate(
          {
            projects: this.props.Projects.data,
            comments: this.props.Comments.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart4, {
          type: "bar",
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Top projects by commenting"
            },
            legend: {
              display: false
            }
          },
          data
        });
        c.generator = commentsProjectsBar;
        charts.push(c);

        data = commentsBranchesBar.generate(
          {
            projects: this.props.Projects.data,
            comments: this.props.Comments.data
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart5, {
          type: "bar",
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Top project branches by commenting"
            },
            legend: {
              display: false
            }
          },
          data
        });
        c.generator = commentsBranchesBar;
        charts.push(c);
        nrGraphs = 5;
        break;

      case "mergeRequests":
        data = mergeRequestsTimeline.generate(
          {
            users: this.props.Users.data,
            mergeRequests: this.props.MergeRequests
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
        c.generator = mergeRequestsTimeline;
        charts.push(c);

        data = mergeRequestsProjectsBar.generate(
          {
            projects: this.props.Projects.data,
            mergeRequests: this.props.MergeRequests
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart2, {
          type: "bar",
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Most active projects per merge requests"
            },
            legend: {
              display: false
            }
          },
          data
        });
        c.generator = mergeRequestsProjectsBar;
        charts.push(c);

        data = mergeRequestsBranchesBar.generate(
          {
            projects: this.props.Projects.data,
            mergeRequests: this.props.MergeRequests
          },
          this.props.Ui.periodFrom
        );

        c = new Chart(this.refs.chart3, {
          type: "bar",
          options: {
            title: {
              display: true,
              fontSize: 16,

              text: "Most active branches per merge requests"
            },
            legend: {
              display: false
            }
          },
          data
        });
        c.generator = mergeRequestsBranchesBar;
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

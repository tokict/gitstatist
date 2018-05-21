import React, { Component } from "react";
import "./App.css";
import { UserCard } from "./components/userCard/userCard";
import { UsersModal } from "./components/usersModal/usersModal";
import ServerPicker from "./serverPicker/serverPicker";
import _ from "lodash";
import userActions from "./actions/userActions";
import projectActions from "./actions/projectActions";
import uiActions from "./actions/uiActions";
import {
  Grid,
  Divider,
  Dimmer,
  Loader,
  Segment,
  Message,
  Statistic,
  Menu,
  Icon,
  Modal,
  Button,
  Progress
} from "semantic-ui-react";
import Slider from "rc-slider";
import Tooltip from "rc-tooltip";
import "rc-slider/assets/index.css";
import Graph from "./graph/graph";
import faker from "faker";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const Handle = Slider.Handle;
const handle = props => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      dots={true}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};
function rand(min, max, num) {
  var rtn = [];
  while (rtn.length < num) {
    rtn.push(Math.random() * (max - min) + min);
  }
  return rtn;
}
const activeItem = null;
const chartData = {
  labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)"
      ],
      borderColor: [
        "rgba(255,99,132,1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)"
      ],
      borderWidth: 1
    }
  ]
};

const messageTypes = {
  unknownUsers: { icon: "warning", color: "orange" }
};

const chartOptions = {};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersModalShown: false
    };
    this.startApp = this.startApp.bind(this);
    this.dismissMessage = this.dismissMessage.bind(this);
    this.closeUsersModal = this.closeUsersModal.bind(this);
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
    this.calculateRemainingTimeCommits = _.throttle(
      this.calculateRemaining,
      20000,
      {
        leading: true
      }
    );
    this.calculateRemainingTimeCommitsDetails = _.throttle(
      this.calculateRemaining,
      30000,
      {
        leading: true
      }
    );
    this.calculateRemainingTimeBranchMeta = _.throttle(
      this.calculateRemaining,
      10000,
      {
        leading: true
      }
    );
    this.calculateRemainingTimeProjects = _.throttle(
      this.calculateRemaining,
      10000,
      {
        leading: true
      }
    );

    if (this.props.Ui.messages.new.length) {
      this.props.actions.showMessage(
        this.props.Ui.messages.new[0],
        this.props.Ui.messages
      );
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.Ui.messages.new.length != this.props.Ui.messages.new.length) {
      if (this.props.Ui.messages.new.length) {
        this.props.actions.showMessage(
          this.props.Ui.messages.new[0],
          this.props.Ui.messages
        );
      }
    }

    if (nextProps.Server.token && !this.props.Server.token) {
      this.props.actions.fetchProjects();
    }

    if (nextProps.Users.unknown && !this.props.Users.unknown) {
      this.props.actions.showMessage("unknownUsers", nextProps.Ui.messages);
    }
  }
  componentDidMount() {
    if (this.props.Server.token) {
      this.props.actions.fetchProjects();
    }
  }
  startApp = (url, token, provider) => {
    this.props.actions.fetchUsers(url, token, provider);
  };

  renderLoader = () => (
    <Segment size="massive" style={{ height: "500px" }}>
      <Dimmer active inverted>
        <Loader>Loading</Loader>
      </Dimmer>
    </Segment>
  );

  handleMenuItemClick = (e, data) => {
    switch (data.name) {
      case "users":
        console.log("Opening users");
        this.setState({ usersModalShown: true });
        console.log(this.state);
        break;
      default:
    }
  };

  closeUsersModal = () => this.setState({ usersModalShown: false });
  renderMenu = () => {
    return this.props.Users.data ? (
      <Menu
        compact
        inverted
        icon="labeled"
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "#222",
          cursor: "pointer"
        }}
      >
        <Menu.Item
          name="users"
          active={activeItem === "users"}
          onClick={this.handleMenuItemClick}
        >
          <Icon name="users" />
          Users
        </Menu.Item>

        <Menu.Item
          name="envelope"
          active={activeItem === "messages"}
          onClick={this.handleMenuItemClick}
        >
          <Icon name="envelope" />
          Messages
        </Menu.Item>

        <Menu.Item
          name="logout"
          active={activeItem === "logout"}
          onClick={this.handleMenuItemClick}
        >
          <Icon name="sign out" />
          Logout
        </Menu.Item>
      </Menu>
    ) : null;
  };

  renderUserList = type => {
    const list = [];
    const data = [];
    let desc;

    switch (type) {
      case "commits":
        desc = "commits";
        break;

      case "refactoring":
        desc = "lines changed";
        break;

      case "newCode":
        desc = "new lines";
        break;

      case "comments":
        desc = "comments";
        break;

      case "mergeRequsts":
        desc = "merge requestsd";
        break;

      case "tests":
        desc = "failed tests";
        break;

      case "productivity":
        desc = "by productivity";
        break;

      default:
        desc = "desc placeholder";
    }

    Object.keys(this.props.Users.data).map(id => {
      data.push(this.props.Users.data[id]);
    });

    data.sort((a, b) => b.commits.length - a.commits.length);

    data.map((item, index) => {
      item.commits.length
        ? list.push(
            <UserCard
              key={item.id}
              order={index + 1}
              name={item.name}
              number={item.commits.length}
              image={item.image}
              description={desc}
            />
          )
        : null;
    });

    return list;
  };

  dismissMessage = message => {
    this.props.actions.dismissMessage(message, this.props.Ui.messages);
  };

  shouldShowMessage = (message, add) =>
    this.props.Ui.messages.new.includes(message);

  calculateRemaining = (total, current, timing) => {
    let remaining = (total - current) * timing / 1000 / 60;
    remaining = remaining < 1 ? 1 : Math.round(remaining);

    return remaining;
  };

  render() {
    const detailsCurrent = this.props.Progress.commitsDetails.current;
    const detailsTotal = this.props.Progress.commitsDetails.total;
    const detailsTiming = this.props.Progress.commitsDetails.timing;

    let remainingCommits = 0;
    if (detailsCurrent) {
      remainingCommits = this.calculateRemainingTimeCommitsDetails(
        detailsTotal,
        detailsCurrent,
        detailsTiming + 50
      );
    }

    const branchCommitsCurrent = this.props.Progress.branchesCommits.current;
    const branchCommitsTotal = this.props.Progress.branchesCommits.total;
    const branchCommitsTiming = this.props.Progress.branchesCommits.timing;
    let remainingBranchesCommits = 0;
    if (branchCommitsCurrent) {
      remainingBranchesCommits = this.calculateRemainingTimeCommits(
        branchCommitsTotal,
        branchCommitsCurrent,
        branchCommitsTiming
      );
    }

    const branchCommitsMetaCurrent = this.props.Progress.branchesCommitsMeta
      .current;
    const branchCommitsMetaTotal = this.props.Progress.branchesCommitsMeta
      .total;
    const branchCommitsMetaTiming = this.props.Progress.branchesCommitsMeta
      .timing;
    let remainingBranchMeta = 0;
    if (branchCommitsMetaCurrent) {
      remainingBranchMeta = this.calculateRemainingTimeBranchMeta(
        branchCommitsMetaTotal,
        branchCommitsMetaCurrent,
        branchCommitsMetaTiming
      );
    }

    const branchCurrent = this.props.Progress.branches.current;
    const branchTotal = this.props.Progress.branches.total;
    const branchTiming = this.props.Progress.branches.timing;
    let remainingProjects = 0;
    if (branchCurrent) {
      remainingProjects = this.calculateRemainingTimeProjects(
        branchTotal,
        branchCurrent,
        branchTiming
      );
    }

    return (
      <div>
        <header className="App-header" style={{ marginBottom: 40 }}>
          <h1 className="App-title">Gitstatista</h1>
        </header>
        {this.renderMenu()}
        {this.props.Users.data ? (
          <div>
            <Grid columns={3} padded centered>
              <Grid.Row>
                <Grid.Column
                  style={{ paddingLeft: "50px", paddingRight: "50px" }}
                >
                  <div>
                    <Statistic.Group size={"mini"}>
                      <Statistic>
                        <Statistic.Value>
                          {Object.keys(this.props.Users.data).length || 0}
                        </Statistic.Value>
                        <Statistic.Label>Active users</Statistic.Label>
                      </Statistic>
                      {this.props.Projects.data ? (
                        <Statistic>
                          <Statistic.Value>
                            {this.props.Projects.data
                              ? Object.keys(this.props.Projects.data).length
                              : "~"}
                          </Statistic.Value>
                          <Statistic.Label>Projects</Statistic.Label>
                        </Statistic>
                      ) : null}

                      <Statistic>
                        <Statistic.Value>
                          {this.props.Commits.details
                            ? Object.keys(this.props.Commits.details).length
                            : "~"}
                        </Statistic.Value>
                        <Statistic.Label>Unique commits</Statistic.Label>
                      </Statistic>
                    </Statistic.Group>
                  </div>
                  <div style={{ height: "80px" }}>
                    {branchCurrent > 0 && branchCurrent < branchTotal ? (
                      <Progress
                        indicating
                        value={branchCurrent}
                        total={branchTotal}
                        autoSuccess
                        progress="ratio"
                      >
                        STEP 1 of 4 : Getting branches info -
                        {remainingProjects > 1 ? " about" : " less than"}{" "}
                        {remainingProjects} minute/s remaining
                      </Progress>
                    ) : null}
                    {branchCommitsMetaCurrent > 0 &&
                    branchCommitsMetaCurrent < branchCommitsMetaTotal ? (
                      <Progress
                        value={branchCommitsMetaCurrent}
                        total={branchCommitsMetaTotal}
                        indicating
                        autoSuccess
                        progress="ratio"
                      >
                        STEP 2 of 4 : Fetching branch metadata -
                        {remainingBranchMeta > 1 ? " about" : " less than"}{" "}
                        {remainingBranchMeta} minute/s remaining
                      </Progress>
                    ) : null}
                    {branchCommitsCurrent > 0 &&
                    branchCommitsCurrent < branchCommitsTotal ? (
                      <Progress
                        value={branchCommitsCurrent}
                        total={branchCommitsTotal}
                        indicating
                        autoSuccess
                        progress="ratio"
                      >
                        STEP 3 of 4 : Fetching all commits -
                        {remainingBranchesCommits > 1
                          ? " about"
                          : " less than"}{" "}
                        {remainingBranchesCommits} minute/s remaining
                      </Progress>
                    ) : null}

                    {detailsCurrent > 0 && detailsCurrent < detailsTotal ? (
                      <Progress
                        value={detailsCurrent}
                        total={detailsTotal}
                        indicating
                        autoSuccess
                        progress="ratio"
                      >
                        STEP 4 of 4 : Fetching commit details -
                        {remainingCommits > 1 ? " about" : " less than"}{" "}
                        {remainingCommits} minute/s remaining
                      </Progress>
                    ) : null}
                  </div>
                </Grid.Column>

                <Grid.Column
                  style={{
                    paddingLeft: "50px",
                    paddingRight: "50px",
                    overlay: null
                  }}
                >
                  <Slider
                    min={0}
                    marks={{
                      0: "Today",
                      1: "Last 7 days",
                      2: "Last 30 days",
                      3: "Last 90 days",
                      4: "This year"
                    }}
                    max={4}
                    step={null}
                    onAfterChange={value =>
                      this.props.actions.changePeriod(value)
                    }
                    defaultValue={this.props.Ui.periodFrom.id || 0}
                  />
                </Grid.Column>

                <Grid.Column
                  style={{ paddingLeft: "50px", paddingRight: "50px" }}
                >
                  {this.props.Users.unknown &&
                  this.shouldShowMessage("unknownUsers") ? (
                    <Message
                      onDismiss={() => this.dismissMessage("unknownUsers")}
                      color={messageTypes["unknownUsers"].color}
                      icon={messageTypes["unknownUsers"].icon}
                      header="We found some unknown commit authors"
                      content="Click the user icon in the menu on top to see them"
                      size="tiny"
                    />
                  ) : null}
                </Grid.Column>

                <Divider />
              </Grid.Row>
            </Grid>
            <Grid columns={7} divided padded>
              <Grid.Row>
                <Grid.Column className="App-usercol">
                  <h1 className="App-usersection-header">Commits</h1>

                  {!this.props.Commits.data
                    ? this.renderLoader()
                    : this.renderUserList("commits")}
                </Grid.Column>
                <Grid.Column className="App-usercol">
                  <h1 className="App-usersection-header">Refactoring</h1>
                  {!this.props.Commits.data
                    ? this.renderLoader()
                    : this.renderUserList("refactoring")}
                </Grid.Column>
                <Grid.Column className="App-usercol">
                  <h1 className="App-usersection-header">New code</h1>
                  {!this.props.Commits.data
                    ? this.renderLoader()
                    : this.renderUserList("newCode")}
                </Grid.Column>
                <Grid.Column>
                  <h1 className="App-usersection-header">Commit comments</h1>
                  {!this.props.Commits.data
                    ? this.renderLoader()
                    : this.renderUserList("comments")}
                </Grid.Column>
                <Grid.Column>
                  <h1 className="App-usersection-header">Merge requests</h1>
                  {!this.props.Commits.data
                    ? this.renderLoader()
                    : this.renderUserList("mergeRequests")}
                </Grid.Column>
                <Grid.Column>
                  <h1 className="App-usersection-header">Failed tests</h1>
                  {!this.props.Commits.data
                    ? this.renderLoader()
                    : this.renderUserList("tests")}
                </Grid.Column>
                <Grid.Column>
                  <h1 className="App-usersection-header">Total productivity</h1>
                  {!this.props.Commits.data
                    ? this.renderLoader()
                    : this.renderUserList("productivity")}
                </Grid.Column>
              </Grid.Row>
            </Grid>

            <Graph data={chartData} />
          </div>
        ) : (
          <ServerPicker
            startApp={this.startApp}
            loading={this.props.Users.loading}
            url={this.props.Server.url}
            token={this.props.Server.token}
            provider={this.props.Server.provider}
          />
        )}
        <UsersModal
          users={this.props.Users}
          open={this.state.usersModalShown}
          onClose={this.closeUsersModal}
          updateUsers={(users, unknown) => {
            this.props.actions.updateUsers(users);
            if (unknown) {
              this.props.actions.updateUnknownUsers(unknown);
            }
          }}
        />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    Users: state.Users,
    Server: state.Server,
    Commits: state.Commits,
    Ui: state.Ui,
    Projects: state.Projects,
    Progress: state.Progress
  };
}

function mapDispatchToProps(dispatch, props) {
  const mix = Object.assign(userActions, projectActions, uiActions);
  return {
    actions: bindActionCreators(mix, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

import React, { Component } from "react";
import "./App.css";
import { UserCard } from "./components/userCard/userCard";
import { UsersModal } from "./components/usersModal/usersModal";
import MessagesModal from "./components/messagesModal/messagesModal";
import ServerPicker from "./serverPicker/serverPicker";
import * as calculator from "./calculator";
import * as commitsLineDatasetGenerator from "./graph/commitsLineDatasetGenerator";
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

const activeItem = null;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersModalShown: false,
      messagesModalShown: false,
      activeGraph: "commits",
      commitsLineGraphData: null
    };
    this.startApp = this.startApp.bind(this);
    this.dismissMessage = this.dismissMessage.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.closeUsersModal = this.closeUsersModal.bind(this);
    this.closeMessagesModal = this.closeMessagesModal.bind(this);
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
    this.dismissMessage = this.dismissMessage.bind(this);
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

    this.calculateRemainingTimeComments = _.throttle(
      this.calculateRemaining,
      10000,
      {
        leading: true
      }
    );
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.Server.token && !this.props.Server.token) {
      this.props.actions.fetchProjects();
    }

    if (nextProps.Commits.data) {
      this.setState({
        commitsLineGraphData: {
          users: nextProps.Users.data,
          commits: nextProps.Commits.data
        }
      });
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
  dismissMessage(type) {
    this.actions.dismissMessage(type);
  }

  logoutUser = () => this.props.actions.logoutUser();

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
        this.setState({ usersModalShown: true });
        break;
      case "messages":
        this.setState({ messagesModalShown: true });

        break;
      default:
    }
  };

  closeUsersModal = () => this.setState({ usersModalShown: false });
  closeMessagesModal = () => this.setState({ messagesModalShown: false });
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
          name="messages"
          active={activeItem === "messages"}
          onClick={this.handleMenuItemClick}
        >
          <Icon name="envelope" />
          Messages
        </Menu.Item>

        <Menu.Item
          name="logout"
          active={activeItem === "logout"}
          onClick={this.logoutUser}
        >
          <Icon name="sign out" />
          Logout
        </Menu.Item>
      </Menu>
    ) : null;
  };

  renderUserList = type => {
    let users = [];
    let list;
    let desc;
    Object.keys(this.props.Users.data).map(id => {
      users.push(this.props.Users.data[id]);
    });

    switch (type) {
      case "commits":
        list = calculator.commits(users);

        break;

      case "refactoring":
        list = calculator.refactoring(users, this.props.Commits.details);
        break;

      case "newCode":
        list = calculator.newCode(users, this.props.Commits.details);
        break;

      case "comments":
        list = calculator.comments(users);
        break;
        break;

      case "mergeRequsts":
        break;

      case "tests":
        list = calculator.failedTests(users, this.props.Commits.details);
        break;
    }

    return list;
  };

  handleGraphChange = graph => {
    let data;
    switch (graph) {
      case "commits":
        data = this.props.Users.data;
        break;

      case "refactoring":
        data = this.props.Users.data;
        break;

      case "newCode":
        data = "new lines";
        break;

      case "comments":
        data = "comments";
        break;

      case "mergeRequsts":
        data = "merge requestsd";
        break;

      case "tests":
        data = "failed tests";
        break;

      default:
        data = "desc placeholder";
    }

    this.setState({ commitsLineGraphData: data, activeGraph: graph });
  };

  dismissMessage = message => {
    this.props.actions.dismissMessage(message, this.props.Ui.messages);
  };

  calculateRemaining = (total, current, timing) => {
    let remaining = (total - current) * timing / 1000 / 60;
    remaining = remaining < 1 ? 1 : Math.round(remaining);

    return remaining;
  };

  render() {
    let commitsLineGraphData = null;
    if (this.state.commitsLineGraphData) {
      commitsLineGraphData = commitsLineDatasetGenerator.generate(
        this.state.commitsLineGraphData,
        this.state.activeGraph,
        this.props.Ui.periodFrom
      );
    }

    const detailsCurrent = this.props.Progress.commitsDetails.current;
    const detailsTotal = this.props.Progress.commitsDetails.total;
    const detailsTiming = this.props.Progress.commitsDetails.timing;

    let remainingCommits = 0;
    if (detailsCurrent) {
      remainingCommits = this.calculateRemainingTimeCommitsDetails(
        detailsTotal,
        detailsCurrent,
        detailsTiming
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

    const commentsCurrent = this.props.Progress.comments.current;
    const commentsTotal = this.props.Progress.comments.total;
    const commentsTiming = this.props.Progress.comments.timing;
    let remainingComments = 0;
    if (commentsCurrent) {
      remainingComments = this.calculateRemainingTimeComments(
        commentsTotal,
        commentsCurrent,
        commentsTiming
      );
    }

    let commitsCount = 0;
    if (this.props.Users.data) {
      for (let user in this.props.Users.data) {
        if (this.props.Users.data[user].commits) {
          commitsCount += Object.keys(this.props.Users.data[user].commits)
            .length;
        }
      }
    }

    return (
      <div>
        <header className="App-header" style={{ marginBottom: 40 }}>
          <h1 className="App-title">Gitstatista</h1>
        </header>
        {this.renderMenu()}
        <Segment
          size="massive"
          style={{
            position: "absolute",
            top: "10px",
            left: "200px",
            backgroundColor: "transparent"
          }}
        >
          <Dimmer
            active={this.props.Progress.fetchingData}
            style={{
              backgroundColor: "transparent"
            }}
          >
            <Loader>Loading</Loader>
          </Dimmer>
        </Segment>
        {this.props.Users.data ? (
          <div>
            <Grid columns={3} padded centered>
              <Grid.Row>
                <Grid.Column
                  style={{
                    paddingLeft: "50px",
                    paddingRight: "50px",
                    textAlign: "center"
                  }}
                >
                  <div>
                    <Statistic.Group size={"mini"}>
                      <Statistic className="App-statistic-margin">
                        <Statistic.Value>
                          {Object.keys(this.props.Users.data).length || 0}
                        </Statistic.Value>
                        <Statistic.Label>Active users</Statistic.Label>
                      </Statistic>
                      {this.props.Projects.data ? (
                        <Statistic className="App-statistic-margin">
                          <Statistic.Value>
                            {this.props.Projects.data
                              ? Object.keys(this.props.Projects.data).length
                              : "~"}
                          </Statistic.Value>
                          <Statistic.Label>Projects</Statistic.Label>
                        </Statistic>
                      ) : null}

                      <Statistic className="App-statistic-margin">
                        <Statistic.Value>{commitsCount}</Statistic.Value>
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
                        STEP 1 of 6 : Getting branches info -
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
                        STEP 2 of 6 : Fetching branch metadata -
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
                        STEP 3 of 6 : Fetching all commits -
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
                        STEP 4 of 6 : Fetching commit details -
                        {remainingCommits > 1 ? " about" : " less than"}{" "}
                        {remainingCommits} minute/s remaining
                      </Progress>
                    ) : null}

                    {commentsCurrent > 0 && commentsCurrent < commentsTotal ? (
                      <Progress
                        value={commentsCurrent}
                        total={commentsTotal}
                        indicating
                        autoSuccess
                        progress="ratio"
                      >
                        STEP 5 of 6 : Fetching comments -
                        {remainingComments > 1 ? " about" : " less than"}{" "}
                        {remainingComments} minute/s remaining
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
                      4: "Last 365 days"
                    }}
                    max={4}
                    step={null}
                    onAfterChange={value => {
                      if (value != this.props.Ui.periodFrom.id)
                        this.props.actions.changePeriod(value);
                    }}
                    defaultValue={
                      this.props.Ui.periodFrom ? this.props.Ui.periodFrom.id : 1
                    }
                  />
                </Grid.Column>

                <Grid.Column
                  style={{ paddingLeft: "50px", paddingRight: "50px" }}
                >
                  {this.props.Ui.messages && this.props.Ui.messages.new[0] ? (
                    <Message
                      onDismiss={() =>
                        this.dismissMessage(this.props.Ui.messages.new[0].type)
                      }
                      color={this.props.Ui.messages.new[0].color}
                      icon={this.props.Ui.messages.new[0].icon}
                      header={this.props.Ui.messages.new[0].header}
                      content={this.props.Ui.messages.new[0].content}
                      size="tiny"
                    />
                  ) : null}
                </Grid.Column>

                <Divider />
              </Grid.Row>
            </Grid>
            <Grid columns={6} divided padded>
              <Grid.Row>
                <Grid.Column className="App-usercol">
                  <h1
                    className="App-usersection-header"
                    onClick={() => this.handleGraphChange("commits")}
                  >
                    Commits
                  </h1>

                  {!this.props.Commits.data
                    ? this.renderLoader()
                    : this.renderUserList("commits")}
                </Grid.Column>
                <Grid.Column className="App-usercol">
                  <h1
                    className="App-usersection-header"
                    onClick={() => this.handleGraphChange("refactoring")}
                  >
                    Refactoring
                  </h1>

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
              </Grid.Row>
            </Grid>
            {commitsLineGraphData && !this.props.Progress.fetchingData ? (
              <Graph data={commitsLineGraphData} type="line" />
            ) : null}
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
        <MessagesModal
          messages={this.props.Ui.messages}
          open={this.state.messagesModalShown}
          onClose={this.closeMessagesModal}
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

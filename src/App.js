import React, { Component } from "react";
import "./App.css";
import { UserCard } from "./components/userCard/userCard";
import { UsersModal } from "./components/usersModal/usersModal";
import MessagesModal from "./components/messagesModal/messagesModal";
import ServerPicker from "./components/serverPicker/serverPicker";
import ProgressBarComponent from "./components/progressBar/progressBar";
import * as calculator from "./calculator";

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
  Button
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
      activeGraph: "commits"
    };
    this.startApp = this.startApp.bind(this);
    this.dismissMessage = this.dismissMessage.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.closeUsersModal = this.closeUsersModal.bind(this);
    this.closeMessagesModal = this.closeMessagesModal.bind(this);
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
    this.dismissMessage = this.dismissMessage.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.Server.token && !this.props.Server.token) {
      this.props.actions.fetchProjects();
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
    <Segment
      size="massive"
      style={{ height: "500px", border: "none", boxShadow: "none" }}
    >
      <Dimmer active inverted>
        <Loader>Refreshing</Loader>
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

      case "mergeRequests":
        list = calculator.mergeRequests(users);
        break;

      case "tests":
        list = calculator.failedTests(users, this.props.Commits.details);
        break;
    }

    return list;
  };

  dismissMessage = message => {
    this.props.actions.dismissMessage(message, this.props.Ui.messages);
  };

  render() {
    const detailsCurrent = this.props.Progress.commitsDetails.current;
    const detailsTotal = this.props.Progress.commitsDetails.total;
    const detailsTiming = this.props.Progress.commitsDetails.timing;

    const branchCommitsCurrent = this.props.Progress.branchesCommits.current;
    const branchCommitsTotal = this.props.Progress.branchesCommits.total;
    const branchCommitsTiming = this.props.Progress.branchesCommits.timing;

    const branchCommitsMetaCurrent = this.props.Progress.branchesCommitsMeta
      .current;
    const branchCommitsMetaTotal = this.props.Progress.branchesCommitsMeta
      .total;
    const branchCommitsMetaTiming = this.props.Progress.branchesCommitsMeta
      .timing;

    const branchCurrent = this.props.Progress.branches.current;
    const branchTotal = this.props.Progress.branches.total;
    const branchTiming = this.props.Progress.branches.timing;

    const commentsCurrent = this.props.Progress.comments.current;
    const commentsTotal = this.props.Progress.comments.total;
    const commentsTiming = this.props.Progress.comments.timing;

    const commentsMetaCurrent = this.props.Progress.commentsMeta.current;
    const commentsMetaTotal = this.props.Progress.commentsMeta.total;
    const commentsMetaTiming = this.props.Progress.commentsMeta.timing;

    const mergeRequestsCurrent = this.props.Progress.mergeRequests.current;
    const mergeRequestsTotal = this.props.Progress.mergeRequests.total;
    const mergeRequestsTiming = this.props.Progress.mergeRequests.timing;

    const mergeRequestsMetaCurrent = this.props.Progress.mergeRequestsMeta
      .current;
    const mergeRequestsMetaTotal = this.props.Progress.mergeRequestsMeta.total;
    const mergeRequestsMetaTiming = this.props.Progress.mergeRequestsMeta
      .timing;

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
          <h1 className="App-title">Gitstatist</h1>
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
                    <ProgressBarComponent
                      current={branchCurrent}
                      total={branchTotal}
                      timing={branchTiming}
                      type="ratio"
                      title="STEP 1 of 8 : Getting branches info"
                    />

                    <ProgressBarComponent
                      current={branchCommitsMetaCurrent}
                      total={branchCommitsMetaTotal}
                      timing={branchCommitsMetaTiming}
                      type="ratio"
                      title="STEP 2 of 8 : Fetching branch metadata"
                    />

                    <ProgressBarComponent
                      current={branchCommitsCurrent}
                      total={branchCommitsTotal}
                      timing={branchCommitsTiming}
                      type="ratio"
                      title="STEP 3 of 8 : Fetching all commits"
                    />

                    <ProgressBarComponent
                      current={detailsCurrent}
                      total={detailsTotal}
                      timing={detailsTiming}
                      type="ratio"
                      title="STEP 4 of 8 : Fetching commit details"
                    />

                    <ProgressBarComponent
                      current={commentsMetaCurrent}
                      total={commentsMetaTotal}
                      timing={commentsMetaTiming}
                      type="ratio"
                      title="STEP 5 of 8 : Fetching comments metadata"
                    />

                    <ProgressBarComponent
                      current={commentsCurrent}
                      total={commentsTotal}
                      timing={commentsTiming}
                      type="ratio"
                      title="STEP 6 of 8 : Fetching comments"
                    />
                    <ProgressBarComponent
                      current={mergeRequestsMetaCurrent}
                      total={mergeRequestsMetaTotal}
                      timing={mergeRequestsMetaTiming}
                      type="ratio"
                      title="STEP 7 of 8 : Fetching merge requests meta"
                    />
                    <ProgressBarComponent
                      current={mergeRequestsCurrent}
                      total={mergeRequestsTotal}
                      timing={mergeRequestsTiming}
                      type="ratio"
                      title="STEP 8 of 8 : Fetching merge requests"
                    />
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
                    style={{
                      color:
                        this.state.activeGraph == "commits" ? "#96dbfa" : ""
                    }}
                    onClick={() =>
                      this.setState({
                        activeGraph: "commits"
                      })
                    }
                  >
                    Commits
                  </h1>

                  {this.props.Commits.loading
                    ? this.renderLoader()
                    : this.renderUserList("commits")}
                </Grid.Column>
                <Grid.Column className="App-usercol">
                  <h1
                    className="App-usersection-header"
                    style={{
                      color:
                        this.state.activeGraph == "refactoring" ? "#96dbfa" : ""
                    }}
                    onClick={() =>
                      this.setState({
                        activeGraph: "refactoring"
                      })
                    }
                  >
                    Refactoring
                  </h1>

                  {detailsCurrent > 0 && detailsCurrent < detailsTotal
                    ? this.renderLoader()
                    : this.renderUserList("refactoring")}
                </Grid.Column>
                <Grid.Column className="App-usercol">
                  <h1
                    className="App-usersection-header"
                    style={{
                      color:
                        this.state.activeGraph == "newCode" ? "#96dbfa" : ""
                    }}
                    onClick={() =>
                      this.setState({
                        activeGraph: "newCode"
                      })
                    }
                  >
                    New code
                  </h1>
                  {detailsCurrent > 0 && detailsCurrent < detailsTotal
                    ? this.renderLoader()
                    : this.renderUserList("newCode")}
                </Grid.Column>
                <Grid.Column>
                  <h1
                    className="App-usersection-header"
                    style={{
                      color: this.state.activeGraph == "tests" ? "#96dbfa" : ""
                    }}
                    onClick={() =>
                      this.setState({
                        activeGraph: "tests"
                      })
                    }
                  >
                    Failed tests
                  </h1>
                  {detailsCurrent > 0 && detailsCurrent < detailsTotal
                    ? this.renderLoader()
                    : this.renderUserList("tests")}
                </Grid.Column>
                <Grid.Column>
                  <h1
                    className="App-usersection-header"
                    style={{
                      color:
                        this.state.activeGraph == "comments" ? "#96dbfa" : ""
                    }}
                    onClick={() =>
                      this.setState({
                        activeGraph: "comments"
                      })
                    }
                  >
                    Commit comments
                  </h1>
                  {this.props.Comments.loading
                    ? this.renderLoader()
                    : this.renderUserList("comments")}
                </Grid.Column>
                <Grid.Column>
                  <h1
                    className="App-usersection-header"
                    style={{
                      color:
                        this.state.activeGraph == "mergeRequests"
                          ? "#96dbfa"
                          : ""
                    }}
                    onClick={() =>
                      this.setState({
                        activeGraph: "mergeRequests"
                      })
                    }
                  >
                    Merge requests
                  </h1>
                  {this.props.MergeRequests.loading
                    ? this.renderLoader()
                    : this.renderUserList("mergeRequests")}
                </Grid.Column>
              </Grid.Row>
            </Grid>
            {!this.props.Progress.fetchingData ? (
              <Graph active={this.state.activeGraph} {...this.props} />
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
    ...state
  };
}

function mapDispatchToProps(dispatch, props) {
  const mix = Object.assign(userActions, projectActions, uiActions);
  return {
    actions: bindActionCreators(mix, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

import React, { Component } from "react";
import "./App.css";
import { UserCard } from "./userCard/userCard";
import ServerPicker from "./serverPicker/serverPicker";
import { Grid, Divider } from "semantic-ui-react";
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

const chartOptions = {};

class App extends Component {
  constructor(props) {
    super(props);
    this.startApp = this.startApp.bind(this);
  }

  startApp = (url, token, provider) => {
    this.props.actions.fetchUsers(url, token, provider);
  };

  renderUserList = type => {
    const list = this.props.Users.data.map((user, index) => (
      <UserCard
        key={user.id}
        order={index + 1}
        name={user.name}
        number={faker.random.number({ min: 10, max: 500 })}
        image={user.image}
        description="This is just a description"
      />
    ));

    return list;
  };

  render() {
    return (
      <div>
        <header className="App-header" style={{ marginBottom: 40 }}>
          <h1 className="App-title">Gitstatista</h1>
        </header>
        {this.props.Users.data ? (
          <div>
            <div style={{ width: 600, margin: "auto", marginBottom: 50 }}>
              <Slider
                handle={handle}
                min={0}
                marks={{
                  0: "Today",
                  25: "This week",
                  50: "This month",
                  75: "This quarter",
                  100: "This year"
                }}
                max={100}
                step={25}
                onChange={() => this.props.actions.fetchUsers()}
                defaultValue={20}
              />
            </div>
            <Divider />
            <Grid columns={7} divided padded>
              <Grid.Row>
                <Grid.Column className="App-usercol">
                  <h1 className="App-usersection-header">Commits</h1>
                  {this.renderUserList("commits")}
                </Grid.Column>
                <Grid.Column className="App-usercol">
                  <h1 className="App-usersection-header">Refactoring</h1>
                  {this.renderUserList("refactoring")}
                </Grid.Column>
                <Grid.Column className="App-usercol">
                  <h1 className="App-usersection-header">New code</h1>
                  {this.renderUserList("newCode")}
                </Grid.Column>
                <Grid.Column>
                  <h1 className="App-usersection-header">Commit comments</h1>
                  {this.renderUserList("comments")}
                </Grid.Column>
                <Grid.Column>
                  <h1 className="App-usersection-header">Merge requests</h1>
                  {this.renderUserList("mergeRequests")}
                </Grid.Column>
                <Grid.Column>
                  <h1 className="App-usersection-header">Failed tests</h1>
                  {this.renderUserList("tests")}
                </Grid.Column>
                <Grid.Column>
                  <h1 className="App-usersection-header">Total productivity</h1>
                  {this.renderUserList("productivity")}
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
      </div>
    );
  }
}

const userActions = {
  fetchUsers: function(url, token, provider) {
    return { type: "FETCH_USERS", url, token, provider };
  }
};

function mapStateToProps(state, ownProps) {
  return {
    Users: state.Users,
    Server: state.Server
  };
}

function mapDispatchToProps(dispatch, props) {
  return {
    actions: bindActionCreators(userActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

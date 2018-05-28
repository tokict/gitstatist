import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {
  Icon,
  Modal,
  Button,
  Header,
  Image,
  Grid,
  List,
  Label
} from "semantic-ui-react";
import SearchComponent from "../search/search";
import commitsSaga from "../../sagas/commits";

const userResultRenderer = user => <span key={user.id}>{user.name}</span>;
userResultRenderer.propTypes = {
  name: PropTypes.string
};

export class UsersModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUnknownUser: null
    };
    this.unknownUserMatched = this.unknownUserMatched.bind(this);
    this.handleUnmatchUnknownUser = this.handleUnmatchUnknownUser.bind(this);
  }

  handleUnmatchUnknownUser = (userId, alias) => {
    console.log(userId, alias);

    const users = this.props.users.data;
    users[userId].aliases.splice(users[userId].aliases.indexOf(alias), 1);
    this.props.users.unknown.push(alias);
    this.setState({ selectedUnknownUser: null });
    this.props.updateUsers(users);
  };

  unknownUserMatched = result => {
    const users = this.props.users.data;
    Object.entries(users).forEach(user => {
      if (result === user[1].name) {
        if (!user[1].aliases.includes(this.state.selectedUnknownUser)) {
          user[1].aliases.push(this.state.selectedUnknownUser);
        }
      }
    });

    this.props.users.unknown.forEach((user, index) => {
      if (user == this.state.selectedUnknownUser) {
        this.props.users.unknown.splice(
          this.props.users.unknown.indexOf(user),
          1
        );
      }
    });

    console.log(users, this.props.users.unknown);
    this.props.updateUsers(users);
    this.setState({ selectedUnknownUser: null });
  };

  renderUnknownUsers(data) {
    if (!data) return null;
    return (
      <List>
        {data.map(usr => {
          if (usr)
            return (
              <List.Item
                style={{
                  cursor: "pointer",
                  width: "130px",
                  padding: "5px",
                  backgroundColor:
                    this.state.selectedUnknownUser == usr
                      ? "rgba(0,0,0, 0.3)"
                      : "transparent"
                }}
                onClick={() => this.setState({ selectedUnknownUser: usr })}
                key={usr}
              >
                {usr}
              </List.Item>
            );
        })}
      </List>
    );
  }

  renderUserAliases() {
    if (!this.props.users.data) return null;
    const ret = [];

    {
      Object.entries(this.props.users.data).forEach(usr => {
        usr[1].aliases.forEach(alias => {
          ret.push(
            <List.Item key={alias}>
              <div>
                <Label>
                  {alias} is {usr[1].name}
                  <Icon
                    name="delete"
                    onClick={() => this.handleUnmatchUnknownUser(usr[0], alias)}
                  />
                </Label>
              </div>
            </List.Item>
          );
        });
      });
    }
    return <List>{ret}</List>;
  }

  render = () => (
    <Modal
      open={this.props.open}
      size={"large"}
      closeOnDimmerClick={true}
      closeIcon={true}
      onClose={() => this.props.onClose()}
      style={{
        marginTop: "50px",
        marginLeft: "auto",
        marginRight: "auto",
        height: "700px"
      }}
    >
      <Modal.Header>Users</Modal.Header>
      <Modal.Content
        scrolling
        style={{
          height: "600px"
        }}
      >
        <Modal.Description>
          <Header>
            <Icon name="question" size="tiny" />Unknown users
          </Header>
          <p>
            This is a list of user we found in commits for whom we could not
            find the appropriate user in users list. This can happen easily as
            users can change their names in commits. You can link the old names
            with new ones in the section below
          </p>
          <Grid columns={3} padded centered>
            <Grid.Row>
              <Grid.Column width={4}>
                <h5>Unknown users</h5>
                {this.renderUnknownUsers(this.props.users.unknown)}
              </Grid.Column>
              <Grid.Column>
                <div style={{ textAlign: "center", alignItems: "center" }}>
                  {this.state.selectedUnknownUser ? (
                    <div style={{ height: "100px" }}>
                      <h5>{this.state.selectedUnknownUser}</h5>
                      <br />
                      <span>is</span>
                      <br />
                      <br />
                      <SearchComponent
                        onSelect={this.unknownUserMatched}
                        searchkey={"name"}
                        resultRenderer={userResultRenderer}
                        data={this.props.users.data}
                      />
                    </div>
                  ) : (
                    <span>
                      <br />
                      <Icon name="exclamation" /> Click a unknown user to assign
                      it to existing user
                    </span>
                  )}
                </div>
              </Grid.Column>

              <Grid.Column>
                <h5>Matched unknown users</h5>
                {this.renderUserAliases()}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}

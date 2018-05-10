import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Icon, Modal, Button, Header, Image, Grid } from "semantic-ui-react";
import SearchComponent from "../search/search";

const userResultRenderer = user => <span key={user.id}>{user.name}</span>;
userResultRenderer.propTypes = {
  name: PropTypes.string
};

export class UsersModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.unknownUserMatched = this.unknownUserMatched.bind(this);
  }

  unknownUserMatched = result => {
    console.log(result);
  };

  render = () => (
    <Modal
      open={this.props.open}
      size={"large"}
      closeOnDimmerClick={true}
      closeIcon={true}
      onClose={() => this.props.onClose()}
      style={{ margin: "auto", marginTop: "300px" }}
    >
      <Modal.Header>Users</Modal.Header>
      <Modal.Content scrolling>
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
              <Grid.Column>
                <span>User 1</span>
              </Grid.Column>
              <Grid.Column>
                <SearchComponent
                  onSelect={this.unknownUserMatched}
                  searchkey={"name"}
                  resultRenderer={userResultRenderer}
                  data={this.props.users}
                />
              </Grid.Column>

              <Grid.Column>
                <span>User 1</span>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Header>
            <Icon name="user close" size="tiny" />Ignored users
          </Header>
          <p>
            These are usually the users that are not developers but users for
            system services etc...
          </p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button primary>
          Proceed <Icon name="right chevron" />
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

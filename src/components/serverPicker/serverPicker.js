import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./styles.css";
import { Input, Button, Icon, Message, Dropdown } from "semantic-ui-react";
class ServerPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      providerName: props.provider
    };

    this.handleButtonPress = this.handleButtonPress.bind(this);
    this.handleProviderChange = this.handleProviderChange.bind(this);
  }

  handleProviderChange(e, { name, value }) {
    this.setState({ providerName: value });
  }

  handleButtonPress() {
    const url = this.refs.gitUrl.inputRef.value;
    const token = this.refs.gitToken.inputRef.value;

    if (!this.isUrlValid(url) || url == "undefined" || url == "") {
      this.setState({ errors: "Url format is not recognized" });
      return;
    }

    if (token == "undefined" || token == "") {
      this.setState({ errors: "Missing token" });
      return;
    }

    if (!this.state.providerName) {
      this.setState({ errors: "Provider not selected" });
      return;
    }

    this.props.startApp(url, token, this.state.providerName);
  }

  isUrlValid(userInput) {
    var res = userInput.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    if (res == null) return false;
    else return true;
  }

  render() {
    return (
      <div className="container">
        <Input
          ref="gitUrl"
          placeholder="Git url"
          iconPosition="left"
          defaultValue={this.props.url}
          size="massive"
          fluid
          className="url"
        />
        <Input
          ref="gitToken"
          placeholder="Git token"
          iconPosition="left"
          size="massive"
          defaultValue={this.props.token}
          type="password"
          fluid
          className="token"
        />
        <Dropdown
          placeholder="Select provider"
          icon="server"
          floating
          selection
          labeled
          button
          defaultValue={this.props.provider}
          className="icon"
          onChange={this.handleProviderChange}
          options={[
            {
              text: "Gitlab",
              value: "gitlab",
              image: { src: "/images/gitlab-logo-small.png" }
            },
            {
              text: "Bitbucket",
              value: "bitbucket",
              image: { src: "/images/bitbucket-logo-small.png" }
            },
            {
              text: "Github",
              value: "github",
              image: { src: "/images/github-logo-small.png", width: 30 }
            }
          ]}
        />
        <Button
          onClick={this.handleButtonPress}
          icon
          loading={this.props.loading}
          labelPosition="right"
          className="nextButton"
          size="massive"
          floated="right"
          positive
        >
          Next
          <Icon name="right arrow" />
        </Button>

        {this.state.errors.length ? (
          <Message
            style={{ marginTop: "150px" }}
            error
            header="There were some errors with your entries"
            list={[this.state.errors]}
          />
        ) : null}
      </div>
    );
  }
}

ServerPicker.propTypes = {
  startApp: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  url: PropTypes.string,
  token: PropTypes.string
};

export default ServerPicker;

import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import ApiAdapter from "../../adapters/adapter";
import styles from "./styles.css";
import {
  Input,
  Button,
  Icon,
  Message,
  Dropdown,
  Grid,
  Header,
  Search
} from "semantic-ui-react";

const resultRenderer = ({ title, id, owner, avatar, customkey }) => {
  return (
    <div key={title + owner}>
      <span className="projectTitle">{title}</span>
      <br />
      <span className="ownerName">{owner ? "by " + owner : null}</span>
    </div>
  );
};

class ServerPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      searchIsLoading: false,
      searchValue: "",
      results: null,
      selectedProjects: [],
      providerName: props.provider
    };

    this.handleButtonPress = this.handleButtonPress.bind(this);
    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.handleProviderChange = this.handleProviderChange.bind(this);
    this.handleSearchChange = _.throttle(this.handleSearchChange, 2000, {
      leading: true
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.Projects && nextProps.Projects.searchProjectResults) {
      this.setState({ searchProjectResults: nextProps.searchProjectResults });
    }
  }

  handleProviderChange(e, { name, value }) {
    this.setState({ providerName: value });
  }

  componentDidMount() {
    //This is a hack because onChange does not fire when browser prefills inputs
    this._listener = setInterval(() => {
      if (
        !this.refs.gitUrl.inputRef ||
        this.refs.gitUrl.inputRef.value === "" ||
        this._previousValue === this.refs.gitUrl.inputRef.value
      ) {
        return;
      }

      this._previousValue = this.refs.gitUrl.inputRef.value;

      this.handleUrlChange(null, { name: null, value: this._previousValue });
    }, 300);
  }

  componentWillUnmount() {
    clearInterval(this._listener);
  }

  handleUrlChange(e, { name, value }) {
    if (value.search("gitlab.com") !== -1) {
      this.handleProviderChange(null, { name: null, value: "gitlab" });
    }
    if (value.search("github.com") !== -1) {
      this.handleProviderChange(null, { name: null, value: "github" });
    }
    if (value.search("bitbucket.com") !== -1) {
      this.handleProviderChange(null, { name: null, value: "bitbucket" });
    }
  }

  checkServerDetails() {
    if (!this.refs.gitUrl || !this.refs) return false;
    const url = this.refs.gitUrl.inputRef.value;
    const token = this.refs.gitToken.inputRef.value;
    const username = this.refs.gitUsername
      ? this.refs.gitUsername.inputRef.value
      : null;

    if (!this.isUrlValid(url) || url == "undefined" || url == "") {
      return false;
    }

    if (token == "undefined" || token == "") {
      return false;
    }

    if (!this.state.providerName) {
      return false;
    }

    if (this.state.providerName == "github" && username == "") {
      return false;
    }

    return true;
  }

  isServerPublic(url) {
    return (
      url.search("gitlab.com") !== -1 ||
      url.search("github.com") !== -1 ||
      url.search("bitbucket.com") !== -1
    );
  }

  checkProjects() {
    let value = this.refs.gitUrl ? this.refs.gitUrl.inputRef.value : null;
    if (!value) return false;

    if (
      (value.search("gitlab.com") !== -1 ||
        value.search("github.com") !== -1 ||
        value.search("bitbucket.com") !== -1 ||
        this.state.providerName == "github") &&
      !this.state.selectedProjects.length
    ) {
      return false;
    }
    return true;
  }
  handleButtonPress() {
    const url = this.refs.gitUrl.inputRef.value;
    const token = this.refs.gitToken.inputRef.value;
    const username = this.refs.gitUsername
      ? this.refs.gitUsername.inputRef.value
      : null;
    const provider = this.refs.providerPicker.props.value;

    if (!this.isUrlValid(url) || url == "undefined" || url == "") {
      this.setState({ errors: "Url format is not recognized" });
      return;
    }

    if (token == "undefined" || token == "") {
      this.setState({ errors: "Missing token" });
      return;
    }

    if (this.state.providerName == "github" && username == "") {
      this.setState({ errors: "Missing username" });
      return;
    }

    if (!provider && !this.state.providerName) {
      this.setState({ errors: "Provider not selected" });
      return;
    }

    if (this.isServerPublic(url) && !this.state.selectedProjects.length) {
      this.setState({
        errors:
          "For a cloud provider, projects must be selected. It is not possible to query all repos"
      });
      return;
    }

    this.props.startApp(
      url,
      token,
      provider,
      username,
      this.state.selectedProjects
    );
  }

  isUrlValid(userInput) {
    var res = userInput.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    if (res == null) return false;
    else return true;
  }
  resetSearch = () =>
    this.setState({
      searchIsLoading: false,
      searchProjectResults: [],
      searchValue: ""
    });

  handleResultSelect = (e, { result }) => {
    let exists = false;
    let p = this.state.selectedProjects;

    for (let project in p) {
      if (p[project].id == result.id) exists = true;
    }

    if (!exists) {
      p.push(result);

      this.setState({ selectedProjects: p });
      this.resetSearch();
    }
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ searchIsLoading: true, searchValue: value });
    if (this.state.searchValue.length < 1) return this.resetSearch();

    const Api = ApiAdapter({
      provider: this.state.providerName,
      url: this.refs.gitUrl.inputRef.value,
      token: this.refs.gitToken.inputRef.value,
      username: this.refs.gitUsername.inputRef.value
    });

    let projects = Api.searchProjects(value);

    var data;
    projects.then(res => {
      if (res.status == 200) {
        let d = !res.data.items ? res.data : res.data.items;
        let parsed = d.map((item, i) => {
          const owner = item.owner.name ? item.owner.name : item.owner.login;
          let title = item.name ? item.name : item.path_with_namespace;
          title = title;

          return {
            id: item.id,
            title: title,
            customkey: item.id + title,
            owner: owner,

            avatar: item.owner.avatar_url
              ? item.owner.avatar_url
              : item.avatar_url
          };
        });
        this.setState({
          searchIsLoading: false,
          results: parsed
        });
      }
    });
  };

  render() {
    const { searchValue, results, selectedProjects } = this.state;
    return (
      <Grid columns={3} padded>
        <Grid.Row>
          <Grid.Column />
          <Grid.Column>
            <Header as="h3" icon textAlign="center">
              <Icon
                name="server"
                circular
                color={this.checkServerDetails() ? "green" : null}
              />
              <Header.Content>Server info</Header.Content>
            </Header>
            <br />
            <br />
            <div className="container">
              <form name="serverPickerForm">
                <Input
                  ref="gitUrl"
                  placeholder="Git url"
                  iconPosition="left"
                  defaultValue={this.props.url}
                  onChange={this.handleUrlChange}
                  size="massive"
                  fluid
                  className="url"
                />
                {this.state.providerName == "github" ? (
                  <Input
                    ref="gitUsername"
                    placeholder="Git username"
                    onChange={() => this.forceUpdate()}
                    iconPosition="left"
                    size="massive"
                    defaultValue={this.props.username}
                    fluid
                    className="username"
                  />
                ) : null}
                <Input
                  ref="gitToken"
                  placeholder="Git token"
                  iconPosition="left"
                  size="massive"
                  onChange={() => this.forceUpdate()}
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
                  ref="providerPicker"
                  button
                  value={this.state.providerName}
                  className="icon"
                  onChange={this.handleProviderChange}
                  options={[
                    {
                      text: "Gitlab",
                      value: "gitlab",
                      image: { src: "/images/gitlab-logo-small.png" }
                    },
                    // {
                    //   text: "Bitbucket",
                    //   value: "bitbucket",
                    //   image: { src: "/images/bitbucket-logo-small.png" }
                    // },
                    {
                      text: "Github",
                      value: "github",
                      image: { src: "/images/github-logo-small.png", width: 30 }
                    }
                  ]}
                />
                <Button
                  onClick={this.handleButtonPress}
                  type="button"
                  icon
                  loading={this.props.loading}
                  labelPosition="right"
                  className="nextButton"
                  size="massive"
                  floated="right"
                  disabled={!this.checkServerDetails() && this.checkProjects()}
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
              </form>
            </div>
          </Grid.Column>
          <Grid.Column>
            <Header as="h3" icon textAlign="center">
              <Icon
                name="list ul"
                circular
                color={
                  this.checkServerDetails() && this.checkProjects()
                    ? "green"
                    : null
                }
              />
              <Header.Content>Projects</Header.Content>
            </Header>
            <br />
            <br />
            <div style={{ width: "300px", margin: "auto" }}>
              <Search
                disabled={!this.checkServerDetails()}
                fluid
                size="huge"
                loading={this.state.searchIsLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={this.handleSearchChange}
                resultRenderer={resultRenderer}
                results={results}
                placeholder="Limit to projects"
              />
            </div>
            <Grid columns={1}>
              <Grid.Row>
                <Grid.Column>
                  {selectedProjects.length
                    ? selectedProjects.map(project => (
                        <div
                          key={project.title + project.owner}
                          style={{ marginLeft: "200px", marginTop: "50px" }}
                        >
                          {resultRenderer(project)}
                        </div>
                      ))
                    : null}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

ServerPicker.propTypes = {
  startApp: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  url: PropTypes.string,
  username: PropTypes.string,
  token: PropTypes.string
};

export default ServerPicker;

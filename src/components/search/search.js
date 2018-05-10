import _ from "lodash";
import React, { Component } from "react";
import { Search, Grid, Header } from "semantic-ui-react";

export default class SearchComponent extends Component {
  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () =>
    this.setState({ isLoading: false, results: [], value: "" });

  handleResultSelect = (e, { result }) => {
    this.props.onSelect(result[this.props.searchkey]);
    this.setState({ value: "" });
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(_.escapeRegExp(this.state.value), "i");

      const isMatch = result => re.test(result[this.props.searchkey]);

      const results = _.filter(this.props.data, isMatch);

      results.forEach(item => {
        item.title = item.name;
      });
      console.log(results);

      this.setState({
        isLoading: false,
        results: results
      });
    }, 300);
  };

  render() {
    const { isLoading, value, results } = this.state;
    return (
      <Grid>
        <Grid.Column width={8}>
          <Search
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true
            })}
            results={results}
            value={value}
            resultRenderer={this.props.resultRenderer}
          />
        </Grid.Column>
      </Grid>
    );
  }
}

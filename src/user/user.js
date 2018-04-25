import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.css";
import { Item, Header } from "semantic-ui-react";

function User(props) {
  return (
    <Item>
      <Item.Header>{props.name}</Item.Header>
      <Item.Content>{props.number}</Item.Content>
      <Item.Extra>{props.description}</Item.Extra>
    </Item>
  );
}

User.PropTypes = {
  name: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired
};

export default User;

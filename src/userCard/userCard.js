import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.css";
import { Item } from "semantic-ui-react";

export const UserCard = props => (
  <Item.Group>
    <Item>
      <Item.Image
        size="tiny"
        src={props.image || "/images/default-user-icon.png"}
        className={"userImage"}
      />
      <Item.Content>
        <Item.Header style={{ fontSize: "1.1em" }}>
          <span style={{ color: "gray", fontSize: 16 }}>#{props.order}</span>{" "}
          {props.name}
        </Item.Header>
        <Item.Meta>{props.number}</Item.Meta>
        <Item.Description>{props.description}</Item.Description>
      </Item.Content>
    </Item>
  </Item.Group>
);

UserCard.propTypes = {
  order: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired
};

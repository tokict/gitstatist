import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Icon, Modal, Button, Message, Header } from "semantic-ui-react";

const MessagesModal = props => {
  const messages = props.messages
    ? [...props.messages.new, ...props.messages.read]
    : [];
  return (
    <Modal
      open={props.open}
      size={"large"}
      closeOnDimmerClick={true}
      closeIcon={true}
      onClose={() => props.onClose()}
      style={{
        marginTop: "50px",
        marginLeft: "auto",
        marginRight: "auto",
        minHeight: "700px"
      }}
    >
      <Modal.Header>Messages</Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <Header>
            <Icon name="question" size="tiny" />App messages
          </Header>
          <p>This is a list of messages from the app you have received</p>
          {messages.map((message, index) => (
            <Message
              key={index + ""}
              onDismiss={() => props.onDismiss(message)}
              color={message.color}
              icon={message.icon}
              header={message.header}
              content={message.content}
              size="tiny"
            />
          ))}
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

export default MessagesModal;

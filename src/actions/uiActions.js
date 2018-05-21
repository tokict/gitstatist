const uiActions = {
  dismissMessage: function(message, messages) {
    if (messages.new.includes(message)) {
      messages.read.push(message);

      messages.new.splice(messages.new.indexOf(message), 1);
    }
    return { type: "UPDATE_MESSAGES", messages: messages };
  },
  showMessage: function(message, messages) {
    if (!messages.new.includes(message)) {
      messages.new.push(message);

      messages.read.splice(messages.read.indexOf(message), 1);
    }
    return { type: "UPDATE_MESSAGES", messages: messages };
  },
  changePeriod: function(id) {
    return { type: "UPDATE_PERIOD", id };
  }
};
export default uiActions;

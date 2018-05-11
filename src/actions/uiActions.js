const uiActions = {
  dismissMessage: function(message, messages) {
    console.log(messages);
    if (messages.new.includes(message)) {
      messages.read.push(message);

      messages.new.splice(messages.new.indexOf(message), 1);
    }
    return { type: "UPDATE_MESSAGES", messages: messages };
  },
  showMessage: function(message, messages) {
    console.log();
    if (!messages.new.includes(message)) {
      messages.new.push(message);

      messages.read.splice(messages.read.indexOf(message), 1);
    }
    return { type: "UPDATE_MESSAGES", messages: messages };
  }
};
export default uiActions;

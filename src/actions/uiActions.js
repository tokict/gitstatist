const uiActions = {
  dismissMessage: function(type) {
    return { type: "DISMISS_MESSAGE", messageType: type };
  },
  logoutUser: function(type) {
    return { type: "USER_LOGOUT" };
  },

  changePeriod: function(id) {
    return { type: "UPDATE_PERIOD", id };
  }
};
export default uiActions;

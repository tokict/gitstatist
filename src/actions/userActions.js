const userActions = {
  fetchUsers: function(url, token, provider, projects) {
    return { type: "FETCH_USERS", url, token, provider, projects };
  },
  updateUsers: function(users) {
    return { type: "USERS_UPDATED", users: users };
  },
  updateUnknownUsers: function(users) {
    return { type: "UNKNOWN_USERS_UPDATED", unknown: users };
  }
};
export default userActions;

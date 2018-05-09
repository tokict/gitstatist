export const initialState = {
  Users: {
    data: null,
    unknown: null,
    loading: false
  },
  Server: {
    url: null,
    token: null,
    provider: null
  },
  Projects: {
    data: null,
    loading: false
  },
  Commits: {
    data: null,
    loading: false
  },
  Ui: {
    messages: {
      new: [],
      read: []
    }
  }
};

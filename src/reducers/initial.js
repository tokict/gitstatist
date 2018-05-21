import moment from "moment";
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
    details: null,
    loading: false,
    earliestDateFetched: null
  },
  Ui: {
    messages: {
      new: [],
      read: []
    },
    periodFrom: { id: null, date: new moment() }
  },
  Progress: {
    commitsDetails: { current: 0, total: 0, timing: 0 },
    branchesCommits: { current: 0, total: 0, timing: 0 },
    branchesCommitsMeta: { current: 0, total: 0, timing: 0 },
    branches: { current: 0, total: 0, timing: 0 }
  }
};

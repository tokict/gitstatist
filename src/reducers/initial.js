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
  Comments: {
    data: null,
    earliestDateFetched: null,
    loading: false
  },
  MergeRequests: {
    data: null,
    earliestDateFetched: null,
    loading: false
  },
  Ui: {
    messages: {
      new: [],
      read: []
    },
    periodFrom: { id: 1, date: new moment().subtract(7, "d") }
  },
  Progress: {
    commitsDetails: { current: 0, total: 0, timing: 0 },
    branchesCommits: { current: 0, total: 0, timing: 0 },
    branchesCommitsMeta: { current: 0, total: 0, timing: 0 },
    branches: { current: 0, total: 0, timing: 0 },
    comments: { current: 0, total: 0, timing: 0 },
    fetchingData: false
  }
};

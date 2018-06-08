import { put } from "redux-saga/effects";
import { expectSaga } from "redux-saga-test-plan";
import * as matchers from "redux-saga-test-plan/matchers";
import { throwError } from "redux-saga-test-plan/providers";

import Projects from "../sagas/projects";
import Commits from "../sagas/commits";
import createTestObject from "../graphTestDataCreator";
import moment from "moment";
const one = new moment().subtract(1, "h");
const two = new moment().subtract(2, "h");
const data = createTestObject(one, two);
expectSaga.DEFAULT_TIMEOUT = 2000;
it("fetches the projects", () => {
  let ProjectsSagas = new Projects();

  return expectSaga(ProjectsSagas.fetchProjects)
    .withState(fakeState)
    .put({
      type: "PROJECTS_UPDATED",
      projects: {
        "1": {
          name: "calculator",
          id: 1,
          image: null,
          path: "test/calculator",
          commitCount: 1,
          branches: [],
          branchCommitNr: {}
        },
        "2": {
          name: "bg",
          id: 2,
          image:
            "http://gitlab.com/uploads/-/system/project/avatar/55/bg_flag.jpg",
          path: "test",
          commitCount: 2691,
          branches: [],
          branchCommitNr: {}
        }
      },
      loading: false
    })
    .run();
});

it("fetches the commits", () => {
  let CommitsSagas = new Commits();

  return expectSaga(CommitsSagas.fetchCommits)
    .withState(fakeState)
    .run()
    .then(result => {
      expect(result.returnValue[1][0]).toEqual({
        author: "test user1",
        created_at: "2018-06-07T15:26:32.000+03:00",
        committer: "test user1",
        committed_at: "2018-06-07T15:26:32.000+03:00",
        id: "dcab708c589af522c674d34876681c33fd8c3870",
        title: "Merging Local",
        branch: "dev"
      });
    });
});

const fakeState = {
  Users: {
    data: data.users,
    unknown: null,
    loading: false
  },
  Server: {
    url: "fake",
    token: "fake",
    provider: "gitlab"
  },
  Projects: {
    data: data.projects,
    loading: false
  },
  Commits: {
    data: data.commits.data,
    details: data.details,
    loading: false,
    earliestDateFetched: new moment().startOf("day")
  },
  Comments: {
    data: data.comments,
    earliestDateFetched: new moment().startOf("day"),
    loading: false
  },
  MergeRequests: {
    data: data.mergeRequests,
    loading: false
  },
  Ui: {
    messages: {
      new: [],
      read: []
    },
    periodFrom: { id: 0, date: new moment().startOf("day") }
  },
  Progress: {
    commitsDetails: { current: 0, total: 0, timing: 0 },
    branchesCommits: { current: 0, total: 0, timing: 0 },
    branchesCommitsMeta: { current: 0, total: 0, timing: 0 },
    branches: { current: 0, total: 0, timing: 0 },
    comments: { current: 0, total: 0, timing: 0 },
    commentsMeta: { current: 0, total: 0, timing: 0 },
    mergeRequests: { current: 0, total: 0, timing: 0 },
    mergeRequestsMeta: { current: 0, total: 0, timing: 0 },
    fetchingData: false
  }
};

import { put } from "redux-saga/effects";
import { expectSaga } from "redux-saga-test-plan";
import * as matchers from "redux-saga-test-plan/matchers";
import { throwError } from "redux-saga-test-plan/providers";

import Projects from "../sagas/projects";
import Commits from "../sagas/commits";
import Comments from "../sagas/comments";
import Users from "../sagas/users";
import Requests from "../sagas/mergeRequests";
import createTestObject from "../graphTestDataCreator";
import moment from "moment";
const one = new moment().subtract(1, "h");
const two = new moment().subtract(2, "h");
const data = createTestObject(one, two);
expectSaga.DEFAULT_TIMEOUT = 2000;
it("fetches projects", () => {
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

it("fetches commits", () => {
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

it("fetches comments", () => {
  let CommentsSagas = new Comments();

  return expectSaga(CommentsSagas.fetchComments)
    .withState(fakeState)
    .run()
    .then(result => {
      expect(result.returnValue[1][0]).toEqual({
        author: {
          avatar_url:
            "http://gitlab.com/uploads/-/system/user/avatar/30/avatar.png",
          id: 1,
          name: "test user1",
          state: "active",
          username: "ttokic",
          web_url: "http://gitlab.com/tokict"
        },
        branch: "dev",
        created_at: "2018-06-07T12:00:13.455Z",
        line: 20,
        line_type: "new",
        note: "fesafsefsg",
        path: "apps/admin/controllers/Controller.php",
        projectId: 4
      });
    });
});

it("fetches users", () => {
  let UsersSagas = new Users({
    url: "test",
    provider: "gitlab",
    token: "taefgedg"
  });

  return expectSaga(UsersSagas.fetchUsers)
    .run()
    .then(result => {
      expect(result.returnValue[0]).toEqual({
        avatar_url: null,
        id: 1,
        name: "test user1",
        state: "active",
        username: "test user1",
        web_url: "http://gitlab.com/test1"
      });
    });
});

it("fetches  merge requests", () => {
  let MergeRequestsSagas = new Requests();

  return expectSaga(MergeRequestsSagas.fetchMergeRequests)
    .withState(fakeState)
    .run()
    .then(result => {
      expect(result.returnValue[1][0]).toEqual({
        assignee: null,
        author: {
          avatar_url:
            "http://gitlab.com/uploads/-/system/user/avatar/30/avatar.png",
          id: 2,
          name: "test user2",
          state: "active",
          username: "ttokic",
          web_url: "http://gitlab.com/tokict"
        },
        created_at: "2018-03-23T12:38:40.524Z",
        description: "",
        discussion_locked: null,
        downvotes: 0,
        force_remove_source_branch: false,
        id: 12,
        iid: 2,
        labels: [],
        merge_commit_sha: "ac4d43e5a58985858f95ea0f9ab1b4e385d61174",
        merge_status: "can_be_merged",
        merge_when_pipeline_succeeds: false,
        milestone: null,
        project_id: 1,
        sha: "55ca660bd2b4d6022475eb78b40bb0a783d00c6a",
        should_remove_source_branch: null,
        source_branch: "dev",
        source_project_id: 54,
        state: "merged",
        target_branch: "master",
        target_project_id: 54,
        time_stats: {
          human_time_estimate: null,
          human_total_time_spent: null,
          time_estimate: 0,
          total_time_spent: 0
        },
        title: "Dev",
        updated_at: "2018-03-23T12:38:45.277Z",
        upvotes: 0,
        user_notes_count: 0,
        web_url: "http://gitlab.com/test/merge_requests/2",
        work_in_progress: false
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
    data: data.comments.data,
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

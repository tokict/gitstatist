import {
  put,
  takeLatest,
  all,
  call,
  select,
  takeEvery
} from "redux-saga/effects";
import { delay } from "redux-saga";
import ApiAdapter from "../adapters/adapter";
import _ from "lodash";
import moment from "moment";

const getToken = state => state.Server.token;
const getUrl = state => state.Server.url;
const getProvider = state => state.Server.provider;
const getProjects = state => state.Projects.data;
const getUsers = state => state.Users.data;
const getUnknown = state => state.Users.unknown;
const getCommits = state => state.Commits.data;
const getDetails = state => state.Commits.details;
const getEarliest = state => state.Commits.earliestDateFetched;
const getUi = state => state.Ui;
let currentBranchPage = 1;

export default class Commits {
  constructor() {
    this.stored = null;

    this.fetchCommits = this.fetchCommits.bind(this);
    this.getEarliestDateFetched = this.getEarliestDateFetched.bind(this);
    this.mapCommitsToUsers = this.mapCommitsToUsers.bind(this);
    this.remapUsersToCommits = this.remapUsersToCommits.bind(this);
    this.projectCommitsIterator = this.projectCommitsIterator.bind(this);
    this.fetchPagesNumber = this.fetchPagesNumber.bind(this);
    this.fetchProjectCommits = this.fetchProjectCommits.bind(this);
    this.iterateBranch = this.iterateBranch.bind(this);
    this.getCommitDetails = this.getCommitDetails.bind(this);
    this.fetchCommitDetails = this.fetchCommitDetails.bind(this);
    this.periodUpdated = this.periodUpdated.bind(this);
    this.updateBranchMetadata = this.updateBranchMetadata.bind(this);
  }

  *fetchCommits(params) {
    yield put({
      type: "UPDATE_PROGRESS",
      commitsDetails: { current: 0, total: 0, timing: 0 },
      branchesCommits: { current: 0, total: 0, timing: 0 },
      branchesCommitsMeta: { current: 0, total: 0, timing: 0 },
      branches: { current: 0, total: 0, timing: 0 },
      fetchingData: true
    });
    try {
      const provider = yield select(getProvider);
      const url = yield select(getUrl);
      const ui = yield select(getUi);
      const token = yield select(getToken);
      const users = yield select(getUsers);
      const earliest = yield select(getEarliest);
      let commits = yield select(getCommits);
      let commitDetails = yield select(getDetails);

      this.stored = {
        url,
        provider,
        token,
        ui,
        users,
        earliest,
        commits,
        commitDetails
      };

      const projects = yield select(getProjects);

      this.Api = ApiAdapter(this.stored);

      yield put({ type: "FETCHING_COMMITS" }); //foreach odi

      const pagesNumber = yield call(this.fetchPagesNumber, projects);

      const commitsData = yield call(
        this.projectCommitsIterator,
        projects,
        pagesNumber
      );

      const newCommits = this.Api.mapCommits(commitsData);

      //Map data to our format
      //Reset commits
      for (let userId in users) {
        users[userId].commits = [];
      }
      const map = yield this.mapCommitsToUsers(newCommits, users);

      const updatedUsers = map.users;

      //Merge new mapped commits to existing ones. If we are going back on slider, reset
      if (
        commits &&
        this.stored.earliest.isBefore(moment(this.stored.ui.periodFrom.date))
      ) {
        for (let projectId in map.commits) {
          if (commits[projectId]) {
            commits[projectId].concat(map.commits[projectId]);
          } else {
            commits[projectId] = map.commits[projectId];
          }
        }
      } else {
        commits = map.commits;
      }

      yield put({
        type: "USERS_UPDATED",
        users: updatedUsers,
        loading: false
      });

      if (!commitDetails) commitDetails = {};
      const newCommitDetails = yield this.getCommitDetails(map.commits);

      yield put({
        type: "UPDATE_PROGRESS",
        commitsDetails: {
          current: 0,
          total: Object.keys(newCommitDetails).length
        }
      });

      yield put({
        type: "COMMITS_FETCHED",
        commits: commits,
        details: newCommitDetails,
        earliestDateFetched: this.getEarliestDateFetched(commits),
        loading: false
      });
      yield put({
        type: "UPDATE_PROGRESS",
        fetchingData: false
      });
      yield put({
        type: "FETCH_COMMENTS"
      });
      return commits;
    } catch (error) {
      console.log(error);
      yield put({ type: "COMMITS_FETCHED", loading: false });
      yield put({
        type: "UPDATE_PROGRESS",
        fetchingData: false
      });
    }
  }

  getEarliestDateFetched(commits) {
    let earliest = new moment.unix();
    let formatted;

    for (let projectId in commits) {
      for (let commit in commits[projectId]) {
        let current = new Date(
          commits[projectId][commit].committed_at
        ).getTime();

        if (current < earliest) {
          current = earliest;
          formatted = commits[projectId][commit].committed_at;
        }
      }
    }

    return new moment(formatted);
  }

  *mapCommitsToUsers(commits, users) {
    const un = yield select(getUnknown);
    const unknown = un ? un : [];

    for (let projectId in commits) {
      if (!commits[projectId] || !commits[projectId].length) continue;

      for (let index in commits[projectId]) {
        let found = false;
        for (let userId in users) {
          if (
            commits[projectId][index].author == users[userId].name ||
            users[userId].aliases.includes(commits[projectId][index].author)
          ) {
            found = true;
            let val = commits[projectId][index].id;

            //Tag the commit
            commits[projectId][index].userId = users[userId].id;

            //Make sure we dont have this commit id already
            if (!users[userId].commits.includes(val)) {
              users[userId].commits.push(val);
            }
          }
        }
        if (!found) {
          if (!unknown.includes(commits[projectId][index].author)) {
            unknown.push(commits[projectId][index].author);
          }
        }
      }
    }

    if (unknown && unknown.length) {
      yield put({
        type: "UNKNOWN_USERS_UPDATED",
        unknown: unknown
      });
    }
    return { users, commits };
  }

  *remapUsersToCommits() {
    const commits = yield select(getCommits);
    const users = yield select(getUsers);
    const details = yield select(getDetails);
    const data = yield this.mapCommitsToUsers(commits, users);
    const updatedUsers = data.users;

    yield put({
      type: "COMMITS_FETCHED",
      commits: data.commits,
      details: details,
      earliestDateFetched: this.getEarliestDateFetched(commits),
      loading: false
    });
    yield put({
      type: "USERS_COMMITS_UPDATED",
      users: updatedUsers,
      loading: false
    });
  }
  // For each branch in project do while to fetch through pagination all commits and then add those commits to the commits in redux for normal processing Make sure we dont duplicate commits (Maybe quit when we find first similar as its probably merge point)
  *projectCommitsIterator(projects, pages) {
    let commits = [];
    currentBranchPage = 1;
    for (let key in projects) {
      if (!projects[key]) continue;
      let data = yield* this.fetchProjectCommits(
        projects[key].id,
        projects[key].branches,
        pages
      );

      commits[projects[key].id] = data.project[projects[key].id];
      projects[key].branchCommitNr = data.branchesData;
    }

    yield put({
      type: "COMMITS_FETCHED",
      commits: commits,
      earliestDateFetched: this.getEarliestDateFetched(commits),
      loading: false
    });

    yield put({
      type: "PROJECTS_UPDATED",
      projects
    });

    return commits;
  }

  *fetchPagesNumber(projects) {
    let nr = 0;
    let current = 0;
    const ui = yield select(getUi);
    const start = ui.periodFrom.date;
    const earliest = yield select(getEarliest);

    let total = 0;
    for (let key in projects) {
      if (!projects[key]) continue;
      total += projects[key].branches.length;
    }
    try {
      for (let key in projects) {
        if (!projects[key]) continue;
        for (let key2 in projects[key].branches) {
          const started = new Date().getTime();

          const calling = yield call(
            this.Api.fetchCommits,
            projects[key].id,
            projects[key].branches[key2],
            start,
            earliest,
            1
          );

          const ended = new Date().getTime();
          if (calling) {
            nr += calling.headers["x-total-pages"] * 1;
          }
          current++;
          if (process.env.NODE_ENV !== "test") {
            yield put({
              type: "UPDATE_PROGRESS",
              branchesCommitsMeta: { current, total, timing: ended - started }
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
    return nr;
  }

  *fetchProjectCommits(id, branches, pages) {
    const project = {
      [id]: []
    };
    const branchesData = {};

    for (let key in branches) {
      try {
        const branchCommits = yield this.iterateBranch(
          id,
          branches[key],
          pages
        );

        branchesData[branches[key]] = branchCommits.length;
        branchCommits.forEach(commit => {
          if (!this.commitExists(commit.id, project[id])) {
            commit.branch = branches[key];
            project[id].push(commit);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }

    return { project, branchesData };
  }

  //We are iterating over one branch here, going through pagination to fetch all commits
  *iterateBranch(id, branch, total) {
    const ui = yield select(getUi);
    const earliest = yield select(getEarliest);
    const start = ui.periodFrom.date;
    let page = 1;
    let calling;

    const cd = yield call(
      this.Api.fetchCommits,
      id,
      branch,
      start,
      earliest,
      page
    );

    const commitsData = cd ? cd.data : [];
    let commits = commitsData;

    const totalPages = cd.headers["x-total-pages"] * 1;

    while (page <= totalPages) {
      const started = new Date().getTime();
      // yield new Promise(resolve => setTimeout(resolve, 30));

      calling = yield call(
        this.Api.fetchCommits,
        id,
        branch,
        start,
        earliest,
        page
      );
      const ended = new Date().getTime();
      commits =
        calling && totalPages > 1 ? commits.concat(calling.data) : commits;
      page++;
      if (process.env.NODE_ENV !== "test") {
        yield put({
          type: "UPDATE_PROGRESS",
          branchesCommits: {
            current: currentBranchPage,
            total: total,
            timing: ended - started
          }
        });
      }
      currentBranchPage++;
    }

    return commits;
  }

  //Check if we already have this commit saved so we dont duplicate it
  commitExists(id, commits) {
    let exists = false;
    if (commits) {
      for (let key in commits) {
        if (commits[key].id == id) {
          exists = true;
        }
      }
    }
    return exists;
  }

  *getCommitDetails(commits) {
    const details = {};
    const counting = {};
    let current = 1;
    let total = 0;

    for (let projectId in commits) {
      for (let index in commits[projectId]) {
        if (
          commits[projectId][index].userId != "undefined" &&
          !counting[commits[projectId][index].id]
        ) {
          total++;
          counting[commits[projectId][index].id] = commits[projectId][index].id;
        }
      }
    }

    try {
      //fetch only commits that have users.
      for (let projectId in commits) {
        if (!commits[projectId]) continue;

        for (let commit in commits[projectId]) {
          if (
            commits[projectId][commit].userId != "undefined" &&
            !details[commits[projectId][commit].id]
          ) {
            const started = new Date().getTime();

            const d = yield this.fetchCommitDetails(
              commits[projectId][commit].id,
              projectId
            );

            const ended = new Date().getTime();
            details[commits[projectId][commit].id] = d;
            yield put({
              type: "UPDATE_PROGRESS",
              commitsDetails: { current, total, timing: ended - started }
            });
            current++;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }

    return details;
  }

  *fetchCommitDetails(sha, projectId) {
    // yield new Promise(resolve => setTimeout(resolve, 20));

    const calling = yield call(this.Api.fetchCommitDetails, sha, projectId);

    return calling ? calling.data : [];
  }

  *periodUpdated(params) {
    //This is from slider. We need to parse it to actual starting dates
    let start;

    switch (params.id) {
      case 0:
        start = new moment().startOf("day");

        break;
      case 1:
        start = new moment().subtract(7, "days");
        break;
      case 2:
        start = new moment().subtract(30, "days");
        break;
      case 3:
        start = new moment().subtract(90, "days");
        break;
      case 4:
        start = new moment().subtract(365, "days");
        break;
      default:
        start = new moment().startOf("day");
        break;
    }

    yield put({
      type: "PERIOD_UPDATED",
      periodFrom: { id: params.id, date: start }
    });

    //Now that we have updated the period, we need to recalculate date
  }

  *updateBranchMetadata(params) {
    //This is from slider. We need to parse it to actual starting dates

    const projects = yield select(getProjects);

    projects[params.projectId].branchCommitNr[params.branch] =
      params.commits.length || 0;

    yield put({
      type: "PROJECTS_UPDATED",
      projects: projects
    });

    //Now that we have updated the period, we need to recalculate date
  }
}
export const CommitsSagas = [
  takeLatest(["FETCH_COMMITS", "PERIOD_UPDATED"], new Commits().fetchCommits),
  takeLatest("USERS_UPDATED", new Commits().remapUsersToCommits),
  takeLatest("UPDATE_PERIOD", new Commits().periodUpdated)
];

import { put, takeLatest, all, call, select } from "redux-saga/effects";
import { delay } from "redux-saga";
import ApiAdapter from "../adapters/adapter";

const getToken = state => state.Server.token;
const getUrl = state => state.Server.url;
const getProvider = state => state.Server.provider;
const getProjects = state => state.Projects.data;
const getUsers = state => state.Users.data;
const getCommits = state => state.Commits.data;

function* fetchCommits(params) {
  try {
    const provider = yield select(getProvider);
    const url = yield select(getUrl);
    const token = yield select(getToken);
    const users = yield select(getUsers);

    const projects = yield select(getProjects);

    const Api = new ApiAdapter({ provider, url, token });

    yield put({ type: "FETCHING_COMMITS" }); //foreach odi
    let commitsData;
    const savedCommitsData = yield call(Api.getSavedCommits);
    if (!Object.keys(savedCommitsData).length) {
      commitsData = yield call(projectCommitsIterator, projects, Api);
      Api.saveCommits(commitsData);
    } else {
      commitsData = savedCommitsData;
    }

    const commits = Api.mapCommits(commitsData);

    yield put({
      type: "COMMITS_FETCHED",
      commits: commits,
      loading: false
    });

    //Map data to our format
    const updatedUsers = yield mapCommitsToUsers(commits, users);
    yield put({
      type: "USERS_UPDATED",
      users: updatedUsers,
      loading: false
    });
  } catch (error) {
    console.log(error);
    yield put({ type: "COMMITS_FETCHED", loading: false });
  }
}

function* mapCommitsToUsers(commits, users) {
  const unknown = [];
  for (let key in commits) {
    if (!commits[key].length) continue;

    for (let key2 in commits[key]) {
      let found = false;
      for (let key3 in users) {
        if (
          commits[key][key2].author == users[key3].name ||
          users[key3].aliases.includes(commits[key][key2].author)
        ) {
          found = true;

          //Make sure we dont have this commit id already
          if (!users[key3].commits.includes(commits[key][key2].id)) {
            users[key3].commits.push(commits[key][key2].id);
          }
        }
      }
      if (!found) {
        if (!unknown.includes(commits[key][key2].author)) {
          unknown.push(commits[key][key2].author);
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
  return users;
}

function* remapUsersToCommits() {
  const commits = yield select(getCommits);
  const users = yield select(getUsers);
  const updatedUsers = yield mapCommitsToUsers(commits, users);
  yield put({
    type: "USERS_COMMITS_UPDATED",
    users: updatedUsers,
    loading: false
  });
}
// For each branch in project do while to fetch through pagination all commits and then add those commits to the commits in redux for normal processing Make sure we dont duplicate commits (Maybe quit when we find first similar as its probably merge point)
function* projectCommitsIterator(projects, Api) {
  let commits = [];
  for (let key in projects) {
    let commit = yield* fetchProjectCommits(
      projects[key].id,
      projects[key].branches,
      Api
    );

    commits[projects[key].id] = commit[projects[key].id];
  }
  return commits;
}

function* fetchProjectCommits(id, branches, Api) {
  let project = {
    [id]: []
  };
  for (let key in branches) {
    try {
      const branchCommits = yield iterateBranch(id, branches[key], Api);

      branchCommits.forEach(commit => {
        if (!commitExists(commit.id, project[id])) {
          project[id].push(commit);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  return project;
}

//We are iterating over one branch here, going through pagination to fetch all commits
function* iterateBranch(id, branch, Api) {
  let page = 1;
  let calling;

  const cd = yield call(Api.fetchCommits, id, branch, page);
  page++;
  const commitsData = cd.data;
  let commits = commitsData;

  const totalPages = cd.headers["x-total-pages"] * 1;

  while (page <= totalPages) {
    yield new Promise(resolve => setTimeout(resolve, 20));
    calling = yield call(Api.fetchCommits, id, branch, page);

    commits = commits.concat(calling.data);
    page++;
  }

  return commits;
}

//Check if we already have this commit saved so we dont duplicate it
function commitExists(id, commits) {
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

export const CommitsSagas = [
  takeLatest("FETCH_COMMITS", fetchCommits),
  takeLatest("USERS_UPDATED", remapUsersToCommits)
];

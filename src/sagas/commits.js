import { put, takeLatest, all, call, select } from "redux-saga/effects";
import { delay } from "redux-saga";
import ApiAdapter from "../adapters/adapter";

const getToken = state => state.Server.token;
const getUrl = state => state.Server.url;
const getProvider = state => state.Server.provider;
const getProjects = state => state.Projects.data;
const getUsers = state => state.Users.data;

function* fetchCommits(params) {
  try {
    const provider = yield select(getProvider);
    const url = yield select(getUrl);
    const token = yield select(getToken);
    const users = yield select(getUsers);

    const projects = yield select(getProjects);

    const Api = new ApiAdapter({ provider, url, token });

    yield put({ type: "FETCHING_COMMITS" });
    const commitsData = yield call(projectCommitsIterator, projects, Api);
    const commits = Api.mapCommits(commitsData);

    yield put({
      type: "COMMITS_FETCHED",
      commits: commits,
      loading: false
    });

    //Map data to our format
    const updatedUsers = yield mapCommitsToUsers(commits, users);
    console.log(updatedUsers);
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
        // console.log(commits[key][key2].author);
        //console.log(users[key3]);

        if (commits[key][key2].author == users[key3].name) {
          found = true;
          users[key3].commits.push(commits[key][key2].id);
        }
      }
      if (!found) {
        if (!unknown.includes(commits[key][key2].author)) {
          unknown.push(commits[key][key2].author);
        }
      }
    }
  }

  if (unknown.length) {
    yield put({
      type: "UNKNOWN_USERS_UPDATED",
      unknown: unknown
    });
  }
  return users;
}

function* projectCommitsIterator(projects, Api) {
  let finished;
  let commits = [];
  let commit;
  for (let key in projects) {
    commit = yield* getCommits(projects[key].id, Api);
    commits.push(commit);
  }
  return commits;
}

function* getCommits(id, Api) {
  yield new Promise(resolve => setTimeout(resolve, 200));

  try {
    const commit = yield call(Api.getCommits, id);
    return { id, data: commit };
  } catch (error) {
    console.log(error);
  }
}

export const CommitsSagas = [takeLatest("FETCH_COMMITS", fetchCommits)];

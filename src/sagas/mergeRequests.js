import { put, takeLatest, all, call, select } from "redux-saga/effects";
import { delay } from "redux-saga";
import ApiAdapter from "../adapters/adapter";
import _ from "lodash";
import moment from "moment";

const getToken = state => state.Server.token;
const getUrl = state => state.Server.url;
const getProvider = state => state.Server.provider;
const getUsers = state => state.Users.data;
const getMergeRequests = state => state.MergeRequests.data;
const getUi = state => state.Ui;
let currentUser = 1;

var Api;

function* fetchMergeRequests(params) {
  yield put({
    type: "UPDATE_PROGRESS",
    mergeRequests: { current: 0, total: 0, timing: 0 },
    fetchingData: true
  });
  try {
    const provider = yield select(getProvider);
    const url = yield select(getUrl);
    const ui = yield select(getUi);
    const token = yield select(getToken);
    const users = yield select(getUsers);

    Api = new ApiAdapter({ provider, url, token });

    yield put({ type: "FETCHING_MERGE_REQUESTS" }); //foreach odi
    for (let key in users) {
      if (!users[key]) continue;
      users[key].mergeRequests = [];
    }
    const pagesNumber = yield call(fetchPagesNumber, users, Api);

    const mergeRequestsData = yield call(
      mergeRequestsIterator,
      users,
      pagesNumber,
      Api
    );

    const map = yield Api.mapMergeRequestsToUsers(mergeRequestsData, users);

    const updatedUsers = map.users;

    const mergeRequests = map.mergeRequests;

    yield put({
      type: "USERS_UPDATED",
      users: updatedUsers,
      loading: false
    });

    yield put({
      type: "MERGE_REQUESTS_FETCHED",
      mergeRequests: mergeRequests,
      loading: false
    });
    yield put({
      type: "UPDATE_PROGRESS",
      fetchingData: false
    });
  } catch (error) {
    console.log(error);
    yield put({ type: "MERGE_REQUESTS_FETCHED", loading: false });
    yield put({
      type: "UPDATE_PROGRESS",
      fetchingData: false
    });
  }
}

function* remapUsersToMergeRequests() {
  const requests = yield select(getMergeRequests);

  const users = yield select(getUsers);
  const data = yield Api.mapMergeRequestsToUsers(requests, users);
  const updatedUsers = data.users;
  // yield put({
  //   type: "USERS_COMMENTS_UPDATED",
  //   users: updatedUsers,
  //   loading: false
  // });
}
// For each branch in project do while to fetch through pagination all comments and then add those comments to the comments in redux for normal processing Make sure we dont duplicate comments (Maybe quit when we find first similar as its probably merge point)
function* mergeRequestsIterator(users, pages, Api) {
  let requests = [];
  currentUser = 1;
  for (let key in users) {
    if (!users[key]) continue;
    let c = yield* fetchUsersMergeRequests(users[key].id, pages, Api);

    requests[users[key].id] = c[users[key].id];
  }

  return requests;
}

function* fetchPagesNumber(users, Api) {
  let nr = 0;
  let current = 0;
  const ui = yield select(getUi);
  const start = ui.periodFrom.date;
  let total = 0;
  for (let key in users) {
    if (!users[key]) continue;
    total++;
  }
  try {
    for (let key in users) {
      if (!users[key]) continue;
      const started = new Date().getTime();

      const calling = yield call(
        Api.fetchMergeRequests,
        users[key].id,
        start,
        1
      );

      const ended = new Date().getTime();
      if (calling) {
        nr += calling.headers["x-total-pages"] * 1;
      }
      current++;
      yield put({
        type: "UPDATE_PROGRESS",
        mergeRequestsMeta: { current, total, timing: ended - started }
      });
    }
  } catch (error) {
    console.log(error);
  }
  return nr;
}

function* fetchUsersMergeRequests(id, pages, Api) {
  let requests = {
    [id]: []
  };
  const ui = yield select(getUi);

  try {
    const userRequests = yield iterateUser(id, pages, Api);

    userRequests.forEach(request => {
      if (!requestExists(request.id, id)) {
        requests[id].push(request);
      }
    });
  } catch (error) {
    console.log(error);
  }

  return requests;
}

//We are iterating over one branch here, going through pagination to fetch all comments
function* iterateUser(id, total, Api) {
  const ui = yield select(getUi);
  const start = ui.periodFrom.date;
  let page = 1;
  let calling;

  const cd = yield call(Api.fetchMergeRequests, id, start, page);

  const requestsData = cd ? cd.data : [];
  let requests = requestsData;

  const totalPages = cd.headers["x-total-pages"] * 1;

  while (page <= totalPages) {
    const started = new Date().getTime();
    // yield new Promise(resolve => setTimeout(resolve, 30));

    calling = yield call(Api.fetchMergeRequests, id, start, page);

    const ended = new Date().getTime();
    requests =
      calling && totalPages > 1 ? requests.concat(calling.data) : requests;
    page++;

    yield put({
      type: "UPDATE_PROGRESS",
      mergeRequests: {
        current: currentUser,
        total: total,
        timing: ended - started
      }
    });
    currentUser++;
  }

  return requests;
}

//Check if we already have this comment saved so we dont duplicate it
function requestExists(id, requests) {
  let exists = false;
  if (requests) {
    for (let key in requests) {
      if (requests[key].id == id) {
        exists = true;
      }
    }
  }
  return exists;
}

export const MergeRequestsSagas = [
  takeLatest("FETCH_MERGE_REQUESTS", fetchMergeRequests)
  //takeLatest("USERS_UPDATED", remapUsersToMergeRequests)
];

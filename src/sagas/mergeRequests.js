import { put, takeLatest, all, call, select } from "redux-saga/effects";
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
const getComments = state => state.Comments.data;
const getEarliest = state => state.Comments.earliestDateFetched;
const getUi = state => state.Ui;
let currentBranchPage = 1;

function* fetchMergeRequests(params) {
  yield put({
    type: "UPDATE_PROGRESS",
    comments: { current: 0, total: 0, timing: 0 },
    fetchingData: true
  });
  try {
    const provider = yield select(getProvider);
    const url = yield select(getUrl);
    const ui = yield select(getUi);
    const token = yield select(getToken);
    const users = yield select(getUsers);
    const earliest = yield select(getEarliest);
    let comments = yield select(getComments);
    const projects = yield select(getProjects);

    const Api = new ApiAdapter({ provider, url, token });

    yield put({ type: "FETCHING_COMMENTS" }); //foreach odi

    const pagesNumber = yield call(fetchPagesNumber, projects, Api);

    const commentsData = yield call(
      projectCommentsIterator,
      projects,
      pagesNumber,
      Api
    );
    console.log(commentsData);
    //Map data to our format
    //Reset comments
    for (let userId in users) {
      users[userId].comments = [];
    }
    const map = yield mapCommentsToUsers(commentsData, users);

    const updatedUsers = map.users;

    //Merge new mapped comments to existing ones. If we are going back on slider, reset
    if (comments && earliest && earliest.isBefore(moment(ui.periodFrom.date))) {
      for (let projectId in map.comments) {
        if (comments[projectId]) {
          comments[projectId].concat(map.comments[projectId]);
        } else {
          comments[projectId] = map.comments[projectId];
        }
      }
    } else {
      comments = map.comments;
    }

    yield put({
      type: "USERS_UPDATED",
      users: updatedUsers,
      loading: false
    });

    yield put({
      type: "COMMENTS_FETCHED",
      comments: comments,
      earliestDateFetched: getEarliestDateFetched(comments),
      loading: false
    });
    yield put({
      type: "UPDATE_PROGRESS",
      fetchingData: false
    });
  } catch (error) {
    console.log(error);
    yield put({ type: "COMMENTS_FETCHED", loading: false });
    yield put({
      type: "UPDATE_PROGRESS",
      fetchingData: false
    });
  }
}

function getEarliestDateFetched(comments) {
  let earliest = new moment.unix();
  let formatted;

  for (let projectId in comments) {
    for (let comment in comments[projectId]) {
      let current = new Date(comments[projectId][comment].created_at).getTime();

      if (current < earliest) {
        current = earliest;
        formatted = comments[projectId][comment].created_at;
      }
    }
  }

  return new moment(formatted);
}

function* mapCommentsToUsers(comments, users) {
  const un = yield select(getUnknown);
  const unknown = un ? un : [];

  for (let projectId in comments) {
    if (!comments[projectId] || !comments[projectId].length) continue;

    for (let index in comments[projectId]) {
      let found = false;
      for (let userId in users) {
        if (
          comments[projectId][index].author.id == users[userId].id ||
          users[userId].aliases.includes(comments[projectId][index].author.name)
        ) {
          found = true;
          let val = comments[projectId][index].created_at;

          //Make sure we dont have this comment id already
          if (!users[userId].comments.includes(val)) {
            users[userId].comments.push(comments[projectId][index]);
          }
        }
      }
    }
  }

  return { users, comments };
}

function* remapUsersToMergeRequests() {
  const comments = yield select(getComments);
  const users = yield select(getUsers);
  const data = yield mapCommentsToUsers(comments, users);
  const updatedUsers = data.users;
  // yield put({
  //   type: "USERS_COMMENTS_UPDATED",
  //   users: updatedUsers,
  //   loading: false
  // });
}
// For each branch in project do while to fetch through pagination all comments and then add those comments to the comments in redux for normal processing Make sure we dont duplicate comments (Maybe quit when we find first similar as its probably merge point)
function* projectCommentsIterator(projects, pages, Api) {
  let comments = [];
  currentBranchPage = 1;
  for (let key in projects) {
    if (!projects[key]) continue;
    let c = yield* fetchProjectComments(
      projects[key].id,
      projects[key].branches,
      pages,
      Api
    );

    comments[projects[key].id] = c[projects[key].id];
  }

  return comments;
}

function* fetchPagesNumber(projects, Api) {
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
          Api.fetchComments,
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
        yield put({
          type: "UPDATE_PROGRESS",
          comments: { current, total, timing: ended - started }
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
  return nr;
}

function* fetchProjectComments(id, branches, pages, Api) {
  let project = {
    [id]: []
  };
  const ui = yield select(getUi);

  for (let key in branches) {
    try {
      const branchComments = yield iterateBranch(id, branches[key], pages, Api);

      branchComments.forEach(comment => {
        if (
          !commentExists(comment.created_at, project[id]) &&
          new moment(comment.created_at).isAfter(moment(ui.periodFrom.date))
        ) {
          project[id].push(comment);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  return project;
}

//We are iterating over one branch here, going through pagination to fetch all comments
function* iterateBranch(id, branch, total, Api) {
  const ui = yield select(getUi);
  const earliest = yield select(getEarliest);
  const start = ui.periodFrom.date;
  let page = 1;
  let calling;

  const cd = yield call(Api.fetchComments, id, branch, start, earliest, page);

  const commentsData = cd ? cd.data : [];
  let comments = commentsData;

  const totalPages = cd.headers["x-total-pages"] * 1;

  while (page <= totalPages) {
    const started = new Date().getTime();
    // yield new Promise(resolve => setTimeout(resolve, 30));

    calling = yield call(Api.fetchComments, id, branch, start, earliest, page);

    const ended = new Date().getTime();
    comments = calling ? comments.concat(calling.data) : comments;
    page++;

    yield put({
      type: "UPDATE_PROGRESS",
      comments: {
        current: currentBranchPage,
        total: total,
        timing: ended - started
      }
    });
    currentBranchPage++;
  }

  return comments;
}

//Check if we already have this comment saved so we dont duplicate it
function commentExists(id, comments) {
  let exists = false;
  if (comments) {
    for (let key in comments) {
      if (comments[key].created_at == id) {
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

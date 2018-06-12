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

export default class Comments {
  constructor() {
    this.stored = null;

    this.fetchComments = this.fetchComments.bind(this);
    this.getEarliestDateFetched = this.getEarliestDateFetched.bind(this);
    this.remapUsersToComments = this.remapUsersToComments.bind(this);
    this.projectCommentsIterator = this.projectCommentsIterator.bind(this);
    this.fetchProjectComments = this.fetchProjectComments.bind(this);
    this.fetchPagesNumber = this.fetchPagesNumber.bind(this);
    this.iterateBranch = this.iterateBranch.bind(this);
  }

  *fetchComments(params) {
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

      this.stored = {
        url,
        provider,
        token,
        ui,

        users,
        earliest,
        comments
      };

      this.Api = ApiAdapter(this.stored);

      yield put({ type: "FETCHING_COMMENTS" }); //foreach odi

      const pagesNumber = yield call(this.fetchPagesNumber, projects);
      //Reset comments
      for (let userId in users) {
        users[userId].comments = [];
      }

      const commentsData = yield call(
        this.projectCommentsIterator,
        projects,
        pagesNumber
      );

      //Map data to our format

      const map = yield this.Api.mapCommentsToUsers(commentsData, users);

      const updatedUsers = map.users;

      //Merge new mapped comments to existing ones. If we are going back on slider, reset
      if (
        comments &&
        earliest &&
        earliest.isBefore(moment(ui.periodFrom.date))
      ) {
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
        type: "COMMENTS_FETCHED",
        comments: comments,
        earliestDateFetched: this.getEarliestDateFetched(comments),
        loading: false
      });
      yield put({
        type: "UPDATE_PROGRESS",
        fetchingData: false
      });
      yield put({
        type: "USERS_UPDATED",
        users: updatedUsers,
        loading: false
      });
      yield put({
        type: "FETCH_MERGE_REQUESTS"
      });
      return comments;
    } catch (error) {
      console.log(error);
      yield put({ type: "COMMENTS_FETCHED", loading: false });
      yield put({
        type: "UPDATE_PROGRESS",
        fetchingData: false
      });
    }
  }

  getEarliestDateFetched(comments) {
    let earliest = new moment.unix();
    let formatted;

    for (let projectId in comments) {
      for (let comment in comments[projectId]) {
        let current = new Date(
          comments[projectId][comment].created_at
        ).getTime();

        if (current < earliest) {
          current = earliest;
          formatted = comments[projectId][comment].created_at;
        }
      }
    }

    return new moment(formatted);
  }

  *remapUsersToComments() {
    const provider = yield select(getProvider);
    const url = yield select(getUrl);

    const token = yield select(getToken);
    const users = yield select(getUsers);
    let comments = yield select(getComments);

    this.stored = {
      url,
      provider,
      token,

      users,

      comments
    };

    this.Api = ApiAdapter(this.stored);
    const data = yield this.Api.mapCommentsToUsers(comments, users);
    const updatedUsers = data.users;
    yield put({
      type: "USERS_COMMENTS_UPDATED",
      users: updatedUsers,
      loading: false
    });
  }
  // For each branch in project do while to fetch through pagination all comments and then add those comments to the comments in redux for normal processing Make sure we dont duplicate comments (Maybe quit when we find first similar as its probably merge point)
  *projectCommentsIterator(projects, pages, Api) {
    let comments = [];
    currentBranchPage = 1;
    for (let key in projects) {
      if (!projects[key]) continue;
      let data = yield* this.fetchProjectComments(
        projects[key].id,
        projects[key].branches,
        pages
      );

      comments[projects[key].id] = data.project[projects[key].id];
      projects[key].commentsNr = data.branchesData;
    }

    return comments;
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
            this.Api.fetchComments,
            projects[key].id,
            projects[key].branches[key2],
            1
          );

          const ended = new Date().getTime();
          if (calling) {
            nr += calling.headers["x-total-pages"] * 1;
          }
          current++;
          yield put({
            type: "UPDATE_PROGRESS",
            commentsMeta: { current, total, timing: ended - started }
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
    return nr;
  }

  *fetchProjectComments(id, branches, pages) {
    let project = {
      [id]: []
    };
    const ui = yield select(getUi);
    const branchesData = {};
    for (let key in branches) {
      try {
        const branchComments = yield this.iterateBranch(
          id,
          branches[key],
          pages
        );
        branchesData[branches[key]] = branchComments.length;

        branchComments.forEach(comment => {
          if (!this.commentExists(comment.created_at, project[id])) {
            comment.branch = branches[key];
            comment.projectId = id;
            project[id].push(comment);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }

    return { project, branchesData };
  }

  //We are iterating over one branch here, going through pagination to fetch all comments
  *iterateBranch(id, branch, total) {
    const ui = yield select(getUi);
    const earliest = yield select(getEarliest);
    const start = ui.periodFrom.date;
    let page = 1;
    let calling;

    const cd = yield call(this.Api.fetchComments, id, branch, page);

    const commentsData = cd ? cd.data : [];
    let comments = commentsData;

    const totalPages = cd.headers["x-total-pages"] * 1;
    while (page <= totalPages) {
      const started = new Date().getTime();
      // yield new Promise(resolve => setTimeout(resolve, 30));

      calling = yield call(this.Api.fetchComments, id, branch, page);

      const ended = new Date().getTime();
      comments =
        calling && totalPages > 1 ? comments.concat(calling.data) : comments;
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
  commentExists(id, comments) {
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
}
export const CommentsSagas = [
  takeLatest("FETCH_COMMENTS", new Comments().fetchComments),
  takeLatest("USERS_UPDATED", new Comments().remapUsersToComments)
];

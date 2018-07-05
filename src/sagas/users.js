import { put, takeLatest, all, call, select } from "redux-saga/effects";
import ApiAdapter from "../adapters/adapter";
import moment from "moment";
let currentProjectPage = 1;

export default class Users {
  constructor(params) {
    this.stored = params ? params : null;
    this.fetchUsers = this.fetchUsers.bind(this);
  }

  *fetchUsers(params) {
    try {
      const provider = params ? params.provider : this.stored.provider;
      const url = params ? params.url : this.stored.url;
      const token = params ? params.token : this.stored.token;
      const projects = params ? params.projects : null;
      const username = params ? params.username : null;

      this.stored = {
        url,
        provider,
        token,
        username
      };

      this.Api = ApiAdapter(this.stored);

      yield put({ type: "FETCHING_USERS" });

      let ud;
      if (projects && projects.length) {
        const pagesNumber =
          this.stored.provider == "github"
            ? yield call(this.fetchPagesNumber, projects)
            : projects.length;
        ud = yield this.iterateProjectsUsers(projects, pagesNumber);

        //Save selected projects

        yield put({
          type: "SELECTED_PROJECTS_UPDATED",
          selected: projects,
          loading: false
        });
      } else {
        ud = yield call(this.Api.fetchUsers);
      }

      const usersData = ud.data;
      const users = this.Api.mapUsers(usersData);

      //Map data to our format
      yield put({ type: "USERS_FETCHED", users: users, loading: false });
      yield put({
        type: "SET_ACCESS_DATA",
        url: this.stored.url,
        token: this.stored.token,
        provider: this.stored.provider
      });
      return usersData;
    } catch (error) {
      console.log(error);
      yield put({
        type: "SET_ACCESS_DATA",
        url: null,
        token: null
      });
      yield put({ type: "USERS_FETCHED", loading: false });
    }
  }

  *iterateProjectsUsers(projects, pages) {
    let users = [];
    currentProjectPage = 1;
    for (let key in projects) {
      if (!projects[key]) continue;
      const projectIdentifier =
        this.stored.provider === "github"
          ? `${projects[key].owner}/${projects[key].title}`
          : projects[key].id;

      let data = yield this.fetchProjectUsers(projectIdentifier, pages);

      users = [...users, ...data.users];
    }

    return { data: users };
  }

  *fetchPagesNumber(projects) {
    let nr = 0;
    let current = 0;
    let total = projects.length;

    try {
      for (let key in projects) {
        if (!projects[key]) continue;
        for (let key2 in projects[key].branches) {
          const started = new Date().getTime();

          const calling = yield call(
            this.Api.fetchProjectUsers,
            projects[key].id
          );

          const ended = new Date().getTime();
          if (calling) {
            nr += calling.headers["x-total-pages"] * 1;
          }
          current++;
          if (process.env.NODE_ENV !== "test") {
            yield put({
              type: "UPDATE_PROGRESS",
              projectUsers: { current, total, timing: ended - started }
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
    return nr;
  }

  *fetchProjectUsers(id, pages) {
    const users = [];

    try {
      const projectUsers = yield this.iterateProject(id, pages);

      projectUsers.forEach(user => {
        if (!users.includes(user.id)) {
          users.push(user);
        }
      });
    } catch (error) {
      console.log(error);
    }

    return { users };
  }

  //We are iterating over one branch here, going through pagination to fetch all commits
  *iterateProject(id, total) {
    let page = 1;
    let calling;

    const cd = yield call(this.Api.fetchProjectUsers, id, page);

    const usersData = cd ? cd.data : [];
    let users = usersData;

    const totalPages = cd.headers["x-total-pages"] * 1;

    while (page <= totalPages) {
      const started = new Date().getTime();
      // yield new Promise(resolve => setTimeout(resolve, 30));

      calling = yield call(this.Api.fetchProjectUsers, id, page);
      const ended = new Date().getTime();
      users = calling && totalPages > 1 ? users.concat(calling.data) : users;

      page++;
      if (process.env.NODE_ENV !== "test") {
        yield put({
          type: "UPDATE_PROGRESS",
          branchesCommits: {
            current: currentProjectPage,
            total: total,
            timing: ended - started
          }
        });
      }
      currentProjectPage++;
    }

    return users;
  }

  userExists(id, users) {
    let exists = false;
    if (users) {
      for (let key in users) {
        if (users[key].id == id) {
          exists = true;
        }
      }
    }
    return exists;
  }
}

export const UserSagas = [takeLatest("FETCH_USERS", new Users().fetchUsers)];

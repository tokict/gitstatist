import { put, takeLatest, all, call, select } from "redux-saga/effects";
import ApiAdapter from "../adapters/adapter";
const getToken = state => state.Server.token;
const getUrl = state => state.Server.url;
const getProvider = state => state.Server.provider;
const getSelectedProjects = state => state.Projects.selected;

export default class Projects {
  constructor() {
    this.stored = null;

    this.fetchProjects = this.fetchProjects.bind(this);

    this.fetchBranches = this.fetchBranches.bind(this);
    this.fetchProjectBranches = this.fetchProjectBranches.bind(this);
  }

  *fetchProjects() {
    let provider = yield select(getProvider);
    let url = yield select(getUrl);
    let token = yield select(getToken);
    let selected = yield select(getSelectedProjects);
    this.stored = { url, provider, token };

    this.Api = ApiAdapter(this.stored);

    try {
      yield put({ type: "FETCHING_PROJECTS" });
      yield put({
        type: "UPDATE_PROGRESS",
        fetchingData: true
      });
      let pd;

      if (selected && selected.length) {
        pd = yield this.getSelectedProjects(selected);
      } else {
        pd = yield call(this.Api.fetchProjects);
      }

      const projectsData = pd.data;

      let projects = this.Api.mapProjects(projectsData);

      // projects = {
      //   48: projects[48],
      //   47: projects[47]
      //   // 53: projects[53],
      //   // 54: projects[54],
      //   // 55: projects[55]
      // };
      //Map data to our format

      const branchesData = yield call(this.fetchBranches, projects);

      branchesData.forEach(item => {
        if (item) {
          const id = item.id;
          const data = item.data;

          if (data) {
            data.forEach(branch => {
              projects[id].branches.push(branch.name);
            });
          }
        }
      });

      yield put({
        type: "PROJECTS_UPDATED",
        projects: projects,
        loading: false
      });

      yield put({ type: "FETCH_COMMITS" });
    } catch (error) {
      console.log(error);
      yield put({ type: "PROJECTS_UPDATED", projects: null, loading: false });
    }
  }

  *fetchBranches(projects) {
    let branches = [];
    let branch;

    let current = 1;
    let total = Object.keys(projects).length;

    for (let key in projects) {
      if (!projects[key]) continue;
      const started = new Date().getTime();
      const branchesData = yield* this.fetchProjectBranches(
        projects[key].id,
        this.Api
      );
      const ended = new Date().getTime();
      current++;
      yield put({
        type: "UPDATE_PROGRESS",
        branches: { current, total, timing: ended - started }
      });

      branches.push(branchesData);
    }
    return branches;
  }

  *getSelectedProjects(selected) {
    const data = [];

    for (let i = 0; i < selected.length; i++) {
      const pd = yield call(this.Api.fetchProject, selected[i].id);
      console.log(55555, pd.data);
      data.push(pd.data);
    }
    return { data };
  }

  *fetchProjectBranches(id) {
    try {
      const b = yield call(this.Api.fetchBranches, id);
      const branches = b.data;

      return { id, data: branches };
    } catch (error) {
      console.warn(error);
    }
  }
}

export const ProjectsSagas = [
  takeLatest("FETCH_PROJECTS", new Projects().fetchProjects)
];

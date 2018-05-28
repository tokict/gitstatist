import { put, takeLatest, all, call, select } from "redux-saga/effects";
import ApiAdapter from "../adapters/adapter";
const getToken = state => state.Server.token;
const getUrl = state => state.Server.url;
const getProvider = state => state.Server.provider;

function* fetchProjects(params) {
  try {
    const provider = yield select(getProvider);
    const url = yield select(getUrl);
    const token = yield select(getToken);
    const Api = new ApiAdapter({ provider, url, token });

    yield put({ type: "FETCHING_PROJECTS" });
    yield put({
      type: "UPDATE_PROGRESS",
      fetchingData: true
    });
    const pd = yield call(Api.fetchProjects);
    const projectsData = pd.data;
    let projects = Api.mapProjects(projectsData);

    projects = {
      48: projects[48],
      47: projects[47],
      55: projects[55]
    };
    //Map data to our format

    const branchesData = yield call(fetchBranches, projects, Api);

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
      type: "PROJECTS_FETCHED",
      projects: projects,
      loading: false
    });

    yield put({ type: "FETCH_COMMITS" });
  } catch (error) {
    console.log(error);
    yield put({ type: "PROJECTS_FETCHED", projects: null, loading: false });
  }
}

function* fetchBranches(projects, Api) {
  let branches = [];
  let branch;

  let current = 1;
  let total = Object.keys(projects).length;

  for (let key in projects) {
    if (!projects[key]) continue;
    const started = new Date().getTime();
    const branchesData = yield* fetchProjectBranches(projects[key].id, Api);
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

function* fetchProjectBranches(id, Api) {
  yield new Promise(resolve => setTimeout(resolve, 50));

  try {
    const b = yield call(Api.fetchBranches, id);
    const branches = b.data;

    return { id, data: branches };
  } catch (error) {
    console.log(error);
  }
}

export const ProjectsSagas = [takeLatest("FETCH_PROJECTS", fetchProjects)];

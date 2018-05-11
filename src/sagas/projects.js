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
    const projectsData = yield call(Api.fetchProjects);
    const projects = Api.mapProjects(projectsData);

    //Map data to our format
    console.log("Fetched projects", projects);
    yield put({
      type: "PROJECTS_FETCHED",
      projects: projects,
      loading: false
    });

    yield put({ type: "FETCH_COMMITS" });
  } catch (error) {
    console.log(error);
    yield put({ type: "PROJECTS_FETCHED", loading: false });
  }
}

export const ProjectsSagas = [takeLatest("FETCH_PROJECTS", fetchProjects)];
